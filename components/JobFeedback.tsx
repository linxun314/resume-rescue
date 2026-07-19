// components/JobFeedback.tsx - 单个岗位推荐的反馈组件
'use client';

import { useState } from 'react';
import { FeedbackType } from '@/lib/feedbackTypes';
import { track } from '@/lib/analytics';

interface JobFeedbackProps {
  jobId: string;
  jobTitle: string;
  matchScore: number;
  position: number;
  onFeedbackSubmit?: (feedback: FeedbackType) => void;
}

export default function JobFeedback({
  jobId,
  jobTitle,
  matchScore,
  position,
  onFeedbackSubmit,
}: JobFeedbackProps) {
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailText, setDetailText] = useState('');

  const options = [
    { type: 'helpful' as FeedbackType, label: '有帮助', icon: '👍' },
    { type: 'not_accurate' as FeedbackType, label: '不太准', icon: '👎' },
    { type: 'not_interested' as FeedbackType, label: '不感兴趣', icon: '🙅' },
  ];

  const handleFeedback = (type: FeedbackType) => {
    setSelected(type);
    onFeedbackSubmit?.(type);

    track('job_feedback_submitted', {
      job_id: jobId,
      job_title: jobTitle,
      feedback_type: type,
      match_score: matchScore,
      position,
    });

    if (type !== 'helpful') {
      setShowDetail(true);
    }
  };

  const handleDetailSubmit = () => {
    if (detailText.trim()) {
      track('job_feedback_detailed', {
        job_id: jobId,
        job_title: jobTitle,
        feedback_type: selected || 'unknown',
        detailed_feedback: detailText,
      });
    }
    setShowDetail(false);
  };

  if (selected === 'helpful' && !showDetail) {
    return (
      <div className="mt-2 text-xs text-green-600">
        感谢反馈！
      </div>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-50">
      {!selected && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">有帮助吗？</span>
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleFeedback(opt.type)}
              className="px-2 py-0.5 text-xs rounded-md bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      )}

      {showDetail && (
        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">
            能告诉我们你期望什么样的岗位吗？
          </p>
          <textarea
            value={detailText}
            onChange={(e) => setDetailText(e.target.value)}
            placeholder="例如：我其实更想做产品类岗位..."
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-300"
            rows={2}
          />
          <div className="flex justify-end gap-1 mt-1">
            <button
              onClick={() => setShowDetail(false)}
              className="px-2 py-0.5 text-xs text-gray-500"
            >
              跳过
            </button>
            <button
              onClick={handleDetailSubmit}
              className="px-2 py-0.5 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              提交
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
