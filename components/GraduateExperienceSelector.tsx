// components/GraduateExperienceSelector.tsx - 考研经历类型选择组件

'use client';

import { motion } from 'framer-motion';

interface ExperienceType {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  questions: string[];
}

interface GraduateExperienceSelectorProps {
  selectedTypes: string[];
  onToggle: (typeId: string) => void;
  onBack?: () => void;
  onNext?: () => void;
}

export default function GraduateExperienceSelector({
  selectedTypes,
  onToggle,
  onBack,
  onNext
}: GraduateExperienceSelectorProps) {

  // 考研经历类型（区别于求职简历）
  const experienceTypes: ExperienceType[] = [
    {
      id: 'course-project',
      title: '课程项目/课程设计',
      subtitle: '最普遍的科研入门经历',
      icon: '📚',
      description: '课程中的项目作业、课程设计、大作业',
      importance: 'high',
      questions: [],
    },
    {
      id: 'competition',
      title: '学科竞赛',
      subtitle: '体现专业能力和钻研精神',
      icon: '🏆',
      description: '数学建模、电子设计、程序设计等学科竞赛',
      importance: 'high',
      questions: [],
    },
    {
      id: 'research-project',
      title: '科研/实验室经历',
      subtitle: '导师最看重的经历',
      icon: '🔬',
      description: '参与导师项目、实验室科研、SRTP等',
      importance: 'high',
      questions: [],
    },
    {
      id: 'paper',
      title: '论文/专利',
      subtitle: '科研能力的直接证明',
      icon: '📝',
      description: '发表的论文、申请的专利',
      importance: 'high',
      questions: [],
    },
    {
      id: 'self-learning',
      title: '自学经历',
      subtitle: '体现学习能力和主动性',
      icon: '📖',
      description: '自学编程、在线课程、阅读文献等',
      importance: 'medium',
      questions: [],
    },
    {
      id: 'honor',
      title: '荣誉奖项',
      subtitle: '综合素质的体现',
      icon: '🏅',
      description: '奖学金、三好学生、优秀干部等',
      importance: 'medium',
      questions: [],
    },
    {
      id: 'student-work',
      title: '学生工作',
      subtitle: '体现责任感和组织能力',
      icon: '👥',
      description: '学生会、社团、班委等',
      importance: 'low',
      questions: [],
    },
    {
      id: 'internship',
      title: '实习经历',
      subtitle: '体现实践能力',
      icon: '💼',
      description: '公司实习、暑期实践等',
      importance: 'medium',
      questions: [],
    },
  ];

  // 重要性排序
  const sortedTypes = [...experienceTypes].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.importance] - order[b.importance];
  });

  // 重要性颜色
  const importanceColor = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  };

  const importanceText = {
    high: '⭐ 重要',
    medium: '一般',
    low: '可选',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onBack?.()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回基本信息
          </button>
          {onNext && (
            <button
              onClick={onNext}
              disabled={selectedTypes.length === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                selectedTypes.length > 0
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedTypes.length > 0 ? `下一步（已选${selectedTypes.length}项）` : '请至少选择一项'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            选择你的经历类型
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            勾选你有的经历类型，我们会帮你挖掘细节
          </p>

          {/* 经历类型卡片 */}
          <div className="grid md:grid-cols-2 gap-4">
            {sortedTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => onToggle(type.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTypes.includes(type.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* 复选框 */}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedTypes.includes(type.id)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedTypes.includes(type.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-semibold text-gray-800">{type.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{type.subtitle}</p>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>

                    {/* 重要性标签 */}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${importanceColor[type.importance]}`}>
                      {importanceText[type.importance]}
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* 提示 */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-800">
              <strong>💡 考研简历小贴士：</strong>
              导师最看重的是<strong>课程项目</strong>、<strong>竞赛</strong>、<strong>科研经历</strong>。
              即使没有论文，也可以通过这些经历展现科研潜力。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
