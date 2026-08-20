import type { Resume } from "@/types/resume";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="border-b border-neutral-300 pb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-900">
        {title}
      </h2>
      <div className="mt-3.5 space-y-4 text-[12px] leading-[1.65] text-neutral-800">{children}</div>
    </section>
  );
}


function bulletsOf(description?: string) {
  if (!description) return [];
  return description
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*\u2022]\s*/, "").trim())
    .filter(Boolean);
}

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-1.5 space-y-1.5">
      {items.map((b, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="text-neutral-400">–</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

export function ResumePreview({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const contact = [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean);

  return (
    <article className="mx-auto w-full max-w-[720px] bg-white p-10 font-sans text-neutral-900 shadow-sm ring-1 ring-border">
      <header className="border-b-2 border-neutral-800 pb-4 text-center">
        <h1 className="font-serif text-[27px] font-bold leading-tight tracking-[0.02em]">
          {p.name || "Seu nome"}
        </h1>
        {p.title && (
          <p className="mt-2 text-[10.5px] uppercase tracking-[0.18em] text-neutral-600">
            {p.title}
          </p>
        )}
        {contact.length > 0 && (
          <p className="mt-2.5 text-[11px] leading-relaxed text-neutral-600">
            {contact.join("   |   ")}
          </p>
        )}
      </header>

      {resume.summary && <Section title="Resumo profissional">{resume.summary}</Section>}

      {resume.experiences.length > 0 && (
        <Section title="Experiência profissional">
          {resume.experiences.map((e) => (
            <div key={e.id}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[13px] font-semibold">{e.role}</p>
                {e.period && <p className="shrink-0 text-[11px] text-neutral-600">{e.period}</p>}
              </div>
              {(e.company || e.location) && (
                <p className="text-[11.5px] italic text-neutral-600">
                  {[e.company, e.location].filter(Boolean).join("  •  ")}
                </p>
              )}
              <Bullets items={bulletsOf(e.description)} />
            </div>
          ))}
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title="Formação acadêmica">
          {resume.education.map((e) => (
            <div key={e.id}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[13px] font-semibold">{e.degree}</p>
                {e.period && <p className="shrink-0 text-[11px] text-neutral-600">{e.period}</p>}
              </div>
              {e.institution && (
                <p className="text-[11.5px] italic text-neutral-600">{e.institution}</p>
              )}
              {e.description && <p className="mt-1.5">{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Habilidades">{resume.skills.join("  •  ")}</Section>
      )}

      {resume.languages.length > 0 && (
        <Section title="Idiomas">
          {resume.languages.map((l) => `${l.name}${l.level ? ` — ${l.level}` : ""}`).join("  •  ")}
        </Section>
      )}

      {resume.certifications.length > 0 && (
        <Section title="Certificações">
          <Bullets
            items={resume.certifications.map(
              (c) => `${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`,
            )}
          />
        </Section>
      )}

      {resume.courses.length > 0 && (
        <Section title="Cursos">
          <Bullets items={resume.courses} />
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Projetos">
          {resume.projects.map((pr) => (
            <div key={pr.id}>
              <p className="text-[13px] font-semibold">{pr.name}</p>
              {pr.description && <p className="mt-1">{pr.description}</p>}
              {pr.link && <p className="text-[11px] text-neutral-600">{pr.link}</p>}
            </div>
          ))}
        </Section>
      )}
    </article>
  );
}
