exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  let rock;
  try { rock = JSON.parse(event.body); } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  try {
    let image_url = rock.image_url || null;

    // Upload photo to Supabase Storage if base64 image is included
    if (rock.imageData) {
      const base64Data = rock.imageData.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const filename = `${rock.id}.jpg`;
      const uploadRes = await fetch(
        `${supabaseUrl}/storage/v1/object/rock-photos/${filename}`,
        {
          method: 'POST',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'image/jpeg',
            'x-upsert': 'true'
          },
          body: imageBuffer
        }
      );
      if (uploadRes.ok) {
        image_url = `${supabaseUrl}/storage/v1/object/public/rock-photos/${filename}`;
      }
    }

    const dbRow = {
      id: rock.id, name: rock.name, submitter: rock.submitter,
      location: rock.location, story: rock.story, emoji: rock.emoji,
      image_url,
      ai_type: rock.aiType || null,
      ai_analysis: rock.aiAnalysis || null,
      timestamp: rock.timestamp
    };

    const dbRes = await fetch(`${supabaseUrl}/rest/v1/rocks`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(dbRow)
    });
    if (!dbRes.ok) {
      const errText = await dbRes.text();
      throw new Error(`DB error: ${dbRes.status} ${errText}`);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
