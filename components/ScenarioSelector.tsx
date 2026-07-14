'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scenario } from '@/lib/prompts';

interface ScenarioSelectorProps {
  onSelect: (scenario: Scenario) => void;
}

// 场景配置
const SCENARIOS: {
  key: Scenario;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
}[] = [
  {
    key: 'internship',
    title: '找实习',
    subtitle: '大一到大三看这里',
    description: '侧重挖掘你的学习能力、主动性和潜力，帮你找到第一份实习',
    icon: '🎯',
    features: [
      '挖掘课堂作业中的隐藏能力',
      '发现日常生活里的可迁移技能',
      '适合没有实习经历的你',
    ],
  },
  {
    key: 'job',
    title: '找工作',
    subtitle: '应届生求职看这里',
    description: '侧重提炼你的专业能力、项目成果和量化数据，帮你拿offer',
    icon: '💼',
    features: [
      '优化课程项目和比赛经历',
      '用STAR法则结构化成果',
      '适合准备秋招/春招的你',
    ],
  },
  {
    key: 'graduate',
    title: '考研',
    subtitle: '联系导师、复试面试',
    description: '面向导师和招生办，突出学业成绩、科研潜力和学术热情',
    icon: '🎓',
    features: [
      '强调学业成绩和英语水平',
      '用学术语言翻译科研经历',
      '适合准备考研复试的你',
    ],
  },
];

export default function ScenarioSelector({ onSelect }: ScenarioSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-5xl mb-4"
          >
            🎯
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            你现在是什么情况？
          </h1>
          <p className="text-lg text-gray-600">
            选择你的场景，我会为你定制专属的简历策略
          </p>
        </div>

        {/* 场景卡片 */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-4">
          {SCENARIOS.map((scenario, index) => (
            <motion.button
              key={scenario.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(scenario.key)}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-left group border-2 border-transparent hover:border-green-400"
            >
              {/* 图标和标题 */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{scenario.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {scenario.title}
                  </h2>
                  <p className="text-sm text-gray-500">{scenario.subtitle}</p>
                </div>
              </div>

              {/* 描述 */}
              <p className="text-gray-600 mb-5 leading-relaxed">
                {scenario.description}
              </p>

              {/* 特性列表 */}
              <ul className="space-y-2">
                {scenario.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* 底部提示 */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm text-green-600 font-medium group-hover:translate-x-2 inline-block transition-transform">
                  选择这个场景 →
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 底部提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          💡 不用纠结选哪个，后面还可以随时调整
        </motion.p>
      </motion.div>
    </div>
  );
}
