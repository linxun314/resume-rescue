// components/JobSelector.tsx — 高端视觉重构
'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { recommendJobsAdvanced, UserAnswer } from '@/lib/jobRecommenderAdvanced';
import type { BasicInfo } from './BasicInfoForm';

interface JobSelectorProps {
  basicInfo: BasicInfo;
  answers: Record<string, string>;
  onConfirm: (selectedJob: string) => void;
  onBack: () => void;
}

function buildMatchAnswers(info: BasicInfo, qAnswers: Record<string, string>): UserAnswer[] {
  const result: UserAnswer[] = [];
  if (info.major) result.push({ id: 'major', question: '你的专业是什么', answer: info.major });
  if (!info.workInMajor) result.push({ id: 'cross', question: '是否跨专业求职', answer: '不想从事本专业 想跨行 跨专业' });
  if (info.skills) result.push({ id: 'skills', question: '你会什么技能', answer: info.skills });
  if (info.desiredJob) result.push({ id: 'desired', question: '你想要的岗位', answer: info.desiredJob });
  for (const [key, value] of Object.entries(qAnswers)) {
    if (value && value.trim()) result.push({ id: key, question: key, answer: value });
  }
  return result;
}

const scoreLabel = (s: number) => {
  if (s >= 80) return { text: '高匹配', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-100' };
  if (s >= 60) return { text: '中匹配', cls: 'bg-brand-50 text-brand-700 ring-brand-100' };
  return { text: '可尝试', cls: 'bg-surface-100 text-surface-500 ring-surface-200' };
};

const diffLabel = (d: string) => {
  const m: Record<string, { text: string; cls: string }> = {
    easy: { text: '入门友好', cls: 'bg-emerald-50 text-emerald-600' },
    medium: { text: '有一定门槛', cls: 'bg-amber-50 text-amber-600' },
    hard: { text: '难度较高', cls: 'bg-red-50 text-red-500' },
  };
  return m[d] || m.easy;
};

export default function JobSelector({ basicInfo, answers, onConfirm, onBack }: JobSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const recommendations = useMemo(
    () => recommendJobsAdvanced(buildMatchAnswers(basicInfo, answers)),
    [basicInfo, answers]
  );

  const hasCustomDesired = basicInfo.desiredJob.trim().length > 0;
  const customJobNotMatched = hasCustomDesired && !recommendations.some(
    r => r.jobTitle.includes(basicInfo.desiredJob) || basicInfo.desiredJob.includes(r.jobTitle)
  );

  const handleConfirm = () => {
    if (!selectedId) return;
    if (selectedId === 'custom') {
      onConfirm(basicInfo.desiredJob);
    } else {
      const job = recommendations.find(r => r.id === selectedId);
      if (job) onConfirm(job.jobTitle);
    }
  };

  return (
    <div className="relative min-h-[100dvh] py-8 md:py-16 px-4 safe-bottom overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-brand-50/40 blur-[120px] animate-orb-float" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-purple-50/30 blur-[100px] animate-orb-float" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Back */}
          <button
            onClick={onBack}
            className="btn-ghost mb-6 -ml-2"
            aria-label="返回修改信息"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-xs">返回修改信息</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <span className="eyebrow mb-3">岗位匹配</span>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 tracking-[-0.02em] mb-1">
              为你匹配了以下岗位
            </h1>
            <p className="text-surface-500 text-sm">选择一个你想尝试的方向，生成针对性简历</p>
          </div>

          {/* Job cards — z-axis cascade */}
          <div className="space-y-3 mb-8" role="radiogroup" aria-label="岗位选择">
            {recommendations.map((job, i) => {
              const isSelected = selectedId === job.id;
              const sc = scoreLabel(job.matchScore);
              const df = diffLabel(job.difficulty);
              return (
                <motion.button
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedId(job.id)}
                  role="radio"
                  aria-checked={isSelected}
                  className={`w-full text-left transition-all duration-500 ease-premium min-h-touch ${
                    isSelected
                      ? 'card-shell ring-brand-400 shadow-glow-brand'
                      : 'card'
                  }`}
                >
                  {isSelected ? (
                    <div className="card-core">
                      <JobCardContent job={job} sc={sc} df={df} />
                    </div>
                  ) : (
                    <JobCardContent job={job} sc={sc} df={df} />
                  )}
                </motion.button>
              );
            })}

            {/* Custom desired job */}
            {customJobNotMatched && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * recommendations.length, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedId('custom')}
                role="radio"
                aria-checked={selectedId === 'custom'}
                className={`w-full text-left transition-all duration-500 ease-premium min-h-touch ${
                  selectedId === 'custom'
                    ? 'card-shell ring-brand-400 shadow-glow-brand'
                    : 'card'
                }`}
              >
                {selectedId === 'custom' ? (
                  <div className="card-core">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-surface-900">{basicInfo.desiredJob}</h4>
                      <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-surface-100 text-surface-500 ring-1 ring-surface-200">
                        你填写的意向
                      </span>
                    </div>
                    <p className="text-xs text-surface-400">按你的意向岗位生成简历</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-surface-900">{basicInfo.desiredJob}</h4>
                      <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-surface-100 text-surface-500 ring-1 ring-surface-200">
                        你填写的意向
                      </span>
                    </div>
                    <p className="text-xs text-surface-400">按你的意向岗位生成简历</p>
                  </>
                )}
              </motion.button>
            )}

            {/* Empty state */}
            {recommendations.length === 0 && !customJobNotMatched && (
              <div className="card text-center py-10">
                <p className="text-surface-500 text-sm mb-2">暂未找到高度匹配的岗位</p>
                <p className="text-surface-400 text-xs">你可以返回补充更多技能信息，或选择直接生成通用简历</p>
              </div>
            )}
          </div>

          {/* Confirm CTA */}
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`w-full py-4 rounded-full font-semibold text-sm transition-all duration-500 ease-premium
              active:scale-[0.97] min-h-touch
              ${selectedId
                ? 'bg-surface-900 text-white shadow-card hover:shadow-card-hover hover:bg-surface-800'
                : 'bg-surface-100 text-surface-400 cursor-not-allowed'
              }`}
          >
            生成简历
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function JobCardContent({ job, sc, df }: { job: any; sc: any; df: any }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-bold text-surface-900 text-sm">{job.jobTitle}</h4>
            <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ring-1 ${sc.cls}`}>
              {sc.text}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-2xs font-medium ${df.cls}`}>
              {df.text}
            </span>
          </div>
          <p className="text-xs text-surface-400">{job.category} · {job.description}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ring-1 ${sc.cls}`}>
          {job.matchScore}%
        </span>
      </div>
      {job.matchReasons.length > 0 && (
        <div className="flex flex-col gap-1 mt-3">
          {job.matchReasons.slice(0, 2).map((reason: string, i: number) => (
            <span key={i} className="text-xs text-brand-600 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />
              {reason}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
