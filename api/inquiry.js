import nodemailer from 'nodemailer';
import { neon } from '@neondatabase/serverless';

/*
 * POST /api/inquiry
 * Emails every wholesale enquiry to the Peora inbox and, when DATABASE_URL
 * is set, also keeps a copy in Postgres.
 *
 * Required Vercel environment variables:
 *   SMTP_USER  – Gmail address that sends the mail (e.g. omaquaserve@gmail.com)
 *   SMTP_PASS  – a Gmail *App Password* for that account (not the normal password)
 * Optional:
 *   INQUIRY_TO – where enquiries are delivered (default omaquaserve@gmail.com)
 *   SMTP_HOST / SMTP_PORT – for a non-Gmail SMTP provider
 *   DATABASE_URL – Neon/Postgres connection string
 */

const DEFAULT_TO = 'omaquaserve@gmail.com';
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

function buildEmail(d) {
  const rows = [
    ['Name', d.name],
    ['Business type', d.business],
    ['City', d.city],
    ['Phone / Email', d.contact],
    ['Volume needed', d.volume],
  ];

  const text = [
    'New wholesale enquiry from peora website',
    '',
    ...rows.map(([k, v]) => `${k}: ${v || '-'}`),
    '',
    'Message:',
    d.message || '-',
  ].join('\n');

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#161743">
    <div style="background:#161743;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:20px;font-weight:700">peora</div>
      <div style="font-size:14px;opacity:.75;margin-top:4px">New wholesale enquiry</div>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#F7F4EB;font-size:15px">
      ${rows
        .map(
          ([k, v]) => `<tr>
        <td style="padding:12px 24px;color:#8585A3;width:38%;border-bottom:1px solid #EDE9DD">${escapeHtml(k)}</td>
        <td style="padding:12px 24px;font-weight:600;border-bottom:1px solid #EDE9DD">${escapeHtml(v || '-')}</td>
      </tr>`
        )
        .join('')}
    </table>
    <div style="background:#fff;padding:20px 24px;border-radius:0 0 12px 12px;border:1px solid #EDE9DD;border-top:0">
      <div style="color:#8585A3;font-size:13px;margin-bottom:6px">Message</div>
      <div style="white-space:pre-wrap;font-size:15px;line-height:1.6">${escapeHtml(d.message || '-')}</div>
    </div>
  </div>`;

  return { text, html };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Honeypot: real visitors never fill this hidden field
  if (body.company_website) {
    return res.status(200).json({ success: true });
  }

  const data = {
    name: clean(body.name, 120),
    business: clean(body.business_type, 60),
    city: clean(body.city, 80),
    volume: clean(body.volume, 80),
    contact: clean(body.contact, 120),
    message: String(body.message ?? '').trim().slice(0, 2000),
  };

  if (!data.name) return res.status(400).json({ error: 'Please enter your name.' });
  if (!data.contact) return res.status(400).json({ error: 'Please enter a phone number or email.' });

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('SMTP_USER / SMTP_PASS are not configured.');
    return res.status(500).json({ error: 'Email is not configured yet. Please email omaquaserve@gmail.com directly.' });
  }

  const transporter = nodemailer.createTransport(
    process.env.SMTP_HOST
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        }
      : { service: 'gmail', auth: { user: SMTP_USER, pass: SMTP_PASS } }
  );

  const { text, html } = buildEmail(data);
  const replyTo = EMAIL_RE.test(data.contact) ? data.contact : undefined;

  try {
    await transporter.sendMail({
      from: `"Peora Website" <${SMTP_USER}>`,
      to: process.env.INQUIRY_TO || DEFAULT_TO,
      replyTo,
      subject: `New enquiry: ${data.name}${data.business ? ` (${data.business})` : ''}${data.city ? ` – ${data.city}` : ''}`,
      text,
      html,
    });
  } catch (err) {
    console.error('Failed to send enquiry email:', err);
    return res.status(502).json({ error: 'We could not send your enquiry right now. Please try again in a moment.' });
  }

  // Keep a copy in the database when one is configured; never block the reply on it.
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
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
      await sql`
        INSERT INTO inquiries (name, business_type, city, volume, contact, message)
        VALUES (${data.name}, ${data.business}, ${data.city}, ${data.volume}, ${data.contact}, ${data.message});
      `;
    } catch (err) {
      console.error('Enquiry emailed but not saved to database:', err);
    }
  }

  return res.status(200).json({ success: true });
}
