import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { uid, type Resume } from "@/types/resume";

interface Props {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = `f-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function ResumeForm({ resume, onChange }: Props) {
  const set = (patch: Partial<Resume>) => onChange({ ...resume, ...patch });
  const setPersonal = (patch: Partial<Resume["personal"]>) =>
    set({ personal: { ...resume.personal, ...patch } });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nome completo"
            value={resume.personal.name}
            onChange={(v) => setPersonal({ name: v })}
          />
          <Field
            label="Cargo / título profissional"
            value={resume.personal.title}
            onChange={(v) => setPersonal({ title: v })}
          />
          <Field
            label="E-mail"
            value={resume.personal.email}
            onChange={(v) => setPersonal({ email: v })}
          />
          <Field
            label="Telefone"
            value={resume.personal.phone}
            onChange={(v) => setPersonal({ phone: v })}
          />
          <Field
            label="Localização"
            value={resume.personal.location}
            onChange={(v) => setPersonal({ location: v })}
          />
          <Field
            label="LinkedIn"
            value={resume.personal.linkedin}
            onChange={(v) => setPersonal({ linkedin: v })}
          />
          <Field
            label="Portfólio / GitHub"
            value={resume.personal.portfolio}
            onChange={(v) => setPersonal({ portfolio: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={resume.summary}
            placeholder="Descreva em poucas linhas sua trajetória, especialidades e objetivo profissional."
            onChange={(e) => set({ summary: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Experiência profissional</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              set({
                experiences: [
                  ...resume.experiences,
                  { id: uid(), role: "", company: "", location: "", period: "", description: "" },
                ],
              })
            }
          >
            <Plus className="size-4" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {resume.experiences.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma experiência adicionada ainda.</p>
          )}
          {resume.experiences.map((exp, i) => (
            <div key={exp.id} className="space-y-3">
              {i > 0 && <Separator />}
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Cargo"
                  value={exp.role}
                  onChange={(v) =>
                    set({
                      experiences: resume.experiences.map((e) =>
                        e.id === exp.id ? { ...e, role: v } : e,
                      ),
                    })
                  }
                />
                <Field
                  label="Empresa"
                  value={exp.company}
                  onChange={(v) =>
                    set({
                      experiences: resume.experiences.map((e) =>
                        e.id === exp.id ? { ...e, company: v } : e,
                      ),
                    })
                  }
                />
                <Field
                  label="Local"
                  value={exp.location ?? ""}
                  onChange={(v) =>
                    set({
                      experiences: resume.experiences.map((e) =>
                        e.id === exp.id ? { ...e, location: v } : e,
                      ),
                    })
                  }
                />
                <Field
                  label="Período"
                  placeholder="Jan 2022 - Atual"
                  value={exp.period ?? ""}
                  onChange={(v) =>
                    set({
                      experiences: resume.experiences.map((e) =>
                        e.id === exp.id ? { ...e, period: v } : e,
                      ),
                    })
                  }
                />
              </div>
              <Textarea
                rows={4}
                placeholder="Principais responsabilidades e resultados."
                value={exp.description ?? ""}
                onChange={(e) =>
                  set({
                    experiences: resume.experiences.map((x) =>
                      x.id === exp.id ? { ...x, description: e.target.value } : x,
                    ),
                  })
                }
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() =>
                  set({ experiences: resume.experiences.filter((e) => e.id !== exp.id) })
                }
              >
                <Trash2 className="size-4" /> Remover experiência
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Formação acadêmica</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              set({
                education: [
                  ...resume.education,
                  { id: uid(), degree: "", institution: "", period: "", description: "" },
                ],
              })
            }
          >
            <Plus className="size-4" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.education.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma formação adicionada ainda.</p>
          )}
          {resume.education.map((ed) => (
            <div key={ed.id} className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Curso / grau"
                value={ed.degree}
                onChange={(v) =>
                  set({
                    education: resume.education.map((e) =>
                      e.id === ed.id ? { ...e, degree: v } : e,
                    ),
                  })
                }
              />
              <Field
                label="Instituição"
                value={ed.institution}
                onChange={(v) =>
                  set({
                    education: resume.education.map((e) =>
                      e.id === ed.id ? { ...e, institution: v } : e,
                    ),
                  })
                }
              />
              <Field
                label="Período"
                value={ed.period ?? ""}
                onChange={(v) =>
                  set({
                    education: resume.education.map((e) =>
                      e.id === ed.id ? { ...e, period: v } : e,
                    ),
                  })
                }
              />
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() =>
                    set({ education: resume.education.filter((e) => e.id !== ed.id) })
                  }
                >
                  <Trash2 className="size-4" /> Remover
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Habilidades, idiomas e cursos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="skills">Habilidades (separadas por vírgula)</Label>
            <Textarea
              id="skills"
              rows={3}
              value={resume.skills.join(", ")}
              placeholder="React, TypeScript, SQL, Gestão de projetos"
              onChange={(e) =>
                set({
                  skills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="languages">Idiomas (ex.: Inglês - Avançado, separados por vírgula)</Label>
            <Input
              id="languages"
              value={resume.languages
                .map((l) => `${l.name}${l.level ? ` - ${l.level}` : ""}`)
                .join(", ")}
              onChange={(e) =>
                set({
                  languages: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => {
                      const [name, level] = s.split("-").map((x) => x.trim());
                      return { id: uid(), name: name ?? "", level: level ?? "" };
                    }),
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="certs">Certificações (separadas por vírgula)</Label>
            <Input
              id="certs"
              value={resume.certifications.map((c) => c.name).join(", ")}
              onChange={(e) =>
                set({
                  certifications: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((name) => ({ id: uid(), name, issuer: "", year: "" })),
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="courses">Cursos (separados por vírgula)</Label>
            <Input
              id="courses"
              value={resume.courses.join(", ")}
              onChange={(e) =>
                set({
                  courses: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Projetos</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              set({
                projects: [...resume.projects, { id: uid(), name: "", description: "", link: "" }],
              })
            }
          >
            <Plus className="size-4" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {resume.projects.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum projeto adicionado ainda.</p>
          )}
          {resume.projects.map((pr) => (
            <div key={pr.id} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Nome do projeto"
                  value={pr.name}
                  onChange={(v) =>
                    set({
                      projects: resume.projects.map((p) =>
                        p.id === pr.id ? { ...p, name: v } : p,
                      ),
                    })
                  }
                />
                <Field
                  label="Link"
                  value={pr.link ?? ""}
                  onChange={(v) =>
                    set({
                      projects: resume.projects.map((p) =>
                        p.id === pr.id ? { ...p, link: v } : p,
                      ),
                    })
                  }
                />
              </div>
              <Textarea
                rows={3}
                value={pr.description ?? ""}
                onChange={(e) =>
                  set({
                    projects: resume.projects.map((p) =>
                      p.id === pr.id ? { ...p, description: e.target.value } : p,
                    ),
                  })
                }
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => set({ projects: resume.projects.filter((p) => p.id !== pr.id) })}
              >
                <Trash2 className="size-4" /> Remover projeto
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
