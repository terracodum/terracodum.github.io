// ML portfolio data. Achievements come from achievements.js (shared).
renderPortfolio({
  achievements: ACHIEVEMENTS,
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
    // {
    //   name: "ProjectName",
    //   status: "wip",
    //   description: "One sentence about what it does and for whom.",
    //   stack: ["Python", "PyTorch"],
    //   github: "https://github.com/terracodum/repo",
    //   page: "projects/projectname.html", // optional
    // },
  ],
});
