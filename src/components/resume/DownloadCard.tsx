import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { downloadDocx, downloadPdf, resumeStats } from "@/lib/export-resume";
import type { GeneratedResumeRecord } from "@/types/resume";

export function DownloadCard({ record }: { record: GeneratedResumeRecord }) {
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null);
  const stats = resumeStats(record.resume);
  const base = `curriculo-ats-${(record.role || "vaga").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const run = async (kind: "pdf" | "docx") => {
    setBusy(kind);
    try {
      if (kind === "pdf") await downloadPdf(record.resume, `${base}.pdf`);
      else await downloadDocx(record.resume, `${base}.docx`);
      toast.success("Download iniciado.");
    } catch {
      toast.error("Não foi possível gerar o arquivo.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Baixar currículo ATS</CardTitle>
        <CardDescription>Seu currículo está pronto para envio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="ATS Score" value={`${Math.round(record.atsScore)}/100`} />
          <Stat label="Páginas" value={String(stats.pages)} />
          <Stat
            label="Palavras-chave"
            value={String(record.analysis.skillsMatch?.length ?? 0)}
          />
          <Stat label="Compatibilidade" value={`${Math.round(record.matchScore)}%`} />
        </div>
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void run("pdf")} disabled={busy !== null}>
            <Download className="size-4" /> Baixar currículo ATS em PDF
          </Button>
          <Button variant="outline" onClick={() => void run("docx")} disabled={busy !== null}>
            <FileText className="size-4" /> Baixar currículo em DOCX
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
