// Add new projects here. That's it.
const PROJECTS = [
  {
    name: "ExpenseMind",
    status: "active",
    description:
      "Локальный трекер финансов с ML-прогнозированием. Все данные остаются на устройстве — никаких облаков и аналитики.",
    stack: ["Go", "Python", "React", "SQLite", "Docker"],
    github: "https://github.com/terracodum/ExpenseMind",
    page: "projects/expensemind.html",
  },
  // Example template — copy, fill in, push:
  // {
  //   name: "ProjectName",
  //   status: "wip",
  //   description: "One sentence about what it does and for whom.",
  //   stack: ["Go", "PostgreSQL"],
  //   github: "https://github.com/terracodum/repo",
  //   page: "projects/projectname.html", // optional — omit if no detail page yet
  // },
];

const githubIcon = `
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.88 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 018 4.32c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>`;

const arrowIcon = `
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 3l5 5-5 5"/>
  </svg>`;

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function renderProject(p) {
  const chips = p.stack.map(s => `<span class="chip">${escape(s)}</span>`).join("");
  const statusLabel = p.status ? `<span class="project-status">${escape(p.status)}</span>` : "";

  const primaryAction = p.page
    ? `<a class="btn" href="${escape(p.page)}">
         <span>open project</span>
         ${arrowIcon}
       </a>`
    : `<a class="btn" href="${escape(p.github)}" target="_blank" rel="noopener">
         ${githubIcon}
         <span>view on github</span>
         ${arrowIcon}
       </a>`;

  const secondaryAction = p.page
    ? `<a class="btn btn-subtle" href="${escape(p.github)}" target="_blank" rel="noopener">
         ${githubIcon}
         <span>github</span>
       </a>`
    : "";

  return `
    <article class="project">
      <div class="project-head">
        <h3 class="project-title">${escape(p.name)}</h3>
        ${statusLabel}
      </div>
      <p class="project-desc">${escape(p.description)}</p>
      <div class="stack">${chips}</div>
      <div class="project-actions">
        ${primaryAction}
        ${secondaryAction}
      </div>
    </article>
  `;
}

document.getElementById("projects").innerHTML = PROJECTS.map(renderProject).join("");
document.getElementById("project-count").textContent =
  String(PROJECTS.length).padStart(2, "0");
document.getElementById("year").textContent = new Date().getFullYear();
