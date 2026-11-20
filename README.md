# Peora

Website for Peora Packaged Drinking Water (Jabalpur, Madhya Pradesh).
React + Vite front end, one Vercel serverless function for the enquiry form.

## Folder layout

```
peora/
├── api/
│   └── inquiry.js          Enquiry form → email (Gmail SMTP), optional Postgres copy
├── db/
│   └── schema.sql          Table for stored enquiries (optional)
├── design/                 Local only, git-ignored: reference screenshots, original photos
├── frontend/
│   ├── index.html
│   ├── public/
│   │   ├── favicon.svg
│   │   └── assets/
│   │       ├── brand/      Logo mark, hero background
│   │       ├── products/   1 L, 500 ml, 20 L cut-outs
│   │       ├── clients/    Custom-label bottles and client logos
│   │       └── machines/   Plant machine photos (process section)
│   └── src/
│       ├── components/
│       │   ├── layout/     Header, Footer, Preloader
│       │   └── sections/   One file per page section
│       ├── hooks/
│       └── styles/index.css
├── package.json            Root: API dependencies + scripts that run the front end
└── vercel.json             Build, output and security headers
```

## Run locally

```bash
npm install        # also installs frontend/ (postinstall)
npm run dev        # http://localhost:5173
npm run build      # outputs frontend/dist
```

`npm run dev` serves the site only. To exercise `/api/inquiry` locally, use `vercel dev`.

## Environment variables (Vercel)

| Name | Required | Purpose |
|---|---|---|
| `SMTP_USER` | yes | Gmail address that sends enquiry emails |
| `SMTP_PASS` | yes | Gmail App Password for that account |
| `INQUIRY_TO` | no | Where enquiries go (default `omaquaserve@gmail.com`) |
| `SMTP_HOST` / `SMTP_PORT` | no | Use a non-Gmail SMTP server |
| `DATABASE_URL` | no | Neon Postgres URL to also store enquiries |
