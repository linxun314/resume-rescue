// lib/jobRecommender.ts - 实习岗位推荐算法

import JOB_MATCHING_RULES, { JobMatchingRule } from './jobMatchingRules';

export interface UserAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface JobRecommendation {
  id: string;
  category: string;
  jobTitle: string;
  searchKeywords: string[];
  matchScore: number;
  matchReasons: string[];
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  searchUrl: string;
}

function generateSearchUrl(keywords: string[]): string {
  const primaryKeyword = keywords[0];
  return `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(primaryKeyword)}`;
}

function calculateMatchScore(
  rule: JobMatchingRule,
  answers: UserAnswer[]
): { score: number; reasons: string[] } {
  let totalScore = 0;
  const matchedReasons: string[] = [];
  const matchedTriggers: Set<string> = new Set();

  for (const answer of answers) {
    const text = answer.answer.toLowerCase();

    if (rule.triggers.keywords) {
      for (const keyword of rule.triggers.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          totalScore += 15;
          matchedTriggers.add('keyword');
        }
      }
    }

    if (rule.triggers.courses) {
      for (const course of rule.triggers.courses) {
        if (text.includes(course.toLowerCase())) {
          totalScore += 12;
          matchedTriggers.add('course');
        }
      }
    }

    if (rule.triggers.activities) {
      for (const activity of rule.triggers.activities) {
        if (text.includes(activity.toLowerCase())) {
          totalScore += 15;
          matchedTriggers.add('activity');
        }
      }
    }

    if (rule.triggers.praised) {
      for (const praise of rule.triggers.praised) {
        if (text.includes(praise.toLowerCase())) {
          totalScore += 10;
          matchedTriggers.add('praised');
        }
      }
    }

    if (rule.triggers.helped) {
      for (const help of rule.triggers.helped) {
        if (text.includes(help.toLowerCase())) {
          totalScore += 12;
          matchedTriggers.add('helped');
        }
      }
    }

    if (rule.triggers.selfLearned) {
      for (const learned of rule.triggers.selfLearned) {
        if (text.includes(learned.toLowerCase())) {
          totalScore += 15;
          matchedTriggers.add('selfLearned');
        }
      }
    }
  }

  if (matchedTriggers.size > 0) {
    matchedReasons.push(rule.matchReasonTemplate);
  }

  const finalScore = matchedTriggers.size > 0
    ? Math.min(rule.baseScore + totalScore, 98)
    : 0;

  return { score: finalScore, reasons: matchedReasons };
}

export function recommendJobs(answers: UserAnswer[]): JobRecommendation[] {
  if (!answers || answers.length === 0) {
    return [];
  }

  const recommendations: JobRecommendation[] = [];

  for (const rule of JOB_MATCHING_RULES) {
    const { score, reasons } = calculateMatchScore(rule, answers);
    if (score >= 50 && reasons.length > 0) {
      recommendations.push({
        id: rule.id,
        category: rule.category,
        jobTitle: rule.jobTitle,
        searchKeywords: rule.searchKeywords,
        matchScore: score,
        matchReasons: reasons,
        description: rule.description,
        difficulty: rule.difficulty,
        searchUrl: generateSearchUrl(rule.searchKeywords),
      });
    }
  }

  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  // 每个大类最多1个，避免同类型重复
  const seenCategories = new Set<string>();
  const filtered: JobRecommendation[] = [];
  for (const rec of recommendations) {
    if (!seenCategories.has(rec.category)) {
      seenCategories.add(rec.category);
      filtered.push(rec);
    }
  }

  return filtered.slice(0, 5);
}

export function getRecommendationStats(recommendations: JobRecommendation[]) {
  return {
    total: recommendations.length,
    categories: [...new Set(recommendations.map(r => r.category))],
    topMatch: recommendations[0]?.jobTitle || null,
    topScore: recommendations[0]?.matchScore || 0,
    avgScore: recommendations.length > 0
      ? Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)
      : 0,
  };
}
