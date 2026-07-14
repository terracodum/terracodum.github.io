// PDF-сборщик портфолио.
// Строит #print-doc теми же классами, что и сайт (.project, .chip, .section-head…),
// чтобы стили из style.css применились 1:1 — единый вид с сайтом.
// print.css показывает документ при печати и форсит печать тёмных цветов.
// Кнопки помечаются атрибутом data-pdf="backend" | "ml" | "all".
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  // github-иконка приезжает из portfolio.js (глобальная githubIcon); подстраховка на пусто.
  var gicon = typeof githubIcon === "string" ? githubIcon : "";

  // "https://github.com/terracodum/ExpenseMind" -> "terracodum/ExpenseMind"
  function ghLabel(url) {
    return String(url).replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");
  }

  function chips(stack) {
    return (stack || []).map(function (s) {
      return '<span class="chip">' + esc(s) + "</span>";
    }).join("");
  }

  function githubAction(url) {
    if (!url) return "";
    return (
      '<div class="project-actions">' +
        '<a class="btn btn-subtle" href="' + esc(url) + '">' +
          gicon + "<span>" + esc(ghLabel(url)) + "</span>" +
        "</a>" +
      "</div>"
    );
  }

  function projectCard(p) {
    return (
      '<article class="project">' +
        '<div class="project-head">' +
          '<h3 class="project-title">' + esc(p.name) + "</h3>" +
          (p.status ? '<span class="project-status">' + esc(p.status) + "</span>" : "") +
        "</div>" +
        '<p class="project-desc">' + esc(p.description) + "</p>" +
        '<div class="stack">' + chips(p.stack) + "</div>" +
        githubAction(p.github) +
      "</article>"
    );
  }

  function achievementCard(a) {
    return (
      '<article class="project achievement">' +
        '<div class="project-head">' +
          '<h3 class="project-title">' + esc(a.title) + "</h3>" +
          (a.rank ? '<span class="project-status">' + esc(a.rank) + "</span>" : "") +
        "</div>" +
        (a.meta ? '<p class="achievement-meta">' + esc(a.meta) + "</p>" : "") +
        '<p class="project-desc">' + esc(a.description) + "</p>" +
        (a.link
          ? '<div class="project-actions"><a class="btn btn-subtle" href="' + esc(a.link) + '">' +
              "<span>" + esc(a.link) + "</span></a></div>"
          : "") +
      "</article>"
    );
  }

  function sectionBlock(label, count, containerClass, innerHtml, spaced) {
    return (
      '<section class="' + (spaced ? "section-stack" : "") + '">' +
        '<div class="section-head">' +
          "<h2>" + esc(label) + "</h2>" +
          '<span class="count">' + pad(count) + "</span>" +
        "</div>" +
        '<div class="' + containerClass + '">' + innerHtml + "</div>" +
      "</section>"
    );
  }

  function achievementsBlock() {
    if (!ACHIEVEMENTS || !ACHIEVEMENTS.length) return "";
    return sectionBlock(
      "// achievements", ACHIEVEMENTS.length, "achievements",
      ACHIEVEMENTS.map(achievementCard).join(""), false
    );
  }

  function projectsBlock(label, projects, spaced) {
    if (!projects || !projects.length) return "";
    return sectionBlock(label, projects.length, "projects", projects.map(projectCard).join(""), spaced);
  }

  function headerBlock(tagline, bio) {
    var links = typeof contactLinksHtml === "function" ? contactLinksHtml() : "";
    return (
      "<header>" +
        '<div class="signal"><span class="dot" aria-hidden="true"></span><span>open to collaborate</span></div>' +
        '<div class="identity">' +
          (PROFILE.photo ? '<img class="avatar" src="' + esc(PROFILE.photo) + '" alt="' + esc(PROFILE.name) + '" />' : "") +
          "<h1>" + esc(PROFILE.name) +
            (tagline ? ' <span class="handle">— ' + esc(tagline) + "</span>" : "") + "</h1>" +
        "</div>" +
        (bio ? '<p class="bio">' + esc(bio) + "</p>" : "") +
        '<div class="links">' + links + "</div>" +
      "</header>"
    );
  }

  // scope: "backend" | "ml" | "all"
  function buildDoc(scope) {
    var html;

    if (scope === "all") {
      html = headerBlock(
        PORTFOLIOS.backend.title + " & " + PORTFOLIOS.ml.title,
        "Бэкенд-разработчик и ML-инженер. Пишу код, обучаю модели, читаю документацию."
      );
      html += achievementsBlock();
      html += projectsBlock("// backend", PORTFOLIOS.backend.projects, true);
      html += projectsBlock("// ml", PORTFOLIOS.ml.projects, true);
    } else {
      var port = PORTFOLIOS[scope];
      if (!port) return "";
      html = headerBlock(port.tagline || port.title, port.bio);
      html += achievementsBlock();
      html += projectsBlock("// projects", port.projects, true);
    }

    return html;
  }

  // ——— Проектные страницы: тянем реальные страницы проектов в PDF ———

  function projId(project) {
    return String(project.page || "").replace(/^.*\//, "").replace(/\.html?$/, "");
  }

  function scopeProjects(scope) {
    if (scope === "all") return PORTFOLIOS.backend.projects.concat(PORTFOLIOS.ml.projects);
    return PORTFOLIOS[scope] ? PORTFOLIOS[scope].projects : [];
  }

  // Разбивает CSS на правила верхнего уровня по балансу скобок (учитывает @media).
  function splitTopRules(css) {
    var rules = [], buf = "", depth = 0;
    for (var i = 0; i < css.length; i++) {
      var ch = css[i];
      buf += ch;
      if (ch === "{") depth++;
      else if (ch === "}") { depth--; if (depth === 0) { rules.push(buf.trim()); buf = ""; } }
    }
    return rules;
  }

  function scopeSelector(sel, scope) {
    return sel.split(",").map(function (s) {
      s = s.trim();
      if (!s) return s;
      if (/^:root\b/.test(s)) return scope + s.slice(5);   // :root -> контейнер
      if (/^html\b/.test(s)) return scope + s.slice(4);
      if (/^body\b/.test(s)) return scope + s.slice(4);
      return scope + " " + s;
    }).join(", ");
  }

  // Префиксует все селекторы CSS контейнером scope, чтобы стили проекта не текли наружу.
  function scopeCss(css, scope) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");
    return splitTopRules(css).map(function (rule) {
      var m = rule.match(/^([^{]*)\{([\s\S]*)\}$/);
      if (!m) return "";
      var prelude = m[1].trim(), body = m[2];
      if (/^@(media|supports)/i.test(prelude)) return prelude + " {" + scopeCss(body, scope) + "}";
      if (/^@/.test(prelude)) return rule;                 // keyframes/font-face/import — как есть
      return scopeSelector(prelude, scope) + " {" + body + "}";
    }).join("\n");
  }

  var injectedCss = {};
  function injectProjectCss(doc, id, base) {
    if (injectedCss[id]) return Promise.resolve();
    injectedCss[id] = true;
    var links = [].slice.call(doc.querySelectorAll('link[rel="stylesheet"]'));
    var jobs = links
      .map(function (l) { return l.getAttribute("href"); })
      .filter(function (h) { return h && !/shared\.css$/.test(h); })  // shared.css уже глобально
      .map(function (h) {
        return fetch(new URL(h, base).href).then(function (r) { return r.ok ? r.text() : ""; }).catch(function () { return ""; });
      });
    return Promise.all(jobs).then(function (texts) {
      var scope = '#print-doc .pdf-proj[data-proj="' + id + '"]';
      var scoped = texts.filter(Boolean).map(function (t) { return scopeCss(t, scope); }).join("\n");
      if (!scoped) return;
      var style = document.createElement("style");
      style.setAttribute("data-proj-css", id);
      style.textContent = scoped;
      document.head.appendChild(style);
    });
  }

  function buildProjectPage(project) {
    if (!project.page) return Promise.resolve(null);
    var id = projId(project);
    var base = new URL(project.page.replace(/[^/]*$/, ""), document.baseURI);  // .../projects/
    return fetch(project.page).then(function (r) {
      if (!r.ok) throw new Error(project.page + " → " + r.status);
      return r.text();
    }).then(function (text) {
      var doc = new DOMParser().parseFromString(text, "text/html");
      var wrap = doc.querySelector(".wrap");
      if (!wrap) return null;
      wrap.querySelectorAll(".back").forEach(function (n) { n.remove(); });
      // относительные src/href → абсолютные (от папки проекта)
      wrap.querySelectorAll("[src],[href]").forEach(function (n) {
        ["src", "href"].forEach(function (attr) {
          if (!n.hasAttribute(attr)) return;
          var v = n.getAttribute(attr);
          if (!v || /^(https?:|mailto:|tel:|data:|#|\/)/.test(v)) return;
          n.setAttribute(attr, new URL(v, base).href);
        });
      });
      return injectProjectCss(doc, id, base).then(function () {
        var art = document.createElement("article");
        art.className = "pdf-proj";
        art.setAttribute("data-proj", id);
        wrap.style.padding = "0";
        wrap.style.maxWidth = "100%";
        art.appendChild(wrap);
        return art;
      });
    });
  }

  function waitImages(host) {
    var imgs = [].slice.call(host.querySelectorAll("img"));
    return Promise.all(imgs.map(function (img) {
      if (img.complete) return null;
      return new Promise(function (res) { img.onload = img.onerror = res; });
    }));
  }

  function ensureHost() {
    var host = document.getElementById("print-doc");
    if (!host) {
      host = document.createElement("div");
      host.id = "print-doc";
      document.body.appendChild(host);
    }
    return host;
  }

  function exportPdf(scope) {
    var doc = buildDoc(scope);
    if (!doc) return Promise.resolve();
    var host = ensureHost();
    host.innerHTML = doc;

    // последовательно подтягиваем полные страницы проектов
    var projects = scopeProjects(scope);
    var chain = Promise.resolve();
    projects.forEach(function (p) {
      chain = chain.then(function () {
        return buildProjectPage(p).then(function (node) {
          if (node) host.appendChild(node);
        }).catch(function (e) {
          console.warn("PDF: не удалось подтянуть", p.page, e && e.message);
        });
      });
    });

    return chain.then(function () { return waitImages(host); }).then(function () { window.print(); });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-pdf]");
    if (!btn) return;
    e.preventDefault();
    exportPdf(btn.getAttribute("data-pdf"));
  });

  window.exportPortfolioPdf = exportPdf;
})();
