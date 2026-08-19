export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period?: string;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period?: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  year?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  link?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface Resume {
  personal: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: LanguageItem[];
  certifications: Certification[];
  courses: string[];
  projects: ProjectItem[];
}

export interface JobPosting {
  description: string;
  company: string;
  role: string;
  location: string;
  seniority: string;
  workModel: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  status: string;
  explanation: string;
}

export interface Recommendation {
  problem: string;
  why: string;
  suggestion: string;
}

export interface AtsCheckItem {
  item: string;
  ok: boolean;
}

export interface AnalysisResult {
  matchScore: number;
  atsScore: number;
  categories: CategoryScore[];
  skillsMatch: string[];
  missingSkills: string[];
  partialSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
  keywords: string[];
  atsChecklist: AtsCheckItem[];
  atsScoreExplanation: string;
  optimizedResume: Resume;
}

export interface GeneratedResumeRecord {
  id: string;
  createdAt: string;
  role: string;
  company: string;
  matchScore: number;
  atsScore: number;
  job: JobPosting;
  analysis: AnalysisResult;
  resume: Resume;
}

export const emptyResume: Resume = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
  },
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  courses: [],
  projects: [],
};

export const emptyJob: JobPosting = {
  description: "",
  company: "",
  role: "",
  location: "",
  seniority: "",
  workModel: "",
};

export const uid = () => Math.random().toString(36).slice(2, 10);
