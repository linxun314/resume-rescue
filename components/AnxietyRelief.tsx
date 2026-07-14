// components/AnxietyRelief.tsx - 心理预设组件（设计心理学版）
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import TipCard from './TipCard';

interface AnxietyReliefProps {
  onStart: () => void;
}

// 提示配置
const TIPS = [
  {
    icon: '😰',
    title: '你不是一个人',
    content: '简历焦虑是大学生求职中最常见的情绪之一\n很多人都有过同样的感受',
    highlight: false,
  },
  {
    icon: '💡',
    title: '你可能低估了自己',
    content: '你缺的不是经历\n是把普通小事翻译成职场语言的能力',
    highlight: false,
  },
  {
    icon: '🔍',
    title: '这个工具能帮你',
    content: '挖掘你忽视的隐藏价值\n发现你没想到的能力点',
    highlight: false,
  },
  {
    icon: '⚖️',
    title: '我们的承诺',
    content: '展示真实的自己\n因为真实经历才最有力',
    highlight: true,
  },
];

export default function AnxietyRelief({ onStart }: AnxietyReliefProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 主卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
          {/* 标题区 */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
            >
              <span className="text-3xl">💡</span>
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              在开始之前...
            </h1>
            <p className="text-gray-500">有几件事想告诉你</p>
          </div>

          {/* 心理学内容 */}
          <div className="space-y-3 mb-6">
            {TIPS.map((tip, index) => (
              <TipCard
                key={index}
                icon={tip.icon}
                title={tip.title}
                content={tip.content}
                index={index}
                highlight={tip.highlight}
              />
            ))}
          </div>

          {/* 承诺勾选 */}
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3 mb-6 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 text-sm">
              我承诺展示真实的自己——因为真实经历才最有力
            </span>
          </motion.label>

          {/* 开始按钮 */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onStart}
            disabled={!isChecked}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              isChecked
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isChecked ? '准备好了，开始发现我的价值！' : '请先勾选承诺'}
          </motion.button>
        </motion.div>

        {/* 底部提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-gray-400 text-sm mt-6"
        >
          预计需要 5-8 分钟 · 请找一个安静的环境
        </motion.p>
      </div>
    </div>
  );
}
