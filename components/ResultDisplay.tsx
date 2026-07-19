// components/ResultDisplay.tsx — 高端视觉重构
'use client';
import { useState, useEffect, useCallback } from 'react';
import PsychologyPanel from './PsychologyPanel';
import ResumePreview from './ResumePreview';
import SatisfactionSurvey from './SatisfactionSurvey';
import JobRecommendationSection from './JobRecommendation';
import { motion } from 'framer-motion';
import type { ResumeResult } from '@/lib/types';
import { allResumes } from '@/lib/resumeData';

interface ResultDisplayProps {
  result: ResumeResult;
  onCopy: (mode: 'resume' | 'full') => void;
  onReset: () => void;
  onShowGenerator?: () => void;
  answers?: Record<string, string>;
  questions?: { id: string; question: string }[];
  scenario?: string;
}

export default function ResultDisplay({ result, onCopy, onReset, onShowGenerator, answers, questions, scenario }: ResultDisplayProps) {
  const [viewMode, setViewMode] = useState<'psychology' | 'resume'>('psychology');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);

  const dismissAnimation = useCallback(() => {
    setShowSuccessAnimation(false);
    setShowSurvey(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(dismissAnimation, 1500);
    return () => clearTimeout(timer);
  }, [dismissAnimation]);

  const handleCopy = (mode: 'resume' | 'full') => {
    onCopy(mode);
    setShowCelebration(true);
  };

  return (
    <div className="relative py-6 md:py-12 px-4 safe-bottom" role="region" aria-label="简历结果页面">
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-brand-50/30 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[35%] h-[35%] rounded-full bg-purple-50/25 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Top navigation — floating pill tabs */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="mb-6 md:mb-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-xl rounded-full ring-1 ring-black/[0.04] shadow-card" role="tablist" aria-label="结果视图切换">
              <button
                onClick={() => setViewMode('psychology')}
                role="tab"
                aria-selected={viewMode === 'psychology'}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-500 ease-premium min-h-touch ${
                  viewMode === 'psychology'
                    ? 'bg-surface-900 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                发现价值
              </button>
              <button
                onClick={() => setViewMode('resume')}
                role="tab"
                aria-selected={viewMode === 'resume'}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-500 ease-premium min-h-touch ${
                  viewMode === 'resume'
                    ? 'bg-surface-900 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                简历内容
              </button>
            </div>
            <button
              onClick={onReset}
              className="text-xs text-surface-400 hover:text-surface-600 transition-colors duration-300 min-h-touch px-3"
              aria-label="重新开始简历生成流程"
            >
              重新开始
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {viewMode === 'psychology' ? (
          <div className="space-y-4 md:space-y-6" role="tabpanel" aria-label="发现价值视图">
            {showSurvey && (
              <SatisfactionSurvey
                onSubmit={(rating, tags) => {
                  console.log('[Feedback]', { rating, tags });
                  setShowSurvey(false);
                }}
                onDismiss={() => setShowSurvey(false)}
              />
            )}

            <PsychologyPanel confidenceBoost={result.confidence_boost} />

            {/* Interview tips */}
            {result.interview_tips && result.interview_tips.length > 0 && (
              <div className="card" role="article" aria-label="面试小贴士">
                <h3 className="text-sm font-bold text-surface-900 mb-4 flex items-center gap-2 tracking-[-0.01em]">
                  <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </span>
                  面试小贴士
                </h3>
                <ul className="space-y-2.5">
                  {result.interview_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-surface-600 text-xs">
                      <span className="w-1 h-1 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job fit analysis */}
            {result.job_fit && (
              <div className="card" role="article" aria-label="岗位适配度分析">
                <h3 className="text-sm font-bold text-surface-900 mb-4 flex items-center gap-2 tracking-[-0.01em]">
                  <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                    </svg>
                  </span>
                  岗位适配度分析
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-surface-500">匹配度</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold ring-1 ${
                      result.job_fit.match_level === '高' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' :
                      result.job_fit.match_level === '中' ? 'bg-amber-50 text-amber-700 ring-amber-100' :
                      'bg-surface-100 text-surface-500 ring-surface-200'
                    }`}>{result.job_fit.match_level}</span>
                  </div>
                  {result.job_fit.relevant_experiences.length > 0 && (
                    <div>
                      <p className="text-2xs font-semibold text-surface-400 uppercase tracking-[0.08em] mb-1.5">直接相关经历</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.job_fit.relevant_experiences.map((exp, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full text-2xs bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">{exp}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.job_fit.transferable_experiences.length > 0 && (
                    <div>
                      <p className="text-2xs font-semibold text-surface-400 uppercase tracking-[0.08em] mb-1.5">可迁移经历</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.job_fit.transferable_experiences.map((exp, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full text-2xs bg-brand-50 text-brand-700 ring-1 ring-brand-100">{exp}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.job_fit.gap_analysis && (
                    <div className="bg-amber-50/80 rounded-card p-4 ring-1 ring-amber-100">
                      <p className="text-2xs font-semibold text-amber-700 uppercase tracking-[0.08em] mb-1">差距分析</p>
                      <p className="text-xs text-amber-800 leading-relaxed">{result.job_fit.gap_analysis}</p>
                    </div>
                  )}
                  {result.job_fit.suggestion && (
                    <div className="bg-brand-50/80 rounded-card p-4 ring-1 ring-brand-100">
                      <p className="text-2xs font-semibold text-brand-700 uppercase tracking-[0.08em] mb-1">下一步建议</p>
                      <p className="text-xs text-brand-800 leading-relaxed">{result.job_fit.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ability map */}
            {result.experiences.some(e => e.real_ability) && (
              <div className="card" role="article" aria-label="能力诚实分析">
                <h3 className="text-sm font-bold text-surface-900 mb-1 flex items-center gap-2 tracking-[-0.01em]">
                  <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                  </span>
                  你的能力地图（诚实版）
                </h3>
                <p className="text-xs text-surface-400 mb-4">简历上是包装，这里是你的真实水平——面试时心里有底</p>
                <div className="space-y-3">
                  {result.experiences.filter(e => e.real_ability).map((exp, i) => (
                    <div key={i} className="bg-surface-50/80 rounded-card p-4 ring-1 ring-surface-100">
                      <p className="text-sm font-medium text-surface-800 mb-1.5">{exp.title}</p>
                      <p className="text-xs text-emerald-600">真实能力：{exp.real_ability}</p>
                      {exp.gap && <p className="text-xs text-amber-600 mt-1">差距：{exp.gap}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reflection guide */}
            <div className="card" role="article" aria-label="反思引导">
              <h3 className="text-sm font-bold text-surface-900 mb-3 flex items-center gap-2 tracking-[-0.01em]">
                <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                记住这个感觉
              </h3>
              <p className="text-sm text-surface-600 mb-2">刚才看到AI分析时，有没有哪句话让你觉得"原来我还挺厉害的"？</p>
              <p className="text-xs text-surface-400">把这个瞬间记住。它比简历本身更重要——因为它是你真实的自信来源。</p>
            </div>

            {/* Integrity self-check */}
            <div className="card-shell ring-brand-200">
              <div className="card-core bg-brand-50/50">
                <h3 className="text-sm font-bold text-surface-900 mb-2 flex items-center gap-2 tracking-[-0.01em]">
                  <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </span>
                  面试前自检
                </h3>
                <p className="text-sm text-surface-700 leading-relaxed">
                  看看你的每条经历，问自己：<strong className="text-surface-900">如果面试官问"你具体做了什么"，你能讲 5 分钟吗？</strong>
                </p>
                <p className="text-xs text-surface-400 mt-2">
                  如果某条经历讲不出来，说明它还是"翻译"，不是你的。面试前把那条经历的细节回忆清楚，或者把它从简历里删掉。
                </p>
              </div>
            </div>

            {/* CTA to resume view */}
            <div className="card text-center">
              <p className="text-sm text-surface-500 mb-4">想看翻译成简历的样子吗？</p>
              <button
                onClick={() => setViewMode('resume')}
                className="btn-primary"
                aria-label="切换到简历内容视图"
              >
                查看简历内容
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            {/* Templates entry */}
            <div className="card-shell ring-purple-200">
              <div className="card-core bg-purple-50/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-surface-900 text-sm mb-1">需要简历范本参考？</h3>
                    <p className="text-xs text-surface-500 mb-4">
                      我们为你准备了{allResumes.length}类高分简历范本，涵盖通用应届生、产品运营、商科创业、技术自学方向。
                    </p>
                    <a
                      href="/templates"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-900 text-white text-xs font-medium hover:bg-surface-800 transition-all duration-500 ease-premium"
                    >
                      查看简历范本
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Few-Shot entry */}
            {onShowGenerator && (
              <div className="card-shell ring-emerald-200">
                <div className="card-core bg-emerald-50/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-surface-900 text-sm mb-1">想了解AI是如何生成简历的？</h3>
                      <p className="text-xs text-surface-500 mb-4">
                        查看Few-Shot学习示例，了解AI如何从优秀范本中学习表达技巧。
                      </p>
                      <button
                        onClick={onShowGenerator}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-900 text-white text-xs font-medium hover:bg-surface-800 transition-all duration-500 ease-premium"
                      >
                        查看学习示例
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job recommendations */}
            {answers && questions && scenario && (scenario === 'internship' || scenario === 'job') && (
              <div className="card">
                <JobRecommendationSection
                  answers={answers}
                  questions={questions}
                  scenario={scenario}
                />
              </div>
            )}

            {/* Resilience card */}
            <div className="card-shell ring-amber-200">
              <div className="card-core bg-amber-50/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900 text-sm mb-2">如果被拒了怎么办</h3>
                    <p className="text-xs text-surface-600 leading-relaxed mb-2">
                      投了简历没回音、面试被拒——这些都会发生，而且大概率会发生。但这不代表你没有价值。
                    </p>
                    <p className="text-xs text-surface-600 leading-relaxed">
                      你刚才发现的那些能力是真实的。这次不匹配，只是"你现在的阶段"和"这个岗位的需求"之间的差距——不是对你这个人的否定。
                      {result.job_fit?.suggestion && (
                        <><br /><br /><strong className="text-surface-900">你的下一步：</strong>{result.job_fit.suggestion}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6" role="tabpanel" aria-label="简历内容视图">
            <ResumePreview result={result} onCopy={handleCopy} />
            {answers && questions && scenario && (scenario === 'internship' || scenario === 'job') && (
              <div className="card">
                <JobRecommendationSection
                  answers={answers}
                  questions={questions}
                  scenario={scenario}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Celebration modal */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-label="完成庆祝"
          aria-modal="true"
          onClick={() => setShowCelebration(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            onClick={e => e.stopPropagation()}
            className="card-shell max-w-lg w-full"
          >
            <div className="card-core text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 ring-1 ring-emerald-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-surface-900 mb-2 tracking-[-0.02em]">
                你做到了
              </h2>

              <div className="bg-emerald-50/80 rounded-card p-4 ring-1 ring-emerald-100 my-6">
                <p className="text-surface-700 text-sm leading-relaxed">
                  你刚才做了一件很多人不敢做的事：<br />
                  <strong className="text-emerald-700">认真面对自己的经历，发现了隐藏的价值</strong>
                </p>
              </div>

              <div className="space-y-3 mb-6 text-left">
                {[
                  { title: '你的经历不是"没有"，而是"没被看见"', sub: '现在它被看见了' },
                  { title: '你具备可迁移能力', sub: '学习能力、解决问题、主动推动——任何岗位都需要' },
                  { title: '你比进入这个页面前更了解自己了', sub: '这就是收获' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-surface-800 font-medium text-sm">{item.title}</p>
                      <p className="text-surface-400 text-xs">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="btn-primary w-full"
              >
                我已经准备好了
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success animation overlay */}
      {showSuccessAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissAnimation}
          className="fixed inset-0 bg-surface/80 backdrop-blur-md flex items-center justify-center z-40 cursor-pointer"
          role="status"
          aria-label="简历生成成功"
          aria-live="assertive"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, filter: 'blur(16px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="text-center px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-100 shadow-glow-brand"
              aria-hidden="true"
            >
              <svg className="w-12 h-12 md:w-14 md:h-14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="text-xl md:text-2xl font-bold text-surface-900 mb-2 tracking-[-0.02em]"
            >
              你的简历已经准备好了！
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="text-sm text-surface-500"
            >
              你刚刚认真梳理了自己的经历，这本身就是一种能力
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-xs text-surface-400 mt-4"
            >
              你比你想象的更有价值
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
