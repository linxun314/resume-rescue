// components/ResumePreview.tsx — 高端视觉重构
'use client';
import { useRef } from 'react';
import PdfExport from './PdfExport';

interface ResumePreviewProps {
  result: {
    summary: string;
    experiences: Array<{
      title: string;
      organization: string;
      role: string;
      period: string;
      bullets: string[];
    }>;
    skills: {
      professional: string[];
      general: string[];
    };
  };
  onCopy: (mode: 'resume' | 'full') => void;
}

export default function ResumePreview({ result, onCopy }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4 md:space-y-6" role="article" aria-label="简历预览">
      {/* Resume content */}
      <div ref={resumeRef} className="card-shell">
        <div className="card-core print-area space-y-6">
          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-[0.1em] mb-3">个人简介</h3>
            <p className="text-sm text-surface-700 leading-relaxed">{result.summary}</p>
          </div>

          <hr className="border-surface-100" />

          {/* Experiences */}
          <div>
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-[0.1em] mb-4">项目经历</h3>
            <div className="space-y-5">
              {result.experiences.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-surface-200">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h4 className="font-bold text-surface-900 text-sm">{exp.title}</h4>
                    {exp.organization && (
                      <span className="text-2xs text-surface-400 bg-surface-50 px-2 py-0.5 rounded-full ring-1 ring-surface-100">
                        {exp.organization}
                      </span>
                    )}
                    <span className="text-xs text-surface-500">{exp.role}</span>
                    {exp.period && (
                      <span className="text-xs text-surface-400 ml-auto">{exp.period}</span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-xs text-surface-600 leading-relaxed flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-surface-300 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-surface-100" />

          {/* Professional skills */}
          {result.skills.professional.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-[0.1em] mb-3">专业技能</h3>
              <div className="flex flex-wrap gap-2">
                {result.skills.professional.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* General skills */}
          {result.skills.general.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-[0.1em] mb-3">通用能力</h3>
              <div className="flex flex-wrap gap-2">
                {result.skills.general.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-100 text-surface-600 ring-1 ring-surface-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onCopy('resume')}
          className="btn-primary"
          aria-label="复制简历内容到剪贴板"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          复制简历内容
        </button>
        <button
          onClick={() => onCopy('full')}
          className="btn-secondary"
          aria-label="复制完整报告到剪贴板"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          复制完整报告
        </button>
        <PdfExport targetRef={resumeRef} fileName="我的简历" />
      </div>
    </div>
  );
}
