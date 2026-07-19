// components/QuestionFlow.tsx — 流畅探索：底部反馈气泡，不阻断操作
'use client';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Scenario } from '@/lib/prompts';
import { recommendJobs, JobRecommendation } from '@/lib/jobRecommendations';
import { showToast } from '@/lib/useToast';
import { generateFeedback, detectAbilities, type FeedbackResult } from '@/lib/feedbackEngine';

interface QuestionFlowProps {
  questions: Question[];
  scenario: Scenario;
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
  initialAnswers?: Record<string, string>;
}

const CONVERSATIONAL_INTROS: Record<number, string> = {
  0: '',
  1: '很好，我们继续——',
  2: '换个角度想想——',
  3: '你提到的这些让我想到——',
  4: '我越来越了解你了——',
  5: '有意思，再看看另一面——',
  6: '快到最后了——',
  7: '最后两个——',
  8: '最后一个问题——',
};

const feedbackColorMap = {
  discovery: { bg: 'bg-amber-50/95', ring: 'ring-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-100 text-amber-600' },
  encouragement: { bg: 'bg-brand-50/95', ring: 'ring-brand-200', text: 'text-brand-800', iconBg: 'bg-brand-100 text-brand-600' },
  affirmation: { bg: 'bg-emerald-50/95', ring: 'ring-emerald-200', text: 'text-emerald-800', iconBg: 'bg-emerald-100 text-emerald-600' },
  connection: { bg: 'bg-purple-50/95', ring: 'ring-purple-200', text: 'text-purple-800', iconBg: 'bg-purple-100 text-purple-600' },
  quote: { bg: 'bg-slate-50/95', ring: 'ring-slate-200', text: 'text-slate-700', iconBg: 'bg-slate-100 text-slate-500' },
};

export default function QuestionFlow({ questions, scenario, onComplete, onBack, initialAnswers }: QuestionFlowProps) {
  // 如果有初始答案，跳到第一个未答的题目
  const getStartIndex = () => {
    if (!initialAnswers || Object.keys(initialAnswers).length === 0) return 0;
    for (let i = 0; i < questions.length; i++) {
      if (!initialAnswers[questions[i].id] || !initialAnswers[questions[i].id].trim()) return i;
    }
    return questions.length - 1;
  };
  const [currentIndex, setCurrentIndex] = useState(getStartIndex);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers || {});
  const [showExample, setShowExample] = useState(false);
  const [validationError, setValidationError] = useState('');

  // 底部反馈气泡
  const [feedbackBubble, setFeedbackBubble] = useState<FeedbackResult | null>(null);
  const [showFeedbackBubble, setShowFeedbackBubble] = useState(false);
  const [allDiscoveredAbilities, setAllDiscoveredAbilities] = useState<string[]>(() => {
    // 从初始答案中恢复已发现的能力
    if (!initialAnswers) return [];
    const abilities: string[] = [];
    for (const val of Object.values(initialAnswers)) {
      if (val.trim()) {
        const detected = detectAbilities(val);
        for (const a of detected) {
          if (!abilities.includes(a)) abilities.push(a);
        }
      }
    }
    return abilities;
  });
  const [pendingAdvance, setPendingAdvance] = useState(false);

  // 阶段小结 toast
  const [summaryToast, setSummaryToast] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;
  const hasAnswer = (answers[currentQuestion.id] || '').trim().length > 0;

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
    setShowExample(false);
    setValidationError('');
    // 切题时清除反馈气泡
    setShowFeedbackBubble(false);
    setFeedbackBubble(null);
    setPendingAdvance(false);
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  const jobRecommendations = useMemo(() => {
    const majorAnswer = answers['q1'] || '';
    if (majorAnswer.length >= 2) return recommendJobs(majorAnswer);
    return [];
  }, [answers['q1']]);

  // 统一的前进逻辑
  const doAdvance = useCallback(() => {
    setShowFeedbackBubble(false);
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    if (isLastQuestion) {
      onComplete(answers);
    } else {
      const nextIndex = currentIndex + 1;
      // 检查阶段小结
      const showSummary = (nextIndex === 3 || nextIndex === 6) && allDiscoveredAbilities.length > 0;
      if (showSummary) {
        setSummaryToast(`已发现 ${allDiscoveredAbilities.length} 项能力`);
        setTimeout(() => setSummaryToast(null), 3000);
      }
      setCurrentIndex(nextIndex);
    }
  }, [isLastQuestion, answers, onComplete, currentIndex, allDiscoveredAbilities.length]);

  const handleNext = () => {
    // 如果正在显示反馈气泡，直接前进（用户手动点的）
    if (showFeedbackBubble && pendingAdvance) {
      doAdvance();
      return;
    }

    if (!hasAnswer) {
      setValidationError('想到什么说什么就好，哪怕几个关键词也行');
      showToast('先写点什么再继续', 'info');
      textareaRef.current?.classList.add('animate-shake-subtle');
      setTimeout(() => textareaRef.current?.classList.remove('animate-shake-subtle'), 400);
      return;
    }
    setValidationError('');

    const answer = answers[currentQuestion.id].trim();

    // 检测能力
    const newAbilities = detectAbilities(answer);
    const freshAbilities = newAbilities.filter(a => !allDiscoveredAbilities.includes(a));
    if (freshAbilities.length > 0) {
      setAllDiscoveredAbilities(prev => [...prev, ...freshAbilities]);
    }

    // 显示底部反馈气泡
    const feedback = generateFeedback(answer, currentIndex, allDiscoveredAbilities);
    setFeedbackBubble(feedback);
    setShowFeedbackBubble(true);
    setPendingAdvance(true);

    // 2.5 秒后自动前进（用户也可以随时点按钮跳过）
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      doAdvance();
    }, 2500);
  };

  const handlePrev = () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setShowFeedbackBubble(false);
    setPendingAdvance(false);
    if (isFirstQuestion) onBack();
    else setCurrentIndex(currentIndex - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const currentTip = useMemo(() => {
    const tips = [
      '不用太纠结，写真实的想法就好',
      '任何小事都可以，关键是你的真实感受',
      '想到什么写什么，后续可以调整',
      '不确定的话，先写个大概',
      '没有标准答案，你说了算',
    ];
    return tips[currentIndex % tips.length];
  }, [currentIndex]);

  return (
    <div className="relative min-h-[100dvh] p-4 safe-bottom overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-brand-50/30 blur-[120px] animate-orb-float" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-50/25 blur-[100px] animate-orb-float" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="max-w-2xl mx-auto pt-4 md:pt-8">
        {/* 进度 + 能力标签 */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8 md:mb-12"
        >
          {allDiscoveredAbilities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4"
            >
              <div className="flex flex-wrap gap-1.5">
                {allDiscoveredAbilities.map((ability) => (
                  <motion.span
                    key={ability}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2.5 py-1 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                  >
                    {ability}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-surface-400 uppercase tracking-[0.1em]">
              探索 {currentIndex + 1}/{questions.length}
            </span>
            <span className="text-xs font-medium text-surface-400">
              {allDiscoveredAbilities.length > 0 ? `已发现 ${allDiscoveredAbilities.length} 项能力` : '开始探索'}
            </span>
          </div>
          <div className="w-full h-1 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-surface-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            />
          </div>
        </motion.div>

        {/* 阶段小结 toast */}
        <AnimatePresence>
          {summaryToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 px-4 py-3 rounded-card bg-emerald-50/90 backdrop-blur-sm ring-1 ring-emerald-100 flex items-center gap-3"
            >
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <p className="text-sm text-emerald-800 font-medium">{summaryToast}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 问题卡片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${currentIndex}`}
            initial={{ opacity: 0, x: 40, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -40, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            {CONVERSATIONAL_INTROS[currentIndex] && (
              <p className="text-xs text-surface-400 mb-4 ml-1">
                {CONVERSATIONAL_INTROS[currentIndex]}
              </p>
            )}

            <div className="card-shell mb-6">
              <div className="card-core">
                <span className="inline-flex px-3 py-1 rounded-full text-2xs font-semibold bg-brand-50 text-brand-600 ring-1 ring-brand-100 mb-5 tracking-[0.05em]">
                  {currentQuestion.psychology_intent || '认真回答'}
                </span>

                <h2 className="text-xl md:text-2xl font-bold text-surface-900 mb-4 tracking-[-0.01em] leading-snug">
                  {currentQuestion.question}
                </h2>

                <p className="text-xs text-surface-400 mb-6">
                  想到什么说什么，不用组织语言
                </p>

                <button
                  onClick={() => setShowExample(!showExample)}
                  className="flex items-center gap-2 text-xs text-surface-400 hover:text-surface-600 mb-4 transition-colors duration-300 min-h-touch"
                  aria-expanded={showExample}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  {showExample ? '收起示例' : '不确定？看看别人的例子'}
                </button>

                <AnimatePresence>
                  {showExample && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-amber-50/80 rounded-card p-4 mb-4 ring-1 ring-amber-100">
                        <p className="text-surface-700 text-sm leading-relaxed">{currentQuestion.example}</p>
                        <p className="text-xs text-amber-600 mt-3 font-medium">这只是例子，请写你的真实经历</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {currentQuestion.type === 'input' ? (
                  <input
                    ref={textareaRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
                      if (e.target.value.trim().length > 0 && validationError) setValidationError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder}
                    className={`form-input ${validationError ? 'ring-2 ring-danger-500' : ''}`}
                    aria-label={currentQuestion.question}
                    aria-required="true"
                  />
                ) : (
                  <textarea
                    ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
                      if (e.target.value.trim().length > 0 && validationError) setValidationError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder}
                    className={`form-textarea min-h-[140px] sm:min-h-[160px] ${
                      validationError ? 'ring-2 ring-danger-500' : ''
                    }`}
                    aria-label={currentQuestion.question}
                    aria-required="true"
                  />
                )}

                {validationError && (
                  <p className="text-xs text-danger-500 mt-2 animate-fade-up" role="alert">
                    {validationError}
                  </p>
                )}

                <p className="text-xs text-surface-400 mt-3">{currentTip}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Job recommendations */}
        {scenario === 'job' && currentIndex === 1 && jobRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="card mb-6"
          >
            <p className="text-xs font-semibold text-surface-500 mb-3 uppercase tracking-[0.05em]">
              根据你的专业，这些方向可能适合你
            </p>
            <div className="flex flex-wrap gap-2">
              {jobRecommendations.map((job: JobRecommendation, i: number) => (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, direction: job.title })}
                  className="px-4 py-2 rounded-full text-xs font-medium bg-brand-50 text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100 transition-all duration-300 min-h-touch"
                >
                  {job.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation — 始终显示，不受反馈影响 */}
        <div className="flex gap-3" role="navigation" aria-label="问题导航">
          <button
            onClick={handlePrev}
            className="btn-secondary"
            aria-label={isFirstQuestion ? '返回上一步' : '上一题'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer && !pendingAdvance}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-sm
              transition-all duration-500 ease-premium active:scale-[0.97] min-h-touch
              ${hasAnswer || pendingAdvance
                ? 'bg-surface-900 text-white shadow-card hover:shadow-card-hover'
                : 'bg-surface-100 text-surface-400 cursor-not-allowed'
              }`}
            aria-label={pendingAdvance ? (isLastQuestion ? '生成简历' : '下一题') : '提交回答'}
            aria-disabled={!hasAnswer && !pendingAdvance}
          >
            {pendingAdvance ? (
              <>
                {isLastQuestion ? '生成简历' : '下一题'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            ) : (
              <>
                提交回答
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 底部反馈气泡 — 浮动，不阻断 */}
      <AnimatePresence>
        {showFeedbackBubble && feedbackBubble && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-6 left-4 right-4 z-30 pointer-events-none"
          >
            {(() => {
              const colors = feedbackColorMap[feedbackBubble.type];
              return (
                <div className={`max-w-2xl mx-auto p-4 rounded-card-lg ${colors.bg} backdrop-blur-xl ring-1 ${colors.ring} shadow-card`}>
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0`}>
                      {feedbackBubble.type === 'discovery' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                      ) : feedbackBubble.type === 'quote' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${colors.text}`}>
                        {feedbackBubble.message}
                      </p>
                      {feedbackBubble.abilityTags && feedbackBubble.abilityTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {feedbackBubble.abilityTags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-white/60 text-emerald-700 ring-1 ring-emerald-200">
                              +{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
