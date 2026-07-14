'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const STEPS = [
  { text: '正在分析你的经历...', icon: '🔍' },
  { text: '正在匹配STAR框架...', icon: '🧩' },
  { text: '正在优化表达方式...', icon: '✨' },
  { text: '正在生成简历文案...', icon: '📝' },
];

export default function LoadingProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* 动画图标 */}
        <motion.div
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-8"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-5xl">{STEPS[currentStep].icon}</span>
        </motion.div>

        {/* 步骤指示器 */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentStep
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-12'
                  : 'bg-gray-200 w-8'
              }`}
              animate={i === currentStep ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* 当前步骤文字 */}
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-gray-800 mb-2"
        >
          {STEPS[currentStep].text}
        </motion.h2>

        <p className="text-gray-500 text-sm">这可能需要 10-20 秒，请耐心等待</p>

        {/* 完成进度 */}
        <div className="mt-6 flex justify-center gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-1 text-xs ${i <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
              <span>{i < currentStep ? '✓' : i === currentStep ? '●' : '○'}</span>
              <span className="hidden sm:inline">{step.text.replace('正在', '').replace('...', '')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
