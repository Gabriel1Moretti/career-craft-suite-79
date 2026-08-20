import type { Resume } from "@/types/resume";

const MARGIN = 54;
const WIDTH = 595.28; // A4 pt
const HEIGHT = 841.89;
const CONTENT = WIDTH - MARGIN * 2;

function contactLine(resume: Resume) {
  const p = resume.personal;
  return [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join("  ·  ");
}


function bulletsOf(description?: string): string[] {
  if (!description) return [];
  return description
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*\u2022]\s*/, "").trim())
    .filter(Boolean);
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

  const INK = 30;
  const SOFT = 110;
  const HAIR = 205;

  let y = MARGIN;

  const ensure = (needed: number) => {
    if (y + needed > HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const style = (size: number, weight: "normal" | "bold" | "italic", color: number) => {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    doc.setTextColor(color);
  };

  interface Opts {
    size?: number;
    weight?: "normal" | "bold" | "italic";
    color?: number;
    lead?: number;
    x?: number;
    width?: number;
    charSpace?: number;
  }

  const write = (value: string, opts: Opts = {}) => {
    const {
      size = 10,
      weight = "normal",
      color = INK,
      lead = size * 1.55,
      x = MARGIN,
      width = CONTENT,
      charSpace = 0,
    } = opts;
    style(size, weight, color);
    const lines = doc.splitTextToSize(value, width) as string[];
    lines.forEach((line) => {
      ensure(lead);
      style(size, weight, color);
      doc.text(line, x, y, { charSpace });
      y += lead;
    });
  };

  const hline = (tone: number, weight: number, from = MARGIN, to = WIDTH - MARGIN) => {
    doc.setDrawColor(tone);
    doc.setLineWidth(weight);
    doc.line(from, y, to, y);
  };

  const section = (label: string) => {
    y += 20;
    ensure(52);
    style(9, "bold", INK);
    doc.text(label.toUpperCase(), MARGIN, y, { charSpace: 1.5 });
    y += 6;
    hline(HAIR, 0.7);
    y += 15;
  };

  const entry = (title: string, right?: string) => {
    const lead = 15;
    style(11, "bold", INK);
    style(9, "normal", SOFT);
    const rightW = right ? doc.getTextWidth(right) + 16 : 0;
    style(11, "bold", INK);
    const lines = doc.splitTextToSize(title, CONTENT - rightW) as string[];
    lines.forEach((line, i) => {
      ensure(lead);
      style(11, "bold", INK);
      doc.text(line, MARGIN, y);
      if (i === 0 && right) {
        style(9, "normal", SOFT);
        doc.text(right, WIDTH - MARGIN, y, { align: "right" });
      }
      y += lead;
    });
  };

  const bullet = (value: string) => {
    const size = 10;
    const lead = 14.5;
    const indent = 13;
    style(size, "normal", INK);
    const lines = doc.splitTextToSize(value, CONTENT - indent) as string[];
    lines.forEach((line, i) => {
      ensure(lead);
      style(size, "normal", INK);
      if (i === 0) {
        doc.setTextColor(SOFT);
        doc.text("•", MARGIN + 1, y);
        doc.setTextColor(INK);
      }
      doc.text(line, MARGIN + indent, y);
      y += lead;
    });
  };

  // ---------------- Header ----------------
  y += 12;
  write(resume.personal.name || "Currículo", {
    size: 23,
    weight: "bold",
    lead: 26,
    charSpace: 0.3,
  });
  if (resume.personal.title) {
    y += 3;
    write(resume.personal.title.toUpperCase(), {
      size: 9.5,
      color: SOFT,
      lead: 14,
      charSpace: 1.8,
    });
  }
  y += 6;
  hline(INK, 1.2);
  y += 15;
  const contact = contactLine(resume);
  if (contact) write(contact, { size: 9.5, color: SOFT, lead: 13.5 });

  if (resume.summary) {
    section("Perfil");
    write(resume.summary, { lead: 15.5 });
  }

  if (resume.experiences.length) {
    section("Experiência profissional");
    resume.experiences.forEach((e, i) => {
      if (i > 0) y += 11;
      entry(e.role || "", e.period);
      const meta = [e.company, e.location].filter(Boolean).join("  ·  ");
      if (meta) write(meta, { size: 9.5, weight: "italic", color: SOFT, lead: 14 });
      y += 3;
      bulletsOf(e.description).forEach(bullet);
    });
  }

  if (resume.education.length) {
    section("Formação acadêmica");
    resume.education.forEach((e, i) => {
      if (i > 0) y += 11;
      entry(e.degree || "", e.period);
      if (e.institution)
        write(e.institution, { size: 9.5, weight: "italic", color: SOFT, lead: 14 });
      if (e.description) {
        y += 3;
        write(e.description, { lead: 15 });
      }
    });
  }

  if (resume.skills.length) {
    section("Competências");
    write(resume.skills.join("  ·  "), { lead: 15.5 });
  }

  if (resume.languages.length) {
    section("Idiomas");
    write(resume.languages.map((l) => `${l.name}${l.level ? ` — ${l.level}` : ""}`).join("  ·  "), {
      lead: 15.5,
    });
  }

  if (resume.certifications.length) {
    section("Certificações");
    resume.certifications.forEach((c) =>
      bullet(`${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`),
    );
  }

  if (resume.courses.length) {
    section("Cursos");
    resume.courses.forEach((c) => bullet(c));
  }

  if (resume.projects.length) {
    section("Projetos");
    resume.projects.forEach((p, i) => {
      if (i > 0) y += 11;
      entry(p.name || "");
      if (p.description) write(p.description, { lead: 15 });
      if (p.link) write(p.link, { size: 9, color: SOFT, lead: 13 });
    });
  }

  doc.save(filename);
}


export async function downloadDocx(resume: Resume, filename: string) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    BorderStyle,
    LevelFormat,
    AlignmentType,
    TabStopType,
    TabStopPosition,
  } = await import("docx");

  const INK = "1A1A1A";
  const GRAY = "5F5F5F";
  const RULE = "BFBFBF";
  const children: InstanceType<typeof Paragraph>[] = [];

  const para = (
    value: string,
    opts: { bold?: boolean; size?: number; color?: string; italics?: boolean; after?: number } = {},
  ) =>
    new Paragraph({
      children: [
        new TextRun({
          text: value,
          bold: opts.bold ?? false,
          italics: opts.italics ?? false,
          size: opts.size ?? 21,
          color: opts.color ?? INK,
        }),
      ],
      spacing: { after: opts.after ?? 140, line: 300, lineRule: "auto" },
    });

  const bulletPara = (value: string) =>
    new Paragraph({
      numbering: { reference: "resume-bullets", level: 0 },
      children: [new TextRun({ text: value, size: 21, color: INK })],
      spacing: { after: 90, line: 290, lineRule: "auto" },
    });

  const section = (value: string) =>
    new Paragraph({
      children: [
        new TextRun({
          text: value.toUpperCase(),
          bold: true,
          size: 21,
          color: INK,
          font: "Georgia",
          characterSpacing: 26,
        }),
      ],
      spacing: { before: 380, after: 140, line: 276, lineRule: "auto" },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 10 } },
    });

  const entry = (title: string, right?: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: title, bold: true, size: 22, color: INK }),
        ...(right ? [new TextRun({ text: `\t${right}`, size: 19, color: GRAY })] : []),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { before: 180, after: 40, line: 290, lineRule: "auto" },
    });

  // Header (classic centered)
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resume.personal.name || "Currículo",
          bold: true,
          size: 44,
          color: INK,
          font: "Georgia",
          characterSpacing: 12,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80, line: 300, lineRule: "auto" },
    }),
  );
  if (resume.personal.title)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.personal.title.toUpperCase(),
            size: 19,
            color: GRAY,
            characterSpacing: 30,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80, line: 290, lineRule: "auto" },
      }),
    );
  const contact = contactLine(resume);
  if (contact)
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contact, size: 19, color: GRAY })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40, line: 290, lineRule: "auto" },
      }),
    );

  if (resume.summary) children.push(section("Resumo profissional"), para(resume.summary));

  if (resume.experiences.length) {
    children.push(section("Experiência profissional"));
    resume.experiences.forEach((e) => {
      children.push(entry(e.role || "", e.period));
      const meta = [e.company, e.location].filter(Boolean).join("  •  ");
      if (meta) children.push(para(meta, { size: 20, color: GRAY, italics: true, after: 80 }));
      bulletsOf(e.description).forEach((b) => children.push(bulletPara(b)));
    });
  }

  if (resume.education.length) {
    children.push(section("Formação acadêmica"));
    resume.education.forEach((e) => {
      children.push(entry(e.degree || "", e.period));
      if (e.institution)
        children.push(para(e.institution, { size: 20, color: GRAY, italics: true, after: 80 }));
      if (e.description) children.push(para(e.description));
    });
  }

  if (resume.skills.length)
    children.push(section("Habilidades"), para(resume.skills.join("  •  ")));

  if (resume.languages.length)
    children.push(
      section("Idiomas"),
      para(resume.languages.map((l) => `${l.name}${l.level ? ` — ${l.level}` : ""}`).join("  •  ")),
    );

  if (resume.certifications.length) {
    children.push(section("Certificações"));
    resume.certifications.forEach((c) =>
      children.push(
        bulletPara(`${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`),
      ),
    );
  }

  if (resume.courses.length) {
    children.push(section("Cursos"));
    resume.courses.forEach((c) => children.push(bulletPara(c)));
  }

  if (resume.projects.length) {
    children.push(section("Projetos"));
    resume.projects.forEach((p) => {
      children.push(entry(p.name || ""));
      if (p.description) children.push(para(p.description));
      if (p.link) children.push(para(p.link, { size: 19, color: GRAY }));
    });
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri", size: 21 } } } },
    numbering: {
      config: [
        {
          reference: "resume-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 220 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1100, right: 1100, bottom: 1100, left: 1100 },
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
