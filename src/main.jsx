import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../content.js";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import "./styles.css";

const skills = [
  { category: "Frontend", technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind CSS", "Bootstrap", "Next.js"] },
  { category: "Backend", technologies: ["Node.js", "Express", "MySQL", "PostgreSQL"] },
  { category: "Mobile", technologies: ["React Native", "Expo"] },
  { category: "Tools & Security", technologies: ["GitHub", "VS Code", "Figma", "JWT", "Bcrypt"] },
  { category: "AI & Cloud", technologies: ["Gemini", "Groq", "OpenAI"] },
];

const portfolio = window.PORTFOLIO;
const isPlaceholder = (value) => !value || /YOUR |20XX|write a short|make it sound like you|replace this|add your|student organization|leadership role in a student organization|about the certificate/i.test(value);
const validEntries = (entries = []) => entries.filter((entry) => {
  const heading = entry.title || entry.degree || entry.role;
  const organization = entry.school || entry.organization || entry.issuer;
  return !isPlaceholder(heading) && (!organization || !isPlaceholder(organization));
});
const education = validEntries(portfolio.education);
const experience = validEntries(portfolio.experience);
const projects = validEntries(portfolio.projects).filter((project) => !isPlaceholder(project.description));
const certificates = validEntries(portfolio.certificates);
const socials = (portfolio.socials || []).filter((social) => !isPlaceholder(social.label));
const location = isPlaceholder(portfolio.location) ? "" : portfolio.location;
const bio = isPlaceholder(portfolio.bio) ? "" : portfolio.bio;
const intro = isPlaceholder(portfolio.intro) ? "" : portfolio.intro;
const normalizeUrl = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`;
const imagePath = (image) => image.startsWith("/") ? image : `/${image}`;

const contributionLevels = ["", "low", "mid", "high", "peak"];
const contributionPreview = Array.from({ length: 364 }, (_, index) => {
  const value = (index * 17 + Math.floor(index / 7) * 11 + 3) % 19;
  return value === 0 ? 0 : value < 7 ? 1 : value < 12 ? 2 : value < 17 ? 3 : 4;
});
const gallery = portfolio.gallery || [];

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("portfolio-theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return undefined;

    const elements = document.querySelectorAll(
      ".content-section, .contact-inner, .skill-card, .project-card, .gallery-card, .contribution-card, .social-card, .experience-entry, .certificate-entry, .education-entry",
    );
    elements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
      const siblingIndex = Array.from(element.parentElement.children).indexOf(element);
      element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex * 75, 300)}ms`);
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header" id="top">
        <a className="wordmark" href="#top" aria-label={`${portfolio.name}, home`}>
          <span className="wordmark-icon">{portfolio.initials}</span>
          <span>{portfolio.name}</span>
        </a>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#education" onClick={closeMenu}>Education</a>
          {experience.length > 0 && <a href="#experience" onClick={closeMenu}>Experience</a>}
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#gallery" onClick={closeMenu}>Gallery</a>
          <a href="#links" onClick={closeMenu}>Links</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <a className="header-contact" href={portfolio.email ? `mailto:${portfolio.email}` : "#contact"}>Contact <ArrowUpRight size={14} /></a>
        </div>
      </header>

      <main className="min-h-screen">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{portfolio.role.trim()}</p>
            <h1 id="hero-title">Hi, I’m {portfolio.name.split(" ")[0]}<span>.</span></h1>
            {intro && <p className="hero-subtitle">{intro}</p>}
            <div className="hero-meta">
              {location && <span><MapPin size={15} /> {location}</span>}
              {portfolio.email && <a href={`mailto:${portfolio.email}`}><Mail size={14} /> EMAIL ME <ArrowUpRight size={13} /></a>}
            </div>
            <a className="scroll-link" href="#about">MORE ABOUT ME <ArrowDown size={13} /></a>
          </div>
          <div className="hero-aside">
            <div className="profile-frame">
              <img className="profile-photo" src={imagePath(portfolio.profileImage || "mark.jpeg")} alt={portfolio.name} />
            </div>
          </div>
        </section>

        <section className="content-section page-width" id="about">
          <div className="section-heading">
            <p className="eyebrow">01 <span>—</span> ABOUT</p>
          </div>
          <div className="about-grid">
            <h2>Learning by<br />building.</h2>
            <div className="about-copy">
              {bio ? <p>{bio}</p> : intro && <p>{intro}</p>}
              {portfolio.focus && !isPlaceholder(portfolio.focus) && <p><strong>Focus:</strong> {portfolio.focus}</p>}
            </div>
          </div>
        </section>

        <section className="content-section page-width education-section" id="education">
          <div className="section-heading">
            <p className="eyebrow">02 <span>—</span> EDUCATION</p>
          </div>
          {education.map((item) => (
            <div className="education-entry" key={`${item.degree}-${item.school}`}>
              <span className="timeline-dot" aria-hidden="true" />
              <div>
                <div className="education-title-row">
                  <h2>{item.degree}</h2>
                  {item.period && !isPlaceholder(item.period) && <span>{item.period}</span>}
                </div>
                <p>{item.school}</p>
                {item.detail && !isPlaceholder(item.detail) && <p>{item.detail}</p>}
              </div>
            </div>
          ))}
        </section>

        {experience.length > 0 && <section className="content-section page-width" id="experience">
          <div className="section-heading">
            <p className="eyebrow">03 <span>—</span> EXPERIENCE</p>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-entry" key={`${item.role}-${item.organization}`}>
                <div className="experience-title-row">
                  <div><h2>{item.role}</h2><p>{item.organization}</p></div>
                  {item.period && !isPlaceholder(item.period) && <span>{item.period.replace(/\s+PRESENT$/i, " — PRESENT")}</span>}
                </div>
                {item.detail && !isPlaceholder(item.detail) && <p className="experience-detail">{item.detail}</p>}
              </article>
            ))}
          </div>
        </section>}

        <section className="content-section page-width" id="skills">
          <div className="section-heading">
            <p className="eyebrow">04 <span>—</span> SKILLS & TECHNOLOGIES</p>
          </div>
          <div className="skills-grid">
            {skills.map((group) => (
              <article className="skill-card" key={group.category}>
                <div className="skill-card-heading"><Code2 size={16} /><h2>{group.category}</h2></div>
                <div className="skill-tags">
                  {group.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section page-width" id="projects">
          <div className="section-heading">
            <p className="eyebrow">05 <span>—</span> PROJECTS</p>
          </div>
          <div className="projects-intro">
            <h2>Things I’ve built.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                {project.image
                  ? <img className="project-image" src={imagePath(project.image)} alt={`${project.title} screenshot`} loading="lazy" />
                  : <div className={`project-visual project-visual-${index + 1}`} aria-hidden="true"><Code2 size={28} /></div>}
                <div className="project-info">
                  <div className="project-title-row"><h3>{project.title}</h3>{project.year && !isPlaceholder(project.year) && <span>{project.year}</span>}</div>
                  <p className="project-category">{project.category}</p>
                  <p>{project.description}</p>
                  <div className="skill-tags project-tags">
                    {(project.tags || []).map((technology) => <span key={technology}>{technology}</span>)}
                  </div>
                  {project.url && <div className="project-links"><a href={normalizeUrl(project.url)} target="_blank" rel="noreferrer">View project <ArrowUpRight size={14} /></a></div>}
                </div>
              </article>
            ))}
          </div>
        </section>

        {certificates.length > 0 && <section className="content-section page-width" id="certificates">
          <div className="section-heading"><p className="eyebrow">06 <span>—</span> CERTIFICATES</p></div>
          <div className="certificate-list">
            {certificates.map((certificate) => (
              <article className="certificate-entry" key={`${certificate.title}-${certificate.issuer}`}>
                <div><h2>{certificate.title}</h2><p>{certificate.issuer}</p></div>
                {certificate.year && !isPlaceholder(certificate.year) && <span>{certificate.year}</span>}
              </article>
            ))}
          </div>
        </section>}

        <section className="content-section page-width" id="gallery">
          <div className="section-heading">
            <p className="eyebrow">07 <span>—</span> GALLERY</p>
            <span className="section-note">PEOPLE, PLACES & LITTLE MOMENTS</span>
          </div>
          <div className="gallery-grid">
            {gallery.map((item) => (
              <article className="gallery-card" key={item.title}>
                <img className="gallery-image" src={imagePath(item.image)} alt={item.title} loading="lazy" />
                <div className="gallery-caption">
                  <p className="eyebrow">{item.category}</p>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section page-width" id="links">
          <div className="section-heading">
            <p className="eyebrow">08 <span>—</span> AROUND THE WEB</p>
          </div>
          <div className="links-grid">
            <article className="contribution-card">
              <div className="contribution-heading">
                <div>
                  <h2>GitHub activity</h2>
                  <p>Contribution graph preview</p>
                </div>
                <Github size={20} />
              </div>
              <div className="heatmap-scroll" role="img" aria-label="GitHub contribution graph preview">
                <div className="heatmap-months">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => <span key={month}>{month}</span>)}
                </div>
                <div className="heatmap">
                  {contributionPreview.map((level, index) => <span className={`heat-cell ${contributionLevels[level]}`} key={index} />)}
                </div>
              </div>
              <div className="heatmap-legend"><span>Less</span>{contributionLevels.map((level, index) => <i className={`heat-cell ${level}`} key={`${level}-${index}`} />)}<span>More</span></div>
              <a className="text-link" href={socials.find((social) => social.label.toLowerCase() === "github")?.url ? normalizeUrl(socials.find((social) => social.label.toLowerCase() === "github").url) : "https://github.com/"} target="_blank" rel="noreferrer">Find me on GitHub <ArrowRight size={14} /></a>
            </article>
            <article className="social-card">
              <h2>Find me on</h2>
              {socials.map((social) => {
                const Icon = social.label.toLowerCase() === "github" ? Github : social.label.toLowerCase() === "linkedin" ? Linkedin : social.label.toLowerCase() === "instagram" ? Instagram : ArrowUpRight;
                return social.url
                  ? <a href={normalizeUrl(social.url)} key={social.label} target="_blank" rel="noreferrer"><span><Icon size={17} /> {social.label}</span><ArrowUpRight size={16} /></a>
                  : <div className="social-placeholder" key={social.label}><span><Icon size={17} /> {social.label}</span><small>Add profile URL in content.js</small></div>;
              })}
            </article>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-inner page-width">
            <div>
              <p className="eyebrow">CONTACT</p>
              <h2>Get in touch.</h2>
              <p className="contact-copy">Feel free to reach out by email or phone.</p>
            </div>
            <div className="contact-actions">
              {portfolio.email && <a className="contact-email" href={`mailto:${portfolio.email}`}><Mail size={15} /> {portfolio.email}</a>}
              <a className="contact-button" href="tel:+639222555100">0922 255 5100 <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer page-width">
        <a className="wordmark" href="#top"><span className="wordmark-icon">{portfolio.initials}</span><span>{portfolio.name}</span></a>
        <span>© {new Date().getFullYear()} {portfolio.name}</span>
        <a className="back-top" href="#top">BACK TO TOP ↑</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
