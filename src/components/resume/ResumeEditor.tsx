import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Resume } from "@/types/resume";

export function ResumeEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (r: Resume) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Editor
        </h3>
        <ResumeForm resume={resume} onChange={onChange} />
      </div>
      <div className="lg:sticky lg:top-20 lg:self-start">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Preview em tempo real
        </h3>
        <ScrollArea className="h-[70vh] rounded-xl border border-border bg-muted/40 p-3">
          <ResumePreview resume={resume} />
        </ScrollArea>
      </div>
    </div>
  );
}
