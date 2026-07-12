'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send, ChevronDown, ChevronUp, Lightbulb, Briefcase } from 'lucide-react';
import { Question, Scenario } from '@/lib/prompts';
import { recommendJobs, JobRecommendation } from '@/lib/jobRecommendations';

interface QuestionFlowProps {
  questions: Question[];
  scenario: Scenario;
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

// 小提示配置
const TIPS: Record<number, string> = {
  0: '💡 小提示：不用太纠结，写真实的想法就好',
  1: '💡 小提示：任何小事都可以，关键是你的真实感受',
  2: '💡 小提示：想到什么写什么，后续可以调整',
};

export default function QuestionFlow({ questions, scenario, onComplete, onBack }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExample, setShowExample] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  // 自动聚焦输入框
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    setShowExample(false);
  }, [currentIndex]);

  // 根据专业推荐岗位（监听q1的回答）
  const jobRecommendations = useMemo(() => {
    const majorAnswer = answers['q1'] || '';
    if (majorAnswer.length >= 2) {
      return recommendJobs(majorAnswer);
    }
    return [];
  }, [answers['q1']]);

  const handleNext = () => {
    if (!answers[currentQuestion.id]?.trim()) {
      alert('请先回答当前问题');
      return;
    }

    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (isFirstQuestion) {
      onBack();
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  // 选择推荐岗位
  const handleSelectJob = (job: JobRecommendation) => {
    setAnswers({
      ...answers,
      direction: job.title,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  // 获取当前提示
  const currentTip = TIPS[currentIndex] || TIPS[2];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">

        {/* 顶部进度条 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              问题 {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* 问题卡片 */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 mb-6"
        >
          {/* 问题意图提示 */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              💡 {currentQuestion.psychology_intent || '认真回答，越详细越好'}
            </span>
          </div>

          {/* 问题内容 */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          {/* 示例展开按钮 */}
          <button
            onClick={() => setShowExample(!showExample)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            {showExample ? '收起示例' : '💡 看看别人的例子'}
            {showExample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* 示例内容 */}
          <AnimatePresence>
            {showExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-amber-50 rounded-2xl p-4 mb-4 border border-amber-100">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {currentQuestion.example}
                  </p>
                  <p className="text-xs text-amber-600 mt-3 font-medium">
                    ⚠️ 这只是例子，请写你的真实经历
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 输入框 */}
          <textarea
            ref={textareaRef}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentQuestion.placeholder}
            className="w-full min-h-[150px] p-4 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          {/* 小提示 */}
          <p className="text-xs text-gray-500 mt-3">
            {currentTip}
          </p>

          {/* 快捷键提示 */}
          <p className="text-xs text-gray-400 mt-2 text-right">
            Ctrl + Enter 快速下一步
          </p>
        </motion.div>

        {/* 岗位推荐（仅在就业场景的第二个问题显示） */}
        {scenario === 'job' && currentIndex === 1 && jobRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                根据你的专业，推荐这些方向：
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {jobRecommendations.map((job, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectJob(job)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-all hover:scale-105"
                >
                  {job.title}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 点击即可自动填入，也可以自己修改
            </p>
          </motion.div>
        )}

        {/* 按钮区域 */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {isFirstQuestion ? '返回' : '上一题'}
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            {isLastQuestion ? (
              <>
                <Send className="w-4 h-4" />
                生成简历
              </>
            ) : (
              <>
                下一题
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
