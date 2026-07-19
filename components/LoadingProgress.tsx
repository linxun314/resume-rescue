// components/LoadingProgress.tsx — 高端视觉重构
'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const STEPS = [
  { text: '正在理解你的经历', icon: '01' },
  { text: '正在发现隐藏的能力', icon: '02' },
  { text: '正在把它们翻译成简历语言', icon: '03' },
  { text: '正在为你量身定制', icon: '04' },
];

export default function LoadingProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center safe-bottom overflow-hidden" role="status" aria-label="简历生成进度" aria-live="polite">
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] rounded-full bg-brand-50/30 blur-[120px] animate-orb-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] rounded-full bg-purple-50/25 blur-[100px] animate-orb-float" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="text-center max-w-md px-6">
        {/* Animated breathing glow */}
        <motion.div
          className="relative inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 mb-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-2xl bg-brand-100/50 animate-breath" />
          <div className="relative w-full h-full rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-surface-100 shadow-card flex items-center justify-center">
            <span className="text-2xl font-bold text-surface-300 tabular-nums tracking-[-0.02em]">
              {STEPS[currentStep].icon}
            </span>
          </div>
        </motion.div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-8" aria-hidden="true">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full transition-all duration-700 ease-premium ${
                i <= currentStep ? 'bg-surface-900 w-10' : 'bg-surface-200 w-4'
              }`}
              animate={i === currentStep ? { opacity: [0.4, 1, 0.4] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Current step text */}
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="text-lg md:text-xl font-bold text-surface-900 mb-2 tracking-[-0.01em]"
        >
          {STEPS[currentStep].text}
        </motion.h2>

        <p className="text-surface-400 text-xs">这可能需要 10-20 秒，请耐心等待</p>

        {/* Progress bar */}
        <div className="mt-8 w-full h-1 bg-surface-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`生成进度 ${progressPercent}%`}>
          <motion.div
            className="h-full bg-surface-900 rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
