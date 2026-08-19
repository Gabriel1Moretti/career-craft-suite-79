import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { AtsPanel } from "@/components/ats/AtsPanel";
import { MatchResults } from "@/components/matchmaking/MatchResults";
import { DownloadCard } from "@/components/resume/DownloadCard";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteRecord, updateRecordResume, useAppState } from "@/lib/store";

export const Route = createFileRoute("/curriculos")({
  head: () => ({
    meta: [
      { title: "Meus currículos gerados — MatchCV" },
      {
        name: "description",
        content: "Acesse, edite e baixe os currículos otimizados que você gerou para cada vaga.",
      },
      { property: "og:title", content: "Meus currículos gerados — MatchCV" },
      {
        property: "og:description",
        content: "Todas as versões ATS criadas para suas candidaturas em um só lugar.",
      },
    ],
  }),
  component: ResumesPage,
});

function ResumesPage() {
  const records = useAppState((s) => s.records);
  const [openId, setOpenId] = useState<string | null>(null);
  const active = records.find((r) => r.id === openId) ?? null;

  if (active) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Button variant="outline" className="mb-6" onClick={() => setOpenId(null)}>
          Voltar para a lista
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {active.role} · <span className="text-muted-foreground">{active.company}</span>
        </h1>
        <Tabs defaultValue="curriculo" className="mt-6">
          <TabsList>
            <TabsTrigger value="curriculo">Currículo</TabsTrigger>
            <TabsTrigger value="match">Match</TabsTrigger>
            <TabsTrigger value="ats">ATS</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>
          <TabsContent value="curriculo" className="mt-6">
            <ResumeEditor
              resume={active.resume}
              onChange={(r) => updateRecordResume(active.id, r)}
            />
          </TabsContent>
          <TabsContent value="match" className="mt-6">
            <MatchResults analysis={active.analysis} />
          </TabsContent>
          <TabsContent value="ats" className="mt-6">
            <AtsPanel analysis={active.analysis} />
          </TabsContent>
          <TabsContent value="download" className="mt-6">
            <DownloadCard record={active} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Meus currículos gerados</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cada análise cria uma versão do currículo adaptada para a vaga.
      </p>

      {records.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Você ainda não gerou nenhum currículo otimizado.
            </p>
            <Button asChild>
              <Link to="/analisar">Analisar uma vaga</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle className="text-base">{r.role}</CardTitle>
                <CardDescription>{r.company}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Match {Math.round(r.matchScore)}%</Badge>
                  <Badge variant="outline">ATS {Math.round(r.atsScore)}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Criado em {new Date(r.createdAt).toLocaleString("pt-BR")}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setOpenId(r.id)}>
                    Abrir
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Excluir currículo"
                    onClick={() => deleteRecord(r.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
