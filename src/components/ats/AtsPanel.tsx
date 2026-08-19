import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AnalysisResult } from "@/types/resume";

const defaultChecklist = [
  "Estrutura simples",
  "Títulos de seção padronizados",
  "Palavras-chave relevantes",
  "Formatação compatível com ATS",
  "Sem tabelas complexas",
  "Sem elementos gráficos desnecessários",
  "Sem caixas de texto complexas",
  "Sem informações importantes dentro de imagens",
];

export function AtsPanel({ analysis }: { analysis: AnalysisResult }) {
  const checklist =
    analysis.atsChecklist?.length > 0
      ? analysis.atsChecklist
      : defaultChecklist.map((item) => ({ item, ok: true }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Otimização ATS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">ATS Score</span>
            <span className="text-2xl font-bold">{Math.round(analysis.atsScore || 0)}/100</span>
          </div>
          <Progress value={analysis.atsScore} />
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {checklist.map((c) => (
            <li key={c.item} className="flex items-start gap-2 text-sm">
              {c.ok ? (
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.item}</span>
            </li>
          ))}
        </ul>

        {analysis.atsScoreExplanation && (
          <Alert>
            <AlertTitle>Como o score foi calculado</AlertTitle>
            <AlertDescription>{analysis.atsScoreExplanation}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
