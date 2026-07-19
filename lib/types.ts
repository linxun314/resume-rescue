// lib/types.ts - 共享类型定义

export interface ConfidenceBoost {
  hidden_value: string;
  evidence: string;
  reassurance: string;
  growth_mindset: string;
  abilities: string[];
}

export interface ResumeExperience {
  title: string;
  organization: string;
  role: string;
  period: string;
  bullets: string[];
  real_ability?: string;
  gap?: string;
}

export interface JobFit {
  match_level: string;
  relevant_experiences: string[];
  transferable_experiences: string[];
  gap_analysis: string;
  suggestion: string;
}

export interface ResumeResult {
  confidence_boost: ConfidenceBoost;
  summary: string;
  experiences: ResumeExperience[];
  skills: {
    professional: string[];
    general: string[];
  };
  interview_tips: string[];
  job_fit?: JobFit;
}
