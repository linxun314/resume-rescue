// components/TipCard.tsx — 已弃用，保留兼容
'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface TipCardProps {
  icon: string;
  title: string;
  content: string;
  index: number;
  highlight?: boolean;
}

export default function TipCard({ icon, title, content, index, highlight = false }: TipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className={`flex items-start gap-4 p-4 rounded-card transition-all duration-500 ease-premium ${
        highlight
          ? 'bg-brand-50/80 ring-2 ring-brand-100'
          : 'bg-surface-50/80 ring-1 ring-surface-100'
      }`}
      role="article"
      aria-label={`提示：${title}`}
    >
      {highlight && (
        <span className="absolute top-3 right-3 eyebrow text-brand-600">重要</span>
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
        highlight ? 'bg-brand-100 text-brand-600' : 'bg-white ring-1 ring-surface-200 text-surface-500'
      }`} aria-hidden="true">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-surface-800 text-sm">{title}</h3>
        <p className="text-surface-500 text-xs leading-relaxed mt-0.5">{content}</p>
      </div>
    </motion.div>
  );
}
