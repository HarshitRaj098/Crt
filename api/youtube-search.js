export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return res.status(503).json({ error: 'YouTube API key is not configured on the server.' });
  const q = typeof req.query.q === 'string' ? req.query.q.trim().replace(/\s+/g, ' ').slice(0, 200) : '';
  if (!q) return res.status(400).json({ error: 'Missing search query.' });
  // Do not let transient upstream failures or quota errors get cached by the CDN.
  res.setHeader('Cache-Control', 'no-store');
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.search = new URLSearchParams({ part:'snippet', type:'video', videoEmbeddable:'true', maxResults:'10', q, key }).toString();
    // Fail quickly instead of leaving the CRT search panel stuck on slow upstream requests.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let upstream;
    try {
      upstream = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status === 403 ? 502 : upstream.status).json({ error: data?.error?.message || 'YouTube API request failed.' });
    // Cache only successful search responses to reduce latency and YouTube API quota usage.
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ items:(data.items || []).map(item => ({
      videoId:item.id?.videoId, title:item.snippet?.title || 'Untitled video',
      channelTitle:item.snippet?.channelTitle || 'YouTube',
      description:item.snippet?.description || '',
      thumbnail:item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || ''
    })).filter(item => item.videoId) });
  } catch (error) {
    if (error?.name === 'AbortError') return res.status(504).json({ error:'YouTube search timed out. Please try again.' });
    return res.status(502).json({ error:'Could not reach YouTube. Try again.' });
  }
}