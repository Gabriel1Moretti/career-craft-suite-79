import { AlertTriangle, CheckCircle2, CircleSlash, Lightbulb } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/matchmaking/ScoreRing";
import type { AnalysisResult } from "@/types/resume";

export function MatchResults({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row sm:items-center sm:justify-around">
          <ScoreRing value={analysis.matchScore} label="Compatibilidade com a vaga" />
          <ScoreRing value={analysis.atsScore} label="ATS Score" size={130} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Análise por categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {(analysis.categories ?? []).map((c) => (
            <div key={c.name} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{c.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{c.status}</Badge>
                  <span className="text-sm font-semibold text-foreground">{c.score}%</span>
                </div>
              </div>
              <Progress value={c.score} />
              <p className="text-sm text-muted-foreground">{c.explanation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Palavras-chave da vaga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <KeywordGroup
            title="Encontradas no currículo"
            icon={<CheckCircle2 className="size-4 text-primary" />}
            items={analysis.skillsMatch}
            className="border-primary/40 bg-primary/10 text-secondary-foreground"
          />
          <KeywordGroup
            title="Correspondência parcial"
            icon={<AlertTriangle className="size-4 text-warning-foreground" />}
            items={analysis.partialSkills}
            className="border-warning/60 bg-warning/25 text-warning-foreground"
          />
          <KeywordGroup
            title="Ausentes"
            icon={<CircleSlash className="size-4 text-destructive" />}
            items={analysis.missingSkills}
            className="border-destructive/30 bg-destructive/10 text-destructive"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pontos fortes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(analysis.strengths ?? []).map((s, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pontos de atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(analysis.weaknesses ?? []).map((s, i) => (
                <li key={i} className="flex gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">O que pode melhorar no seu currículo</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {(analysis.recommendations ?? []).map((r, i) => (
              <AccordionItem key={i} value={`rec-${i}`}>
                <AccordionTrigger className="text-left text-sm">
                  <span className="flex items-center gap-2">
                    <Lightbulb className="size-4 text-primary" />
                    {r.problem}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Por que importa: </strong>
                    {r.why}
                  </p>
                  <p>
                    <strong className="text-foreground">Sugestão: </strong>
                    {r.suggestion}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function KeywordGroup({
  title,
  items,
  icon,
  className,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {(items ?? []).length === 0 && (
          <span className="text-sm text-muted-foreground">Nenhuma identificada.</span>
        )}
        {(items ?? []).map((k) => (
          <Badge key={k} variant="outline" className={className}>
            {k}
          </Badge>
        ))}
      </div>
    </div>
  );
}
