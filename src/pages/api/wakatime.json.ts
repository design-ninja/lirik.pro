import type { APIRoute } from 'astro';

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function formatHuman(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const apiKey = import.meta.env.WAKATIME_API_KEY as string | undefined;
    const user = (import.meta.env.WAKATIME_USER as string | undefined) ?? 'current';
    if (!apiKey) {
      return new Response(JSON.stringify({ totalSeconds: 0, totalText: null, topLanguages: [], range: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const days = Math.max(1, Math.min(90, Number(url.searchParams.get('days') ?? 7)));
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    const start = toISODate(startDate);
    const end = toISODate(endDate);
    const auth = Buffer.from(`${apiKey}:`).toString('base64');

    const res = await fetch(`https://wakatime.com/api/v1/users/${encodeURIComponent(user)}/summaries?start=${start}&end=${end}`, {
      headers: { Authorization: `Basic ${auth}` }
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ totalSeconds: 0, totalText: null, topLanguages: [], range: { start, end, days } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const json: any = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];

    let totalSeconds = Number(json?.cumulative_total?.seconds ?? 0);
    if (!totalSeconds) {
      totalSeconds = data.reduce((acc: number, d: any) => acc + Number(d?.grand_total?.total_seconds ?? 0), 0);
    }
    const totalText = json?.cumulative_total?.text ?? formatHuman(totalSeconds);

    const langMap: Record<string, number> = {};
    for (const day of data) {
      for (const l of day?.languages ?? []) {
        const name = String(l?.name ?? '');
        const seconds = Number(l?.total_seconds ?? 0);
        if (!name) continue;
        langMap[name] = (langMap[name] ?? 0) + seconds;
      }
    }
    const langs = Object.entries(langMap)
      .map(([name, seconds]) => ({ name, seconds }))
      .sort((a, b) => b.seconds - a.seconds);
    const topLanguages = langs.slice(0, 5).map(({ name, seconds }) => ({
      name,
      percent: totalSeconds ? Math.round((seconds / totalSeconds) * 1000) / 10 : 0
    }));

    return new Response(JSON.stringify({ range: { start, end, days }, totalSeconds, totalText, topLanguages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch {
    return new Response(JSON.stringify({ totalSeconds: 0, totalText: null, topLanguages: [], range: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
};
