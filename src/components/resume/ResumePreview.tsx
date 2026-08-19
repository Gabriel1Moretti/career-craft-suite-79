import type { Resume } from "@/types/resume";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-neutral-300 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-700">
        {title}
      </h2>
      <div className="mt-2 space-y-3 text-[12px] leading-relaxed text-neutral-800">{children}</div>
    </section>
  );
}

export function ResumePreview({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const contact = [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean);

  return (
    <article className="mx-auto w-full max-w-[720px] bg-white p-8 font-sans text-neutral-900 shadow-sm ring-1 ring-border">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{p.name || "Seu nome"}</h1>
        {p.title && <p className="mt-1 text-sm text-neutral-700">{p.title}</p>}
        {contact.length > 0 && (
          <p className="mt-2 text-[11px] text-neutral-600">{contact.join("  •  ")}</p>
        )}
      </header>

      {resume.summary && <Section title="Resumo profissional">{resume.summary}</Section>}

      {resume.experiences.length > 0 && (
        <Section title="Experiência profissional">
          {resume.experiences.map((e) => (
            <div key={e.id}>
              <p className="font-semibold">
                {e.role}
                {e.company ? ` — ${e.company}` : ""}
              </p>
              {(e.location || e.period) && (
                <p className="text-[11px] text-neutral-600">
                  {[e.location, e.period].filter(Boolean).join(" | ")}
                </p>
              )}
              {e.description && <p className="mt-1 whitespace-pre-line">{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title="Formação acadêmica">
          {resume.education.map((e) => (
            <div key={e.id}>
              <p className="font-semibold">
                {e.degree}
                {e.institution ? ` — ${e.institution}` : ""}
              </p>
              {e.period && <p className="text-[11px] text-neutral-600">{e.period}</p>}
              {e.description && <p className="mt-1">{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Habilidades">{resume.skills.join(", ")}</Section>
      )}

      {resume.languages.length > 0 && (
        <Section title="Idiomas">
          {resume.languages.map((l) => `${l.name}${l.level ? ` — ${l.level}` : ""}`).join(", ")}
        </Section>
      )}

      {resume.certifications.length > 0 && (
        <Section title="Certificações">
          {resume.certifications
            .map((c) => `${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`)
            .join(", ")}
        </Section>
      )}

      {resume.courses.length > 0 && <Section title="Cursos">{resume.courses.join(", ")}</Section>}

      {resume.projects.length > 0 && (
        <Section title="Projetos">
          {resume.projects.map((pr) => (
            <div key={pr.id}>
              <p className="font-semibold">{pr.name}</p>
              {pr.description && <p>{pr.description}</p>}
              {pr.link && <p className="text-[11px] text-neutral-600">{pr.link}</p>}
            </div>
          ))}
        </Section>
      )}
    </article>
  );
}
