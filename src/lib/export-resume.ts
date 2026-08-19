import type { Resume } from "@/types/resume";

const MARGIN = 56;
const WIDTH = 595.28; // A4 pt
const HEIGHT = 841.89;
const CONTENT = WIDTH - MARGIN * 2;

function contactLine(resume: Resume) {
  const p = resume.personal;
  return [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join("   |   ");
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
  let y = MARGIN;

  const INK = 26;
  const GRAY = 105;
  const RULE = 190;

  const ensureSpace = (needed: number) => {
    if (y + needed > HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  interface TextOpts {
    size?: number;
    bold?: boolean;
    italic?: boolean;
    gap?: number;
    color?: number;
    x?: number;
    width?: number;
    charSpace?: number;
    font?: "helvetica" | "times";
    align?: "left" | "center";
  }

  const setStyle = (
    font: "helvetica" | "times",
    size: number,
    bold: boolean,
    italic: boolean,
    color: number,
  ) => {
    doc.setFont(font, bold ? (italic ? "bolditalic" : "bold") : italic ? "italic" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
  };

  const text = (value: string, opts: TextOpts = {}) => {
    const {
      size = 10.5,
      bold = false,
      italic = false,
      gap = size * 1.6,
      color = INK,
      x = MARGIN,
      width = CONTENT,
      charSpace = 0,
      font = "helvetica",
      align = "left",
    } = opts;
    setStyle(font, size, bold, italic, color);
    const lines = doc.splitTextToSize(value, width) as string[];
    lines.forEach((line) => {
      ensureSpace(gap);
      setStyle(font, size, bold, italic, color);
      if (align === "center") {
        doc.text(line, WIDTH / 2, y, { charSpace, align: "center" });
      } else {
        doc.text(line, x, y, { charSpace });
      }
      y += gap;
    });
  };

  const rule = (weight = 0.6, tone = RULE) => {
    doc.setDrawColor(tone);
    doc.setLineWidth(weight);
    doc.line(MARGIN, y, WIDTH - MARGIN, y);
  };

  const heading = (value: string) => {
    if (!value) return;
    y += 20;
    ensureSpace(40);
    rule(0.6);
    y += 15;
    text(value.toUpperCase(), {
      size: 10.5,
      bold: true,
      gap: 15,
      charSpace: 1.6,
      font: "times",
      color: INK,
    });
    y += 3;
  };

  // Entry title with right-aligned period on the same baseline.
  const entryTitle = (title: string, right?: string) => {
    const size = 11;
    const gap = 15.5;
    setStyle("helvetica", size, true, false, INK);
    const rightWidth = right
      ? (doc.getStringUnitWidth(right) * 9.5) / doc.internal.scaleFactor + 14
      : 0;
    const lines = doc.splitTextToSize(title, CONTENT - rightWidth) as string[];
    lines.forEach((line, i) => {
      ensureSpace(gap);
      setStyle("helvetica", size, true, false, INK);
      doc.text(line, MARGIN, y);
      if (i === 0 && right) {
        setStyle("helvetica", 9.5, false, false, GRAY);
        doc.text(right, WIDTH - MARGIN, y, { align: "right" });
      }
      y += gap;
    });
  };

  const bullet = (value: string) => {
    const size = 10.5;
    const gap = 15.5;
    const indent = 15;
    setStyle("helvetica", size, false, false, INK);
    const lines = doc.splitTextToSize(value, CONTENT - indent) as string[];
    lines.forEach((line, i) => {
      ensureSpace(gap);
      setStyle("helvetica", size, false, false, INK);
      if (i === 0) {
        doc.setTextColor(GRAY);
        doc.text("–", MARGIN + 2, y);
        doc.setTextColor(INK);
      }
      doc.text(line, MARGIN + indent, y);
      y += gap;
    });
  };

  // ---------- Header (classic centered) ----------
  y += 6;
  text(resume.personal.name || "Currículo", {
    size: 22,
    bold: true,
    gap: 27,
    charSpace: 0.8,
    font: "times",
    align: "center",
  });
  if (resume.personal.title)
    text(resume.personal.title.toUpperCase(), {
      size: 9.5,
      gap: 17,
      charSpace: 1.4,
      color: GRAY,
      align: "center",
    });
  const contact = contactLine(resume);
  if (contact)
    text(contact, { size: 9.5, gap: 14, color: GRAY, align: "center", width: CONTENT - 20 });
  y += 8;
  rule(1.1, 120);
  y += 2;

  if (resume.summary) {
    heading("Resumo profissional");
    text(resume.summary, { gap: 16.5 });
  }

  if (resume.experiences.length) {
    heading("Experiência profissional");
    resume.experiences.forEach((e, i) => {
      if (i > 0) y += 12;
      entryTitle(e.role || "", e.period);
      const meta = [e.company, e.location].filter(Boolean).join("  •  ");
      if (meta) text(meta, { size: 10, italic: true, gap: 16, color: GRAY });
      y += 2;
      bulletsOf(e.description).forEach(bullet);
    });
  }

  if (resume.education.length) {
    heading("Formação acadêmica");
    resume.education.forEach((e, i) => {
      if (i > 0) y += 12;
      entryTitle(e.degree || "", e.period);
      if (e.institution) text(e.institution, { size: 10, italic: true, gap: 16, color: GRAY });
      if (e.description) {
        y += 2;
        text(e.description, { gap: 16.5 });
      }
    });
  }

  if (resume.skills.length) {
    heading("Habilidades");
    text(resume.skills.join("  •  "), { gap: 16.5 });
  }

  if (resume.languages.length) {
    heading("Idiomas");
    text(
      resume.languages.map((l) => `${l.name}${l.level ? ` — ${l.level}` : ""}`).join("  •  "),
      { gap: 16.5 },
    );
  }

  if (resume.certifications.length) {
    heading("Certificações");
    resume.certifications.forEach((c) =>
      bullet(`${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`),
    );
  }

  if (resume.courses.length) {
    heading("Cursos");
    resume.courses.forEach((c) => bullet(c));
  }

  if (resume.projects.length) {
    heading("Projetos");
    resume.projects.forEach((p, i) => {
      if (i > 0) y += 12;
      entryTitle(p.name || "");
      if (p.description) text(p.description, { gap: 16.5 });
      if (p.link) text(p.link, { size: 9.5, gap: 15, color: GRAY });
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
        spacing: { after: 120, line: 290, lineRule: "auto" },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: RULE, space: 8 } },
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
