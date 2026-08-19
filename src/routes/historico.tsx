import { createFileRoute, Link } from "@tanstack/react-router";
import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de análises — MatchCV" },
      {
        name: "description",
        content: "Veja as vagas analisadas nesta sessão com scores de compatibilidade e ATS.",
      },
      { property: "og:title", content: "Histórico de análises — MatchCV" },
      {
        property: "og:description",
        content: "Acompanhe a evolução dos seus matches e currículos otimizados.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const records = useAppState((s) => s.records);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Histórico de análises</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        As análises ficam salvas apenas neste navegador.
      </p>

      {records.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <History className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhuma análise por aqui ainda.</p>
            <Button asChild>
              <Link to="/analisar">Analisar minha primeira vaga</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="mt-8 space-y-3">
          {records.map((r) => (
            <li key={r.id}>
              <Card>
                <CardContent className="flex flex-wrap items-center gap-4 py-5">
                  <div className="min-w-48 flex-1">
                    <p className="font-medium">{r.role}</p>
                    <p className="text-sm text-muted-foreground">{r.company}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="w-48 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Compatibilidade</span>
                      <span>{Math.round(r.matchScore)}%</span>
                    </div>
                    <Progress value={r.matchScore} />
                  </div>
                  <Badge variant="secondary">ATS {Math.round(r.atsScore)}</Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/curriculos">Ver currículo</Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
