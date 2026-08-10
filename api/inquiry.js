import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, business_type, city, volume, contact, message } = req.body || {};

    // Input sanitization and length bounds
    const safeName = String(name).trim().slice(0, 255);
    const safeContact = String(contact || '').trim().slice(0, 255);
    const safeBusiness = String(business_type || '').trim().slice(0, 100);
    const safeCity = String(city || '').trim().slice(0, 100);
    const safeVolume = String(volume || '').trim().slice(0, 100);
    const safeMessage = String(message || '').trim().slice(0, 2000);

    if (!safeName) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!safeContact) {
      return res.status(400).json({ error: 'Phone number or email is required' });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('DATABASE_URL environment variable is missing.');
      return res.status(500).json({ error: 'Database configuration error.' });
    }

    const sql = neon(databaseUrl);

    // Auto-create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        business_type VARCHAR(100),
        city VARCHAR(100),
        volume VARCHAR(100),
        contact VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert inquiry record securely using parameterized queries
    const result = await sql`
      INSERT INTO inquiries (name, business_type, city, volume, contact, message)
      VALUES (${safeName}, ${safeBusiness}, ${safeCity}, ${safeVolume}, ${safeContact}, ${safeMessage})
      RETURNING id, created_at;
    `;

    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully',
      id: result[0]?.id,
      created_at: result[0]?.created_at,
    });
  } catch (error) {
    console.error('Error handling inquiry submission:', error);
    return res.status(500).json({
      error: 'Failed to process inquiry',
    });
  }
}
