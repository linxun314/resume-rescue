// components/JobCard.tsx - 岗位推荐卡片（仅展示推荐，含反馈）
'use client';

import { JobRecommendationAdvanced } from '@/lib/jobRecommenderAdvanced';
import JobFeedback from './JobFeedback';

interface JobCardProps {
  job: JobRecommendationAdvanced;
  position: number;
  scenario: string;
}

export default function JobCard({ job, position, scenario }: JobCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: { text: '入门友好', color: 'bg-green-100 text-green-700' },
      medium: { text: '有一定门槛', color: 'bg-yellow-100 text-yellow-700' },
      hard: { text: '难度较高', color: 'bg-red-100 text-red-700' },
    };
    return labels[difficulty as keyof typeof labels] || labels.easy;
  };

  const getConfidenceBadge = (confidence: string) => {
    const badges = {
      high: { text: '高置信', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
      medium: { text: '中置信', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      low: { text: '低置信', color: 'bg-gray-50 text-gray-500 border-gray-200' },
    };
    return badges[confidence as keyof typeof badges] || badges.low;
  };

  const difficultyInfo = getDifficultyLabel(job.difficulty);
  const confidenceInfo = getConfidenceBadge(job.confidence);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-gray-400 text-sm">#{position}</span>
            <h4 className="font-medium text-gray-900">{job.jobTitle}</h4>
            <span className={`px-2 py-0.5 rounded text-xs ${difficultyInfo.color}`}>
              {difficultyInfo.text}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-xs border ${confidenceInfo.color}`}>
              {confidenceInfo.text}
            </span>
          </div>
          <p className="text-sm text-gray-500">{job.category} · {job.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium shrink-0 ${getScoreColor(job.matchScore)}`}>
          匹配 {job.matchScore}%
        </div>
      </div>

      <div className="mb-3">
        <div className="flex flex-col gap-1">
          {job.matchReasons.map((reason, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded"
            >
              <span>✓</span>
              {reason}
            </span>
          ))}
        </div>
      </div>

      <JobFeedback
        jobId={job.id}
        jobTitle={job.jobTitle}
        matchScore={job.matchScore}
        position={position}
      />
    </div>
  );
}
