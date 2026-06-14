// Backend portfolio data. Achievements come from achievements.js (shared).
renderPortfolio({
  achievements: ACHIEVEMENTS,
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
    // Example template — copy, fill in, push:
    // {
    //   name: "ProjectName",
    //   status: "wip",
    //   description: "One sentence about what it does and for whom.",
    //   stack: ["Go", "PostgreSQL"],
    //   github: "https://github.com/terracodum/repo",
    //   page: "projects/projectname.html", // optional — omit if no detail page yet
    // },
  ],
});
