// components/AnxietyRelief.tsx - 心理预设组件（设计心理学版）
'use client';
import { useState } from 'react';

interface AnxietyReliefProps {
  onStart: () => void;
}

export default function AnxietyRelief({ onStart }: AnxietyReliefProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 主卡片 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">

          {/* 标题区 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">💡</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              在开始之前...
            </h1>
            <p className="text-gray-500">有几件事想告诉你</p>
          </div>

          {/* 心理学内容 */}
          <div className="space-y-6 mb-8">

            {/* 数据支撑：降低孤立感 */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                90%
              </div>
              <div>
                <p className="text-gray-800 font-medium mb-1">的大学生都有&quot;简历焦虑&quot;</p>
                <p className="text-gray-600 text-sm">你不是一个人。即使是那些看起来光鲜亮丽的同学，也常常不知道怎么写简历。</p>
              </div>
            </div>

            {/* 认知重构 */}
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                ✨
              </div>
              <div>
                <p className="text-gray-800 font-medium mb-1">你缺的不是经历，是&quot;翻译经历&quot;的能力</p>
                <p className="text-gray-600 text-sm">很多时候，你以为不值一提的小事，在面试官眼里可能恰恰是他们看重的能力。</p>
              </div>
            </div>

            {/* 预期引导 */}
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                🎯
              </div>
              <div>
                <p className="text-gray-800 font-medium mb-1">接下来，我们会帮你发现自己的&quot;隐藏价值&quot;</p>
                <p className="text-gray-600 text-sm">这不是简历扩写，这是一次重新认识自己的旅程。你会惊讶于自己原来已经具备了这么多能力。</p>
              </div>
            </div>
          </div>

          {/* 承诺勾选 */}
          <label className="flex items-center gap-3 mb-6 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              我愿意认真回答问题，重新认识自己
            </span>
          </label>

          {/* 开始按钮 */}
          <button
            onClick={onStart}
            disabled={!isChecked}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              isChecked
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isChecked ? '准备好了，开始发现我的价值！' : '请先勾选承诺'}
          </button>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-gray-400 text-sm mt-6">
          预计需要 5-8 分钟 · 请找一个安静的环境
        </p>
      </div>
    </div>
  );
}
