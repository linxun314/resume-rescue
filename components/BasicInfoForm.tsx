// components/BasicInfoForm.tsx — 高端视觉重构
'use client';
import { motion } from 'framer-motion';

export interface BasicInfo {
  major: string;
  workInMajor: boolean;
  skills: string;
  desiredJob: string;
}

interface BasicInfoFormProps {
  data: BasicInfo;
  onChange: (data: BasicInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BasicInfoForm({ data, onChange, onNext, onBack }: BasicInfoFormProps) {
  const canProceed = data.major.trim().length > 0;

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-4 safe-bottom overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-brand-50/40 blur-[120px] animate-orb-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-purple-50/30 blur-[100px] animate-orb-float" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="card-shell">
            <div className="card-core">
              {/* Back button */}
              <button
                onClick={onBack}
                className="btn-ghost mb-5 -ml-2"
                aria-label="返回场景选择"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-xs">返回</span>
              </button>

              {/* Header */}
              <div className="mb-8">
                <span className="eyebrow mb-3">基本信息</span>
                <h1 className="text-2xl md:text-3xl font-bold text-surface-900 tracking-[-0.02em] mb-1">
                  先聊聊你的背景
                </h1>
                <p className="text-surface-500 text-sm">不用写得很正式，大概情况就行</p>
              </div>

              <div className="space-y-6" role="form" aria-label="基本信息表单">
                {/* Major */}
                <div>
                  <label htmlFor="major-input" className="block text-xs font-semibold text-surface-600 mb-2 uppercase tracking-[0.05em]">
                    你的专业 <span className="text-danger-500">*</span>
                  </label>
                  <input
                    id="major-input"
                    type="text"
                    value={data.major}
                    onChange={(e) => onChange({ ...data, major: e.target.value })}
                    placeholder="例如：计算机科学与技术、市场营销"
                    className="form-input"
                    aria-required="true"
                  />
                </div>

                {/* Work in major */}
                <div role="radiogroup" aria-label="是否从事本专业工作">
                  <label className="block text-xs font-semibold text-surface-600 mb-2 uppercase tracking-[0.05em]">
                    毕业后想从事本专业吗？ <span className="text-danger-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: true, label: '想从事' },
                      { value: false, label: '想跨行' },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        role="radio"
                        aria-checked={data.workInMajor === opt.value}
                        onClick={() => onChange({ ...data, workInMajor: opt.value })}
                        className={`py-3 rounded-full font-medium text-sm transition-all duration-500 ease-premium min-h-touch ${
                          data.workInMajor === opt.value
                            ? 'bg-surface-900 text-white shadow-card'
                            : 'bg-surface-50 text-surface-500 ring-1 ring-surface-200 hover:ring-surface-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label htmlFor="skills-input" className="block text-xs font-semibold text-surface-600 mb-2 uppercase tracking-[0.05em]">
                    会什么技能 <span className="text-surface-400 font-normal normal-case tracking-normal">（选填）</span>
                  </label>
                  <textarea
                    id="skills-input"
                    value={data.skills}
                    onChange={(e) => onChange({ ...data, skills: e.target.value })}
                    placeholder="例如：Python、PS、剪辑、公众号运营、Excel"
                    rows={2}
                    className="form-textarea"
                  />
                </div>

                {/* Desired job */}
                <div>
                  <label htmlFor="desired-job-input" className="block text-xs font-semibold text-surface-600 mb-2 uppercase tracking-[0.05em]">
                    有想尝试的岗位吗？ <span className="text-surface-400 font-normal normal-case tracking-normal">（选填）</span>
                  </label>
                  <input
                    id="desired-job-input"
                    type="text"
                    value={data.desiredJob}
                    onChange={(e) => onChange({ ...data, desiredJob: e.target.value })}
                    placeholder="例如：运营实习生、数据分析、前端开发"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={() => canProceed && onNext()}
                disabled={!canProceed}
                className={`w-full py-4 mt-8 rounded-full font-semibold text-sm transition-all duration-500 ease-premium
                  active:scale-[0.97] min-h-touch
                  ${canProceed
                    ? 'bg-surface-900 text-white shadow-card hover:shadow-card-hover hover:bg-surface-800'
                    : 'bg-surface-100 text-surface-400 cursor-not-allowed'
                  }`}
                aria-label={canProceed ? '开始探索' : '请填写专业后继续'}
              >
                开始探索
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
