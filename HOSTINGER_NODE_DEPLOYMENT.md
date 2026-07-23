# Hostinger Node.js Deployment

Use the source repository for the Node.js app:

```text
https://github.com/mysticalcode/KEAS-India.git
```

The public dist-only repository is only for static hosting. The CMS, contact forms, bookings, newsletter leads, and SQL storage require this Node.js app.

## Hostinger App Settings

Recommended settings in hPanel:

```text
Application root: repository root
Startup file: app.js
Node version: 20 or newer
Build command: npm run build
Start command: npm start
```

If Hostinger gives you an install command field, use:

```text
npm install
```

The app serves:

```text
Website: /
CMS: /admin/
API: /api/*
```

## Required Environment Variables

```text
NODE_ENV=production
KEAS_CMS_PASSWORD=<strong admin password>
KEAS_CMS_SECRET=<long random session secret>
```

Hostinger usually provides `PORT` automatically. Add `PORT` only if the Node.js panel explicitly asks for it.

## Optional Hostinger MySQL Variables

Create a MySQL database in Hostinger, then add either `DATABASE_URL`:

```text
DATABASE_URL=mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME
```

Or add the separate variables:

```text
MYSQL_HOST=<hostinger mysql host>
MYSQL_PORT=3306
MYSQL_USER=<database user>
MYSQL_PASSWORD=<database password>
MYSQL_DATABASE=<database name>
```

When these variables are present, the app automatically creates:

```text
keas_content
keas_submissions
keas_media
```

Without MySQL variables, the app uses local JSON files in `server/data/`, which is fine for local testing but not ideal for production persistence.

## After Deploy

Open:

```text
https://keasindia.com/admin/
```

Log in with `KEAS_CMS_PASSWORD`.

Make one small content edit and submit a test enquiry. Then check the CMS submissions table to confirm the backend and database are working.
