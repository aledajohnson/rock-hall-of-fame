exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rocks?order=timestamp.desc`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
        }
      }
    );
    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    const rows = await res.json();
    const rocks = rows.map(r => ({
      id: r.id, name: r.name, submitter: r.submitter,
      location: r.location, story: r.story, emoji: r.emoji,
      image_url: r.image_url, aiType: r.ai_type,
      aiAnalysis: r.ai_analysis, timestamp: r.timestamp
    }));
    return { statusCode: 200, headers, body: JSON.stringify(rocks) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
