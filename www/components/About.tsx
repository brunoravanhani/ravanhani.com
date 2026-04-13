export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6366f1] text-sm font-semibold tracking-[0.2em] uppercase mb-2">
            Sobre Mim
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Quem Sou Eu
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#818cf8] rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Avatar placeholder */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#818cf8] rounded-2xl rotate-6 opacity-30" />
              <div className="relative bg-[#1e293b] border border-[#334155] rounded-2xl w-full h-full flex items-center justify-center">
                <span className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
                  BR
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-6">
            <p className="text-[#94a3b8] text-lg leading-relaxed">
              Sou <strong className="text-white">Bruno Ravanhani</strong>, Engenheiro de
              Software Sênior com <strong className="text-[#818cf8]">10 anos de experiência</strong>{" "}
              entregando soluções robustas e escaláveis. Especialista em back-end com{" "}
              <strong className="text-[#818cf8]">C# e .NET</strong> (Core &amp; Framework),
              com sólida experiência em front-end com{" "}
              <strong className="text-[#818cf8]">React</strong> e TypeScript.
            </p>
            <p className="text-[#94a3b8] text-lg leading-relaxed">
              Construí e mantive APIs, microsserviços e sistemas complexos nos setores de
              e-commerce, finanças e setor público. Atuei como líder técnico, mentor de
              equipes e ponto de contato com stakeholders em projetos nacionais e
              internacionais (EUA, Brasil, Índia).
            </p>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {[
                { label: "Localização", value: "Cuiabá, MT — Brasil" },
                { label: "Experiência", value: "10+ Anos" },
                { label: "Foco", value: ".NET & React" },
                { label: "Disponibilidade", value: "Aberto a Propostas" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#1e293b] border border-[#334155] rounded-xl p-4"
                >
                  <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="text-white font-semibold text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-2 self-start px-6 py-3 bg-[#6366f1] hover:bg-[#818cf8] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#6366f1]/20"
            >
              Vamos Conversar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

