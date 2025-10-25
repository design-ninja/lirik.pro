import type { APIRoute } from 'astro';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken(): Promise<string | null> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID as string | undefined;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET as string | undefined;
  const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN as string | undefined;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export const GET: APIRoute = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return new Response(JSON.stringify({ url: null, title: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const res = await fetch(RECENTLY_PLAYED_URL, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ url: null, title: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const json = (await res.json()) as any;
    const item = json?.items?.[0];
    const track = item?.track;

    const trackUrl: string | null = track?.external_urls?.spotify ?? null;
    const trackName: string | null = track?.name ?? null;
    const artists: string = Array.isArray(track?.artists)
      ? track.artists
          .map((a: any) => a?.name)
          .filter(Boolean)
          .join(', ')
      : '';

    const title = trackName && artists ? `${artists} — ${trackName}` : (trackName ?? null);

    return new Response(JSON.stringify({ url: trackUrl, title }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch {
    return new Response(JSON.stringify({ url: null, title: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
};
