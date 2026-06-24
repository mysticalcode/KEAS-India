# KEAS India CMS Notes

The site is now data-driven through `src/content/siteData.json`. This gives us a clean content model for:

- Navigation
- Contact details
- Categories
- Destinations
- Experiences
- Detailed itineraries
- Custom services
- Journal posts

I also scaffolded Decap CMS under `public/admin`, but the final CMS implementation depends on your preferred CMS inspiration and hosting stack.

Recommended production options:

1. Decap CMS with GitHub auth for a simple static-site editorial workflow.
2. Sanity or Strapi if you want a richer hosted CMS with media library, roles, drafts, and preview.
3. Payload CMS if you want a custom React/Node CMS and own the backend.

Content still needed:

- Real KEAS trip photos for each experience.
- Real destination photos for Sainj Valley, Kullu, Manali, and Shimla.
- Final pricing or "on request" policy.
- Exact included/excluded items per experience.
- Booking flow preference: WhatsApp, email, Razorpay, or CMS-managed enquiries.
- CMS inspiration/reference.
