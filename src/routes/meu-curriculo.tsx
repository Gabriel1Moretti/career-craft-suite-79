import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { Button } from "@/components/ui/button";
import { setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/meu-curriculo")({
  head: () => ({
    meta: [
      { title: "Meu currículo — MatchCV" },
      {
        name: "description",
        content:
          "Monte e edite seu currículo base com preview em tempo real. Ele fica salvo no seu navegador.",
      },
      { property: "og:title", content: "Meu currículo — MatchCV" },
      {
        property: "og:description",
        content: "Editor de currículo com preview em tempo real, pronto para análises de vagas.",
      },
    ],
  }),
  component: MyResumePage,
});

function MyResumePage() {
  const resume = useAppState((s) => s.resume);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Meu currículo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Este é seu currículo base. Ele será usado nas análises de vaga.
          </p>
        </div>
        <Button asChild>
          <Link to="/analisar">
            Analisar uma vaga <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <ResumeEditor resume={resume} onChange={(r) => setState({ resume: r })} />
    </div>
  );
}
