// lib/feedbackService.ts - 反馈数据存储与分析

import { JobFeedback, OverallFeedback, FeedbackType } from './feedbackTypes';

const FEEDBACK_KEY = 'job_feedback_history';

function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('anonymous_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('anonymous_id', id);
  }
  return id;
}

export function saveJobFeedback(feedback: Omit<JobFeedback, 'id' | 'timestamp' | 'anonymousId'>) {
  const entry: JobFeedback = {
    ...feedback,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    anonymousId: getAnonymousId(),
  };

  const history = getAllFeedback();
  history.push(entry);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(history));

  return entry;
}

export function saveOverallFeedback(feedback: Omit<OverallFeedback, 'id' | 'timestamp' | 'anonymousId'>) {
  const entry: OverallFeedback = {
    ...feedback,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    anonymousId: getAnonymousId(),
  };

  const history = getAllFeedback();
  history.push(entry);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(history));

  return entry;
}

export function getAllFeedback(): (JobFeedback | OverallFeedback)[] {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(FEEDBACK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function analyzeJobFeedback(feedbacks: JobFeedback[]) {
  const total = feedbacks.length;
  if (total === 0) {
    return { helpfulRate: 0, notAccurateRate: 0, notInterestedRate: 0, topProblematic: [] };
  }

  const counts: Record<FeedbackType, number> = {
    helpful: 0,
    not_accurate: 0,
    not_interested: 0,
  };

  const jobNegatives: Record<string, { jobTitle: string; count: number }> = {};

  for (const f of feedbacks) {
    counts[f.feedbackType]++;
    if (f.feedbackType !== 'helpful') {
      if (!jobNegatives[f.jobId]) {
        jobNegatives[f.jobId] = { jobTitle: f.jobTitle, count: 0 };
      }
      jobNegatives[f.jobId].count++;
    }
  }

  const topProblematic = Object.entries(jobNegatives)
    .map(([jobId, data]) => ({ jobId, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    helpfulRate: Math.round((counts.helpful / total) * 100),
    notAccurateRate: Math.round((counts.not_accurate / total) * 100),
    notInterestedRate: Math.round((counts.not_interested / total) * 100),
    topProblematic,
  };
}
