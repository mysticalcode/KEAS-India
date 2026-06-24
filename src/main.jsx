import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import data from './content/siteData.json';
import './styles.css';

const { categories, customServices, destinations, expeditions, experiences, journalPosts, navigation, site } = data;

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7 17L17 7M17 7H8M17 7V16" />
    </svg>
  );
}

function ThemeIcon({ theme }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {theme === 'dark' ? (
        <>
          <path d="M12 3V5M12 19V21M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M3 12H5M19 12H21M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64" />
          <path d="M12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8Z" />
        </>
      ) : (
        <path d="M21 13.2C19.78 13.72 18.39 13.84 17 13.44C13.64 12.48 11.68 8.98 12.64 5.62C12.92 4.65 13.42 3.78 14.08 3.06C9.51 2.62 5.35 5.62 4.1 10.01C2.75 14.76 5.5 19.71 10.25 21.06C14.43 22.25 18.78 20.26 20.69 16.62C21.25 15.56 21.08 14.25 21 13.2Z" />
      )}
    </svg>
  );
}

function Header({ theme, onToggleTheme }) {
  const isSubPage = window.location.pathname !== '/' || window.location.hash.startsWith('#/');

  return (
    <header className="site-header">
      <a className="brand" href={isSubPage ? '/' : '#top'} aria-label="KEAS India home">
        <img className="brand-logo brand-icon" src="/brand/keas-icon.svg" alt="" />
        <span>KEAS India</span>
      </a>
      <nav aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item.label} className="nav-link" href={isSubPage ? `/${item.href}` : item.href}>
            {item.label === 'Experiences' ? 'Experiences' : item.label === 'Journal' ? 'Blog' : item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="discover-link" href={isSubPage ? '/#experiences' : '#experiences'}>
          <span>Discover</span>
          <ArrowIcon />
        </a>
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <ThemeIcon theme={theme} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero-image" src={site.heroImage} alt="KEAS India Himalayan experience" fetchPriority="high" />
      <div className="hero-overlay" />
      <div className="hero-inner">
        <div className="hero-title">
          <h1>
            <span>Find</span>
            <span>your next</span>
          </h1>
          <p>Curated Himalayan expeditions, treks, retreats, and skill programs with transparent planning and field support.</p>
          <a className="primary-button" href="#experiences">
            Discover now
            <ArrowIcon />
          </a>
        </div>
        <div className="hero-trust" aria-label="KEAS rating">
          <div className="avatar-row">
            <img src="/images/drive-optimized/experience-rock.webp" alt="" />
            <img src="/images/drive-optimized/experience-pottery.webp" alt="" />
            <img src="/images/drive-optimized/destination-sainj.webp" alt="" />
          </div>
          <strong>4.9 <span>/ 5</span></strong>
          <p>Trusted by adventure, creator, and learning cohorts</p>
        </div>
        <h2 className="hero-script">
          <span>equilibrium</span>
          <span>journey.</span>
        </h2>
      </div>
    </section>
  );
}

function About() {
  const features = [
    ['Custom route', 'Routes are matched to fitness, season, acclimatization needs, and the purpose of the group.'],
    ['Safety-first design', 'Every program starts with screening, gear checks, weather review, and clear risk communication.'],
    ['Local field support', 'On-ground teams coordinate access, stays, food, transport, permits, and daily plan changes.'],
    ['Private cohorts', 'Custom departures for schools, teams, creators, families, clubs, and learning communities.']
  ];

  return (
    <section className="section about" id="about">
      <div>
        <p className="eyebrow">About us</p>
        <h2>Mountain journeys designed with craft, culture, safety, and care.</h2>
        <a className="primary-button inverted" href="#contact">
          Start your trip
          <ArrowIcon />
        </a>
      </div>
      <div className="feature-grid">
        {features.map(([title, copy], index) => (
          <article className="feature-card reveal" key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, action, href }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action ? (
        <div className="heading-action">
          <p>{eyebrow === 'Top destinations' ? 'Pick a base region, then let KEAS shape the route, stay style, activity intensity, and support model.' : 'Every KEAS program can be converted into a private departure with custom dates, route support, and add-on services.'}</p>
          <a className="primary-button inverted" href={href}>
            {action}
            <ArrowIcon />
          </a>
        </div>
      ) : null}
    </div>
  );
}

function Destinations() {
  return (
    <section className="section destinations" id="destinations">
      <SectionHeading eyebrow="Top destinations" title="Where do you want to go?" action="More destinations" href="#contact" />
      <div className="destination-grid">
        {destinations.map((destination) => (
          <a className="destination-card reveal" href={`/#/destinations/${slugify(destination.name)}`} key={destination.name}>
            <div className="image-wrap">
              <img src={destination.image} alt="" loading="lazy" />
              <span className="round-action"><ArrowIcon /></span>
            </div>
            <div className="card-copy">
              <h3>{destination.name}</h3>
              <p>{destination.count}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function VideoTour() {
  return (
    <section className="section video-tour">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Video tour</p>
          <h2>It's not just a trip. It's a vibe</h2>
        </div>
        <p>We balance route ambition with recovery, acclimatization, local culture, and decision-making in the field.</p>
      </div>
      <div className="video-frame">
        <img src="/images/drive-optimized/hero-pin-parvati.webp" alt="KEAS India mountain route" loading="lazy" />
        <a className="play-button" href="#expeditions" aria-label="View expedition programs">
          <ArrowIcon />
        </a>
      </div>
      <div className="stat-card">
        <strong>96%</strong>
        <p>Guests value the slower pacing, field briefings, and space to understand the terrain rather than rush through it.</p>
      </div>
    </section>
  );
}

function CategoryTabs() {
  return (
    <div className="category-tabs" aria-label="Experience filters">
      <a className="active" href="#experiences">All</a>
      {categories.map((category) => (
        <a href={`/#/categories/${category.slug}`} key={category.slug}>{category.title}</a>
      ))}
    </div>
  );
}

function ExperienceCard({ experience }) {
  return (
    <a className="experience-card reveal" href={`/#/experiences/${experience.slug}`}>
      <div className="experience-media">
        <img src={experience.image} alt="" loading="lazy" />
        <div className="experience-top">
          <span>Popular</span>
          <span className="round-action"><ArrowIcon /></span>
        </div>
      </div>
      <div className="experience-body">
        <div>
          <h3>{experience.title}</h3>
          <p>{experience.category}</p>
        </div>
        <div className="experience-meta">
          <span>{experience.duration}</span>
          <span>{experience.group}</span>
        </div>
        <details>
          <summary>
            Detailed itinerary
            <ArrowIcon />
          </summary>
          <ol>
            {experience.itinerary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </details>
        <div className="experience-foot">
          <strong>{experience.price}</strong>
          <span>{experience.rating} ({experience.reviews})</span>
        </div>
      </div>
    </a>
  );
}

function Experiences() {
  return (
    <section className="section experiences" id="experiences">
      <SectionHeading eyebrow="Our popular experiences" title="Find the right pace, terrain, and purpose" />
      <CategoryTabs />
      <div className="experience-grid">
        {experiences.map((experience) => (
          <ExperienceCard experience={experience} key={experience.slug} />
        ))}
      </div>
    </section>
  );
}

function ExpeditionCard({ expedition }) {
  return (
    <article className="expedition-card reveal">
      <div className="expedition-visual">
        <img src={expedition.gallery[0]} alt={`${expedition.title} mountain range`} loading="lazy" />
        <div className="experience-top">
          <span>{expedition.altitude}</span>
          <a className="round-action" href={`/#/expeditions/${expedition.slug}`} aria-label={`View ${expedition.title} details`}>
            <ArrowIcon />
          </a>
        </div>
      </div>
      <div className="expedition-copy">
        <p className="eyebrow">{expedition.region}</p>
        <h3>{expedition.title}</h3>
        <p>{expedition.summary}</p>
        <div className="expedition-meta">
          <span>{expedition.duration}</span>
          <span>{expedition.difficulty}</span>
          <span>{expedition.bestSeason}</span>
          <span>{expedition.group}</span>
        </div>
        <div className="highlight-row">
          {expedition.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
        <details className="expedition-expanded">
          <summary>
            Quick itinerary
            <ArrowIcon />
          </summary>
          <div className="quick-panel">
            <div>
              <h4>Short route view</h4>
              <ol className="itinerary-list compact-list">
                {expedition.itinerary.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="thumb-row" aria-label={`${expedition.title} image previews`}>
              {expedition.gallery.slice(1).map((image) => (
                <img src={image} alt="" loading="lazy" key={image} />
              ))}
            </div>
            <a className="primary-button inverted detail-link" href={`/#/expeditions/${expedition.slug}`}>
              View full itinerary
              <ArrowIcon />
            </a>
          </div>
        </details>
        <div className="experience-foot">
          <strong>{expedition.price}</strong>
          <span>{expedition.rating} ({expedition.reviews})</span>
        </div>
      </div>
    </article>
  );
}

function BookingForm({ expedition }) {
  const [status, setStatus] = useState('');

  function handleBookingSubmit(event) {
    event.preventDefault();
    setStatus(`Booking enquiry noted for ${expedition.title}. We will connect this to the CMS/email workflow next.`);
  }

  return (
    <form className="booking-form" aria-label={`${expedition.title} booking enquiry`} onSubmit={handleBookingSubmit}>
      <h4>Enquire / book this expedition</h4>
      <div className="form-row">
        <label>
          Name
          <input name="name" type="text" placeholder="Your name" />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" placeholder="+91" />
        </label>
      </div>
      <label>
        Email
        <input name="email" type="email" placeholder="you@example.com" />
      </label>
      <label>
        Expedition
        <input name="expedition" type="text" value={expedition.title} readOnly />
      </label>
      <label>
        Message
        <textarea name="message" rows="5" placeholder="Preferred dates, group size, experience level, and questions." />
      </label>
      <button type="submit">Send booking enquiry</button>
      {status ? <p className="form-note dark-note">{status}</p> : null}
    </form>
  );
}

function ExpeditionDetail({ expedition }) {
  return (
    <>
      <section className="detail-hero">
        <img src={expedition.gallery[0]} alt={`${expedition.title} mountain range`} />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#expeditions">
            <ArrowIcon />
            Back to expeditions
          </a>
          <p className="eyebrow">{expedition.region}</p>
          <h1>{expedition.title}</h1>
          <p>{expedition.summary}</p>
          <div className="detail-meta">
            <span>{expedition.altitude}</span>
            <span>{expedition.duration}</span>
            <span>{expedition.difficulty}</span>
            <span>{expedition.bestSeason}</span>
            <span>{expedition.group}</span>
            <span>{expedition.price}</span>
          </div>
        </div>
      </section>
      <section className="section detail-page">
        <div className="detail-gallery">
          {expedition.gallery.map((image) => (
            <img src={image} alt={`${expedition.title} expedition view`} loading="lazy" key={image} />
          ))}
        </div>
        <div className="detail-layout">
          <div className="detail-main">
            <p className="eyebrow">Detailed itinerary</p>
            <h2>Route plan and summit rhythm</h2>
            <ol className="detail-itinerary">
              {expedition.itinerary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <aside className="detail-aside">
            <div className="detail-panel">
              <h3>Things to pack</h3>
              <ul className="packing-list">
                {expedition.packing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="detail-panel">
              <h3>Highlights</h3>
              <div className="highlight-row">
                {expedition.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </div>
            <div className="detail-panel">
              <h3>KEAS field support</h3>
              <ul className="packing-list">
                <li>Pre-trip fitness, gear, and medical disclosure call.</li>
                <li>Weather-window planning with reserve-day recommendations.</li>
                <li>Daily route briefings, hydration checks, and altitude observation.</li>
                <li>Local logistics coordination for roadheads, camps, meals, and support staff.</li>
                <li>Post-trip debrief with next-step training or recovery guidance.</li>
              </ul>
            </div>
            <BookingForm expedition={expedition} />
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}

function CategoryDetail({ category }) {
  const relatedExperiences = experiences.filter((experience) => experience.category.toLowerCase().includes(category.title.toLowerCase().split(' ')[0]));

  return (
    <>
      <section className="detail-hero">
        <img src={category.image} alt={`${category.title} experience`} />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#experiences">
            <ArrowIcon />
            Back to experiences
          </a>
          <p className="eyebrow">Experience category</p>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </div>
      </section>
      <section className="section detail-page">
        <div className="detail-layout">
          <div className="detail-main">
            <p className="eyebrow">What this includes</p>
            <h2>Designed as a complete KEAS module</h2>
            <ol className="detail-itinerary">
              {category.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <aside className="detail-aside">
            <div className="detail-panel">
              <h3>Good for</h3>
              <div className="highlight-row">
                <span>Private groups</span>
                <span>Learning cohorts</span>
                <span>Custom dates</span>
                <span>Field support</span>
              </div>
            </div>
            <div className="detail-panel">
              <h3>Related programs</h3>
              <ul className="packing-list">
                {(relatedExperiences.length ? relatedExperiences : experiences).slice(0, 3).map((experience) => (
                  <li key={experience.slug}>{experience.title}</li>
                ))}
              </ul>
            </div>
            <a className="primary-button" href="/#contact">Enquire about this category <ArrowIcon /></a>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}

function ExperienceDetail({ experience }) {
  return (
    <>
      <section className="detail-hero">
        <img src={experience.image} alt={experience.title} />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#experiences">
            <ArrowIcon />
            Back to experiences
          </a>
          <p className="eyebrow">{experience.category}</p>
          <h1>{experience.title}</h1>
          <p>{experience.summary}</p>
          <div className="detail-meta">
            <span>{experience.duration}</span>
            <span>{experience.group}</span>
            <span>{experience.price}</span>
            <span>{experience.rating} rating</span>
          </div>
        </div>
      </section>
      <section className="section detail-page">
        <div className="detail-layout">
          <div className="detail-main">
            <p className="eyebrow">Detailed itinerary</p>
            <h2>Daily rhythm and learning flow</h2>
            <ol className="detail-itinerary">
              {experience.itinerary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <aside className="detail-aside">
            <div className="detail-panel">
              <h3>KEAS support</h3>
              <ul className="packing-list">
                <li>Pre-program briefing and expectation setting.</li>
                <li>Local coordination for stays, routes, meals, and activity windows.</li>
                <li>Safety notes, gear guidance, and field debriefs.</li>
              </ul>
            </div>
            <a className="primary-button" href="/#contact">Send enquiry <ArrowIcon /></a>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}

function DestinationDetail({ destination }) {
  return (
    <>
      <section className="detail-hero">
        <img src={destination.image} alt={destination.name} />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#destinations">
            <ArrowIcon />
            Back to destinations
          </a>
          <p className="eyebrow">{destination.count}</p>
          <h1>{destination.name}</h1>
          <p>{destination.copy}</p>
        </div>
      </section>
      <section className="section detail-page">
        <div className="detail-layout">
          <div className="detail-main">
            <p className="eyebrow">Why this base works</p>
            <h2>Route, stay, and activity planning</h2>
            <ol className="detail-itinerary">
              <li>Use this region as a base for custom KEAS experiences and private departures.</li>
              <li>Match the activity intensity to the group, season, road access, and comfort level.</li>
              <li>Combine outdoor learning, local culture, recovery time, and field-supported logistics.</li>
            </ol>
          </div>
          <aside className="detail-aside">
            <div className="detail-panel">
              <h3>Possible formats</h3>
              <div className="highlight-row">
                <span>Private trips</span>
                <span>Retreats</span>
                <span>Skill clinics</span>
                <span>Learning cohorts</span>
              </div>
            </div>
            <a className="primary-button" href="/#contact">Plan this region <ArrowIcon /></a>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}

function BlogDetail({ post }) {
  return (
    <>
      <section className="detail-hero">
        <img src={post.image} alt={post.title} />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#journal">
            <ArrowIcon />
            Back to blog
          </a>
          <p className="eyebrow">{post.date}</p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </section>
      <section className="section detail-page">
        <article className="detail-main article-body">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </section>
      <Footer />
    </>
  );
}

function Expeditions() {
  return (
    <section className="section expeditions" id="expeditions">
      <SectionHeading eyebrow="Expeditions" title="Guided Himalayan objectives with real planning depth" action="Plan expedition" href="#contact" />
      <div className="expedition-grid">
        {expeditions.map((expedition) => (
          <ExpeditionCard expedition={expedition} key={expedition.slug} />
        ))}
      </div>
    </section>
  );
}

function TripCta() {
  return (
    <section className="section trip-cta">
      <div>
        <p className="eyebrow">Let's go on a trip!</p>
        <h2>Are you ready to start your KEAS India experience?</h2>
        <p>Share your dates, group profile, fitness level, and the kind of experience you want. We will recommend the right route and support plan.</p>
      </div>
      <div className="cta-actions">
        <a className="primary-button" href="#contact">
          Contact us
          <ArrowIcon />
        </a>
        <a className="primary-button ghost" href="#experiences">
          Explore experiences
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ['Tell us your intent', 'Share dates, group size, fitness level, prior trekking experience, and comfort expectations.'],
    ['Shape the route', 'We align destination, difficulty, acclimatization, stays, activities, transport, and field support.'],
    ['Arrive prepared', 'You receive itinerary notes, packing guidance, safety expectations, and a clear contact path before departure.']
  ];

  return (
    <section className="section process">
      <div>
        <p className="eyebrow">Easy process</p>
        <h2>Three simple steps to your trip</h2>
      </div>
      <div className="process-list">
        {steps.map(([title, copy], index) => (
          <article className="process-card reveal" key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CustomExperiences() {
  return (
    <section className="section custom-block">
      <div>
        <p className="eyebrow">Custom experiences</p>
        <h2>Built around your group, terrain appetite, dates, and comfort level.</h2>
      </div>
      <div className="service-list">
        {customServices.map((service) => (
          <span key={service}>{service}</span>
        ))}
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="section journal" id="journal">
      <SectionHeading eyebrow="Blog" title="Field notes for safer, slower, better mountain travel" action="See all articles" href="#journal" />
      <div className="journal-grid">
        {journalPosts.map((post) => (
          <a className="journal-card reveal" href={`/#/blog/${post.slug}`} key={post.title}>
            <img src={post.image} alt="" loading="lazy" />
            <div>
              <span>{post.date}</span>
              <h3>{post.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('Thanks. We will connect this to the CMS email list when the backend is selected.');
  }

  return (
    <section className="section newsletter">
      <div>
        <p className="eyebrow">Newsletter</p>
        <h2>Get route openings, safety notes, retreat dates, and private departure windows.</h2>
      </div>
      <form className="newsletter-form" aria-label="Newsletter signup" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email address" aria-label="Email address" />
        <button type="submit">Subscribe</button>
        {status ? <p className="form-note">{status}</p> : null}
      </form>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('Enquiry captured locally for now. Next step: connect this form to your CMS or email service.');
  }

  return (
    <section className="section contact" id="contact">
      <div>
        <p className="eyebrow">Contact us</p>
        <h2>Plan your KEAS India trip with the right level of support.</h2>
        <div className="contact-lines">
          <a href="tel:+918719962147">{site.phone}</a>
          {site.emails.map((email) => (
            <a href={`mailto:${email}`} key={email}>{email}</a>
          ))}
        </div>
      </div>
      <form className="contact-form" aria-label="Contact form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Name<input name="name" type="text" placeholder="Your name" /></label>
          <label>Phone<input name="phone" type="tel" placeholder="+91" /></label>
        </div>
        <label>Email<input name="email" type="email" placeholder="you@example.com" /></label>
        <label>
          Experience type
          <select name="experience">
            {categories.map((category) => (
              <option key={category.slug}>{category.title}</option>
            ))}
          </select>
        </label>
        <label>Message<textarea name="message" rows="5" placeholder="Tell us your dates, group size, and goals." /></label>
        <button type="submit">Send enquiry</button>
        {status ? <p className="form-note dark-note">{status}</p> : null}
      </form>
    </section>
  );
}

function Footer() {
  const isSubPage = window.location.pathname !== '/' || window.location.hash.startsWith('#/');

  return (
    <footer className="footer">
      <a className="brand" href={isSubPage ? '/' : '#top'} aria-label="KEAS India home">
        <img className="brand-logo brand-icon" src="/brand/keas-icon.svg" alt="" />
        <span>KEAS India</span>
      </a>
      <div className="footer-links">
        <a href={isSubPage ? '/#about' : '#about'}>About</a>
        <a href={isSubPage ? '/#contact' : '#contact'}>Contact</a>
        <a href={isSubPage ? '/#journal' : '#journal'}>Blog</a>
        <a href={isSubPage ? '/#experiences' : '#experiences'}>Our experiences</a>
      </div>
      <p>{site.domain}</p>
    </footer>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('keas-theme') || 'dark');
  const categorySlug = window.location.hash.match(/^#\/categories\/([^/]+)/)?.[1];
  const experienceSlug = window.location.hash.match(/^#\/experiences\/([^/]+)/)?.[1];
  const expeditionSlug =
    window.location.hash.match(/^#\/expeditions\/([^/]+)/)?.[1] ||
    window.location.pathname.match(/^\/expeditions\/([^/]+)/)?.[1];
  const destinationSlug = window.location.hash.match(/^#\/destinations\/([^/]+)/)?.[1];
  const blogSlug = window.location.hash.match(/^#\/blog\/([^/]+)/)?.[1];
  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const selectedExperience = experiences.find((experience) => experience.slug === experienceSlug);
  const selectedExpedition = expeditions.find((expedition) => expedition.slug === expeditionSlug);
  const selectedDestination = destinations.find((destination) => slugify(destination.name) === destinationSlug);
  const selectedPost = journalPosts.find((post) => post.slug === blogSlug);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('keas-theme', nextTheme);
      return nextTheme;
    });
  }

  if (selectedExpedition) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <ExpeditionDetail expedition={selectedExpedition} />
      </main>
    );
  }

  if (selectedCategory) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <CategoryDetail category={selectedCategory} />
      </main>
    );
  }

  if (selectedExperience) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <ExperienceDetail experience={selectedExperience} />
      </main>
    );
  }

  if (selectedDestination) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <DestinationDetail destination={selectedDestination} />
      </main>
    );
  }

  if (selectedPost) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <BlogDetail post={selectedPost} />
      </main>
    );
  }

  return (
    <main data-theme={theme}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Destinations />
      <VideoTour />
      <Expeditions />
      <Experiences />
      <TripCta />
      <Process />
      <CustomExperiences />
      <Journal />
      <Newsletter />
      <Contact />
      <Footer />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
