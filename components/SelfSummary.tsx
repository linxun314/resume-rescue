// components/SelfSummary.tsx — 探索式反思：自然的中途停顿
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface SelfSummaryProps {
  questionCount: number;
  onComplete: (reflection: string) => void;
  onBack: () => void;
}

export default function SelfSummary({ questionCount, onComplete, onBack }: SelfSummaryProps) {
  const [reflection, setReflection] = useState('');

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-4 safe-bottom overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-amber-50/40 blur-[120px] animate-orb-float" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full bg-orange-50/30 blur-[100px] animate-orb-float" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="card-shell">
            <div className="card-core">
              <button
                onClick={onBack}
                className="btn-ghost mb-5 -ml-2"
                aria-label="返回上一步"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-xs">返回</span>
              </button>

              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center ring-1 ring-amber-100 shadow-sm"
                  aria-hidden="true"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </motion.div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-surface-900 text-center mb-1 tracking-[-0.02em]">
                先停一下
              </h1>
              <p className="text-surface-500 text-center text-sm mb-6 leading-relaxed">
                刚才聊了 {questionCount} 个问题，<br />
                来看看你有没有什么新发现
              </p>

              <div className="bg-amber-50/80 rounded-card p-4 ring-1 ring-amber-100 mb-5">
                <p className="text-sm text-surface-700 leading-relaxed">
                  有没有哪个瞬间，让你觉得<strong className="text-surface-900">"原来我做的事还挺有价值的"？</strong>
                </p>
                <p className="text-xs text-surface-400 mt-2">
                  不用写得完整——"帮室友修电脑那次"这种一两句话就行。留空也可以。
                </p>
              </div>

              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="想到什么写什么..."
                rows={3}
                className="form-textarea mb-6"
              />

              <button
                onClick={() => onComplete(reflection)}
                className="w-full py-4 rounded-full font-semibold text-sm bg-surface-900 text-white
                  shadow-card hover:shadow-card-hover hover:bg-surface-800
                  transition-all duration-500 ease-premium active:scale-[0.97] min-h-touch"
              >
                继续探索
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
