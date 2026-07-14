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
      initial={{ opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className={`relative flex items-start gap-4 p-4 rounded-2xl transition-all ${
        highlight
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md'
          : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* 重要标签 */}
      {highlight && (
        <span className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
          重要
        </span>
      )}

      {/* 图标 */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
        highlight ? 'bg-blue-100' : 'bg-white border border-gray-200'
      }`}>
        {icon}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold mb-1 ${
          highlight ? 'text-blue-700' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
