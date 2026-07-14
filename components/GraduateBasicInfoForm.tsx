// components/GraduateBasicInfoForm.tsx - 考研基本信息表单

'use client';

import { motion } from 'framer-motion';

// 考研基本信息类型（导出供其他模块使用）
export interface GraduateBasicInfo {
  name: string;
  gender: string;
  phone: string;
  email: string;
  school: string;
  major: string;
  degree: '本科' | '硕士';
  graduationYear: string;
  gpa: string;
  ranking: string;
  englishLevel: string;
  englishScore: string;
  targetSchool: string;
  targetMajor: string;
  targetDirection: string; // 研究方向
  examScore?: string; // 初试成绩（可选）
}

interface GraduateBasicInfoFormProps {
  data: GraduateBasicInfo;
  onChange: (data: GraduateBasicInfo) => void;
  onBack?: () => void;
  onNext?: () => void;
}

export default function GraduateBasicInfoForm({ data, onChange, onBack, onNext }: GraduateBasicInfoFormProps) {

  const handleChange = (field: keyof GraduateBasicInfo, value: string) => {
    onChange({ ...data, [field]: value });
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
            返回场景选择
          </button>
          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              下一步
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
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            基本信息
          </h2>

          {/* 个人信息 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              个人信息
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">姓名 *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="张三"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">性别</label>
                <select
                  value={data.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">手机号 *</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="138-0000-0000"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">邮箱 *</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          {/* 教育背景 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              教育背景
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">本科学校 *</label>
                <input
                  type="text"
                  value={data.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="某某大学"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">专业 *</label>
                <input
                  type="text"
                  value={data.major}
                  onChange={(e) => handleChange('major', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="计算机科学与技术"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">毕业年份</label>
                <input
                  type="text"
                  value={data.graduationYear}
                  onChange={(e) => handleChange('graduationYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="2025"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">学位</label>
                <select
                  value={data.degree}
                  onChange={(e) => handleChange('degree', e.target.value as '本科' | '硕士')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="本科">本科</option>
                  <option value="硕士">硕士（考博）</option>
                </select>
              </div>
            </div>
          </div>

          {/* 学业成绩（考研重点） */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              学业成绩
              <span className="text-xs text-purple-600 ml-2">⭐ 考研简历重点</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">GPA/均分</label>
                <input
                  type="text"
                  value={data.gpa}
                  onChange={(e) => handleChange('gpa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="3.6/4.0 或 均分85"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">专业排名</label>
                <input
                  type="text"
                  value={data.ranking}
                  onChange={(e) => handleChange('ranking', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="前10% 或 5/100"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 如果成绩不够好，可以不写排名，只写GPA。导师更看重科研潜力。
            </p>
          </div>

          {/* 英语水平（考研重点） */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              英语水平
              <span className="text-xs text-purple-600 ml-2">⭐ 考研简历重点</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">英语等级</label>
                <select
                  value={data.englishLevel}
                  onChange={(e) => handleChange('englishLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">请选择</option>
                  <option value="CET-4">CET-4（四级）</option>
                  <option value="CET-6">CET-6（六级）</option>
                  <option value="雅思">雅思（IELTS）</option>
                  <option value="托福">托福（TOEFL）</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">分数</label>
                <input
                  type="text"
                  value={data.englishScore}
                  onChange={(e) => handleChange('englishScore', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 六级分数较高（500+）建议标注，体现英语阅读文献能力。
            </p>
          </div>

          {/* 考研信息 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              考研信息
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">目标学校</label>
                <input
                  type="text"
                  value={data.targetSchool}
                  onChange={(e) => handleChange('targetSchool', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="XX大学"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">目标专业</label>
                <input
                  type="text"
                  value={data.targetMajor}
                  onChange={(e) => handleChange('targetMajor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="计算机科学与技术"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">研究方向（如有）</label>
                <input
                  type="text"
                  value={data.targetDirection}
                  onChange={(e) => handleChange('targetDirection', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="机器学习、自然语言处理、计算机视觉等"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">
                  初试成绩（如已出分）
                  <span className="text-gray-400 text-xs ml-1">（可选）</span>
                </label>
                <input
                  type="text"
                  value={data.examScore}
                  onChange={(e) => handleChange('examScore', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="总分380（政治70/英语75/数学120/专业课125）"
                />
              </div>
            </div>
          </div>

          {/* 提示 */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-800">
              <strong>💡 考研简历小贴士：</strong>
              导师最看重的是<strong>科研潜力</strong>和<strong>学习能力</strong>。
              即使没有论文，也可以通过课程项目、竞赛经历、自学能力来展现。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
