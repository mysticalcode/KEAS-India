# KEAS India CMS Notes

The site now has a lightweight Node backend and custom CMS.

Run it locally:

```powershell
pnpm cms
```

CMS URL:

```text
http://127.0.0.1:4174/admin/
```

Default local password:

```text
keas-admin
```

For hosting, set these environment variables:

```text
KEAS_CMS_PASSWORD=<strong private password>
KEAS_CMS_SECRET=<long random session secret>
PORT=<host provided port>
```

Hostinger MySQL is supported. Add either `DATABASE_URL` or the separate `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` variables. When these are present, the app automatically creates the SQL tables for content, submissions, and media records.

The CMS can manage:

- Navigation
- Contact details
- Categories
- Destinations
- Experiences
- Detailed itineraries
- Custom services
- Journal posts
- Media uploads
- Contact enquiries
- Expedition booking enquiries
- Newsletter leads

Content is stored in MySQL when database variables are configured. Without MySQL, content falls back to `server/data/siteData.json` and syncs to `src/content/siteData.json` whenever it is saved from the CMS. The public website also fetches `/api/content` at runtime when the backend is running, so edits can appear immediately on the Node-served site.

Important hosting note:

The current public deployment repo contains only static `dist` files. That is correct for fast static hosting, but the CMS backend requires Node hosting. Use Hostinger's Node.js app option with the source repo for the CMS/backend version. See `HOSTINGER_NODE_DEPLOYMENT.md`.

Content still needed:

- Real KEAS trip photos for each experience.
- Real destination photos for Sainj Valley, Kullu, Manali, and Shimla.
- Final pricing or "on request" policy.
- Exact included/excluded items per experience.
- Booking flow preference: WhatsApp, email, Razorpay, or CMS-managed enquiries.
