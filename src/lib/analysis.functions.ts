import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AnalysisResult } from "@/types/resume";

const inputSchema = z.object({
  resumeText: z.string().min(1),
  job: z.object({
    description: z.string().min(1),
    company: z.string().optional().default(""),
    role: z.string().optional().default(""),
    location: z.string().optional().default(""),
    seniority: z.string().optional().default(""),
    workModel: z.string().optional().default(""),
  }),
});

const SYSTEM = `Você é um especialista sênior em recrutamento técnico e em sistemas ATS (Applicant Tracking Systems).
Você analisa currículos frente a uma vaga e devolve SEMPRE um JSON válido, em português do Brasil.
REGRA ABSOLUTA: nunca invente experiências, empresas, cargos, tecnologias, certificações, formações ou resultados.
Você só pode reorganizar, priorizar, reescrever com linguagem profissional e destacar informações que já existem no currículo do usuário.
Se uma informação não existir, deixe o campo vazio.`;

function buildPrompt(resumeText: string, job: z.infer<typeof inputSchema>["job"]) {
  return `CURRÍCULO DO CANDIDATO:
"""
${resumeText}
"""

VAGA:
Empresa: ${job.company || "não informada"}
Cargo: ${job.role || "não informado"}
Localização: ${job.location || "não informada"}
Senioridade: ${job.seniority || "não informada"}
Modelo de trabalho: ${job.workModel || "não informado"}
Descrição:
"""
${job.description}
"""

Retorne SOMENTE um objeto JSON com exatamente esta estrutura:
{
  "matchScore": number (0-100),
  "atsScore": number (0-100),
  "atsScoreExplanation": string,
  "categories": [{"name": "Habilidades técnicas"|"Experiência profissional"|"Formação"|"Senioridade"|"Palavras-chave"|"Idiomas"|"Certificações", "score": number, "status": "Excelente"|"Bom"|"Atenção"|"Crítico", "explanation": string}],
  "skillsMatch": string[],
  "missingSkills": string[],
  "partialSkills": string[],
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": [{"problem": string, "why": string, "suggestion": string}],
  "keywords": string[],
  "atsChecklist": [{"item": string, "ok": boolean}],
  "optimizedResume": {
    "personal": {"name": string, "title": string, "email": string, "phone": string, "location": string, "linkedin": string, "portfolio": string},
    "summary": string,
    "experiences": [{"id": string, "role": string, "company": string, "location": string, "period": string, "description": string}],
    "education": [{"id": string, "degree": string, "institution": string, "period": string, "description": string}],
    "skills": string[],
    "languages": [{"id": string, "name": string, "level": string}],
    "certifications": [{"id": string, "name": string, "issuer": string, "year": string}],
    "courses": string[],
    "projects": [{"id": string, "name": string, "description": string, "link": string}]
  }
}
Inclua as 7 categorias. Gere de 4 a 7 recomendações. O optimizedResume deve ser a versão do currículo adaptada para esta vaga, apenas com informações verdadeiras do candidato.`;
}

export const analyzeMatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Serviço de IA não configurado.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: buildPrompt(data.resumeText, data.job) },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429)
        throw new Error("Muitas análises em sequência. Aguarde alguns segundos e tente de novo.");
      if (res.status === 402)
        throw new Error("Os créditos de IA do projeto acabaram. Adicione créditos para continuar.");
      throw new Error(`Falha na análise (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "";
    const cleaned = content
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "");
    try {
      return JSON.parse(cleaned) as AnalysisResult;
    } catch {
      throw new Error("A IA retornou um formato inesperado. Tente novamente.");
    }
  });
