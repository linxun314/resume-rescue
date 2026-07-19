// components/JobRecommendation.tsx - 实习岗位智能推荐（仅展示推荐）
'use client';

import { useState, useEffect, useMemo } from 'react';
import { recommendJobsAdvanced, UserAnswer } from '@/lib/jobRecommenderAdvanced';
import { track } from '@/lib/analytics';
import JobCard from './JobCard';
import OverallFeedback from './OverallFeedback';

interface JobRecommendationProps {
  answers: Record<string, string>;
  questions: { id: string; question: string }[];
  scenario: string;
}

export default function JobRecommendationSection({ answers, questions, scenario }: JobRecommendationProps) {
  const [hasTracked, setHasTracked] = useState(false);

  const userAnswers: UserAnswer[] = useMemo(() => {
    return Object.entries(answers)
      .filter(([, value]) => value && value.trim())
      .map(([key, value]) => {
        const question = questions.find(q => q.id === key);
        return {
          id: key,
          question: question?.question || key,
          answer: value,
        };
      });
  }, [answers, questions]);

  const recommendations = useMemo(() => recommendJobsAdvanced(userAnswers), [userAnswers]);

  const categories = useMemo(
    () => [...new Set(recommendations.map(r => r.category))],
    [recommendations]
  );

  useEffect(() => {
    if (recommendations.length > 0 && !hasTracked) {
      const topMatch = recommendations[0];
      track('job_recommendation_shown', {
        count: recommendations.length,
        categories: categories.join(','),
        top_match: topMatch?.jobTitle || '',
        top_score: topMatch?.matchScore || 0,
        scenario,
      });
      setHasTracked(true);
    }
  }, [recommendations, hasTracked, categories, scenario]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-purple-500">💡</span>
          根据你的经历，推荐以下实习岗位
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          基于{recommendations.length}个岗位匹配，匹配度越高越适合你
        </p>
      </div>

      <div className="space-y-3 mt-4">
        {recommendations.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            position={index + 1}
            scenario={scenario}
          />
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">
          <span className="font-medium">📌 使用提示：</span>
          以上推荐基于你的回答生成，仅供参考。建议在Boss直聘、实习僧等平台搜索相关岗位，找到最适合你的机会。
        </p>
      </div>

      <OverallFeedback
        recommendationCount={recommendations.length}
        categories={categories}
      />
    </div>
  );
}
