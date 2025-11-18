import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const graduates = [
  {
    name: 'Amaka O.',
    title: 'Senior Data Analyst',
    company: 'FinTech Co.',
  },
  {
    name: 'Lewis K.',
    title: 'Machine Learning Engineer',
    company: 'CloudScale',
  },
  {
    name: 'Sara D.',
    title: 'Product Analyst',
    company: 'GrowthHub',
  },
  {
    name: 'Jonas M.',
    title: 'Software Engineer',
    company: 'MetaSpace',
  },
];

const mentorCompanies = ['Cambridge', 'Oxford', 'Google', 'Amazon', 'Meta', 'Spotify', 'Vinted'];

const learnerCompanies = [
  'Vinted',
  'Nord Security',
  'Accenture',
  'Siemens',
  'Meta',
  'Western Union',
  'Deutsche Bank',
];

const testimonials = [
  {
    quote:
      'EduTech has been a great experience. I loved the structure and content of the material and the constant contact with mentors and peers.',
    name: 'Kata Hernádi',
    title: 'Delegation Team Coordinator',
    company: 'Siemens Energy',
  },
  {
    quote:
      'Switching career is never easy, but EduTech gave me the skills, support, and confidence to make it happen.',
    name: 'Pegah F.',
    title: 'Data Analyst',
    company: 'REMONDIS Gruppe',
  },
  {
    quote:
      'I joined EduTech to upskill my career in Data Science. The program has exceeded my expectations.',
    name: 'Lorence C.',
    title: 'Product Data Analyst',
    company: 'Adyen',
  },
];

const programs = [
  'Data analytics',
  'Data science & AI',
  'Digital marketing & analytics',
  'Software & AI engineering',
  'AI for business analytics',
  'AI engineering',
  'AI literacy',
  'AI ethics',
];

function LandingPage() {
  const { user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="fade-in">
      <section className="hero-wrapper">
        <div className="hero-panel">
          <div className="hero-main">
            <div className="badge">Project-based learning</div>
            <h1 className="hero-title">Learn new tech skills. Get promotion-ready.</h1>
            <p className="hero-subtitle">
              Join a mentor-led, project-based program that helps you grow your skills and advance
              your career.
            </p>
            <div className="hero-cta">
              {!user && (
                <Link to="/register" className="button hero-button">
                  Select your program
                </Link>
              )}
              {user && (
                <Link to="/dashboard" className="button hero-button">
                  Go to dashboard
                </Link>
              )}
            </div>
            <div className="ratings-row">
              <div className="rating-item">
                <span className="rating-score">★ 4.9/5</span>
                <span className="rating-source">Learner reviews</span>
              </div>
              <div className="rating-item">
                <span className="rating-score">★ 4.9/5</span>
                <span className="rating-source">Career outcomes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="graduates" className="section">
        <h2 className="section-title">Our graduates</h2>
        <div className="graduates-carousel">
          {graduates.map((grad) => (
            <article key={grad.name} className="graduate-card">
              <div className="graduate-photo-placeholder" />
              <div className="graduate-info">
                <h3>{grad.name}</h3>
                <p>{grad.title}</p>
                <p className="text-muted">{grad.company}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="mentors" className="section mentors-section">
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          +150 mentors from top tech companies
        </p>
        <div className="logos-strip">
          {mentorCompanies.map((c) => (
            <div key={c} className="logo-pill">
              {c}
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section feature-section">
        <div className="feature-grid">
          <div>
            <h2 className="section-title">
              A school to make any future career step with confidence
            </h2>
            <div className="feature-list">
              <div className="feature-item">
                <h3>Get job-ready</h3>
                <p className="text-muted">
                  Build in-demand skills, real projects, and experience that mirrors modern tech
                  teams.
                </p>
              </div>
              <div className="feature-item">
                <h3>Get promotion-ready</h3>
                <p className="text-muted">
                  Go beyond basics with advanced modules, leadership skills, and mentor feedback.
                </p>
              </div>
              <div className="feature-item">
                <h3>Build your own AI startup</h3>
                <p className="text-muted">
                  Learn how to prototype, validate, and launch AI-driven products with expert
                  guidance.
                </p>
              </div>
            </div>
          </div>
          <aside className="stat-card">
            <div className="stat-value">97.9%</div>
            <div className="stat-label">Employment rate</div>
            <ul className="stat-list">
              <li>Career guidance program</li>
              <li>Mock interviews led by industry experts</li>
              <li>Salary negotiation support</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section feature-section alt" id="programs">
        <div className="feature-grid">
          <div>
            <h2 className="section-title">Personalized 1-on-1 learning, anywhere</h2>
            <p className="text-muted">
              There are no lectures. You learn by solving real-world problems with the support of
              mentors and peers, at a pace that fits your life.
            </p>
            <p className="text-muted">
              With 1-on-1 mentorship, you get tailored feedback on your code, projects, and career
              strategy.
            </p>
            <button className="button secondary" style={{ marginTop: '1rem' }}>
              How it works →
            </button>
          </div>
          <div className="feature-image-placeholder" />
        </div>
      </section>

      <section className="section logos-strip-section">
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Our learners work at
        </h2>
        <div className="logos-strip">
          {learnerCompanies.map((c) => (
            <div key={c} className="logo-pill">
              {c}
            </div>
          ))}
        </div>
      </section>

      <section className="section section-cream">
        <div className="testimonial-hero">
          <div className="testimonial-photo" />
          <div className="testimonial-copy">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">
              {testimonials[0].quote}
            </p>
            <p className="testimonial-name">
              {testimonials[0].name} · {testimonials[0].title} @ {testimonials[0].company}
            </p>
            <div className="testimonial-stats-row">
              <div>
                <div className="stat-value">97%</div>
                <div className="stat-label">Employment rate*</div>
              </div>
              <div>
                <div className="stat-value">40+</div>
                <div className="stat-label">Student nationalities</div>
              </div>
              <div>
                <div className="stat-value">1000+</div>
                <div className="stat-label">Active students</div>
              </div>
            </div>
            <p className="stat-footnote text-muted">
              *Job-qualified graduates who received an offer within a few months of graduation.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-cream" id="programs-list">
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Pick a program
        </h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          Our programs are developed by senior professionals to give you the skills you need for
          your next career move.
        </p>
        <div className="program-list">
          {programs.map((name) => (
            <div key={name} className="program-row">
              <span>{name}</span>
              <button className="button secondary program-tag">Career course</button>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-cream">
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Our graduates have achieved life-changing growth. You can too.
        </h2>
        <div className="testimonial-carousel">
          <div className="testimonial-grid">
            {[activeTestimonial, (activeTestimonial + 1) % testimonials.length].map((idx) => {
              const t = testimonials[idx];
              return (
                <article key={t.name} className="testimonial-card">
                  <p className="testimonial-quote-small">“{t.quote}”</p>
                  <div className="testimonial-person">
                    <div className="testimonial-avatar" />
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="text-muted">
                        {t.title} @ {t.company}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={idx === activeTestimonial ? 'dot active' : 'dot'}
                onClick={() => setActiveTestimonial(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream final-cta">
        <h2 className="final-cta-title">Build the skills and confidence to transform your career.</h2>
        <Link to="/register" className="button hero-button">
          Select your program
        </Link>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <div className="footer-logo">EduTech</div>
              <p className="text-muted">A project-based online school helping learners upskill into tech.</p>
              <div className="footer-addresses">
                <div>
                  <strong>United States</strong>
                  <p className="text-muted">123 Learning Ave, Wilmington, DE</p>
                </div>
                <div>
                  <strong>Europe</strong>
                  <p className="text-muted">EduTech Campus, Vilnius</p>
                </div>
              </div>
            </div>

            <div className="footer-col">
              <h3>About us</h3>
              <ul>
                <li>About</li>
                <li>Education team</li>
                <li>How it works</li>
                <li>FAQ</li>
                <li>Blog</li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Education</h3>
              <ul>
                {programs.slice(0, 6).map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3>For business</h3>
              <ul>
                <li>Upskilling</li>
                <li>Hiring</li>
              </ul>
              <h3>Guidebooks</h3>
              <ul>
                <li>Intro to data science</li>
                <li>10 AI engineering principles</li>
                <li>Data in business</li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Connect</h3>
              <ul>
                <li>Contact</li>
                <li>Privacy policy</li>
                <li>Terms &amp; conditions</li>
              </ul>
            </div>
          </div>

          <div className="badge-row">
            <span className="badge">Best Data Science Bootcamp 2022</span>
            <span className="badge">Best Data Science Bootcamp 2023</span>
            <span className="badge">Best Data Science Bootcamp 2024</span>
          </div>

          <div className="footer-bottom">
            <span className="yc-pill">Backed by YC (demo)</span>
            <span className="text-muted">© {new Date().getFullYear()} EduTech</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
