# terracodum.github.io

Личный сайт-портфолио. Статика — HTML, CSS, JS без фреймворков.

## Структура

```
index.html              — хаб: выбор портфолио + достижения
backend.html            — портфолио backend
ml.html                 — портфолио ML / AI
style.css               — стили страниц портфолио
shared.css              — базовые стили (переменные, кнопки, лайтбокс)
shared.js               — общий JS (лайтбокс для скринов)
portfolio.js            — общий рендер карточек (проекты, достижения)
achievements.js         — достижения (один список, виден на всех страницах)
backend.js              — данные backend-портфолио (проекты)
ml.js                   — данные ML-портфолио (проекты)
favicon.svg             — иконка вкладки

projects/
  expensemind.html      — страница проекта
  expensemind.css       — стили страницы
  img/
    expensemind/        — скриншоты проекта
```

## Добавить достижение

Открыть `achievements.js`, добавить объект в `ACHIEVEMENTS` — появится на хабе и обеих страницах портфолио:

```js
{
  title: "Название",
  rank: "1st place",              // бейдж справа, опционально
  meta: "Событие · Месяц Год · Город",
  description: "Что сделали и какой результат.",
  link: "https://...",            // пруф, опционально
  linkLabel: "официальные итоги",
},
```

## Добавить новый проект

**1. Карточка** — открыть `backend.js` или `ml.js`, добавить объект в `projects`:

```js
{
  name: "ProjectName",
  status: "wip",           // active | wip | archived
  description: "Одно предложение о проекте.",
  stack: ["Go", "PostgreSQL"],
  github: "https://github.com/terracodum/repo",
  page: "projects/projectname.html",  // убрать если нет страницы
},
```

**2. Страница проекта** — скопировать `projects/expensemind.html`, поменять контент.  
Подключить в `<head>`:

```html
<link rel="icon" href="../favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="../shared.css" />
<link rel="stylesheet" href="projectname.css" />
```

Перед `</body>`:

```html
<div class="lightbox" id="lightbox"><img id="lightbox-img" src="" alt="" /></div>
<script src="../shared.js"></script>
```

**3. Скриншоты** — положить в `projects/img/projectname/`, использовать класс `.shot` и `.shot.wide`:

```html
<div class="shots">
  <div class="shot wide"><img src="img/projectname/main.png" alt="..." /></div>
  <div class="shot"><img src="img/projectname/detail.png" alt="..." /></div>
</div>
```
