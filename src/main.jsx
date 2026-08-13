import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import data from './content/siteData.json';
import './styles.css';

let currentData = data;
let { categories, customServices, destinations, expeditions, experiences, journalPosts, navigation, site } = currentData;

function applyContent(nextData) {
  currentData = nextData;
  ({ categories, customServices, destinations, expeditions, experiences, journalPosts, navigation, site } = currentData);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function postJson(path, payload) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('The CMS backend is not available yet.');
  }
  return response.json();
}

function whatsappUrl(message) {
  const phone = site.phone.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
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

function MenuIcon({ open }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {open ? (
        <>
          <path d="M6 6L18 18" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7H20" />
          <path d="M4 12H20" />
          <path d="M4 17H20" />
        </>
      )}
    </svg>
  );
}

function Header({ theme, onToggleTheme }) {
  const isSubPage = window.location.pathname !== '/' || window.location.hash.startsWith('#/');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`site-header${menuOpen ? ' menu-open' : ''}`}>
      <a className="brand" href={isSubPage ? '/' : '#top'} aria-label="KEAS India home" onClick={() => setMenuOpen(false)}>
        <img className="brand-logo brand-icon" src="/brand/keas-icon.svg" alt="" />
        <span>KEAS India</span>
      </a>
      <nav aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item.label} className="nav-link" href={item.href.startsWith('/#/') ? item.href : isSubPage ? `/${item.href}` : item.href} onClick={() => setMenuOpen(false)}>
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
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          <MenuIcon open={menuOpen} />
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
          <p className="hero-kicker">Kinetic Earth Adventure Sports</p>
          <h1>
            <span>Himalayan</span>
            <span>field craft.</span>
          </h1>
          <p>Book skill-led Himalayan packages with clear prices, real KEAS field support, small teams, and WhatsApp-first planning before you commit.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#experiences">
              View packages
              <ArrowIcon />
            </a>
            <a className="primary-button ghost hero-secondary" href="#contact">
              Talk to KEAS
            </a>
          </div>
          <div className="hero-metrics" aria-label="KEAS India highlights">
            <span><strong>5</strong> launch packages</span>
            <span><strong>4-6</strong> guests per team</span>
            <span><strong>Aut</strong> pickup options</span>
          </div>
        </div>
        <div className="hero-trust" aria-label="KEAS rating">
          <div className="avatar-row">
            <img src="/images/keas-real/img-20260619-wa0000.jpg" alt="" />
            <img src="/images/keas-real/img-20260612-wa0011.jpg" alt="" />
            <img src="/images/keas-real/img-20260619-wa0001.jpg" alt="" />
          </div>
          <strong>4.9 <span>/ 5</span></strong>
          <p>Real field teams, transparent itineraries, and direct booking support</p>
        </div>
        <h2 className="hero-script">
          <span>move with</span>
          <span>mountains.</span>
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
          <p>Every KEAS program can be converted into a private departure with custom dates, route support, and add-on services.</p>
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
        <img src="/images/keas-real/img-20260612-wa0049.jpg" alt="KEAS India mountain route" loading="lazy" />
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
      <a className="active" href="#experiences">All packages</a>
      {categories.map((category) => (
        <a href={`/#/categories/${category.slug}`} key={category.slug}>{category.title}</a>
      ))}
    </div>
  );
}

function ProgramActions({ program, kind = 'package' }) {
  const message = `Hi KEAS India, I want to enquire about ${program.title} (${program.price}). Please share available dates, offers, and booking details.`;

  return (
    <div className="program-actions">
      <a className="primary-button" href="/#contact">
        Instant booking
        <ArrowIcon />
      </a>
      <a className="primary-button whatsapp-offer" href={whatsappUrl(message)} target="_blank" rel="noreferrer">
        WhatsApp offer
        <ArrowIcon />
      </a>
      <a className="primary-button ghost" href={`/#/${kind === 'expedition' ? 'expeditions' : 'experiences'}/${program.slug}`}>
        Full itinerary
        <ArrowIcon />
      </a>
    </div>
  );
}

function AnimatedItinerary({ items, compact = false }) {
  return (
    <ol className={`animated-itinerary${compact ? ' compact' : ''}`}>
      {items.map((item, index) => (
        <li key={item} style={{ '--step-delay': `${index * 90}ms` }}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}

function ExperienceCard({ experience }) {
  const quickFacts = [
    experience.totalDistance ? ['Distance', experience.totalDistance] : null,
    experience.maxAltitude ? ['Altitude', experience.maxAltitude] : null,
    experience.startEnd ? ['Route', experience.startEnd] : null
  ].filter(Boolean);

  return (
    <article className="experience-card package-card reveal">
      <div className="experience-media">
        <img src={experience.image} alt="" loading="lazy" />
        <div className="experience-top">
          <span>{experience.duration}</span>
          <a className="round-action" href={`/#/experiences/${experience.slug}`} aria-label={`View ${experience.title} itinerary`}><ArrowIcon /></a>
        </div>
      </div>
      <div className="experience-body">
        <div>
          <h3>{experience.title}</h3>
          <p>{experience.category} - {experience.location}</p>
        </div>
        <div className="experience-meta">
          <span>{experience.difficulty}</span>
          <span>{experience.group}</span>
          <span>{experience.pickupDrop}</span>
        </div>
        <p>{experience.summary}</p>
        {quickFacts.length ? (
          <div className="package-facts" aria-label={`${experience.title} quick facts`}>
            {quickFacts.map(([label, value]) => (
              <span key={label}>
                <strong>{label}</strong>
                {value}
              </span>
            ))}
          </div>
        ) : null}
        <div className="highlight-row package-highlights">
          {(experience.highlights || []).slice(0, 4).map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
        <div className="experience-foot">
          <strong>{experience.price}</strong>
          <span>{experience.rating} ({experience.reviews})</span>
        </div>
        <ProgramActions program={experience} />
      </div>
    </article>
  );
}

function Experiences() {
  return (
    <section className="section experiences" id="experiences">
      <SectionHeading eyebrow="Bookable packages" title="Choose your KEAS experience, then speak directly with the field team" />
      <CategoryTabs />
      <div className="experience-grid">
        {experiences.map((experience) => (
          <ExperienceCard experience={experience} key={experience.slug} />
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  const trustPoints = [
    ['Talk before you pay', `Call or WhatsApp ${site.phone} to confirm dates, fitness, route fit, and available offers.`],
    ['Small guided teams', 'Most launch packages are built around 4-6 participants so the guide can actually watch the group.'],
    ['Real mountain systems', 'Each booking includes route briefing, gear check, safety expectations, inclusions, exclusions, and packing guidance.']
  ];

  return (
    <section className="section trust-section">
      <div className="trust-copy">
        <p className="eyebrow">Why people book KEAS</p>
        <h2>Human planning before the mountain day begins.</h2>
        <p>KEAS is not a faceless checkout page. You can speak with the team, understand difficulty honestly, ask what to pack, and choose the package that fits your group instead of guessing from a brochure.</p>
        <div className="trust-actions">
          <a className="primary-button" href={whatsappUrl('Hi KEAS India, I want help choosing the right package and current offers.')} target="_blank" rel="noreferrer">
            Ask on WhatsApp
            <ArrowIcon />
          </a>
          <a className="primary-button ghost" href="#contact">
            Request a call
          </a>
        </div>
      </div>
      <div className="human-proof">
        <div className="proof-photo">
          <img src="/images/keas-real/img-20260619-wa0000.jpg" alt="KEAS India field team preparing rock craft equipment" loading="lazy" />
          <span>KEAS field team</span>
        </div>
        <div className="proof-card">
          <div className="avatar-row">
            <img src="/images/keas-real/img-20260619-wa0000.jpg" alt="" />
            <img src="/images/keas-real/img-20260612-wa0011.jpg" alt="" />
            <img src="/images/keas-real/img-20260619-wa0001.jpg" alt="" />
          </div>
          <strong>Small teams. Clear calls. Real routes.</strong>
          <p>Before booking, KEAS helps you match the route to your experience level, comfort, dates, and group profile.</p>
        </div>
      </div>
      <div className="trust-grid">
        {trustPoints.map(([title, copy], index) => (
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
        <ProgramActions program={expedition} kind="expedition" />
      </div>
    </article>
  );
}

function BookingForm({ expedition, program }) {
  const [status, setStatus] = useState('');
  const selectedProgram = expedition || program;
  const programType = expedition ? 'expedition' : 'package';

  async function handleBookingSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.programSlug = selectedProgram.slug;
    payload.programType = programType;
    try {
      await postJson('/api/booking', payload);
      form.reset();
      setStatus(`Thanks. Your ${selectedProgram.title} enquiry has been saved and the KEAS team will respond soon.`);
    } catch {
      setStatus(`Please WhatsApp or call ${site.phone} for ${selectedProgram.title}. The enquiry backend is not running on this host yet.`);
    }
  }

  return (
    <form className="booking-form" aria-label={`${selectedProgram.title} booking enquiry`} onSubmit={handleBookingSubmit}>
      <h4>Instant booking enquiry</h4>
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
        Program
        <input name="program" type="text" value={selectedProgram.title} readOnly />
      </label>
      <label>
        Message
        <textarea name="message" rows="5" placeholder="Preferred dates, group size, experience level, and questions." />
      </label>
      <button type="submit">Send booking enquiry</button>
      <a className="primary-button whatsapp-offer booking-whatsapp" href={whatsappUrl(`Hi KEAS India, I want to book/enquire about ${selectedProgram.title} (${selectedProgram.price}).`)} target="_blank" rel="noreferrer">
        Enquire on WhatsApp
        <ArrowIcon />
      </a>
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
            <AnimatedItinerary items={expedition.itinerary} />
          </div>
          <aside className="detail-aside">
            <div className="detail-panel price-panel">
              <p className="eyebrow">Expedition quote</p>
              <strong>{expedition.price}</strong>
              <p>{expedition.duration} · {expedition.group} · {expedition.bestSeason}</p>
            </div>
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
  const quickFacts = [
    ['Duration', experience.duration],
    ['Group', experience.group],
    ['Difficulty', experience.difficulty],
    ['Pickup/drop', experience.pickupDrop],
    experience.totalDistance ? ['Distance', experience.totalDistance] : null,
    experience.maxAltitude ? ['Altitude', experience.maxAltitude] : null,
    experience.startEnd ? ['Start/end', experience.startEnd] : null
  ].filter(Boolean);

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
            <span>{experience.difficulty}</span>
            <span>{experience.pickupDrop}</span>
            {experience.totalDistance ? <span>{experience.totalDistance}</span> : null}
            {experience.maxAltitude ? <span>{experience.maxAltitude}</span> : null}
            <span>{experience.price}</span>
            <span>{experience.rating} rating</span>
          </div>
        </div>
      </section>
      <section className="section detail-page">
        <div className="detail-layout">
          <div className="detail-main">
            <p className="eyebrow">Detailed itinerary</p>
            <h2>Animated day-by-day route plan</h2>
            <AnimatedItinerary items={experience.itinerary} />
          </div>
          <aside className="detail-aside">
            <div className="detail-panel price-panel">
              <p className="eyebrow">Package price</p>
              <strong>{experience.price}</strong>
              <p>{experience.duration} - {experience.group} - {experience.pickupDrop}</p>
            </div>
            <div className="detail-panel">
              <h3>Quick facts</h3>
              <dl className="fact-list">
                {quickFacts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="detail-panel">
              <h3>Package highlights</h3>
              <div className="highlight-row">
                {(experience.highlights || []).map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </div>
            {experience.skillsCovered ? (
              <div className="detail-panel">
                <h3>Skills covered</h3>
                <ul className="packing-list">
                  {experience.skillsCovered.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {experience.courseObjectives ? (
              <div className="detail-panel">
                <h3>Course objectives</h3>
                <ul className="packing-list">
                  {experience.courseObjectives.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="detail-panel">
              <h3>Inclusions</h3>
              <ul className="packing-list">
                {(experience.inclusions || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="detail-panel">
              <h3>Exclusions</h3>
              <ul className="packing-list">
                {(experience.exclusions || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {experience.thingsToPack ? (
              <div className="detail-panel">
                <h3>Things to pack</h3>
                <ul className="packing-list">
                  {experience.thingsToPack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <BookingForm program={experience} />
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

function AboutPage() {
  const beliefs = [
    ['Nature is not a backdrop.', 'It is a teacher, a responsibility and a place to which we belong.'],
    ['Confidence is not created by motivational words.', 'It is built by attempting something difficult, learning carefully and discovering that you can do more than you assumed.'],
    ['Skill matters more than spectacle.', 'The strongest experience is not always the most extreme; it is the one that leaves you more aware, capable and prepared.'],
    ['Challenge and stillness belong together.', 'There are moments to climb, move and push, and moments to breathe, listen and recover.'],
    ['Adventure should benefit the places that make it possible.', 'Local knowledge deserves respect, communities deserve meaningful participation, and natural environments deserve more than symbolic promises.']
  ];

  return (
    <>
      <section className="detail-hero about-page-hero">
        <img src="/images/keas-real/img-20260612-wa0054.jpg" alt="KEAS India mountain landscape" />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#top">
            <ArrowIcon />
            Back home
          </a>
          <p className="eyebrow">About KEAS India</p>
          <h1>Adventure that leaves you more capable than it found you.</h1>
          <p>At KEAS India, travel is designed to teach skill, build judgement, deepen self-awareness, and reconnect people with the natural world.</p>
          <div className="detail-meta">
            <span>Kinetic Earth Adventure Sports</span>
            <span>Skill-led experiences</span>
            <span>Find Your Equilibrium</span>
          </div>
        </div>
      </section>
      <section className="section about-page">
        <article className="about-story detail-main">
          <p className="eyebrow">Why KEAS exists</p>
          <h2>Adventure that involves you, not merely entertains you.</h2>
          <p>At KEAS India - Kinetic Earth Adventure Sports - we believe travel should do more than take you somewhere new. It should teach you a skill, reveal something about you and deepen your relationship with the natural world.</p>
          <p>Modern life keeps us constantly connected, yet often disconnected from ourselves. Our days move between screens, schedules and familiar routines, leaving little room for uncertainty, movement or genuine discovery. Even travel can become another checklist: arrive, take a photograph and move on.</p>
          <p>KEAS was created to offer something more meaningful.</p>
          <p>We design skill-led outdoor experiences that bring together adventure, learning, reflection and responsible exploration. Whether you are handling a rope for the first time, navigating a mountain trail, learning to read changing terrain or simply sitting quietly beneath the trees after a demanding day, every KEAS experience is designed to involve you - not merely entertain you.</p>
          <p>We do not believe adventure is about chasing danger or proving how fearless you are. Real adventure asks for preparation, humility, awareness and good judgement. It teaches you to remain present when something feels unfamiliar, to trust your growing ability and to recognise when the mountain - not the ego - must have the final word.</p>
          <p>Beginning in Himachal Pradesh, KEAS is being built around the character of each landscape we enter. Our experiences are shaped by the terrain, local knowledge and the people who understand these places best. As we grow, we aim to work closely with local guides, communities and responsible partners while reducing waste and respecting the ecological limits of every destination.</p>
          <p>Alongside dedicated outdoor programs, our Work & Wild experiences are designed for people who need to stay professionally connected without remaining personally disconnected. They create room for focused work, meaningful movement and time outdoors - without turning the wilderness into just another office.</p>
          <p>This balance is what we call equilibrium: effort followed by recovery, courage guided by competence, and adventure grounded in respect.</p>
        </article>
        <div className="about-split">
          <div className="about-image-stack">
            <img src="/images/keas-real/img-20260619-wa0000.jpg" alt="KEAS India rock craft team" loading="lazy" />
            <img src="/images/keas-real/img-20260612-wa0044.jpg" alt="Himalayan village landscape" loading="lazy" />
          </div>
          <aside className="detail-aside">
            <div className="detail-panel price-panel">
              <p className="eyebrow">The KEAS way</p>
              <strong>Skill. Perspective. Connection.</strong>
              <p>Every experience should return you with more capability than you arrived with.</p>
            </div>
            <div className="detail-panel">
              <h3>Every KEAS experience should give you</h3>
              <div className="highlight-row">
                <span>A new skill</span>
                <span>A deeper understanding of yourself</span>
                <span>A stronger connection with nature</span>
              </div>
            </div>
          </aside>
        </div>
        <section className="manifesto-band">
          <div>
            <p className="eyebrow">Our manifesto</p>
            <h2>Nature is teacher, responsibility, and belonging.</h2>
          </div>
          <div className="manifesto-grid">
            {beliefs.map(([title, copy], index) => (
              <article className="feature-card reveal" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className="about-emphasis">If an experience does none of these, it is not the KEAS way.</p>
        </section>
        <article className="about-vision detail-main">
          <p className="eyebrow">Our vision</p>
          <h2>A trusted network of skill-led outdoor experiences across India.</h2>
          <p>Our vision is to grow KEAS into a trusted network of skill-led outdoor experiences across India - beginning in the mountains of Himachal Pradesh and expanding thoughtfully wherever there are landscapes to understand, communities to learn from and meaningful challenges to meet.</p>
          <p>We want to make outdoor learning more approachable for beginners, more purposeful for experienced adventurers and more responsible toward the places in which it happens. We envision experiences led by capable teams, supported by clear safety systems and designed around honest difficulty levels, local participation and environmental care.</p>
          <p>Our ambition is not simply to help people escape their everyday lives.</p>
          <p>It is to help them return with greater confidence, clearer perspective and a renewed sense of connection - to themselves, to other people and to the living world around them.</p>
          <blockquote>
            We do not collect destinations. We build capability, perspective and connection - one experience at a time.
          </blockquote>
          <h3>KEAS India - Find Your Equilibrium.</h3>
        </article>
      </section>
      <Footer />
    </>
  );
}

function CreatorPortalPage() {
  const creatorServices = [
    ['Route and itinerary backend', 'KEAS helps shape the route, difficulty level, day plan, safety expectations, and operational flow for your group.'],
    ['Ground logistics', 'Transport coordination, stays, meals, local crew, equipment, permits where applicable, and field support can be handled by KEAS.'],
    ['Creator-fronted experience', 'You lead the community, content, positioning, and relationship. KEAS operates quietly as the mountain backend.'],
    ['Custom service menu', 'Choose trekking, workshops, rock craft, navigation, creator retreats, Work & Wild formats, or private community departures.']
  ];

  return (
    <>
      <section className="detail-hero creator-hero">
        <img src="/images/keas-real/img-20260619-wa0000.jpg" alt="Creator-led KEAS India outdoor group support" />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#top">
            <ArrowIcon />
            Back home
          </a>
          <p className="eyebrow">Creator Portal</p>
          <h1>You stay the face of the trip. KEAS becomes the backend.</h1>
          <p>For creators, influencers, educators, community leaders, and brands who want to lead their own group experiences while KEAS provides the logistics, safety systems, local support, and services behind the scenes.</p>
          <div className="detail-meta">
            <span>Creator-led groups</span>
            <span>KEAS logistics backend</span>
            <span>Custom service stack</span>
          </div>
        </div>
      </section>
      <section className="section creator-page">
        <div className="creator-intro detail-main">
          <p className="eyebrow">How it works</p>
          <h2>Creators can be the frontend. KEAS can be the backend.</h2>
          <p>You bring the audience, voice, community trust, content style, and group intent. KEAS supports the operational side: route planning, logistics, local coordination, safety expectations, field crew, stays, meals, activity support, and custom add-ons based on what you want to offer your group.</p>
          <p>This is designed for creators who want to lead meaningful mountain experiences without personally managing every moving part on the ground.</p>
          <div className="creator-actions">
            <a className="primary-button" href={whatsappUrl('Hi KEAS India, I am a creator/influencer and want to lead my group with KEAS as logistics partner.')} target="_blank" rel="noreferrer">
              Partner on WhatsApp
              <ArrowIcon />
            </a>
            <a className="primary-button ghost" href="/#contact">Request partnership call</a>
          </div>
        </div>
        <div className="creator-grid">
          {creatorServices.map(([title, copy], index) => (
            <article className="feature-card reveal" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="creator-model">
          <img src="/images/keas-real/img-20260612-wa0044.jpg" alt="Himalayan base village for creator-led KEAS trips" loading="lazy" />
          <div>
            <p className="eyebrow">Partnership model</p>
            <h2>You choose what your group receives.</h2>
            <ul className="packing-list">
              <li>Private trekking or learning departures under your community identity.</li>
              <li>KEAS route, crew, safety, meals, stays, transport, and field operations.</li>
              <li>Optional workshops: navigation, rock craft, wilderness skills, Work & Wild, recovery, and reflection circles.</li>
              <li>Custom pricing, inclusions, and deliverables based on your group size and positioning.</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function PolicyPage({ type }) {
  const isCancellation = type === 'cancellation';
  const title = isCancellation ? 'Booking and Cancellation Policy' : 'Terms and Conditions';
  const points = isCancellation
    ? [
        'Bookings are confirmed after KEAS accepts the selected date, route, group profile, and payment terms.',
        'Advance payments reserve logistics, crew, stay, permits where applicable, and planning time.',
        'Cancellations, date changes, and refunds depend on the package, season, supplier commitments, permit rules, and notice period.',
        'Weather, road closures, safety concerns, medical issues, or government restrictions may require itinerary changes, postponement, or route adjustment.',
        'For exact cancellation terms for your selected package, contact KEAS before payment confirmation.'
      ]
    : [
        'All KEAS experiences require honest disclosure of fitness, medical conditions, prior experience, age, and emergency contact details.',
        'Outdoor activities include inherent risks such as weather changes, altitude, terrain, road delays, and route changes.',
        'Participants must follow safety briefings, guide instructions, equipment protocols, Leave No Trace practices, and local rules.',
        'Package inclusions, exclusions, pricing, itinerary, and availability may vary by season, route condition, group profile, and logistics requirements.',
        'KEAS may modify or cancel an activity when safety, weather, permissions, or local conditions require it.'
      ];

  return (
    <>
      <section className="detail-hero policy-hero">
        <img src="/images/keas-real/img-20260612-wa0046.jpg" alt={`${title} KEAS India`} />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <a className="primary-button ghost back-link" href="/#top">
            <ArrowIcon />
            Back home
          </a>
          <p className="eyebrow">KEAS India</p>
          <h1>{title}</h1>
          <p>Clear expectations help every trip feel professional, safe, and fair before anyone reaches the trailhead.</p>
        </div>
      </section>
      <section className="section detail-page policy-page">
        <article className="detail-main">
          <p className="eyebrow">Policy summary</p>
          <h2>{title}</h2>
          <ol className="detail-itinerary">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>
          <p className="policy-note">For package-specific terms, call {site.phone} or email {site.emails[0]} before making payment.</p>
        </article>
      </section>
      <Footer />
    </>
  );
}

function ExpeditionHealthFormPage() {
  const [status, setStatus] = useState('');
  const conditionOptions = [
    'Heart condition / chest pain / fainting',
    'High blood pressure',
    'Asthma or respiratory illness',
    'Diabetes',
    'Epilepsy / seizures',
    'Severe allergy / anaphylaxis',
    'Recent surgery or hospitalisation',
    'Back, knee, ankle, shoulder, or joint injury',
    'Anxiety, panic attacks, depression, or mental health concern',
    'Pregnancy',
    'None of the above'
  ];

  const acknowledgementOptions = [
    'I have disclosed all relevant health information truthfully.',
    'I understand expedition, trekking, climbing, altitude, terrain, weather, and remoteness involve inherent risks.',
    'I will carry prescribed medication and inform the KEAS leader where it is packed.',
    'I will follow guide instructions, pace decisions, gear protocols, campsite discipline, and safety cut-off decisions.',
    'I understand KEAS may request medical clearance from a registered doctor before confirming participation.'
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.conditions = formData.getAll('conditions');
    payload.acknowledgements = formData.getAll('acknowledgements');
    payload.submittedFrom = 'expedition-health-form';

    try {
      await postJson('/api/expedition-health', payload);
      form.reset();
      setStatus('Thanks. Your expedition health information has been securely submitted to KEAS.');
    } catch {
      setStatus(`Please call ${site.phone} or email ${site.emails[0]}. The health form backend is not available on this host yet.`);
    }
  }

  return (
    <>
      <section className="detail-hero health-hero">
        <img src="/images/keas-real/img-20260612-wa0017.jpg" alt="KEAS India expedition health information form" />
        <div className="hero-overlay" />
        <div className="detail-hero-inner">
          <p className="eyebrow">Guest onboarding</p>
          <h1>Expedition health information form.</h1>
          <p>Share the medical and emergency details KEAS needs to plan safer remote mountain travel for your selected expedition or trek.</p>
          <div className="detail-meta">
            <span>Medical disclosure</span>
            <span>Emergency readiness</span>
            <span>Altitude planning</span>
          </div>
        </div>
      </section>
      <section className="section health-form-page">
        <div className="detail-main health-intro">
          <p className="eyebrow">Before you begin</p>
          <h2>Complete this honestly so the field team can prepare responsibly.</h2>
          <p>This form is not a diagnosis or medical clearance. It helps KEAS prepare for altitude, weather, terrain, emergency response, medications, allergies, and support needs. For high-altitude expeditions, recent illness, chronic disease, abnormal vitals, or any uncertainty, please consult a registered medical practitioner before travel.</p>
        </div>
        <form className="contact-form health-form" aria-label="Expedition health information form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Trip and participant details</legend>
            <div className="form-row">
              <label>Full name<input name="fullName" type="text" placeholder="Participant name" required /></label>
              <label>Date of birth<input name="dateOfBirth" type="date" required /></label>
            </div>
            <div className="form-row">
              <label>Phone<input name="phone" type="tel" placeholder="+91" required /></label>
              <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
            </div>
            <div className="form-row">
              <label>Program / expedition<input name="program" type="text" placeholder="Friendship Peak, Raktisar, custom expedition..." required /></label>
              <label>Departure date<input name="departureDate" type="date" /></label>
            </div>
            <div className="form-row">
              <label>Height<input name="height" type="text" placeholder="cm or ft/in" /></label>
              <label>Weight<input name="weight" type="text" placeholder="kg" /></label>
            </div>
            <label>Blood group, if known<input name="bloodGroup" type="text" placeholder="Example: B+" /></label>
          </fieldset>

          <fieldset>
            <legend>Emergency and physician contacts</legend>
            <div className="form-row">
              <label>Emergency contact name<input name="emergencyContactName" type="text" required /></label>
              <label>Emergency contact phone<input name="emergencyContactPhone" type="tel" required /></label>
            </div>
            <label>Relationship to participant<input name="emergencyContactRelation" type="text" placeholder="Parent, spouse, friend..." /></label>
            <div className="form-row">
              <label>Physician name<input name="physicianName" type="text" placeholder="Doctor name, if available" /></label>
              <label>Physician phone<input name="physicianPhone" type="tel" placeholder="Doctor phone" /></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Medical history</legend>
            <div className="checkbox-grid">
              {conditionOptions.map((condition) => (
                <label className="check-option" key={condition}>
                  <input name="conditions" type="checkbox" value={condition} />
                  <span>{condition}</span>
                </label>
              ))}
            </div>
            <label>Explain any selected condition, past injury, surgery, or limitation<textarea name="conditionDetails" rows="4" placeholder="Include dates, current status, triggers, and restrictions." /></label>
            <label>Allergies<textarea name="allergies" rows="3" placeholder="Food, medicine, insect sting, latex, etc. Mention severity and treatment." /></label>
            <label>Current medications<textarea name="medications" rows="3" placeholder="Medicine name, dose, frequency, and where you will carry it." /></label>
            <label>Recent illness or hospitalisation<textarea name="recentIllness" rows="3" placeholder="Fever, infection, injury, surgery, admission, COVID/flu, etc." /></label>
          </fieldset>

          <fieldset>
            <legend>Altitude and fitness readiness</legend>
            <div className="form-row">
              <label>Highest altitude reached<input name="highestAltitude" type="text" placeholder="Example: 4,500 m / 14,700 ft" /></label>
              <label>Last trek / expedition date<input name="lastTrekDate" type="text" placeholder="Month and year" /></label>
            </div>
            <label>Past altitude illness<textarea name="altitudeIllnessHistory" rows="3" placeholder="AMS, HAPE, HACE, severe headache, vomiting, breathlessness, medication used, descent required." /></label>
            <label>Current fitness routine<textarea name="fitnessRoutine" rows="3" placeholder="Walking, running, strength training, stairs, sports, frequency per week." /></label>
            <label>Any concern you want the KEAS leader to know<textarea name="leaderNotes" rows="3" placeholder="Sleep, anxiety, food restrictions, pace concern, previous bad experience, etc." /></label>
          </fieldset>

          <fieldset>
            <legend>Insurance and consent</legend>
            <div className="form-row">
              <label>Travel / rescue insurance provider<input name="insuranceProvider" type="text" placeholder="Provider name, if available" /></label>
              <label>Policy number<input name="insurancePolicy" type="text" placeholder="Policy number" /></label>
            </div>
            <label>Insurance coverage notes<textarea name="insuranceNotes" rows="3" placeholder="Mention whether trekking, high altitude, evacuation, rescue, hospitalisation, or repatriation is covered." /></label>
            <div className="checkbox-grid acknowledgements">
              {acknowledgementOptions.map((item) => (
                <label className="check-option" key={item}>
                  <input name="acknowledgements" type="checkbox" value={item} required />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            <div className="form-row">
              <label>Digital signature<input name="signature" type="text" placeholder="Type your full name" required /></label>
              <label>Date<input name="signedDate" type="date" required /></label>
            </div>
          </fieldset>

          <button type="submit">Submit health information</button>
          {status ? <p className="form-note dark-note">{status}</p> : null}
        </form>
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
  const offerMessage = 'Hi KEAS India, I want to enquire on WhatsApp about current offers and custom experiences.';

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
          Explore packages
          <ArrowIcon />
        </a>
        <a className="primary-button whatsapp-offer" href={whatsappUrl(offerMessage)} target="_blank" rel="noreferrer">
          Enquire on WhatsApp for offers
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

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await postJson('/api/newsletter', payload);
      form.reset();
      setStatus('Subscribed. You will receive KEAS route openings and field notes.');
    } catch {
      setStatus(`Thanks. The CMS backend is not running on this host yet, so please also email ${site.emails[0]}.`);
    }
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
  const offerMessage = 'Hi KEAS India, I want to enquire on WhatsApp about offers, custom experiences, and suitable dates.';

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await postJson('/api/contact', payload);
      form.reset();
      setStatus('Thanks. Your enquiry has been saved and the KEAS team will respond soon.');
    } catch {
      setStatus(`Please call ${site.phone} or email ${site.emails[0]}. The CMS backend is not running on this host yet.`);
    }
  }

  return (
    <section className="section contact" id="contact">
      <div>
        <p className="eyebrow">Contact us</p>
        <h2>Plan your KEAS India trip with the right level of support.</h2>
        <div className="contact-lines">
          <a href={`tel:+${site.phone.replace(/\D/g, '')}`}>{site.phone}</a>
          {site.emails.map((email) => (
            <a href={`mailto:${email}`} key={email}>{email}</a>
          ))}
        </div>
        <a className="primary-button whatsapp-offer contact-whatsapp" href={whatsappUrl(offerMessage)} target="_blank" rel="noreferrer">
          Enquire on WhatsApp for offers
          <ArrowIcon />
        </a>
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
  const primaryEmail = site.emails[0];
  const salesEmail = site.emails.find((email) => email.startsWith('sales')) || primaryEmail;
  const instagramUrl = site.instagram || 'https://www.instagram.com/keasindia/';

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="brand" href={isSubPage ? '/' : '#top'} aria-label="KEAS India home">
            <img className="brand-logo brand-icon" src="/brand/keas-icon.svg" alt="" />
            <span>KEAS India</span>
          </a>
          <p>Kinetic Earth Adventure Sports - skill-led Himalayan experiences, creator-led trips, workshops, treks, and expedition logistics.</p>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <a href={isSubPage ? '/#experiences' : '#experiences'}>Packages</a>
          <a href="/#/creator-portal">Creator Portal</a>
          <a href="/#/about">About KEAS</a>
          <a href={isSubPage ? '/#journal' : '#journal'}>Blog</a>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <a href={`tel:+${site.phone.replace(/\D/g, '')}`}>{site.phone}</a>
          <a href={`mailto:${primaryEmail}`}>{primaryEmail}</a>
          <a href={`mailto:${salesEmail}`}>{salesEmail}</a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <div className="footer-column">
          <h3>Policies</h3>
          <a href="/#/terms-and-conditions">Terms and Conditions</a>
          <a href="/#/booking-and-cancellation-policy">Booking and Cancellation Policy</a>
          <a href={isSubPage ? '/#contact' : '#contact'}>Support</a>
          <a href={whatsappUrl('Hi KEAS India, I need help with booking terms or cancellation policy.')} target="_blank" rel="noreferrer">WhatsApp Support</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright 2026 KEAS India. All rights reserved.</p>
        <p>{site.domain}</p>
      </div>
    </footer>
  );
}

const ROUTINE_START = new Date(2026, 7, 6);
const ROUTINE_DAYS = Array.from({ length: 31 }, (_, index) => {
  const date = new Date(ROUTINE_START);
  date.setDate(date.getDate() + index);
  return date;
});

const regularRoutine = [
  ['09:00', 'Wake up', 'Start softly. Water, curtains open, one deep breath.'],
  ['09:10', 'Breakfast + shower', 'Fuel up and get fresh for the day.'],
  ['10:30–13:00', 'Study session 1', 'Your strongest focus block.'],
  ['13:00', 'Lunch', 'Eat properly, honey — your brain needs it.'],
  ['13:40', 'Rest', 'A real pause, without guilt.'],
  ['15:30–17:30', 'Study session 2', 'Steady work, one topic at a time.'],
  ['17:30', 'Break', 'Move, snack, breathe, reset.'],
  ['18:30–20:00', 'Study session 3', 'A calm evening focus block.'],
  ['20:00', 'Dinner', 'Close the books and enjoy your meal.'],
  ['21:00–22:00', 'Study session 4', 'Light review and tidy notes.'],
  ['22:00', 'Bedtime routine', 'Slow down, screens away, get cosy.'],
  ['00:00', 'Sleep', 'Rest is part of the plan, baby.']
];

const easyRoutine = [
  ['09:00', 'Wake up', 'No rush today, love.'],
  ['09:10', 'Breakfast + shower', 'A gentle, fresh start.'],
  ['10:30–12:00', 'Easy study session 1', 'Only the most important topic.'],
  ['13:00', 'Lunch', 'Eat well and take your time.'],
  ['13:40', 'Long rest', 'You have permission to truly rest.'],
  ['15:30–16:30', 'Easy study session 2', 'One small win is enough.'],
  ['16:30', 'Walk + break', 'Stretch, breathe, and be off-screen.'],
  ['18:30–19:00', 'Gentle review', 'Flashcards or a quick recap only.'],
  ['20:00', 'Dinner', 'The rest of the evening is yours.'],
  ['22:00', 'Bedtime routine', 'Make the night soft and peaceful.'],
  ['00:00', 'Sleep', 'Recharge fully, honey.']
];

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function RoutineLogger() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mahak-routine-checks') || '{}'); } catch { return {}; }
  });
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mahak-routine-notes') || '{}'); } catch { return {}; }
  });
  const selectedDate = ROUTINE_DAYS[selectedIndex];
  const key = dateKey(selectedDate);
  const isEasy = selectedDate.getMonth() === 7 && [8, 9, 10, 11].includes(selectedDate.getDate());
  const tasks = isEasy ? easyRoutine : regularRoutine;
  const dayChecks = checks[key] || {};
  const done = tasks.filter((_, index) => dayChecks[index]).length;
  const percent = Math.round((done / tasks.length) * 100);
  const totalChecks = Object.values(checks).reduce((sum, day) => sum + Object.values(day).filter(Boolean).length, 0);
  const totalTasks = ROUTINE_DAYS.reduce((sum, date) => sum + (date.getMonth() === 7 && [8, 9, 10, 11].includes(date.getDate()) ? easyRoutine.length : regularRoutine.length), 0);

  useEffect(() => {
    document.title = "Mahak's 31-Day Study Log";
  }, []);

  useEffect(() => {
    localStorage.setItem('mahak-routine-checks', JSON.stringify(checks));
  }, [checks]);

  useEffect(() => {
    localStorage.setItem('mahak-routine-notes', JSON.stringify(notes));
  }, [notes]);

  function toggleTask(index) {
    setChecks((current) => ({
      ...current,
      [key]: { ...(current[key] || {}), [index]: !(current[key] || {})[index] }
    }));
  }

  return (
    <main className="routine-app">
      <section className="routine-hero">
        <img src="/routine/together-sunset.jpeg" alt="A loving sunset memory" />
        <div className="routine-hero-shade" />
        <div className="routine-hero-copy">
          <span className="routine-mark">M × M</span>
          <p className="routine-overline">31 days · 6 Aug — 5 Sep</p>
          <h1>One gentle day<br />at a time.</h1>
          <p className="routine-intro">For Mahak — show up, check it off, and remember I’m always cheering for you, love.</p>
          <a href="#today" className="routine-start">Open today’s plan <span>↓</span></a>
        </div>
      </section>

      <section className="routine-dashboard" id="today">
        <header className="routine-topbar">
          <div>
            <span className="routine-eyebrow">Mahak’s monthly log</span>
            <h2>{selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
          </div>
          <div className="routine-ring" style={{ '--progress': `${percent * 3.6}deg` }} aria-label={`${percent}% complete`}>
            <span>{percent}%</span>
          </div>
        </header>

        <div className="routine-month-progress">
          <span style={{ width: `${Math.round((totalChecks / totalTasks) * 100)}%` }} />
        </div>
        <p className="routine-month-label">Month progress · {totalChecks} little wins</p>

        <div className="routine-date-strip" aria-label="Choose a date">
          {ROUTINE_DAYS.map((date, index) => {
            const dateIsEasy = date.getMonth() === 7 && [8, 9, 10, 11].includes(date.getDate());
            const dateTasks = dateIsEasy ? easyRoutine : regularRoutine;
            const finished = dateTasks.every((_, taskIndex) => checks[dateKey(date)]?.[taskIndex]);
            return (
              <button key={dateKey(date)} type="button" className={`${selectedIndex === index ? 'active ' : ''}${dateIsEasy ? 'easy ' : ''}${finished ? 'finished' : ''}`} onClick={() => setSelectedIndex(index)}>
                <span>{date.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2)}</span>
                <strong>{date.getDate()}</strong>
                <small>{date.toLocaleDateString('en-IN', { month: 'short' })}</small>
              </button>
            );
          })}
        </div>

        {isEasy && (
          <div className="routine-easy-note">
            <span>Soft day</span>
            <p>Less pressure, more breathing room. Resting is productive too, baby.</p>
          </div>
        )}

        <div className="routine-checklist">
          {tasks.map(([time, title, description], index) => (
            <label key={`${key}-${title}`} className={dayChecks[index] ? 'checked' : ''}>
              <input type="checkbox" checked={Boolean(dayChecks[index])} onChange={() => toggleTask(index)} />
              <span className="routine-box" aria-hidden="true">{dayChecks[index] ? '✓' : ''}</span>
              <span className="routine-task-copy">
                <time>{time}</time>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </label>
          ))}
        </div>

        <div className="routine-note-card">
          <label htmlFor="day-note">A note to myself</label>
          <textarea id="day-note" value={notes[key] || ''} onChange={(event) => setNotes((current) => ({ ...current, [key]: event.target.value }))} placeholder="What felt good today? What can wait until tomorrow?" />
          <span>Saved automatically on this device</span>
        </div>

        <div className="routine-love-card">
          <img src="/routine/hug-sunset.jpeg" alt="A warm hug at sunset" />
          <div>
            <span>From M, with love</span>
            <blockquote>“You don’t have to be perfect, honey. Just keep choosing yourself — one small promise at a time.”</blockquote>
            <p>{done === tasks.length ? 'You did it, baby. I’m so proud of you.' : `${tasks.length - done} gentle step${tasks.length - done === 1 ? '' : 's'} left today. You’ve got this.`}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  if (window.location.pathname === '/routine' || window.location.pathname === '/routine/') {
    return <RoutineLogger />;
  }
  const [theme, setTheme] = useState(() => localStorage.getItem('keas-theme') || 'dark');
  const [route, setRoute] = useState(() => ({ hash: window.location.hash, pathname: window.location.pathname }));
  const [, setContentVersion] = useState(0);
  const categorySlug = route.hash.match(/^#\/categories\/([^/]+)/)?.[1];
  const experienceSlug = route.hash.match(/^#\/experiences\/([^/]+)/)?.[1];
  const expeditionSlug =
    route.hash.match(/^#\/expeditions\/([^/]+)/)?.[1] ||
    route.pathname.match(/^\/expeditions\/([^/]+)/)?.[1];
  const blogSlug = route.hash.match(/^#\/blog\/([^/]+)/)?.[1];
  const isAboutPage = route.hash === '#/about' || route.pathname === '/about';
  const isCreatorPage = route.hash === '#/creator-portal' || route.pathname === '/creator-portal';
  const isHealthFormPage = route.hash === '#/expedition-health-form' || route.pathname === '/expedition-health-form';
  const policyType =
    route.hash === '#/terms-and-conditions' || route.pathname === '/terms-and-conditions'
      ? 'terms'
      : route.hash === '#/booking-and-cancellation-policy' || route.pathname === '/booking-and-cancellation-policy'
        ? 'cancellation'
        : null;
  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const selectedExperience = experiences.find((experience) => experience.slug === experienceSlug);
  const selectedExpedition = expeditions.find((expedition) => expedition.slug === expeditionSlug);
  const selectedPost = journalPosts.find((post) => post.slug === blogSlug);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('keas-theme', nextTheme);
      return nextTheme;
    });
  }

  useEffect(() => {
    function syncRoute() {
      setRoute({ hash: window.location.hash, pathname: window.location.pathname });
    }

    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    fetch('/api/content')
      .then((response) => {
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('No runtime content API.');
        }
        return response.json();
      })
      .then((runtimeContent) => {
        applyContent(runtimeContent);
        setContentVersion((version) => version + 1);
      })
      .catch(() => {});
  }, []);

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

  if (selectedPost) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <BlogDetail post={selectedPost} />
      </main>
    );
  }

  if (isAboutPage) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <AboutPage />
      </main>
    );
  }

  if (isCreatorPage) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <CreatorPortalPage />
      </main>
    );
  }

  if (policyType) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <PolicyPage type={policyType} />
      </main>
    );
  }

  if (isHealthFormPage) {
    return (
      <main data-theme={theme}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <ExpeditionHealthFormPage />
      </main>
    );
  }

  return (
    <main data-theme={theme}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Experiences />
      <TrustSection />
      <About />
      <VideoTour />
      <Expeditions />
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
