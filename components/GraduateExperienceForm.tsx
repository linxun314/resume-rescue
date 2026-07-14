// components/GraduateExperienceForm.tsx - 考研经历问题表单

'use client';

import { motion } from 'framer-motion';

// 经历表单数据类型（导出供其他模块使用）
export interface ExperienceFormData {
  [key: string]: {
    [question: string]: string;
  };
}

interface GraduateExperienceFormProps {
  selectedTypes: string[];
  onDataChange: (data: ExperienceFormData) => void;
  data: ExperienceFormData;
  onBack?: () => void;
  onComplete?: () => void;
}

// 问题配置
const questionConfig: Record<string, { title: string; questions: { id: string; text: string; placeholder: string; tip?: string }[] }> = {
  'course-project': {
    title: '📚 课程项目/课程设计',
    questions: [
      { id: 'course', text: '课程名称', placeholder: '例如：数据结构与算法、机器学习' },
      { id: 'topic', text: '项目主题', placeholder: '例如：基于XX的XX系统设计与实现' },
      { id: 'role', text: '你承担了什么角色', placeholder: '组长/组员，负责XX部分' },
      { id: 'method', text: '用了什么方法/技术', placeholder: '例如：使用Python实现XX算法，使用XX框架' },
      { id: 'result', text: '成果如何', placeholder: '例如：完成报告一份、代码已开源、获优秀项目' },
      { id: 'learning', text: '你学到了什么', placeholder: '例如：掌握了XX算法、提升了编程能力', tip: '考研简历重点展现学习能力' },
    ],
  },
  'competition': {
    title: '🏆 学科竞赛',
    questions: [
      { id: 'name', text: '竞赛名称和级别', placeholder: '例如：全国大学生数学建模竞赛（国家级）' },
      { id: 'topic', text: '参赛题目', placeholder: '例如：XX问题的建模与求解' },
      { id: 'role', text: '你承担了什么角色', placeholder: '负责建模/编程/论文写作' },
      { id: 'method', text: '用了什么方法/技术', placeholder: '例如：使用XX模型求解，使用XX软件实现' },
      { id: 'award', text: '获得了什么奖项', placeholder: '例如：省一等奖、国家二等奖' },
    ],
  },
  'research-project': {
    title: '🔬 科研/实验室经历',
    questions: [
      { id: 'lab', text: '实验室/项目名称', placeholder: '例如：XX实验室、XX项目组' },
      { id: 'direction', text: '研究方向', placeholder: '例如：机器学习、计算机视觉' },
      { id: 'role', text: '你承担了什么工作', placeholder: '例如：文献调研、实验设计、数据分析' },
      { id: 'method', text: '用了什么方法/工具', placeholder: '例如：使用XX框架、Python、MATLAB' },
      { id: 'result', text: '成果如何', placeholder: '例如：撰写论文一篇、完成实验报告' },
      { id: 'learning', text: '你学到了什么', placeholder: '例如：了解了科研流程、学会了文献检索', tip: '导师最看重科研潜力' },
    ],
  },
  'paper': {
    title: '📝 论文/专利',
    questions: [
      { id: 'title', text: '论文题目', placeholder: '例如：基于XX的XX方法研究' },
      { id: 'journal', text: '发表在什么期刊/会议', placeholder: '例如：XX学报、XX会议' },
      { id: 'author', text: '你是第几作者', placeholder: '第一作者/第二作者/通讯作者' },
      { id: 'contribution', text: '你的主要贡献', placeholder: '例如：负责实验设计和数据分析' },
      { id: 'impact', text: '被引用/下载情况（如有）', placeholder: '例如：已被引用10次' },
    ],
  },
  'self-learning': {
    title: '📖 自学经历',
    questions: [
      { id: 'topic', text: '自学了什么', placeholder: '例如：Python编程、机器学习' },
      { id: 'path', text: '通过什么途径', placeholder: '例如：Coursera、B站、GitHub' },
      { id: 'level', text: '达到什么水平', placeholder: '例如：能独立完成项目、获得证书' },
      { id: 'output', text: '有什么产出', placeholder: '例如：GitHub项目、技术博客' },
    ],
  },
  'honor': {
    title: '🏅 荣誉奖项',
    questions: [
      { id: 'name', text: '什么奖项', placeholder: '例如：国家奖学金、校级三好学生' },
      { id: 'level', text: '什么级别', placeholder: '校级/省级/国家级' },
      { id: 'time', text: '什么时候获得', placeholder: '例如：2023年' },
    ],
  },
  'student-work': {
    title: '👥 学生工作',
    questions: [
      { id: 'org', text: '什么组织/什么职位', placeholder: '例如：学生会副主席、班长' },
      { id: 'activity', text: '组织了什么活动', placeholder: '例如：迎新晚会、学术论坛' },
      { id: 'result', text: '有什么成果', placeholder: '例如：参与人数500+、获优秀组织奖' },
    ],
  },
  'internship': {
    title: '💼 实习经历',
    questions: [
      { id: 'company', text: '公司名称和岗位', placeholder: '例如：XX公司-算法实习生' },
      { id: 'work', text: '主要工作内容', placeholder: '例如：负责XX算法优化' },
      { id: 'skill', text: '用了什么技能', placeholder: '例如：Python、TensorFlow' },
      { id: 'result', text: '有什么成果', placeholder: '例如：算法效率提升20%' },
    ],
  },
};

export default function GraduateExperienceForm({
  selectedTypes,
  onDataChange,
  data,
  onBack,
  onComplete
}: GraduateExperienceFormProps) {

  const handleQuestionChange = (typeId: string, questionId: string, value: string) => {
    onDataChange({
      ...data,
      [typeId]: {
        ...data[typeId],
        [questionId]: value,
      },
    });
  };

  // 只显示选中的经历类型
  const activeTypes = selectedTypes.filter((type) => questionConfig[type]);

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
            返回经历选择
          </button>
          {onComplete && (
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v2" transform="rotate(90 12 12)" />
              </svg>
              生成考研简历
            </button>
          )}
        </div>

        <div className="space-y-6">
          {activeTypes.map((typeId, index) => {
            const config = questionConfig[typeId];
            if (!config) return null;

            return (
              <motion.div
                key={typeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-4">{config.title}</h3>

                <div className="space-y-4">
                  {config.questions.map((question) => (
                    <div key={question.id}>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {question.text}
                        {question.tip && (
                          <span className="text-purple-600 text-xs ml-2">💡 {question.tip}</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={data[typeId]?.[question.id] || ''}
                        onChange={(e) => handleQuestionChange(typeId, question.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        placeholder={question.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* 如果没有选择任何经历 */}
          {activeTypes.length === 0 && (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">
                请在上一步选择你的经历类型
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
