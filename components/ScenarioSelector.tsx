// components/ScenarioSelector.tsx — 高端视觉重构
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Scenario } from '@/lib/prompts';

interface ScenarioSelectorProps {
  onSelect: (scenario: Scenario) => void;
}

const SCENARIOS: {
  key: Scenario;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}[] = [
  {
    key: 'internship',
    title: '找实习',
    subtitle: '大一到大三',
    description: '挖掘课堂作业中的隐藏能力，发现可迁移技能',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    features: ['挖掘课堂作业中的能力', '发现可迁移技能', '适合没有实习经历的你'],
  },
  {
    key: 'job',
    title: '找工作',
    subtitle: '应届生求职',
    description: '提炼专业能力、项目成果和量化数据',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    features: ['优化课程项目和比赛经历', '用STAR法则结构化成果', '适合秋招/春招的你'],
  },
  {
    key: 'graduate',
    title: '考研',
    subtitle: '复试、联系导师',
    description: '突出学业成绩、科研潜力和学术热情',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    features: ['强调学业成绩和英语水平', '用学术语言翻译科研经历', '适合准备考研复试的你'],
  },
];

export default function ScenarioSelector({ onSelect }: ScenarioSelectorProps) {
  return (
    <div className="relative min-h-[100dvh] py-12 md:py-24 px-4 safe-bottom">
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-brand-50/50 blur-[120px] animate-orb-float" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-50/40 blur-[100px] animate-orb-float" style={{ animationDelay: '-8s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="max-w-5xl mx-auto"
      >
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="eyebrow mb-4">选择场景</span>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 text-balance mb-4 tracking-[-0.03em]">
            你现在是什么情况？
          </h1>
          <p className="text-surface-500 text-base md:text-lg max-w-md mx-auto">
            选一个最接近你的，我来帮你梳理
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {SCENARIOS.map((scenario, index) => {
            const isWide = index === 0;
            return (
              <motion.button
                key={scenario.key}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(scenario.key)}
                className={`group relative text-left ${isWide ? 'md:col-span-3' : 'md:col-span-2'}`}
              >
                <div className="card-shell h-full">
                  <div className="card-core h-full flex flex-col">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 ring-1 ring-brand-100 group-hover:bg-brand-100 transition-colors duration-500 ease-premium">
                      {scenario.icon}
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-surface-900 tracking-[-0.01em]">
                        {scenario.title}
                      </h2>
                      <p className="text-xs text-surface-400 mt-0.5">{scenario.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-surface-500 text-sm leading-relaxed mb-5 flex-1">
                      {scenario.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {scenario.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs text-surface-600">
                          <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA row */}
                    <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                      <span className="text-sm font-medium text-surface-700">
                        选择这个场景
                      </span>
                      <span className="w-8 h-8 rounded-full bg-surface-100 group-hover:bg-surface-900 flex items-center justify-center transition-all duration-500 ease-premium group-hover:translate-x-1 shrink-0">
                        <svg className="w-4 h-4 text-surface-400 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-surface-400 text-xs mt-10"
        >
          不用纠结选哪个，后面还可以随时调整
        </motion.p>
      </motion.div>
    </div>
  );
}
