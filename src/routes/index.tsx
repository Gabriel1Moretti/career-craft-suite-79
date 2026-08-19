import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Download,
  FileCheck2,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchCV — Match de currículo com vagas e currículo ATS" },
      {
        name: "description",
        content:
          "Compare seu currículo com uma vaga, veja sua compatibilidade e gere um currículo otimizado para ATS. Sem cadastro.",
      },
      { property: "og:title", content: "MatchCV — Match de currículo com vagas" },
      {
        property: "og:description",
        content: "Compatibilidade com a vaga, análise de palavras-chave e currículo ATS em minutos.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  { title: "Envie seu currículo", text: "Faça upload em PDF/DOCX ou preencha manualmente." },
  { title: "Adicione a vaga", text: "Cole a descrição completa da oportunidade desejada." },
  { title: "Gere seu currículo otimizado", text: "Receba o match, as melhorias e o currículo ATS." },
];

const benefits = [
  { icon: Target, title: "Match inteligente com vagas", text: "Score de compatibilidade por categoria." },
  { icon: FileCheck2, title: "Currículos personalizados", text: "Uma versão adaptada para cada vaga." },
  { icon: BarChart3, title: "Otimização ATS", text: "Checklist e score de leitura automatizada." },
  { icon: KeyRound, title: "Análise de palavras-chave", text: "Veja o que falta e o que já está lá." },
  { icon: Download, title: "Download rápido", text: "Baixe em PDF ou DOCX prontos para envio." },
  { icon: ShieldCheck, title: "Sem cadastro", text: "Use na hora; os dados ficam no seu navegador." },
];

function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="size-3.5" /> Análise com inteligência artificial
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Encontre vagas que combinam com você e adapte seu currículo para cada oportunidade.
          </h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Compare seu currículo com uma vaga, descubra seu nível de compatibilidade e gere uma
            versão otimizada para ATS em poucos minutos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/analisar">
                Começar agora <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/meu-curriculo">Preencher meu currículo</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Sem login, sem cadastro e sem e-mail. Seus dados ficam salvos apenas no seu navegador.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold">Como funciona</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title}>
                <CardHeader>
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <CardTitle className="mt-3 text-base">{s.title}</CardTitle>
                  <CardDescription>{s.text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold">Benefícios</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title}>
              <CardContent className="pt-6">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <b.icon className="size-4" />
                </span>
                <h3 className="mt-3 font-medium">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-accent/40">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Prepare seu currículo para a próxima oportunidade.
          </h2>
          <Button asChild size="lg" className="mt-6">
            <Link to="/analisar">
              Começar agora <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
