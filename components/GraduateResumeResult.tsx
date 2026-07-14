// components/GraduateResumeResult.tsx - 考研简历结果展示组件

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GraduateBasicInfo } from './GraduateBasicInfoForm';
import type { ExperienceFormData } from './GraduateExperienceForm';

interface GraduateResumeResultProps {
  basicInfo: GraduateBasicInfo;
  experienceData: ExperienceFormData;
  selectedTypes: string[];
  onReset: () => void;
}

export default function GraduateResumeResult({
  basicInfo,
  experienceData,
  selectedTypes,
  onReset,
}: GraduateResumeResultProps) {
  const [copied, setCopied] = useState(false);

  // 生成简历文本
  const generateResumeText = () => {
    let resume = '';

    // 基本信息
    resume += `# ${basicInfo.name}\n\n`;
    resume += `${basicInfo.gender || ''} | ${basicInfo.phone} | ${basicInfo.email}\n`;
    resume += `${basicInfo.school} | ${basicInfo.major} | ${basicInfo.degree} | ${basicInfo.graduationYear}届\n\n`;

    // 学业成绩
    if (basicInfo.gpa || basicInfo.ranking) {
      resume += `---\n\n## 学业成绩\n\n`;
      if (basicInfo.gpa) resume += `- GPA/均分：${basicInfo.gpa}\n`;
      if (basicInfo.ranking) resume += `- 专业排名：${basicInfo.ranking}\n`;
      resume += '\n';
    }

    // 英语水平
    if (basicInfo.englishLevel) {
      resume += `---\n\n## 英语水平\n\n`;
      resume += `- ${basicInfo.englishLevel}：${basicInfo.englishScore}分\n\n`;
    }

    // 考研信息
    if (basicInfo.targetSchool || basicInfo.targetMajor) {
      resume += `---\n\n## 考研信息\n\n`;
      if (basicInfo.targetSchool) resume += `- 目标学校：${basicInfo.targetSchool}\n`;
      if (basicInfo.targetMajor) resume += `- 目标专业：${basicInfo.targetMajor}\n`;
      if (basicInfo.targetDirection) resume += `- 研究方向：${basicInfo.targetDirection}\n`;
      if (basicInfo.examScore) resume += `- 初试成绩：${basicInfo.examScore}\n`;
      resume += '\n';
    }

    // 经历（按重要性排序）
    const typeOrder = ['paper', 'research-project', 'competition', 'course-project', 'internship', 'self-learning', 'honor', 'student-work'];
    const sortedTypes = [...selectedTypes].sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b));

    const typeNames: Record<string, string> = {
      'course-project': '课程项目',
      'competition': '学科竞赛',
      'research-project': '科研经历',
      'paper': '论文专利',
      'self-learning': '自学经历',
      'honor': '荣誉奖项',
      'student-work': '学生工作',
      'internship': '实习经历',
    };

    resume += `---\n\n## 科研经历\n\n`;
    sortedTypes.forEach((typeId) => {
      const data = experienceData[typeId] || {};
      const hasData = Object.values(data).some((v) => v && v.trim());
      if (hasData) {
        resume += `**${typeNames[typeId] || typeId}**\n`;
        Object.entries(data).forEach(([, value]) => {
          if (value && value.trim()) {
            resume += `- ${value}\n`;
          }
        });
        resume += '\n';
      }
    });

    return resume;
  };

  const resumeText = generateResumeText();

  // 复制到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* 顶部导航 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              你的考研简历
            </h1>
            <button
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              重新开始
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          {/* 标题和复制按钮 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📄</span>
              简历预览
            </h2>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制简历
                </>
              )}
            </button>
          </div>

          {/* 简历预览 */}
          <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed text-gray-700">
            {resumeText}
          </div>

          {/* 提示 */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-800">
              <strong>💡 考研简历小贴士：</strong>
              发送简历给导师时，建议附上一封简短的邮件，说明你的研究兴趣和为什么选择这位导师。
            </p>
          </div>
        </motion.div>

        {/* 简历范本入口 */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 mt-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📋</div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-gray-800 mb-2">需要考研简历范本参考？</h3>
              <p className="text-sm text-gray-600 mb-4">
                我们为你准备了考研简历范本，涵盖计算机考研和通用考研方向，
                所有范本遵循学术简历规范，强调科研潜力和学习能力。
              </p>
              <a
                href="/templates"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                查看简历范本 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
