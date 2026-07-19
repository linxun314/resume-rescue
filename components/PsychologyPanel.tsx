// components/PsychologyPanel.tsx — 高端视觉重构
'use client';
import { motion } from 'framer-motion';

interface ConfidenceBoost {
  hidden_value: string;
  evidence: string;
  reassurance: string;
  growth_mindset: string;
  abilities: string[];
}

interface PsychologyPanelProps {
  confidenceBoost: ConfidenceBoost;
}

export default function PsychologyPanel({ confidenceBoost }: PsychologyPanelProps) {
  const { hidden_value, evidence, reassurance, growth_mindset, abilities } = confidenceBoost;

  return (
    <div className="card-shell ring-brand-200" role="article" aria-label="心理赋能面板">
      <div className="card-core bg-gradient-to-br from-brand-50/30 via-white to-purple-50/30">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center ring-1 ring-brand-200 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-surface-900 tracking-[-0.01em]">你的隐藏价值</h2>
            <p className="text-xs text-surface-400">心理学研究表明：人往往低估了自己的能力</p>
          </div>
        </div>

        {/* Core value */}
        <div className="bg-white/80 rounded-card p-5 ring-1 ring-brand-100 shadow-sm mb-4">
          <p className="text-surface-700 text-sm leading-relaxed">{hidden_value}</p>
        </div>

        {/* Four modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-white/60 rounded-card p-4 ring-1 ring-surface-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-surface-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-surface-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-surface-700">你的证据</span>
            </div>
            <p className="text-xs text-surface-500 leading-relaxed">{evidence}</p>
          </div>

          <div className="bg-white/60 rounded-card p-4 ring-1 ring-surface-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-surface-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-surface-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-surface-700">给你信心</span>
            </div>
            <p className="text-xs text-surface-500 leading-relaxed">{reassurance}</p>
          </div>

          <div className="bg-white/60 rounded-card p-4 ring-1 ring-surface-100 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-surface-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-surface-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-surface-700">换个角度看自己</span>
            </div>
            <p className="text-xs text-surface-500 leading-relaxed">{growth_mindset}</p>
          </div>
        </div>

        {/* Ability tags */}
        <div>
          <p className="text-xs text-surface-400 mb-2.5">你的可迁移能力标签</p>
          <div className="flex flex-wrap gap-2" role="list" aria-label="能力标签列表">
            {abilities.map((ability, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-900 text-white shadow-sm"
                role="listitem"
              >
                {ability}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
