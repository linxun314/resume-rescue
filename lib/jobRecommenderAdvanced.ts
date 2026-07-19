// lib/jobRecommenderAdvanced.ts - 高级岗位推荐算法

import JOB_MATCHING_RULES, { JobMatchingRule } from './jobMatchingRules';

export interface UserAnswer {
  id: string;
  question: string;
  answer: string;
}

interface MatchDetail {
  type: 'keyword' | 'course' | 'activity' | 'praised' | 'helped' | 'selfLearned';
  matched: string;
  source: string;
  weight: number;
}

export interface JobRecommendationAdvanced {
  id: string;
  category: string;
  jobTitle: string;
  searchKeywords: string[];
  matchScore: number;
  matchReasons: string[];
  matchDetails: MatchDetail[];
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  searchUrl: string;
  confidence: 'high' | 'medium' | 'low';
}

// 同义词扩展表
const SYNONYMS: Record<string, string[]> = {
  '编程': ['写代码', '程序', '开发', 'coding'],
  '网站': ['网页', 'web'],
  '前端': ['网页开发', 'web前端'],
  '后端': ['服务器开发', '服务端'],
  '公众号': ['微信公众号', '推文'],
  '小红书': ['小红书运营'],
  '抖音': ['短视频', 'tiktok'],
  '社群': ['微信群', 'qq群', '社区', '群管理'],
  'ps': ['photoshop', '修图', '作图'],
  '设计': ['美工', '视觉设计'],
  '剪辑': ['视频剪辑', '后期'],
  '细心': ['认真', '仔细'],
  '沟通能力': ['表达能力', '沟通'],
  '组织能力': ['协调能力', '统筹'],
  '学习能力强': ['学习能力', '自学', '快速学习'],
  '学生会': ['学生组织'],
  '社团': ['学生社团'],
  '班长': ['班干部', '班委', '班级管理'],
};

function preprocessAndExpand(text: string): string[] {
  const cleaned = text.toLowerCase().replace(/[，。！？、；：""''（）【】《》\s]+/g, ' ');
  const tokens = cleaned.split(/\s+/).filter(t => t.length > 0);
  const expanded = [...tokens];

  for (const token of tokens) {
    if (SYNONYMS[token]) {
      expanded.push(...SYNONYMS[token]);
    }
  }

  return expanded;
}

function matchInText(tokens: string[], keyword: string): boolean {
  const kw = keyword.toLowerCase();
  return tokens.some(t => t.includes(kw) || kw.includes(t));
}

const TRIGGER_WEIGHTS = {
  keywords: 15,
  courses: 12,
  activities: 18,
  praised: 10,
  helped: 15,
  selfLearned: 18,
};

function calculateMatch(
  rule: JobMatchingRule,
  answers: UserAnswer[]
): { score: number; matchedTriggers: string[]; details: MatchDetail[] } {
  let totalScore = 0;
  const matchedTriggers = new Set<string>();
  const details: MatchDetail[] = [];

  for (const answer of answers) {
    const tokens = preprocessAndExpand(answer.answer);

    const triggerMap: [string, string[] | undefined, number][] = [
      ['keyword', rule.triggers.keywords, TRIGGER_WEIGHTS.keywords],
      ['course', rule.triggers.courses, TRIGGER_WEIGHTS.courses],
      ['activity', rule.triggers.activities, TRIGGER_WEIGHTS.activities],
      ['praised', rule.triggers.praised, TRIGGER_WEIGHTS.praised],
      ['helped', rule.triggers.helped, TRIGGER_WEIGHTS.helped],
      ['selfLearned', rule.triggers.selfLearned, TRIGGER_WEIGHTS.selfLearned],
    ];

    for (const [type, list, weight] of triggerMap) {
      if (!list) continue;
      for (const kw of list) {
        if (matchInText(tokens, kw)) {
          totalScore += weight;
          matchedTriggers.add(type);
          details.push({
            type: type as MatchDetail['type'],
            matched: kw,
            source: answer.id,
            weight,
          });
        }
      }
    }
  }

  return { score: totalScore, matchedTriggers: [...matchedTriggers], details };
}

function calculateFinalScore(
  rule: JobMatchingRule,
  rawScore: number,
  dimensionCount: number,
  detailCount: number
): number {
  if (dimensionCount === 0) return 0;

  let finalScore = rule.baseScore;
  finalScore += dimensionCount * 5;
  finalScore += Math.min(detailCount * 3, 20);

  const difficultyAdjust = { easy: 5, medium: 0, hard: -5 };
  finalScore += difficultyAdjust[rule.difficulty];

  return Math.max(50, Math.min(98, finalScore));
}

function generateMatchReasons(
  rule: JobMatchingRule,
  details: MatchDetail[],
  answers: UserAnswer[]
): string[] {
  const grouped: Record<string, string[]> = {
    activity: [], selfLearned: [], course: [], helped: [], praised: [], keyword: [],
  };

  for (const d of details) {
    if (!grouped[d.type].includes(d.matched)) {
      grouped[d.type].push(d.matched);
    }
  }

  const reasons: string[] = [];

  if (grouped.activity.length > 0) {
    const items = grouped.activity.slice(0, 2);
    reasons.push(`你的「${items.join('、')}」经历与该岗位高度相关`);
  }
  if (grouped.selfLearned.length > 0) {
    const items = grouped.selfLearned.slice(0, 2);
    reasons.push(`你自学的「${items.join('、')}」正是这个岗位的核心技能`);
  }
  if (grouped.course.length > 0) {
    const items = grouped.course.slice(0, 2);
    reasons.push(`你学过的「${items.join('、')}」课程可以支撑岗位工作`);
  }
  if (grouped.helped.length > 0) {
    const items = grouped.helped.slice(0, 2);
    reasons.push(`你帮他人${items.join('、')}说明你具备该岗位需要的服务意识`);
  }
  if (grouped.praised.length > 0) {
    const items = grouped.praised.slice(0, 2);
    reasons.push(`别人夸你「${items.join('、')}」，这些品质在该岗位中很受用`);
  }
  if (grouped.keyword.length > 0 && reasons.length === 0) {
    reasons.push(rule.matchReasonTemplate);
  }

  return reasons.slice(0, 3);
}

function generateSearchUrl(keywords: string[]): string {
  return `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(keywords[0])}`;
}

export function recommendJobsAdvanced(answers: UserAnswer[]): JobRecommendationAdvanced[] {
  if (!answers || answers.length === 0) return [];

  const recommendations: JobRecommendationAdvanced[] = [];

  for (const rule of JOB_MATCHING_RULES) {
    const { score, matchedTriggers, details } = calculateMatch(rule, answers);
    const finalScore = calculateFinalScore(rule, score, matchedTriggers.length, details.length);

    if (finalScore >= 50 && matchedTriggers.length > 0) {
      let confidence: 'high' | 'medium' | 'low';
      if (finalScore >= 80 && matchedTriggers.length >= 3) {
        confidence = 'high';
      } else if (finalScore >= 65 && matchedTriggers.length >= 2) {
        confidence = 'medium';
      } else {
        confidence = 'low';
      }

      recommendations.push({
        id: rule.id,
        category: rule.category,
        jobTitle: rule.jobTitle,
        searchKeywords: rule.searchKeywords,
        matchScore: finalScore,
        matchReasons: generateMatchReasons(rule, details, answers),
        matchDetails: details,
        description: rule.description,
        difficulty: rule.difficulty,
        searchUrl: generateSearchUrl(rule.searchKeywords),
        confidence,
      });
    }
  }

  const confidenceOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => {
    if (confidenceOrder[a.confidence] !== confidenceOrder[b.confidence]) {
      return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    }
    return b.matchScore - a.matchScore;
  });

  const seenCategories = new Set<string>();
  const filtered: JobRecommendationAdvanced[] = [];
  for (const rec of recommendations) {
    if (!seenCategories.has(rec.category)) {
      seenCategories.add(rec.category);
      filtered.push(rec);
    }
  }

  return filtered.slice(0, 5);
}
