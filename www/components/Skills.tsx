const skillGroups = [
  {
    category: "Back-end",
    icon: "⚙️",
    skills: [
      { name: "C# / .NET (Core & Framework)", level: 95 },
      { name: "ASP.NET Core / Web API", level: 93 },
      { name: "Entity Framework", level: 88 },
      { name: "Microsserviços", level: 87 },
      { name: "SQL Server / PostgreSQL", level: 85 },
      { name: "MongoDB", level: 75 },
      { name: "RabbitMQ / Apache Kafka", level: 78 },
    ],
  },
  {
    category: "Front-end",
    icon: "🎨",
    skills: [
      { name: "React", level: 88 },
      { name: "TypeScript", level: 85 },
      { name: "Next.js", level: 80 },
      { name: "Angular", level: 60 },
      { name: "JavaScript (ES6+)", level: 88 },
      { name: "HTML5 / CSS3 / Tailwind", level: 87 },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon: "☁️",
    skills: [
      { name: "Azure DevOps", level: 85 },
      { name: "AWS (Cloud Practitioner)", level: 72 },
      { name: "Docker", level: 82 },
      { name: "GitHub Actions", level: 80 },
      { name: "CI/CD Pipelines", level: 80 },
      { name: "Desenvolvimento apoiado por AI", level: 88 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-[#0a0f1e]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6366f1] text-sm font-semibold tracking-[0.2em] uppercase mb-2">
            O Que Sei
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Minhas Habilidades
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#818cf8] rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-[#6366f1]/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{group.icon}</span>
                <h3 className="text-white font-bold text-lg">{group.category}</h3>
              </div>

              <div className="flex flex-col gap-5">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#94a3b8] text-sm font-medium">
                        {skill.name}
                      </span>
                      <span className="text-[#6366f1] text-sm font-semibold">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#0f172a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6366f1] to-[#818cf8] rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
