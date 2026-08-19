import type { Resume } from "@/types/resume";

const MARGIN = 48;
const WIDTH = 595.28; // A4 pt
const HEIGHT = 841.89;

function contactLine(resume: Resume) {
  const p = resume.personal;
  return [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join("  |  ");
}

export interface ResumeStats {
  pages: number;
  words: number;
}

export function resumeStats(resume: Resume): ResumeStats {
  const text = JSON.stringify(resume).replace(/[^\p{L}\p{N}\s]/gu, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return { pages: Math.max(1, Math.ceil(words / 550)), words };
}

export async function downloadPdf(resume: Resume, filename: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = MARGIN;

  const ensureSpace = (needed = 16) => {
    if (y + needed > HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const text = (
    value: string,
    { size = 10, bold = false, gap = 14 }: { size?: number; bold?: boolean; gap?: number } = {},
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(value, WIDTH - MARGIN * 2) as string[];
    lines.forEach((line) => {
      ensureSpace(gap);
      doc.text(line, MARGIN, y);
      y += gap;
    });
  };

  const heading = (value: string) => {
    if (!value) return;
    y += 8;
    ensureSpace(20);
    text(value.toUpperCase(), { size: 11, bold: true, gap: 14 });
    doc.setDrawColor(160);
    doc.line(MARGIN, y - 9, WIDTH - MARGIN, y - 9);
    y += 2;
  };

  text(resume.personal.name || "Currículo", { size: 18, bold: true, gap: 22 });
  if (resume.personal.title) text(resume.personal.title, { size: 11, gap: 15 });
  const contact = contactLine(resume);
  if (contact) text(contact, { size: 9, gap: 13 });

  if (resume.summary) {
    heading("Resumo profissional");
    text(resume.summary);
  }

  if (resume.experiences.length) {
    heading("Experiência profissional");
    resume.experiences.forEach((e) => {
      text(`${e.role}${e.company ? ` — ${e.company}` : ""}`, { bold: true, gap: 14 });
      const meta = [e.location, e.period].filter(Boolean).join(" | ");
      if (meta) text(meta, { size: 9, gap: 12 });
      if (e.description) text(e.description, { gap: 13 });
      y += 4;
    });
  }

  if (resume.education.length) {
    heading("Formação acadêmica");
    resume.education.forEach((e) => {
      text(`${e.degree}${e.institution ? ` — ${e.institution}` : ""}`, { bold: true, gap: 14 });
      if (e.period) text(e.period, { size: 9, gap: 12 });
      if (e.description) text(e.description, { gap: 13 });
      y += 2;
    });
  }

  if (resume.skills.length) {
    heading("Habilidades");
    text(resume.skills.join(", "));
  }

  if (resume.languages.length) {
    heading("Idiomas");
    text(resume.languages.map((l) => `${l.name}${l.level ? ` — ${l.level}` : ""}`).join(", "));
  }

  if (resume.certifications.length) {
    heading("Certificações");
    resume.certifications.forEach((c) =>
      text(
        `${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`,
        { gap: 13 },
      ),
    );
  }

  if (resume.courses.length) {
    heading("Cursos");
    text(resume.courses.join(", "));
  }

  if (resume.projects.length) {
    heading("Projetos");
    resume.projects.forEach((p) => {
      text(p.name, { bold: true, gap: 14 });
      if (p.description) text(p.description, { gap: 13 });
      if (p.link) text(p.link, { size: 9, gap: 12 });
    });
  }

  doc.save(filename);
}

export async function downloadDocx(resume: Resume, filename: string) {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("docx");

  const children: InstanceType<typeof Paragraph>[] = [];
  const para = (value: string, opts: { bold?: boolean; size?: number } = {}) =>
    new Paragraph({
      children: [new TextRun({ text: value, bold: opts.bold, size: opts.size ?? 22 })],
      spacing: { after: 80 },
    });
  const section = (value: string) =>
    new Paragraph({
      children: [new TextRun({ text: value.toUpperCase(), bold: true, size: 24 })],
      spacing: { before: 240, after: 120 },
    });

  children.push(
    new Paragraph({
      children: [new TextRun({ text: resume.personal.name || "Currículo", bold: true, size: 36 })],
      alignment: AlignmentType.LEFT,
    }),
  );
  if (resume.personal.title) children.push(para(resume.personal.title));
  const contact = contactLine(resume);
  if (contact) children.push(para(contact, { size: 20 }));

  if (resume.summary) {
    children.push(section("Resumo profissional"), para(resume.summary));
  }
  if (resume.experiences.length) {
    children.push(section("Experiência profissional"));
    resume.experiences.forEach((e) => {
      children.push(para(`${e.role}${e.company ? ` — ${e.company}` : ""}`, { bold: true }));
      const meta = [e.location, e.period].filter(Boolean).join(" | ");
      if (meta) children.push(para(meta, { size: 20 }));
      if (e.description) children.push(para(e.description));
    });
  }
  if (resume.education.length) {
    children.push(section("Formação acadêmica"));
    resume.education.forEach((e) => {
      children.push(para(`${e.degree}${e.institution ? ` — ${e.institution}` : ""}`, { bold: true }));
      if (e.period) children.push(para(e.period, { size: 20 }));
      if (e.description) children.push(para(e.description));
    });
  }
  if (resume.skills.length) children.push(section("Habilidades"), para(resume.skills.join(", ")));
  if (resume.languages.length)
    children.push(
      section("Idiomas"),
      para(resume.languages.map((l) => `${l.name}${l.level ? ` — ${l.level}` : ""}`).join(", ")),
    );
  if (resume.certifications.length) {
    children.push(section("Certificações"));
    resume.certifications.forEach((c) =>
      children.push(
        para(`${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`),
      ),
    );
  }
  if (resume.courses.length) children.push(section("Cursos"), para(resume.courses.join(", ")));
  if (resume.projects.length) {
    children.push(section("Projetos"));
    resume.projects.forEach((p) => {
      children.push(para(p.name, { bold: true }));
      if (p.description) children.push(para(p.description));
      if (p.link) children.push(para(p.link, { size: 20 }));
    });
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
