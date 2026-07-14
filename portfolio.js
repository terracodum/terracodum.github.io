// Shared portfolio renderer. Page data lives in backend.js / ml.js.
// Each page calls renderPortfolio({ projects, achievements }).

const githubIcon = `
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.88 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 018 4.32c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>`;

const arrowIcon = `
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 3l5 5-5 5"/>
  </svg>`;

const mailIcon = `
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="M2 4l6 4.5L14 4"/>
  </svg>`;

const telegramIcon = `
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M14.5 2.3 1.9 7.1c-.7.3-.7.8-.1 1l3.2 1 1.2 3.8c.2.4.3.6.7.6.3 0 .4-.1.6-.3l1.7-1.6 3.3 2.4c.6.3 1 .2 1.2-.6l2.2-10.3c.2-.9-.3-1.3-1-1z"/>
  </svg>`;

const CONTACT_ICONS = { github: githubIcon, mail: mailIcon, telegram: telegramIcon };

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Ссылки-контакты из PROFILE.contacts (data.js). Единый вид на сайте и в PDF.
function contactLinksHtml() {
  return (typeof PROFILE !== "undefined" ? PROFILE.contacts || [] : [])
    .map(c => {
      const icon = CONTACT_ICONS[c.icon] || "";
      const inner = `${icon}${escape(c.label)}`;
      if (!c.href) return `<span class="link">${inner}</span>`;
      const ext = /^https?:/.test(c.href) ? ' target="_blank" rel="noopener"' : "";
      return `<a class="link" href="${escape(c.href)}"${ext}>${inner}</a>`;
    })
    .join("");
}

// Заполняет каждый контейнер [data-contacts] контактами (перед его текущим содержимым,
// чтобы не затирать, например, кнопку "скачать PDF").
function renderContacts() {
  const html = contactLinksHtml();
  document.querySelectorAll("[data-contacts]").forEach(el => {
    el.insertAdjacentHTML("afterbegin", html);
  });
}

function renderProject(p) {
  const chips = p.stack.map(s => `<span class="chip">${escape(s)}</span>`).join("");
  const statusLabel = p.status ? `<span class="project-status">${escape(p.status)}</span>` : "";

  const githubBtn = p.github
    ? `<a class="btn" href="${escape(p.github)}" target="_blank" rel="noopener">
         ${githubIcon}
         <span>view on github</span>
         ${arrowIcon}
       </a>`
    : "";

  let actions;
  if (p.page) {
    const secondary = p.github
      ? `<a class="btn btn-subtle" href="${escape(p.github)}" target="_blank" rel="noopener">
           ${githubIcon}
           <span>github</span>
         </a>`
      : "";
    actions = `
      <a class="btn" href="${escape(p.page)}">
        <span>open project</span>
        ${arrowIcon}
      </a>
      ${secondary}`;
  } else {
    actions = githubBtn;
  }

  const actionsBlock = actions.trim()
    ? `<div class="project-actions">${actions}</div>`
    : "";

  return `
    <article class="project">
      <div class="project-head">
        <h3 class="project-title">${escape(p.name)}</h3>
        ${statusLabel}
      </div>
      <p class="project-desc">${escape(p.description)}</p>
      <div class="stack">${chips}</div>
      ${actionsBlock}
    </article>
  `;
}

function renderAchievement(a) {
  const action = a.link
    ? `<div class="project-actions">
         <a class="btn btn-subtle" href="${escape(a.link)}" target="_blank" rel="noopener">
           <span>${escape(a.linkLabel || "подробнее")}</span>
           ${arrowIcon}
         </a>
       </div>`
    : "";

  return `
    <article class="project achievement">
      <div class="project-head">
        <h3 class="project-title">${escape(a.title)}</h3>
        ${a.rank ? `<span class="project-status">${escape(a.rank)}</span>` : ""}
      </div>
      ${a.meta ? `<p class="achievement-meta">${escape(a.meta)}</p>` : ""}
      <p class="project-desc">${escape(a.description)}</p>
      ${action}
    </article>
  `;
}

// Fills a section, or hides it entirely when there's nothing to show.
function mountSection(sectionId, listId, countId, items, render) {
  const section = document.getElementById(sectionId);
  if (!items || items.length === 0) {
    if (section) section.hidden = true;
    return;
  }
  document.getElementById(listId).innerHTML = items.map(render).join("");
  document.getElementById(countId).textContent = String(items.length).padStart(2, "0");
}

function renderPortfolio({ projects = [], achievements = [] } = {}) {
  renderContacts();
  mountSection("achievements-section", "achievements", "achievement-count", achievements, renderAchievement);
  mountSection("projects-section", "projects", "project-count", projects, renderProject);
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}
