import { FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { extractTextFromFile } from "@/lib/parse-upload";
import { setState, useAppState } from "@/lib/store";
import type { Resume } from "@/types/resume";

export function ResumeSource() {
  const resume = useAppState((s) => s.resume);
  const rawResumeText = useAppState((s) => s.rawResumeText);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const text = await extractTextFromFile(file);
      if (!text.trim()) throw new Error("Não conseguimos ler texto nesse arquivo.");
      setState({ rawResumeText: text });
      toast.success(`Currículo "${file.name}" carregado.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao ler o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-none sm:inline-grid sm:grid-flow-col">
        <TabsTrigger value="upload">Enviar arquivo</TabsTrigger>
        <TabsTrigger value="manual">Criar manualmente</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Envie seu currículo</CardTitle>
            <CardDescription>Aceitamos arquivos PDF, DOCX e TXT.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) void handleFile(file);
              }}
              className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                dragging ? "border-primary bg-accent" : "border-border hover:bg-muted/60"
              }`}
            >
              {loading ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : (
                <Upload className="size-6 text-primary" />
              )}
              <div>
                <p className="text-sm font-medium">
                  Arraste seu currículo aqui ou clique para selecionar um arquivo.
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX ou TXT até 10MB</p>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = "";
              }}
            />

            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-medium">
                <FileText className="size-4 text-primary" /> Texto do currículo
              </p>
              <Textarea
                rows={10}
                value={rawResumeText}
                placeholder="Ou cole aqui o conteúdo do seu currículo..."
                onChange={(e) => setState({ rawResumeText: e.target.value })}
              />
              {rawResumeText && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setState({ rawResumeText: "" })}
                >
                  Limpar texto
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manual" className="mt-4">
        <ResumeForm resume={resume} onChange={(r: Resume) => setState({ resume: r })} />
      </TabsContent>
    </Tabs>
  );
}
