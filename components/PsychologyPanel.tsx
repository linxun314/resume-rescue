// components/PsychologyPanel.tsx - 心理赋能面板（设计心理学版）
'use client';

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
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-6 md:p-8 border border-blue-100 shadow-lg mb-6">

      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
          <span className="text-2xl">✨</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">你的隐藏价值</h2>
          <p className="text-gray-500 text-sm">心理学研究表明：人往往低估了自己的能力</p>
        </div>
      </div>

      {/* 核心价值卡片 */}
      <div className="bg-white rounded-2xl p-5 mb-4 border-l-4 border-blue-500 shadow-sm">
        <p className="text-gray-800 leading-relaxed">{hidden_value}</p>
      </div>

      {/* 四个赋能模块 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* 证据锚定 */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📌</span>
            <span className="text-sm font-semibold text-gray-700">你的证据</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{evidence}</p>
        </div>

        {/* 焦虑缓解 */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💪</span>
            <span className="text-sm font-semibold text-gray-700">给你信心</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{reassurance}</p>
        </div>

        {/* 成长思维 */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🌱</span>
            <span className="text-sm font-semibold text-gray-700">换个角度看自己</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{growth_mindset}</p>
        </div>
      </div>

      {/* 能力标签云 */}
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">✨ 你的可迁移能力标签：</p>
        <div className="flex flex-wrap gap-2">
          {abilities.map((ability, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full shadow-sm"
            >
              {ability}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
