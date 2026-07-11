// components/ResultDisplay.tsx - 结果展示组件（设计心理学版）
'use client';
import { useState } from 'react';
import PsychologyPanel from './PsychologyPanel';
import ResumePreview from './ResumePreview';

interface ConfidenceBoost {
  hidden_value: string;
  evidence: string;
  reassurance: string;
  growth_mindset: string;
  abilities: string[];
}

interface Experience {
  title: string;
  role: string;
  realistic: string;
  optimized: string;
  abilities: string[];
  impact: string;
}

interface ResumeResult {
  confidence_boost: ConfidenceBoost;
  headline: {
    realistic: string;
    optimized: string;
  };
  experiences: Experience[];
  skills: {
    realistic: string[];
    optimized: string[];
  };
  self_evaluation: {
    realistic: string;
    optimized: string;
  };
  interview_tips: string[];
}

interface ResultDisplayProps {
  result: ResumeResult;
  onCopy: () => void;
  onReset: () => void;
}

export default function ResultDisplay({ result, onCopy, onReset }: ResultDisplayProps) {
  const [viewMode, setViewMode] = useState<'psychology' | 'resume'>('psychology');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCopy = () => {
    onCopy();
    setShowCelebration(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* 顶部导航 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('psychology')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  viewMode === 'psychology'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ✨ 发现价值
              </button>
              <button
                onClick={() => setViewMode('resume')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  viewMode === 'resume'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📄 简历内容
              </button>
            </div>
            <button
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              重新开始
            </button>
          </div>
        </div>

        {/* 内容区 */}
        {viewMode === 'psychology' ? (
          <div className="space-y-6">
            {/* 心理赋能面板 - 峰终定律的"峰" */}
            <PsychologyPanel confidenceBoost={result.confidence_boost} />

            {/* 引导到简历视图 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <p className="text-gray-600 mb-4">想看翻译成简历的样子吗？</p>
              <button
                onClick={() => setViewMode('resume')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
              >
                查看简历内容 📄
              </button>
            </div>
          </div>
        ) : (
          <ResumePreview
            result={result}
            onCopy={handleCopy}
          />
        )}
      </div>

      {/* 完成庆祝弹窗 - 峰终定律的"终" */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg mb-4">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                恭喜你！完成了一次重要的自我探索
              </h2>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 mb-6 border border-green-100">
              <p className="text-gray-800 leading-relaxed text-center font-medium">
                你刚刚做了 90% 大学生都不会做的事：<br/>
                <span className="text-green-600">认真梳理自己的价值</span>
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-xl text-green-500">✓</span>
                <div>
                  <p className="text-gray-800 font-medium">你的焦虑说明你在认真对待这件事</p>
                  <p className="text-gray-500 text-sm">焦虑不是弱点，而是你在乎的证明</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl text-green-500">✓</span>
                <div>
                  <p className="text-gray-800 font-medium">你的经历证明你具备可迁移能力</p>
                  <p className="text-gray-500 text-sm">学习能力、解决问题、主动推动...这些在任何岗位都稀缺</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl text-green-500">✓</span>
                <div>
                  <p className="text-gray-800 font-medium">面试官要的不是完美经历，是闭环思维</p>
                  <p className="text-gray-500 text-sm">你能发现问题→学习→解决→拿到结果，这就是闭环</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">💡 下一步建议：</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 打开简历，根据生成的内容调整格式</li>
                <li>• 准备2-3个经历的具体细节（以备面试深挖）</li>
                <li>• 对着镜子练习讲自己的故事</li>
              </ul>
            </div>

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              去投简历！我已经准备好了 💪
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
