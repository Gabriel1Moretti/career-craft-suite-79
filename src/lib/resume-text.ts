import type { Resume } from "@/types/resume";

export function resumeToText(resume: Resume, raw?: string): string {
  const p = resume.personal;
  const lines: string[] = [];
  if (p.name) lines.push(`Nome: ${p.name}`);
  if (p.title) lines.push(`Título: ${p.title}`);
  const contact = [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean);
  if (contact.length) lines.push(`Contato: ${contact.join(" | ")}`);
  if (resume.summary) lines.push(`\nResumo profissional:\n${resume.summary}`);
  if (resume.experiences.length) {
    lines.push("\nExperiência profissional:");
    resume.experiences.forEach((e) =>
      lines.push(
        `- ${e.role} | ${e.company}${e.location ? ` | ${e.location}` : ""}${e.period ? ` | ${e.period}` : ""}\n  ${e.description ?? ""}`,
      ),
    );
  }
  if (resume.education.length) {
    lines.push("\nFormação acadêmica:");
    resume.education.forEach((e) =>
      lines.push(`- ${e.degree} | ${e.institution}${e.period ? ` | ${e.period}` : ""}`),
    );
  }
  if (resume.skills.length) lines.push(`\nHabilidades: ${resume.skills.join(", ")}`);
  if (resume.languages.length)
    lines.push(
      `\nIdiomas: ${resume.languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join(", ")}`,
    );
  if (resume.certifications.length)
    lines.push(
      `\nCertificações: ${resume.certifications.map((c) => `${c.name}${c.issuer ? ` - ${c.issuer}` : ""}`).join(", ")}`,
    );
  if (resume.courses.length) lines.push(`\nCursos: ${resume.courses.join(", ")}`);
  if (resume.projects.length) {
    lines.push("\nProjetos:");
    resume.projects.forEach((pr) => lines.push(`- ${pr.name}: ${pr.description ?? ""}`));
  }
  const structured = lines.join("\n").trim();
  if (raw && raw.trim().length > structured.length) {
    return `${structured}\n\nTexto original do currículo enviado:\n${raw.trim()}`;
  }
  return structured || (raw ?? "");
}

export function hasResumeContent(resume: Resume, raw: string) {
  return Boolean(
    raw.trim() ||
      resume.personal.name.trim() ||
      resume.summary.trim() ||
      resume.experiences.length ||
      resume.skills.length,
  );
}
