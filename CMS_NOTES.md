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

Content is stored in `server/data/siteData.json` and synced to `src/content/siteData.json` whenever it is saved from the CMS. The public website also fetches `/api/content` at runtime when the backend is running, so edits can appear immediately on the Node-served site.

Important hosting note:

The current public deployment repo contains only static `dist` files. That is correct for fast static hosting, but the CMS backend requires Node hosting. Use Hostinger's Node.js app option for the CMS/backend version, or keep the static public repo for the website and run the CMS on a separate Node app.

Content still needed:

- Real KEAS trip photos for each experience.
- Real destination photos for Sainj Valley, Kullu, Manali, and Shimla.
- Final pricing or "on request" policy.
- Exact included/excluded items per experience.
- Booking flow preference: WhatsApp, email, Razorpay, or CMS-managed enquiries.
