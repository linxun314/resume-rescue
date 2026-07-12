/**
 * 简历范本数据类型定义
 */

// 基础信息类型
export interface BasicInfo {
  name: string;
  phone: string;
  email: string;
  location: string;
  education: string;
  major: string;
  graduationYear: string;
  targetPosition: string;
}

// 教育背景类型
export interface Education {
  school: string;
  major: string;
  degree: string;
  period: string;
  gpa?: string;
  courses?: string[];
  honors?: string[];
}

// STAR经历类型
export interface ExperienceItem {
  title: string;
  role: string;
  period: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags?: string[];
}

// 校园实践类型
export interface PracticeItem {
  organization: string;
  role: string;
  period: string;
  achievements: string[];
}

// 技能证书类型
export interface Skills {
  categories: {
    name: string;
    items: string[];
  }[];
}

// 自我评价类型
export interface SelfEvaluationItem {
  title: string;
  description: string;
}

// 完整简历类型
export interface Resume {
  id: string;
  title: string;
  description: string;
  targetJobs: string[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  writingTime: string;
  basicInfo: BasicInfo;
  education: Education;
  projectExperiences: ExperienceItem[];
  practiceExperiences?: PracticeItem[];
  skills: Skills;
  selfEvaluation: SelfEvaluationItem[];
  writingTips: string[];
  starExamples: {
    category: string;
    original: string;
    optimized: string;
  }[];
}

// 简历范本元数据类型
export interface ResumeMeta {
  id: string;
  title: string;
  description: string;
  tags: string[];
  targetJobs: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  writingTime: string;
  highlight?: boolean;
}
