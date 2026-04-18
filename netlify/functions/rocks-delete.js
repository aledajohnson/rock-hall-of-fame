exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  if (event.httpMethod !== 'DELETE') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const authHeaders = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`
  };

  try {
    // Fetch the rock to get its image_url before deleting
    const getRes = await fetch(
      `${supabaseUrl}/rest/v1/rocks?id=eq.${encodeURIComponent(body.id)}`,
      { headers: authHeaders }
    );
    const rocks = await getRes.json();
    const rock = rocks[0];

    // Delete photo from storage if one exists
    if (rock?.image_url) {
      const filename = rock.image_url.split('/rock-photos/')[1];
      if (filename) {
        await fetch(`${supabaseUrl}/storage/v1/object/rock-photos`, {
          method: 'DELETE',
          headers: { ...authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefixes: [filename] })
        });
      }
    }

    // Delete from database
    await fetch(
      `${supabaseUrl}/rest/v1/rocks?id=eq.${encodeURIComponent(body.id)}`,
      {
        method: 'DELETE',
        headers: { ...authHeaders, 'Prefer': 'return=minimal' }
      }
    );

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
