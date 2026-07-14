// Единый источник данных портфолио.
// Едят и страницы (renderPortfolio), и PDF-сборщик (portfolio-pdf.js).

const PROFILE = {
  name: "Никита Харлов",
  photo: "img/avatar.jpg",
  location: "Омск, Россия",
  // Единый источник контактов — рендерятся в шапке каждой страницы и в PDF.
  // icon: "github" | "mail" | "telegram". Раскомментируй/добавь нужное.
  contacts: [
    { label: "github.com/terracodum", href: "https://github.com/terracodum", icon: "github" },
    { label: "nikitakharlov007@gmail.com", icon: "mail" },
    { label: "@Lucky_Woif", href: "https://t.me/Lucky_Woif", icon: "telegram" },
  ],
};

// Общие достижения — показываются на каждой странице и в каждом PDF.
const ACHIEVEMENTS = [
  {
    title: "Цифровой прорыв — Сезон: Искусственный интеллект",
    rank: "1st place",
    meta: "Россия — страна возможностей · Июнь 2026 · Омск",
    description:
      "Команда ZeroCode (5 человек) заняла первое место в треке «Новички» среди 550+ участников со всей страны. Разработали LLM-пайплайн для автоматического анализа 400 000 обращений граждан Омской области: кластеризация проблем, территориальная геопривязка, генерация аналитических отчётов с рейтингом муниципалитетов.",
    link: "https://rsv.ru/news/3/9249/",
    linkLabel: "официальные итоги",
  },
];

// Два независимых портфолио. Ачивки к ним не относятся — они общие (выше).
const PORTFOLIOS = {
  backend: {
    title: "Backend",
    tagline: "Go / backend",
    bio: "Бэкенд-разработчик. Пишу код, читаю документацию, чиню баги.",
    projects: [
      {
        name: "ExpenseMind",
        status: "active",
        description:
          "Локальный трекер финансов с ML-прогнозированием. Все данные остаются на устройстве — никаких облаков и аналитики.",
        stack: ["Go", "Python", "React", "SQLite", "Docker"],
        github: "https://github.com/terracodum/ExpenseMind",
        page: "projects/expensemind.html",
      },
    ],
  },
  ml: {
    title: "ML / AI",
    tagline: "ML / AI",
    bio: "Машинное обучение и LLM-пайплайны. Кластеризация, анализ текста, генерация отчётов.",
    projects: [
      {
        name: "ZeroProblems",
        status: "hackathon · 1st place",
        description:
          "Платформа команды ZeroCode для анализа обращений граждан: Excel → классификация тяжести дообученной RuBERT (ONNX) → Health Score по муниципалитетам Омской области, карта, дашборд и LLM-справки. 1 место на «Цифровом прорыве — Сезон ИИ».",
        stack: ["Python", "RuBERT", "ONNX", "FastAPI", "React", "Leaflet"],
        page: "projects/zerocode.html",
        github: "https://github.com/terracodum/DigitalBreakthrough",
      },
    ],
  },
};
