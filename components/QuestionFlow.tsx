// components/QuestionFlow.tsx - 问答流程组件
'use client';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  placeholder: string;
  psychology_intent?: string;
  type: string;
}

interface QuestionFlowProps {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export default function QuestionFlow({ questions, onComplete, onBack }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;

  // 自动聚焦输入框
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentIndex]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">

        {/* 顶部进度条 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              问题 {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-6">

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

          {/* 输入框 */}
          <textarea
            ref={textareaRef}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentQuestion.placeholder}
            className="w-full min-h-[150px] p-4 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          {/* 快捷键提示 */}
          <p className="text-xs text-gray-400 mt-2 text-right">
            Ctrl + Enter 快速下一步
          </p>
        </div>

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
