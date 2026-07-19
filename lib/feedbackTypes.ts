// lib/feedbackTypes.ts - 反馈数据类型定义

export type FeedbackType = 'helpful' | 'not_accurate' | 'not_interested';

export interface JobFeedback {
  id: string;
  jobId: string;
  jobTitle: string;
  feedbackType: FeedbackType;
  timestamp: number;
  anonymousId?: string;
  matchScore: number;
  position: number;
  scenario: string;
  detailedFeedback?: string;
  expectedJob?: string;
}

export interface OverallFeedback {
  id: string;
  timestamp: number;
  anonymousId?: string;
  overallSatisfaction: number;
  recommendationCount: 'too_few' | 'appropriate' | 'too_many';
  missingCategories?: string[];
  freeFeedback?: string;
}
