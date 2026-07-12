// components/ResumeGenerator.tsx
// 简历生成器组件，展示Few-Shot示例并生成简历

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  selectFewShotExamples,
  getExampleExplanation,
  FewShotExample
} from '@/lib/fewShotExamples';

interface ResumeGeneratorProps {
  userInfo: {
    name: string;
    education: string;
    major: string;
    graduationYear: string;
  };
  targetJob: string;
  experiences: string[];
  onGenerate?: (prompt: string) => void;
}

export default function ResumeGenerator({
  userInfo,
  targetJob,
  experiences,
  onGenerate
}: ResumeGeneratorProps) {
  const [showExamples, setShowExamples] = useState(true);
  const [selectedExamples, setSelectedExamples] = useState<FewShotExample[]>([]);

  // 初始化时选择示例
  useEffect(() => {
    const examples = selectFewShotExamples(experiences.join(' '), targetJob, 3);
    setSelectedExamples(examples);
  }, [experiences, targetJob]);

  // 获取学习要点
  const getLearningPointsFromExample = (example: FewShotExample): string => {
    const points: string[] = [];

    const strongVerbs = ['策划', '设计', '优化', '建立', '管理', '主导', '开发', '实现'];
    const hasStrongVerb = strongVerbs.some(verb => example.output.includes(verb));
    if (hasStrongVerb) {
      points.push('使用强动词替代弱动词');
    }

    if (/\d+/.test(example.output)) {
      points.push('量化成果，用具体数字展示');
    }

    if (example.output.includes('情境') || example.output.includes('任务')) {
      points.push('遵循STAR结构');
    }

    return points.join('、') || '学习示例的整体风格';
  };

  // 难度标签
  const difficultyLabel = {
    easy: '入门',
    medium: '进阶',
    hard: '挑战'
  };

  // 难度颜色
  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6">

      {/* Few-Shot示例展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">📚</span>
            AI学习的优秀范本示例
          </h2>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showExamples ? '收起' : '展开'}
          </button>
        </div>

        <AnimatePresence>
          {showExamples && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-gray-600 mb-4">
                AI通过学习以下{selectedExamples.length}个优秀示例，理解STAR法则和职场语言风格
              </p>

              <div className="space-y-4">
                {selectedExamples.map((example, index) => (
                  <motion.div
                    key={example.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* 示例标题 */}
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800">
                          示例{index + 1}：{example.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${difficultyColor[example.difficulty]}`}>
                          {difficultyLabel[example.difficulty]}
                        </span>
                      </div>
                      {example.templateId && (
                        <Link
                          href={`/templates/${example.templateId}`}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          查看完整范本 →
                        </Link>
                      )}
                    </div>

                    {/* 原始 vs 优化对比 */}
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="p-4 bg-red-50 border-r border-gray-200">
                        <p className="text-xs text-red-600 font-semibold mb-2 flex items-center gap-1">
                          <span>❌</span> 原始表达（用户输入）
                        </p>
                        <p className="text-sm text-gray-700 italic">
                          "{example.input}"
                        </p>
                      </div>
                      <div className="p-4 bg-green-50">
                        <p className="text-xs text-green-600 font-semibold mb-2 flex items-center gap-1">
                          <span>✅</span> 优化输出（STAR格式）
                        </p>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {example.output}
                        </div>
                      </div>
                    </div>

                    {/* 学习要点 */}
                    <div className="px-4 py-3 bg-yellow-50 border-t border-gray-200">
                      <p className="text-xs text-yellow-700 flex items-center gap-1">
                        <span>💡</span>
                        <span className="font-semibold">学习要点：</span>
                        {getLearningPointsFromExample(example)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 撰写标准提示 */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <span>📌</span> AI遵循的撰写标准
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-700">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>STAR法则：情境-任务-行动-结果</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>强动词表达："策划"、"设计"、"优化"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>量化成果：具体数字展示结果</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>真实性：不虚构，只翻译真实内容</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 用户信息展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">👤</span>
          你的基本信息
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">姓名</span>
            <span className="text-gray-800 font-medium">{userInfo.name || '待填写'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">学校</span>
            <span className="text-gray-800 font-medium">{userInfo.education || '待填写'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">专业</span>
            <span className="text-gray-800 font-medium">{userInfo.major || '待填写'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">毕业年份</span>
            <span className="text-gray-800 font-medium">{userInfo.graduationYear || '待填写'}</span>
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <span className="text-gray-500 w-16">目标岗位</span>
            <span className="text-gray-800 font-medium">{targetJob || '待填写'}</span>
          </div>
        </div>
      </motion.div>

      {/* 经历输入展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📝</span>
          你的经历
        </h2>

        {experiences.length > 0 ? (
          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
              >
                <span className="text-gray-400 mr-2">{index + 1}.</span>
                {exp}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">暂无经历信息</p>
        )}
      </motion.div>

      {/* 诚信提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
      >
        <p className="text-sm text-yellow-800 flex items-start gap-2">
          <span className="flex-shrink-0">⚠️</span>
          <span>
            <strong>重要提示：</strong>
            AI只会帮你翻译真实经历，不会虚构内容。如果你的经历信息不足，AI会提示你补充。
            请遵循诚信求职原则，不虚构、不夸大、不造假。
          </span>
        </p>
      </motion.div>
    </div>
  );
}
