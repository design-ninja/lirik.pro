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

function yyyymmdd(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function readState() {
  try {
    const data = await fs.readFile(STATE_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return { offset: 0 };
  }
}

async function writeState(state) {
  await fs.mkdir(path.dirname(STATE_PATH), { recursive: true });
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function parseMessage(text) {
  const lines = text.trim().split('\n');
  const title = (lines.shift() || '').trim();
  const body = lines.join('\n').trim();
  const tags = Array.from(new Set((text.match(/#[\p{L}\p{N}_-]+/gu) || []).map((t) => t.slice(1))));
  return { title, body, tags };
}

function buildMdx({ title, body, tags, publishDate }) {
  const safeBody = body.replace(/^\s*(import|export)[^\n]*\n/gm, '');
  const description = truncate(safeBody.replace(/\s+/g, ' ').trim(), 160);
  const tagsYaml = tags.length ? tags.map((t) => `  - ${t}`).join('\n') : '';
  return `---
title: '${escapeYaml(title)}'
publishDate: '${publishDate}'
${tags.length ? `tags:\n${tagsYaml}\n` : ''}
isFeatured: false
seo:
  description: '${escapeYaml(description)}'
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

    const { title, body, tags } = parseMessage(msg.text);
    if (!title || !body) continue;

    const slugBase = slugify(title) || `post-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`;
    const mdxPathBase = path.join(BLOG_DIR, `${slugBase}.mdx`);
    const mdxPath = await uniqueFilePath(mdxPathBase);

    const date = new Date((msg.date || Math.floor(Date.now() / 1000)) * 1000);
    const mdx = buildMdx({ title, body, tags, publishDate: yyyymmdd(date) });

    await fs.writeFile(mdxPath, mdx, 'utf8');
    created.push(path.basename(mdxPath));
  }

  if (maxUpdateId > offset) {
    await writeState({ offset: maxUpdateId });
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
