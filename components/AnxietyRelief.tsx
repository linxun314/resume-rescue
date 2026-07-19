// components/AnxietyRelief.tsx — 探索式开场：先给予，再索取
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWelcomeFact } from '@/lib/feedbackEngine';

interface AnxietyReliefProps {
  onStart: () => void;
}

export default function AnxietyRelief({ onStart }: AnxietyReliefProps) {
  const [fact, setFact] = useState('67% 的应届生简历写的是课堂项目，不是实习。你并不特殊。');

  useEffect(() => {
    setFact(getWelcomeFact());
  }, []);

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-4 safe-bottom overflow-hidden">
      {/* Background: radial mesh orbs */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-100/40 blur-[120px] animate-orb-float" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-100/30 blur-[100px] animate-orb-float" style={{ animationDelay: '-10s' }} />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-amber-50/30 blur-[80px] animate-orb-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="card-shell">
            <div className="card-core">
              {/* Eyebrow */}
              <div className="flex justify-center mb-6">
                <span className="eyebrow">AI 简历助手</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 text-center text-balance mb-3 tracking-[-0.02em]">
                嗨，很高兴见到你
              </h1>
              <p className="text-surface-500 text-center text-sm mb-8 leading-relaxed">
                你可能觉得自己"没什么经历"，<br className="hidden sm:inline" />
                不确定"我到底能做什么"。<br />
                <span className="text-surface-700 font-medium">但你比你想象的更有价值。</span>
              </p>

              {/* Data fact — the "gift" before asking */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="bg-brand-50/80 rounded-card p-4 ring-1 ring-brand-100 mb-8"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                    </svg>
                  </div>
                  <p className="text-sm text-surface-700 leading-relaxed">{fact}</p>
                </div>
              </motion.div>

              {/* Warm instructions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="space-y-2.5 mb-8"
              >
                {[
                  { text: '没有标准答案，不用担心答错', icon: 'check' },
                  { text: '想到什么说什么，后续可以调整', icon: 'edit' },
                  { text: '每答一题都会告诉你发现了什么', icon: 'discover' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-surface-600 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    {item.text}
                  </div>
                ))}
              </motion.div>

              {/* CTA — no checkbox gate */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              >
                <button
                  onClick={onStart}
                  className="w-full py-4 rounded-full font-semibold text-sm bg-surface-900 text-white
                    shadow-card hover:shadow-card-hover hover:bg-surface-800
                    transition-all duration-500 ease-premium active:scale-[0.97] min-h-touch"
                >
                  开始探索自己
                </button>
              </motion.div>
            </div>
          </div>

          {/* Bottom hint */}
          <p className="text-center text-surface-400 text-xs mt-8">
            约 5 分钟 · 无需注册 · 全程陪伴
          </p>
        </motion.div>
      </div>
    </div>
  );
}
