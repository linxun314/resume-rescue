// components/ResumePreview.tsx - 简历预览组件（面试官视角版）
'use client';
import { useState } from 'react';

interface ResumePreviewProps {
  result: {
    headline: {
      realistic: string;
      optimized: string;
    };
    experiences: Array<{
      title: string;
      role: string;
      realistic: string;
      optimized: string;
      abilities: string[];
      impact: string;
    }>;
    skills: {
      realistic: string[];
      optimized: string[];
    };
    self_evaluation: {
      realistic: string;
      optimized: string;
    };
    interview_tips: string[];
  };
  onCopy: () => void;
}

export default function ResumePreview({ result, onCopy }: ResumePreviewProps) {
  const [showMode, setShowMode] = useState<'optimized' | 'realistic'>('optimized');

  return (
    <div className="space-y-6">

      {/* 模式切换 */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex gap-3">
          <button
            onClick={() => setShowMode('optimized')}
            className={`flex-1 py-2 rounded-xl font-medium transition-all ${
              showMode === 'optimized'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            ✨ 面试官视角
          </button>
          <button
            onClick={() => setShowMode('realistic')}
            className={`flex-1 py-2 rounded-xl font-medium transition-all ${
              showMode === 'realistic'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            📝 原始表达
          </button>
        </div>
      </div>

      {/* 简历内容 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">

        {/* 一句话介绍 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">一句话介绍</h3>
          <p className="text-gray-700 leading-relaxed">
            {showMode === 'optimized' ? result.headline.optimized : result.headline.realistic}
          </p>
        </div>

        <hr className="border-gray-100" />

        {/* 项目经历 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">项目经历</h3>
          <div className="space-y-5">
            {result.experiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-800">{exp.title}</h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {exp.role}
                  </span>
                </div>
                <p className="text-gray-700 mb-2 leading-relaxed">
                  {showMode === 'optimized' ? exp.optimized : exp.realistic}
                </p>
                {showMode === 'optimized' && (
                  <>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {exp.abilities.map((ability, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full"
                        >
                          {ability}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">💡 {exp.impact}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 技能标签 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">技能标签</h3>
          <div className="flex flex-wrap gap-2">
            {(showMode === 'optimized' ? result.skills.optimized : result.skills.realistic).map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  showMode === 'optimized'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 自我评价 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">自我评价</h3>
          <p className="text-gray-700 leading-relaxed">
            {showMode === 'optimized' ? result.self_evaluation.optimized : result.self_evaluation.realistic}
          </p>
        </div>

        {/* 面试建议 */}
        {showMode === 'optimized' && (
          <>
            <hr className="border-gray-100" />
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="text-lg font-bold text-gray-800 mb-2">💡 面试小贴士</h3>
              <ul className="space-y-2">
                {result.interview_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* 复制按钮 */}
      <button
        onClick={onCopy}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all"
      >
        📋 复制到简历
      </button>
    </div>
  );
}
