import type { APIRoute } from 'astro';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

export const GET: APIRoute = async ({ url }) => {
  // Do not expose token exchange endpoint in production
  if (import.meta.env.PROD) {
    return new Response('Not Found', { status: 404 });
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    return new Response('Missing "code"', { status: 400 });
  }

  const clientId = import.meta.env.SPOTIFY_CLIENT_ID as string | undefined;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET as string | undefined;
  // Use site origin if available (when running on prod), fallback to local dev origin.
  const defaultOrigin = `${url.protocol}//${url.host}`;
  const redirectUri = (import.meta.env.SPOTIFY_REDIRECT_URI as string | undefined) ?? `${defaultOrigin}/api/spotify-callback`;

  if (!clientId || !clientSecret) {
    return new Response('Missing client credentials', { status: 500 });
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  const json = await res.json();

  if (!res.ok) {
    return new Response(`Error: ${res.status}\n${JSON.stringify(json, null, 2)}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  const { access_token, refresh_token, expires_in, scope, token_type } = json as any;

  const html = `<!doctype html><html><body style="font-family:monospace;padding:24px;">
  <h2>Spotify tokens</h2>
  <pre>${JSON.stringify({ access_token, refresh_token, expires_in, scope, token_type, state }, null, 2)}</pre>
  <p>Copy and save <strong>refresh_token</strong> into your .env as <code>SPOTIFY_REFRESH_TOKEN</code>.</p>
  </body></html>`;

  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
};
