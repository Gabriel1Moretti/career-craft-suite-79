import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AtsPanel } from "@/components/ats/AtsPanel";
import { MatchResults } from "@/components/matchmaking/MatchResults";
import { DownloadCard } from "@/components/resume/DownloadCard";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeSource } from "@/components/resume/ResumeSource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeMatch } from "@/lib/analysis.functions";
import { hasResumeContent, resumeToText } from "@/lib/resume-text";
import { saveRecord, setState, updateRecordResume, useAppState } from "@/lib/store";
import { emptyResume, uid, type AnalysisResult, type Resume } from "@/types/resume";

export const Route = createFileRoute("/analisar")({
  head: () => ({
    meta: [
      { title: "Analisar vaga — MatchCV" },
      {
        name: "description",
        content:
          "Fluxo guiado: currículo, vaga, match, currículo ATS e download. Sem cadastro necessário.",
      },
      { property: "og:title", content: "Analisar vaga — MatchCV" },
      {
        property: "og:description",
        content: "Compare currículo e vaga e gere um currículo otimizado para ATS.",
      },
    ],
  }),
  component: AnalyzePage,
});

const STEPS = ["Meu currículo", "Vaga", "Match", "Currículo ATS", "Download"];

function Stepper({ step, onSelect }: { step: number; onSelect: (i: number) => void }) {
  return (
    <ol className="mb-8 flex flex-wrap gap-2">
      {STEPS.map((label, i) => {
        const state = i === step ? "current" : i < step ? "done" : "todo";
        return (
          <li key={label}>
            <button
              type="button"
              onClick={() => i <= step && onSelect(i)}
              disabled={i > step}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                state === "current"
                  ? "border-primary bg-primary text-primary-foreground"
                  : state === "done"
                    ? "border-primary/40 bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground"
              }`}
            >
              <span className="font-semibold">{i + 1}.</span> {label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function AnalyzePage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const resume = useAppState((s) => s.resume);
  const rawResumeText = useAppState((s) => s.rawResumeText);
  const job = useAppState((s) => s.job);
  const record = useAppState((s) => s.records.find((r) => r.id === recordId) ?? null);
  const analyze = useServerFn(analyzeMatch);

  const runAnalysis = async () => {
    if (!hasResumeContent(resume, rawResumeText)) {
      toast.error("Adicione seu currículo antes de analisar.");
      setStep(0);
      return;
    }
    if (job.description.trim().length < 40) {
      toast.error("Cole a descrição da vaga (pelo menos algumas linhas).");
      return;
    }
    setLoading(true);
    setStep(2);
    try {
      const result = (await analyze({
        data: { resumeText: resumeToText(resume, rawResumeText), job },
      })) as AnalysisResult;

      const optimized: Resume = {
        ...emptyResume,
        ...(result.optimizedResume ?? {}),
        personal: { ...emptyResume.personal, ...(result.optimizedResume?.personal ?? {}) },
      };
      optimized.experiences = (optimized.experiences ?? []).map((e) => ({ ...e, id: e.id || uid() }));
      optimized.education = (optimized.education ?? []).map((e) => ({ ...e, id: e.id || uid() }));
      optimized.projects = (optimized.projects ?? []).map((e) => ({ ...e, id: e.id || uid() }));
      optimized.languages = (optimized.languages ?? []).map((e) => ({ ...e, id: e.id || uid() }));
      optimized.certifications = (optimized.certifications ?? []).map((e) => ({
        ...e,
        id: e.id || uid(),
      }));

      const id = uid();
      saveRecord({
        id,
        createdAt: new Date().toISOString(),
        role: job.role || optimized.personal.title || "Vaga",
        company: job.company || "Empresa não informada",
        matchScore: result.matchScore ?? 0,
        atsScore: result.atsScore ?? 0,
        job,
        analysis: result,
        resume: optimized,
      });
      setRecordId(id);
      toast.success("Análise concluída!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível concluir a análise.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Analisar uma vaga</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Um fluxo guiado para comparar seu currículo com a vaga e gerar a versão ATS.
        </p>
      </div>

      <Stepper step={step} onSelect={setStep} />

      {step === 0 && (
        <div className="space-y-6">
          <ResumeSource />
          <div className="flex justify-end">
            <Button
              onClick={() => {
                if (!hasResumeContent(resume, rawResumeText)) {
                  toast.error("Envie um arquivo ou preencha o currículo manualmente.");
                  return;
                }
                setStep(1);
              }}
            >
              Continuar <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descrição da vaga</CardTitle>
              <CardDescription>
                Quanto mais completa a descrição, mais precisa fica a análise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={12}
                value={job.description}
                placeholder="Cole aqui a descrição completa da vaga..."
                onChange={(e) => setState({ job: { ...job, description: e.target.value } })}
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <JobField
                  label="Empresa"
                  value={job.company}
                  onChange={(v) => setState({ job: { ...job, company: v } })}
                />
                <JobField
                  label="Cargo"
                  value={job.role}
                  onChange={(v) => setState({ job: { ...job, role: v } })}
                />
                <JobField
                  label="Localização"
                  value={job.location}
                  onChange={(v) => setState({ job: { ...job, location: v } })}
                />
                <JobField
                  label="Senioridade"
                  value={job.seniority}
                  onChange={(v) => setState({ job: { ...job, seniority: v } })}
                />
                <JobField
                  label="Modelo de trabalho"
                  value={job.workModel}
                  onChange={(v) => setState({ job: { ...job, workModel: v } })}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ArrowLeft className="size-4" /> Voltar
            </Button>
            <Button onClick={() => void runAnalysis()} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Analisar vaga
            </Button>
          </div>
        </div>
      )}

      {step === 2 &&
        (loading || !record ? (
          <AnalysisSkeleton />
        ) : (
          <div className="space-y-6">
            <MatchResults analysis={record.analysis} />
            <div className="flex flex-wrap justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4" /> Editar vaga
              </Button>
              <Button onClick={() => setStep(3)}>
                Criar currículo para esta vaga <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ))}

      {step === 3 && record && (
        <div className="space-y-6">
          <AtsPanel analysis={record.analysis} />
          <Alert>
            <AlertTitle>Somente informações verdadeiras</AlertTitle>
            <AlertDescription>
              A versão gerada reorganiza e melhora o que você informou. Revise e ajuste livremente
              antes de baixar.
            </AlertDescription>
          </Alert>
          <ResumeEditor
            resume={record.resume}
            onChange={(r) => updateRecordResume(record.id, r)}
          />
          <div className="flex flex-wrap justify-between gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="size-4" /> Voltar ao match
            </Button>
            <Button onClick={() => setStep(4)}>
              Ir para o download <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && record && (
        <div className="space-y-6">
          <DownloadCard record={record} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent className="bg-muted/40 p-4">
              <ResumePreview resume={record.resume} />
            </CardContent>
          </Card>
          <div className="flex flex-wrap justify-between gap-3">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ArrowLeft className="size-4" /> Editar currículo
            </Button>
            <Button asChild variant="secondary">
              <Link to="/curriculos">Ver meus currículos</Link>
            </Button>
          </div>
        </div>
      )}

      {step >= 3 && !record && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Faça uma análise primeiro para gerar o currículo.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function JobField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `job-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label} (opcional)</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <Skeleton className="size-40 rounded-full" />
          <Skeleton className="h-4 w-56" />
          <p className="text-sm text-muted-foreground">Analisando currículo e vaga com IA...</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 py-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
