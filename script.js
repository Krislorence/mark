const portfolio = window.PORTFOLIO;

if (!portfolio) {
  throw new Error("Portfolio content was not loaded. Check that content.js is available.");
}

const setText = (selector, value) => {
  if (!value) return;
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

const makeElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

setText("[data-name]", portfolio.name);
setText("[data-role]", portfolio.role);
setText("[data-intro]", portfolio.intro);
setText("[data-bio]", portfolio.bio);
setText("[data-location]", portfolio.location);
setText("[data-focus]", portfolio.focus);
setText("[data-year]", new Date().getFullYear());
setText("[data-initials]", portfolio.initials);

if (portfolio.name && portfolio.name !== "YOUR NAME") {
  document.title = `${portfolio.name} — Portfolio`;
}

if (portfolio.profileImage) {
  document.querySelectorAll("[data-profile-avatar]").forEach((avatar) => {
    const image = avatar.querySelector("[data-profile-image]");
    image.src = portfolio.profileImage;
    image.hidden = false;
    avatar.querySelector("[data-initials]").hidden = true;
  });
}

const dialog = document.querySelector("[data-detail-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogEyebrow = document.querySelector("[data-dialog-eyebrow]");
const dialogDescription = document.querySelector("[data-dialog-description]");
const dialogVisual = document.querySelector("[data-dialog-visual]");
const dialogTags = document.querySelector("[data-dialog-tags]");
const dialogLink = document.querySelector("[data-dialog-link]");

const showDetail = ({ title, eyebrow, description, image, tags = [], url }) => {
  dialogTitle.textContent = title || "Portfolio detail";
  dialogEyebrow.textContent = eyebrow || "";
  dialogDescription.textContent = description || "";
  dialogVisual.replaceChildren();
  dialogTags.replaceChildren();

  if (image) {
    const preview = makeElement("img", "dialog-image");
    preview.src = image;
    preview.alt = `${title || "Portfolio item"} preview`;
    dialogVisual.append(preview);
  } else {
    dialogVisual.append(makeElement("span", "dialog-placeholder", "✦"));
  }

  for (const tag of tags) {
    dialogTags.append(makeElement("span", "tech-tag", tag));
  }

  dialogLink.hidden = !url;
  if (url) dialogLink.href = url;
  dialog.showModal();
};

document.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const makeTechTags = (tags = []) => {
  const list = makeElement("div", "tech-tags");
  for (const tag of tags) {
    list.append(makeElement("span", "tech-tag", tag));
  }
  return list;
};

const createProjectCard = (project, index) => {
  const article = makeElement("article", `project-card reveal project-${index + 1}`);
  const preview = makeElement("div", `project-preview preview-${project.color || "violet"}`);
  const previewContent = makeElement("div", "preview-placeholder");

  if (project.image) {
    const image = makeElement("img", "");
    image.src = project.image;
    image.alt = `${project.title || "Project"} preview`;
    image.loading = "lazy";
    previewContent.append(image);
  } else {
    previewContent.append(makeElement("span", "placeholder-orbit"));
    previewContent.append(makeElement("span", "placeholder-mark"));
    previewContent.append(makeElement("span", "placeholder-note", "PROJECT PREVIEW"));
  }
  preview.append(previewContent);

  const meta = makeElement("div", "project-meta");
  const title = makeElement("h3", "", project.title || "PROJECT TITLE");
  const category = makeElement(
    "span",
    "",
    [project.category, project.year].filter(Boolean).join(" · "),
  );
  meta.append(title, category);

  const description = makeElement("p", "project-description", project.description || "");
  const footer = makeElement("div", "project-footer");
  footer.append(makeTechTags(project.tags));
  const detailButton = makeElement("button", "text-link", "Details ↗");
  detailButton.type = "button";
  detailButton.addEventListener("click", () => {
    showDetail({
      title: project.title,
      eyebrow: [project.category, project.year].filter(Boolean).join(" · "),
      description: project.description,
      image: project.image,
      tags: project.tags,
      url: project.url,
    });
  });
  footer.append(detailButton);
  article.append(preview, meta, description, footer);
  return article;
};

const projectsContainer = document.querySelector("[data-projects]");
for (const [index, project] of (portfolio.projects || []).entries()) {
  projectsContainer.append(createProjectCard(project, index));
}

const educationContainer = document.querySelector("[data-education]");
for (const education of portfolio.education || []) {
  const card = makeElement("article", "timeline-card");
  card.append(makeElement("span", "timeline-period", education.period));
  card.append(makeElement("h4", "", education.degree));
  card.append(makeElement("p", "timeline-place", education.school));
  card.append(makeElement("p", "timeline-detail", education.detail));
  educationContainer.append(card);
}

const experienceContainer = document.querySelector("[data-experience]");
for (const experience of portfolio.experience || []) {
  const card = makeElement("article", "experience-card");
  const badge = makeElement("span", "experience-badge", experience.type || "EXPERIENCE");
  const heading = makeElement("h4", "", experience.role);
  const organization = makeElement("p", "experience-organization", experience.organization);
  const detail = makeElement("p", "experience-detail", experience.detail);
  const period = makeElement("span", "experience-period", experience.period);
  card.append(badge, heading, organization, detail, period);
  experienceContainer.append(card);
}

const certificateContainer = document.querySelector("[data-certificates]");
for (const certificate of portfolio.certificates || []) {
  const card = makeElement("article", "certificate-card");
  const seal = makeElement("span", "certificate-seal", "✦");
  const issuer = makeElement("p", "certificate-issuer", certificate.issuer);
  const title = makeElement("h3", "", certificate.title);
  const year = makeElement("span", "certificate-year", certificate.year);
  const button = makeElement("button", "text-link", "View credential ↗");
  button.type = "button";
  button.addEventListener("click", () => {
    showDetail({
      title: certificate.title,
      eyebrow: [certificate.issuer, certificate.year].filter(Boolean).join(" · "),
      description: certificate.detail,
      image: certificate.image,
    });
  });
  card.append(seal, issuer, title, year, button);
  certificateContainer.append(card);
}

const galleryContainer = document.querySelector("[data-gallery]");
for (const item of portfolio.gallery || []) {
  const card = makeElement("button", `gallery-card preview-${item.color || "violet"}`);
  card.type = "button";
  card.setAttribute("aria-label", `View ${item.title || "gallery item"}`);
  if (item.image) {
    const image = makeElement("img", "gallery-image");
    image.src = item.image;
    image.alt = "";
    image.loading = "lazy";
    card.append(image);
  } else {
    card.append(makeElement("span", "gallery-placeholder-mark", "✦"));
  }
  const caption = makeElement("span", "gallery-caption");
  caption.append(
    makeElement("span", "gallery-category", item.category),
    makeElement("strong", "", item.title),
  );
  card.append(caption);
  card.addEventListener("click", () => {
    showDetail({
      title: item.title,
      eyebrow: item.category,
      description: item.detail,
      image: item.image,
    });
  });
  galleryContainer.append(card);
}

for (const category of ["projects", "certificates", "gallery"]) {
  const source = category === "gallery" ? portfolio.gallery : portfolio[category];
  const count = document.querySelector(`[data-count="${category}"]`);
  count.textContent = String(source?.length || 0).padStart(2, "0");
}

const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const activateTab = (name, focus = false) => {
  for (const tab of tabs) {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  }
  for (const panel of panels) {
    const active = panel.dataset.panel === name;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  }
};

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    activateTab(tabs[nextIndex].dataset.tab, true);
  });
}

const cvLink = document.querySelector("[data-cv-link]");
const cvLabel = document.querySelector("[data-cv-label]");
if (portfolio.cvUrl) {
  cvLink.href = portfolio.cvUrl;
  cvLink.target = "_blank";
  cvLink.rel = "noreferrer";
  cvLabel.textContent = "View my CV";
} else {
  cvLabel.textContent = "Add CV link in content.js";
  cvLink.title = "Add your CV PDF URL in content.js";
}

const socialIcons = {
  GitHub: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13.2 13.2 0 0 0-7 0C5.4 1.2 4.2 1.6 4.2 1.6a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7A3.4 3.4 0 0 0 8 18v4"/></svg>',
  LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v11M5 4v.01M10 9v11m0-7a4 4 0 0 1 8 0v7"/></svg>',
  Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',
  TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v11.2a4.2 4.2 0 1 1-4-4.2M14 4c.5 3.2 2.4 5 6 5"/></svg>',
  YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/></svg>',
};

const socialCards = document.querySelector("[data-social-cards]");
for (const social of portfolio.socials || []) {
  const card = makeElement(social.url ? "a" : "div", "social-card");
  if (social.url) {
    card.href = social.url;
    card.target = "_blank";
    card.rel = "noreferrer";
  } else {
    card.classList.add("is-unlinked");
  }
  const icon = makeElement("span", "social-card-icon");
  icon.innerHTML = socialIcons[social.label] || "";
  const copy = makeElement("span", "social-card-copy");
  copy.append(
    makeElement("strong", "", social.label),
    makeElement("small", "", social.url ? "Visit profile" : "Add link in content.js"),
  );
  card.append(icon, copy, makeElement("span", "social-card-arrow", "↗"));
  socialCards.append(card);
}

const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!portfolio.email) {
    contactStatus.textContent = "Add your email address in content.js to enable this form.";
    return;
  }

  const fields = new FormData(contactForm);
  const subject = String(fields.get("subject")).trim();
  const body = [
    `From: ${String(fields.get("name")).trim()}`,
    `Reply-to: ${String(fields.get("email")).trim()}`,
    "",
    String(fields.get("message")).trim(),
  ].join("\n");
  contactStatus.textContent = "Opening your email app with this message…";
  window.location.href = `mailto:${portfolio.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const feedbackForm = document.querySelector("[data-feedback-form]");
const feedbackStatus = document.querySelector("[data-feedback-status]");
const feedbackList = document.querySelector("[data-feedback-list]");
const feedbackStorageKey = "portfolio-guestbook-v1";

const renderFeedback = (entries) => {
  feedbackList.replaceChildren();
  for (const entry of entries.slice(0, 8)) {
    const item = makeElement("article", "feedback-entry");
    item.append(
      makeElement("p", "", entry.message),
      makeElement("span", "", `${entry.name} · ${entry.date}`),
    );
    feedbackList.append(item);
  }
};

try {
  const storedFeedback = localStorage.getItem(feedbackStorageKey);
  const feedbackEntries = storedFeedback ? JSON.parse(storedFeedback) : [];
  if (!Array.isArray(feedbackEntries)) throw new TypeError("Guestbook data is not a list.");
  renderFeedback(feedbackEntries);
} catch (error) {
  feedbackStatus.textContent = `Guestbook could not load: ${error.message}`;
}

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(feedbackForm);
  const entry = {
    name: String(fields.get("name")).trim(),
    message: String(fields.get("message")).trim(),
    date: new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date()),
  };
  if (!entry.name || !entry.message) {
    feedbackStatus.textContent = "Please enter your name and a note.";
    return;
  }

  try {
    const storedFeedback = localStorage.getItem(feedbackStorageKey);
    const feedbackEntries = storedFeedback ? JSON.parse(storedFeedback) : [];
    if (!Array.isArray(feedbackEntries)) throw new TypeError("Guestbook data is not a list.");
    const updatedEntries = [entry, ...feedbackEntries].slice(0, 8);
    localStorage.setItem(feedbackStorageKey, JSON.stringify(updatedEntries));
    renderFeedback(updatedEntries);
    feedbackForm.reset();
    feedbackStatus.textContent = "Your note has been saved in this browser.";
  } catch (error) {
    feedbackStatus.textContent = `Your note could not be saved: ${error.message}`;
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
});

const themeToggle = document.querySelector(".theme-toggle");
themeToggle.addEventListener("click", () => {
  const lightMode = document.documentElement.dataset.theme !== "light";
  document.documentElement.dataset.theme = lightMode ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${lightMode ? "dark" : "light"} theme`);
  themeToggle.title = `Switch to ${lightMode ? "dark" : "light"} theme`;
  themeToggle.querySelector(".theme-label").textContent = lightMode ? "Dark" : "Light";
  themeToggle.querySelector(".theme-icon").textContent = lightMode ? "☾" : "☼";
});

const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = ["top", "about", "work", "contact"].map((id) => document.getElementById(id));
const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress-bar");
let scrollTicking = false;

const updateScrollState = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  header.classList.toggle("is-scrolled", window.scrollY > 32);
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  scrollTicking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollState);
  },
  { passive: true },
);
updateScrollState();

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    hero.style.setProperty("--pointer-x", `${x * 22}px`);
    hero.style.setProperty("--pointer-y", `${y * 22}px`);
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--pointer-x", "0px");
    hero.style.setProperty("--pointer-y", "0px");
  });
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const activeId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
        });
      }
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
