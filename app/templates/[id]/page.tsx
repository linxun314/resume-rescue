'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getResumeById } from '@/lib/resumeData';

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;
  const resume = getResumeById(resumeId);

  const [activeTab, setActiveTab] = useState<'content' | 'tips' | 'star'>('content');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // 如果简历不存在
  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">简历不存在</h1>
          <Link href="/templates" className="text-blue-600 hover:underline">
            返回简历列表
          </Link>
        </div>
      </div>
    );
  }

  // 复制完整简历
  const copyFullResume = () => {
    let content = `# ${resume.basicInfo.name}\n\n`;
    content += `📱 ${resume.basicInfo.phone} | 📧 ${resume.basicInfo.email} | 🏠 ${resume.basicInfo.location}\n`;
    content += `🎓 ${resume.basicInfo.education} · ${resume.basicInfo.major} · ${resume.basicInfo.graduationYear}\n`;
    content += `💼 求职意向：${resume.basicInfo.targetPosition}\n\n`;

    content += `---\n\n## 教育背景\n\n`;
    content += `**${resume.education.school}** | ${resume.education.major} | ${resume.education.degree} | ${resume.education.period}\n`;
    if (resume.education.gpa) content += `- ${resume.education.gpa}\n`;
    if (resume.education.courses && resume.education.courses.length > 0) {
      content += `- 核心课程：${resume.education.courses.join('、')}\n`;
    }
    if (resume.education.honors && resume.education.honors.length > 0) {
      content += `- 荣誉：${resume.education.honors.join('、')}\n`;
    }

    content += `\n---\n\n## 项目经历\n\n`;
    resume.projectExperiences.forEach((exp) => {
      content += `**${exp.title}** | ${exp.role} | ${exp.period}\n`;
      content += `**情境(S)**：${exp.situation}\n`;
      content += `**任务(T)**：${exp.task}\n`;
      content += `**行动(A)**：${exp.action}\n`;
      content += `**结果(R)**：${exp.result}\n\n`;
    });

    if (resume.practiceExperiences && resume.practiceExperiences.length > 0) {
      content += `---\n\n## 校园实践\n\n`;
      resume.practiceExperiences.forEach((practice) => {
        content += `**${practice.organization}** | ${practice.role} | ${practice.period}\n`;
        practice.achievements.forEach((achievement) => {
          content += `- ${achievement}\n`;
        });
        content += `\n`;
      });
    }

    content += `---\n\n## 技能证书\n\n`;
    resume.skills.categories.forEach((category) => {
      content += `**${category.name}**：${category.items.join('、')}\n`;
    });

    content += `\n---\n\n## 自我评价\n\n`;
    resume.selfEvaluation.forEach((item) => {
      content += `- **${item.title}**：${item.description}\n`;
    });

    navigator.clipboard.writeText(content).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回简历列表
          </button>
        </motion.div>

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {resume.title}
              </h1>
              <p className="text-gray-600">{resume.description}</p>
            </div>
            <button
              onClick={copyFullResume}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copiedText ? '已复制!' : '复制简历'}
            </button>
          </div>

          {/* 标签和岗位 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {resume.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-500">适合岗位：</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {resume.targetJobs.map((job) => (
                <span key={job} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  {job}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📄 简历内容
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tips'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            💡 撰写要点
          </button>
          <button
            onClick={() => setActiveTab('star')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'star'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ⭐ STAR案例
          </button>
        </div>

        {/* 内容区域 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          {/* 简历内容 */}
          {activeTab === 'content' && (
            <div>
              {/* 基本信息 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
                  基本信息
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {resume.basicInfo.name}
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>📱 {resume.basicInfo.phone}</p>
                    <p>📧 {resume.basicInfo.email}</p>
                    <p>🏠 {resume.basicInfo.location}</p>
                    <p>🎓 {resume.basicInfo.education} · {resume.basicInfo.major}</p>
                    <p>📅 {resume.basicInfo.graduationYear}</p>
                    <p>💼 求职意向：{resume.basicInfo.targetPosition}</p>
                  </div>
                </div>
              </div>

              {/* 教育背景 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
                  教育背景
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">
                    {resume.education.school} | {resume.education.major} | {resume.education.degree} | {resume.education.period}
                  </p>
                  {resume.education.gpa && (
                    <p className="text-sm text-gray-600 mt-2">• {resume.education.gpa}</p>
                  )}
                  {resume.education.courses && resume.education.courses.length > 0 && (
                    <p className="text-sm text-gray-600">
                      • 核心课程：{resume.education.courses.join('、')}
                    </p>
                  )}
                  {resume.education.honors && resume.education.honors.length > 0 && (
                    <p className="text-sm text-gray-600">
                      • 荣誉：{resume.education.honors.join('、')}
                    </p>
                  )}
                </div>
              </div>

              {/* 项目经历 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
                  项目经历
                </h2>
                {resume.projectExperiences.map((exp, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-800">
                        {exp.title} | {exp.role}
                      </p>
                      <span className="text-sm text-gray-500">{exp.period}</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>情境(S)：</strong>{exp.situation}</p>
                      <p><strong>任务(T)：</strong>{exp.task}</p>
                      <p><strong>行动(A)：</strong>{exp.action}</p>
                      <p className="text-blue-700"><strong>结果(R)：</strong>{exp.result}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 校园实践 */}
              {resume.practiceExperiences && resume.practiceExperiences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
                    校园实践
                  </h2>
                  {resume.practiceExperiences.map((practice, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-800">
                          {practice.organization} | {practice.role}
                        </p>
                        <span className="text-sm text-gray-500">{practice.period}</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {practice.achievements.map((achievement, i) => (
                          <li key={i}>• {achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* 技能证书 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
                  技能证书
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {resume.skills.categories.map((category, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      <strong>{category.name}：</strong>
                      {category.items.join('、')}
                    </p>
                  ))}
                </div>
              </div>

              {/* 自我评价 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
                  自我评价
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {resume.selfEvaluation.map((item, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      • <strong>{item.title}：</strong>{item.description}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 撰写要点 */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💡 撰写要点</h3>
              {resume.writingTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <span className="text-yellow-600 text-lg flex-shrink-0">💡</span>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {/* STAR案例 */}
          {activeTab === 'star' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">⭐ STAR优化案例</h3>
              <p className="text-sm text-gray-600 mb-6">
                对比原始表达和STAR优化后的表达，学习如何将普通经历转化为职场语言
              </p>
              {resume.starExamples.map((example, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-800">
                    {example.category}
                  </div>
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-4 bg-red-50 border-r border-gray-200">
                      <p className="text-xs text-red-600 font-semibold mb-2">❌ 原始表达</p>
                      <p className="text-sm text-gray-700">{example.original}</p>
                    </div>
                    <div className="p-4 bg-green-50">
                      <p className="text-xs text-green-600 font-semibold mb-2">✅ STAR优化后</p>
                      <p className="text-sm text-gray-700">{example.optimized}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>⚠️ 重要提示：</strong>
            所有简历范本均为真实经历转化，遵循诚信求职原则。请根据自己的实际情况调整内容，不要直接复制。
          </p>
        </motion.div>

      </div>
    </div>
  );
}
