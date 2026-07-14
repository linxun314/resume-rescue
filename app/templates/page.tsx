'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { resumeMetas, filterResumeByTags } from '@/lib/resumeData';

export default function TemplatesPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 所有标签
  const allTags = [
    '无实习',
    '有社团',
    '有课程项目',
    '有项目经历',
    '有社团组织经历',
    '对用户需求敏感',
    '有创业经历',
    '有销售经历',
    '商业敏感度高',
    '自学编程',
    '有个人项目',
    '非科班转技术',
    '考研',
    '有竞赛经历',
    '编程能力强',
    '学习成绩好',
    '英语较好',
  ];

  // 筛选后的简历
  const filteredResumes = selectedTags.length > 0
    ? filterResumeByTags(selectedTags)
    : resumeMetas;

  // 切换标签
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 难度颜色映射
  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  const difficultyText = {
    easy: '入门',
    medium: '进阶',
    hard: '挑战',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            高分简历范本
          </h1>
          <p className="text-gray-600 mb-6">
            所有范本遵循：<span className="font-semibold">一页纸</span> ·{' '}
            <span className="font-semibold">STAR量化</span> ·{' '}
            <span className="font-semibold">不造假</span> ·{' '}
            <span className="font-semibold">真实经历转化</span>
          </p>

          {/* 撰写标准 */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3 text-left">📌 撰写标准</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 text-left">
              <div className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>一页纸：</strong>控制在一页A4纸内</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>STAR量化：</strong>情境-任务-行动-结果</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>不造假：</strong>所有经历均为真实</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>真实转化：</strong>普通经历→职场语言</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 标签筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            按标签筛选：
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              清除筛选
            </button>
          )}
        </motion.div>

        {/* 简历卡片列表 */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredResumes.map((meta, index) => (
            <motion.div
              key={meta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/templates/${meta.id}`}>
                <div
                  className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-lg cursor-pointer ${
                    meta.highlight
                      ? 'border-blue-300 shadow-md'
                      : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  {/* 推荐标签 */}
                  {meta.highlight && (
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                        👍 推荐新手
                      </span>
                    </div>
                  )}

                  {/* 标题和难度 */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {meta.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        difficultyColor[meta.difficulty]
                      }`}
                    >
                      {difficultyText[meta.difficulty]}
                    </span>
                  </div>

                  {/* 描述 */}
                  <p className="text-sm text-gray-600 mb-3">{meta.description}</p>

                  {/* 适合岗位 */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">适合岗位：</p>
                    <div className="flex flex-wrap gap-1">
                      {meta.targetJobs.map((job) => (
                        <span
                          key={job}
                          className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 撰写时间 */}
                  <div className="text-xs text-gray-500">
                    📝 预计撰写时间：{meta.writingTime}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <p className="text-sm text-yellow-800">
            <strong>💡 温馨提示：</strong>
            所有简历范本均为真实经历转化，遵循诚信求职原则。请根据自己的实际情况调整内容，不要直接复制。
          </p>
        </motion.div>

      </div>
    </div>
  );
}
