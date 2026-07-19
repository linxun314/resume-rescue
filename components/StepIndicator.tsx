// components/StepIndicator.tsx — 高端视觉重构
'use client';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  stepLabels,
  className = '',
}: StepIndicatorProps) {
  const labels = stepLabels || [];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className={`bg-white/60 backdrop-blur-xl rounded-full ring-1 ring-black/[0.04] shadow-card px-4 py-2.5 ${className}`}
      role="navigation"
      aria-label="步骤进度指示器"
    >
      <div className="flex items-center gap-3">
        {/* Step dots */}
        <div className="hidden md:flex items-center gap-2.5 flex-1">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5" aria-current={i === currentStep ? 'step' : undefined}>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ease-premium ${
                  i < currentStep
                    ? 'bg-surface-900 text-white'
                    : i === currentStep
                    ? 'bg-surface-900 text-white ring-2 ring-surface-300'
                    : 'bg-surface-100 text-surface-400'
                }`}
              >
                {i < currentStep ? (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-300 ${
                i === currentStep ? 'text-surface-700' : 'text-surface-400'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: label + percentage */}
        <div className="flex md:hidden items-center justify-between w-full">
          <span className="text-xs font-medium text-surface-600" aria-live="polite">
            {labels[currentStep] || `步骤 ${currentStep + 1}`}
          </span>
          <span className="text-xs font-bold text-surface-800 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="hidden md:block w-20 h-1 bg-surface-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`总进度 ${progressPercent}%`}
        >
          <motion.div
            className="h-full bg-surface-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden w-full h-1 bg-surface-100 rounded-full overflow-hidden mt-2" role="progressbar" aria-valuenow={progressPercent} aria-label={`总进度 ${progressPercent}%`}>
        <motion.div
          className="h-full bg-surface-900 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
    </motion.nav>
  );
}
