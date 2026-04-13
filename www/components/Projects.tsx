const projects = [
  {
    title: "Sistema Santillana",
    description:
      "Plataforma de captura e gestão de leads com foco educacional, desenvolvida para a Santillana. Back-end em C# e ASP.NET MVC, banco de dados MySQL e infraestrutura na Google Cloud Platform (GCP).",
    tags: ["C#", "ASP.NET MVC", "MySQL", "GCP"],
    github: null,
    live: null,
    gradient: "from-[#6366f1] to-[#8b5cf6]",
  },
  {
    title: "ProCorretor",
    description:
      "Arquitetura e desenvolvimento inicial de uma plataforma para corretores de imóveis. Responsável pelo design da solução, definição de padrões e implementação da base do sistema com .NET e C#.",
    tags: ["C#", ".NET", "Arquitetura de Software"],
    github: null,
    live: "https://procorretor.com",
    gradient: "from-[#0ea5e9] to-[#6366f1]",
  },
  {
    title: "321achei",
    description:
      "Portal de busca e classificados de imóveis com listagem, filtros e detalhamento de propriedades. API back-end em .NET e C# com banco de dados MySQL.",
    tags: ["C#", ".NET", "MySQL"],
    github: null,
    live: "https://321achei.com",
    gradient: "from-[#10b981] to-[#0ea5e9]",
  },
  {
    title: "Children Movies",
    description:
      "Projeto pessoal com curadoria de filmes infantis. Front-end em React, back-end serverless com Node.js via AWS Lambda, hospedado na AWS.",
    tags: ["React", "Node.js", "AWS Lambda", "AWS"],
    github: "https://github.com/brunoravanhani/children-movies",
    live: "https://children.ravanhani.com",
    gradient: "from-[#f59e0b] to-[#ef4444]",
  },
  {
    title: "Soccer Results",
    description:
      "Projeto pessoal para consulta de resultados de partidas de futebol em tempo real, consumindo APIs esportivas externas. Front-end em React com deploy na AWS.",
    tags: ["React", "REST API", "AWS"],
    github: "https://github.com/brunoravanhani/soccer-results",
    live: "https://soccer.ravanhani.com/",
    gradient: "from-[#10b981] to-[#6366f1]",
  },
  {
    title: "Achadinhos do Papai",
    description:
      "Plataforma de lista de promoções e ofertas com integração simplificada. Desenvolvido com React e Next.js no front-end, back-end serverless com Node.js e AWS Lambda, todo na AWS.",
    tags: ["React", "Next.js", "Node.js", "AWS Lambda", "AWS"],
    github: "https://github.com/brunoravanhani/weekly-offers",
    live: "https://achadinhosdopapai.com/",
    gradient: "from-[#8b5cf6] to-[#0ea5e9]",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6366f1] text-sm font-semibold tracking-[0.2em] uppercase mb-2">
            O Que Construí
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Projetos em Destaque
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#818cf8] rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden hover:border-[#6366f1]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6366f1]/10 flex flex-col"
            >
              {/* Gradient banner */}
              <div className={`h-2 w-full bg-gradient-to-r ${project.gradient}`} />

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg leading-tight mb-3">
                  {project.title}
                </h3>

                <p className="text-[#94a3b8] text-sm leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[#0f172a] border border-[#334155] text-[#818cf8] text-xs font-medium rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 mt-5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Código
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#6366f1] hover:text-[#818cf8] transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ver site
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/ravanhani"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#334155] hover:border-[#6366f1] text-[#94a3b8] hover:text-white rounded-xl font-medium transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Ver Mais no GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
