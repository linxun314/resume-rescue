// components/OverallFeedback.tsx - 岗位推荐整体反馈组件
'use client';

import { useState } from 'react';
import { saveOverallFeedback } from '@/lib/feedbackService';
import { track } from '@/lib/analytics';

interface OverallFeedbackProps {
  recommendationCount: number;
  categories: string[];
}

export default function OverallFeedback({
  recommendationCount,
  categories,
}: OverallFeedbackProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [satisfaction, setSatisfaction] = useState(0);
  const [countOpinion, setCountOpinion] = useState<string>('');
  const [freeFeedback, setFreeFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    saveOverallFeedback({
      overallSatisfaction: satisfaction,
      recommendationCount: countOpinion as 'too_few' | 'appropriate' | 'too_many',
      freeFeedback: freeFeedback || undefined,
    });

    track('job_recommendation_overall_feedback', {
      satisfaction,
      count_opinion: countOpinion,
      recommendation_count: recommendationCount,
      categories: categories.join(','),
    });

    setSubmitted(true);
    setShowFeedback(false);
  };

  if (submitted) {
    return (
      <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
        <p className="text-sm text-green-700">感谢你的反馈！这将帮助我们优化推荐。</p>
      </div>
    );
  }

  if (!showFeedback) {
    return (
      <button
        onClick={() => setShowFeedback(true)}
        className="w-full mt-4 p-3 bg-gray-50 text-sm text-gray-500 rounded-lg hover:bg-gray-100 transition-colors text-left"
      >
        对岗位推荐有其他建议？<span className="text-purple-500 ml-1">点击反馈</span>
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-3 text-sm">整体评价</h4>

      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">你对本次岗位推荐的整体满意度？</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => setSatisfaction(score)}
              className={`w-8 h-8 rounded text-sm transition-colors ${
                satisfaction >= score
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              {score <= satisfaction ? '★' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">推荐的岗位数量合适吗？</p>
        <div className="flex gap-2">
          {[
            { value: 'too_few', label: '太少了' },
            { value: 'appropriate', label: '刚好' },
            { value: 'too_many', label: '太多了' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCountOpinion(opt.value)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                countOpinion === opt.value
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">其他建议（可选）</p>
        <textarea
          value={freeFeedback}
          onChange={(e) => setFreeFeedback(e.target.value)}
          placeholder="你希望看到什么样的岗位？有什么改进建议？"
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300"
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowFeedback(false)}
          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={satisfaction === 0}
          className="px-3 py-1 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          提交反馈
        </button>
      </div>
    </div>
  );
}
