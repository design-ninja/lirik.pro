import fs from 'node:fs/promises';
import path from 'node:path';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_ALLOWED_CHAT_ID;
if (!TELEGRAM_TOKEN || !ALLOWED_CHAT_ID) {
  console.error('Missing TELEGRAM_TOKEN or TELEGRAM_ALLOWED_CHAT_ID');
  process.exit(1);
}

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const STATE_PATH = path.join(ROOT, '.github', 'telegram-state.json');

function slugify(input = '') {
  let slug = input.toLowerCase().trim();
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();
  slug = slug.replace(/[\s-]+/g, '-');
  return slug;
}

function escapeYaml(s = '') {
  return s.replace(/'/g, "''");
}

function truncate(s, n) {
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

function ddmmyyyy(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

async function readState() {
  try {
    const data = await fs.readFile(STATE_PATH, 'utf8');
    const parsed = JSON.parse(data);
    return { offset: 0, posts: {}, ...parsed };
  } catch {
    return { offset: 0, posts: {} };
  }
}

async function writeState(state) {
  await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function parseMessage(text) {
  const lines = text.trim().split('\n');
  const title = (lines.shift() || '').trim();
  const rawBody = lines.join('\n').trim();
  const tags = Array.from(new Set((text.match(/#[\p{L}\p{N}_-]+/gu) || []).map((t) => t.slice(1))));

  // Remove hashtag tokens (e.g. "#tag" or "#tag-name") from the body text
  const body = rawBody
    .replace(/(^|\s)#[\p{L}\p{N}_-]+/gu, (m, p1) => p1 || '')
    .replace(/\s+([.,;:!?])/g, '$1')
    .split('\n')
    .map((line) => line.replace(/\s{2,}/g, ' ').trimEnd())
    .join('\n')
    .trim();

  return { title, body, tags };
}

function postKey(chatId, messageId) {
  return `${chatId}:${messageId}`;
}

async function deletePostByKey(key, state) {
  const relPath = state.posts?.[key];
  if (!relPath) return false;
  const absPath = path.join(ROOT, relPath);
  try {
    await fs.unlink(absPath);
  } catch {
    // If file is already gone, continue to clean state
  }
  delete state.posts[key];
  return true;
}

async function findPostPathBySlug(slug, state) {
  // First, try to resolve from state map
  const matchesFromState = Object.entries(state.posts || {}).filter(([, rel]) => {
    return rel.startsWith('src/content/blog/') && (rel.endsWith(`/${slug}.mdx`) || (/\/[^/]+$/.test(rel) && rel.match(new RegExp(`/${slug}-\\d+\\.mdx$`))));
  });
  if (matchesFromState.length === 1) return path.join(ROOT, matchesFromState[0][1]);

  // Fallback: scan filesystem and pick the most recently modified matching file
  const files = await fs.readdir(BLOG_DIR);
  const candidates = files.filter((f) => f === `${slug}.mdx` || (/^.+-\d+\.mdx$/.test(f) && f.startsWith(`${slug}-`)));
  if (!candidates.length) return null;
  let newest = null;
  let newestMtime = 0;
  for (const name of candidates) {
    const p = path.join(BLOG_DIR, name);
    const s = await fs.stat(p);
    if (s.mtimeMs >= newestMtime) {
      newestMtime = s.mtimeMs;
      newest = p;
    }
  }
  return newest;
}

async function deletePostBySlug(slug, state) {
  const abs = await findPostPathBySlug(slug, state);
  if (!abs) return false;
  try {
    await fs.unlink(abs);
  } catch {
    return false;
  }
  // Also drop any mapping entries pointing to this file
  for (const [k, rel] of Object.entries(state.posts || {})) {
    if (path.join(ROOT, rel) === abs) delete state.posts[k];
  }
  return true;
}

function buildMdx({ title, body, tags, publishDate }) {
  const safeBody = body.replace(/^\s*(import|export)[^\n]*\n/gm, '');
  const tagsYaml = tags.length ? tags.map((t) => `  - ${t}`).join('\n') : '';
  return `---
title: '${escapeYaml(title)}'
publishDate: '${publishDate}'
${tags.length ? `tags:\n${tagsYaml}\n` : ''}
isFeatured: false
---

${safeBody}
`;
}

async function uniqueFilePath(basePath) {
  let p = basePath;
  let i = 2;
  while (true) {
    try {
      await fs.access(p);
      const ext = path.extname(basePath);
      const name = basePath.slice(0, -ext.length);
      p = `${name}-${i}${ext}`;
      i++;
    } catch {
      return p;
    }
  }
}

async function fetchUpdates(offset) {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offset, timeout: 0, allowed_updates: ['message', 'edited_message'] })
  });
  if (!res.ok) {
    throw new Error(`getUpdates failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram error: ${JSON.stringify(json)}`);
  return json.result || [];
}

async function main() {
  await fs.mkdir(BLOG_DIR, { recursive: true });
  const state = await readState();
  let offset = typeof state.offset === 'number' ? state.offset : 0;

  const updates = await fetchUpdates(offset ? offset + 1 : undefined);
  if (!updates.length) {
    console.log('No new updates');
    return;
  }

  let maxUpdateId = offset;
  const created = [];

  for (const u of updates) {
    if (u.update_id > maxUpdateId) maxUpdateId = u.update_id;
    const msg = u.message || u.edited_message;
    if (!msg || typeof msg.text !== 'string') continue;
    const chatId = String(msg.chat?.id ?? '');
    if (chatId !== String(ALLOWED_CHAT_ID)) continue;

    const trimmed = msg.text.trim();

    // Handle delete commands: reply to original message or delete by slug
    const deleteMatch = trimmed.match(/^\/(delete|rm)\b\s*(.*)$/i);
    if (deleteMatch) {
      let deleted = false;
      if (msg.reply_to_message && typeof msg.reply_to_message.message_id === 'number') {
        const key = postKey(chatId, msg.reply_to_message.message_id);
        deleted = await deletePostByKey(key, state);
      }
      if (!deleted) {
        const arg = (deleteMatch[2] || '').trim();
        const slug = slugify(arg);
        if (slug) deleted = await deletePostBySlug(slug, state);
      }
      if (deleted) {
        if (!created.includes('[deleted]')) created.push('[deleted]');
      }
      continue;
    }

    const { title, body, tags } = parseMessage(msg.text);
    if (!title || !body) continue;

    const slugBase = slugify(title) || `post-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`;
    const mdxPathBase = path.join(BLOG_DIR, `${slugBase}.mdx`);
    const mdxPath = await uniqueFilePath(mdxPathBase);

    const date = new Date((msg.date || Math.floor(Date.now() / 1000)) * 1000);
    const mdx = buildMdx({ title, body, tags, publishDate: ddmmyyyy(date) });

    await fs.writeFile(mdxPath, mdx, 'utf8');
    created.push(path.basename(mdxPath));

    // Remember mapping to support future deletion by reply
    const key = postKey(chatId, msg.message_id);
    const rel = path.relative(ROOT, mdxPath);
    state.posts[key] = rel;
  }

  if (maxUpdateId > offset) {
    state.offset = maxUpdateId;
    await writeState(state);
  } else {
    await writeState(state);
  }

  if (created.length) {
    console.log('Created posts:', created.join(', '));
  } else {
    console.log('No eligible messages');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
