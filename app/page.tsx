// app/page.tsx — 探索式流程重构
'use client';
import { useState, useMemo } from 'react';
import { showToast } from '@/lib/useToast';
import { track } from '@/lib/analytics';
import ToastContainer from '@/components/ToastContainer';
import LoadingProgress from '@/components/LoadingProgress';
import StepIndicator from '@/components/StepIndicator';
import AnxietyRelief from '@/components/AnxietyRelief';
import ScenarioSelector from '@/components/ScenarioSelector';
import QuestionFlow from '@/components/QuestionFlow';
import ResultDisplay from '@/components/ResultDisplay';
import ResumeGenerator from '@/components/ResumeGenerator';
import GraduateBasicInfoForm from '@/components/GraduateBasicInfoForm';
import GraduateExperienceSelector from '@/components/GraduateExperienceSelector';
import GraduateExperienceForm from '@/components/GraduateExperienceForm';
import GraduateResumeResult from '@/components/GraduateResumeResult';
import type { GraduateBasicInfo } from '@/components/GraduateBasicInfoForm';
import type { ExperienceFormData } from '@/components/GraduateExperienceForm';
import { getQuestionsByScenario, Scenario, Question } from '@/lib/prompts';
import type { ResumeResult } from '@/lib/types';
import type { BasicInfo } from '@/components/BasicInfoForm';
import JobSelector from '@/components/JobSelector';
import { resetFeedbackHistory } from '@/lib/feedbackEngine';

type Step = 'anxiety-relief' | 'scenario' | 'questions' | 'result' | 'generator'
  | 'job-select'
  | 'graduate-info' | 'graduate-experience-select' | 'graduate-experience-form' | 'graduate-result';

const STEP_INDEX_MAP: Record<Step, number> = {
  'anxiety-relief': 0,
  'scenario': 1,
  'questions': 2,
  'graduate-info': 2,
  'job-select': 3,
  'graduate-experience-select': 3,
  'graduate-experience-form': 4,
  'result': 4,
  'graduate-result': 5,
  'generator': 5,
};

const JOB_FLOW_LABELS = ['欢迎', '选择场景', '探索经历', '匹配岗位', '查看成果'];
const GRAD_FLOW_LABELS = ['欢迎', '选择场景', '基本信息', '选择经历', '填写经历', '查看简历'];

export default function Home() {
  const [step, setStep] = useState<Step>('anxiety-relief');
  const [scenario, setScenario] = useState<Scenario>('internship');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Graduate flow state
  const [graduateBasicInfo, setGraduateBasicInfo] = useState<GraduateBasicInfo>({
    name: '', gender: '', phone: '', email: '', school: '', major: '',
    degree: '本科', graduationYear: '', gpa: '', ranking: '',
    englishLevel: '', englishScore: '', targetSchool: '', targetMajor: '',
    targetDirection: '', examScore: '',
  });
  const [selectedExpTypes, setSelectedExpTypes] = useState<string[]>([]);
  const [graduateExpData, setGraduateExpData] = useState<ExperienceFormData>({});

  // Job flow state — derived from answers at API call time
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');

  const isGraduateFlow = scenario === 'graduate';
  const stepLabels = useMemo(() =>
    isGraduateFlow ? GRAD_FLOW_LABELS : JOB_FLOW_LABELS,
    [isGraduateFlow]
  );
  const currentStepIndex = STEP_INDEX_MAP[step] || 0;
  const showStepIndicator = step !== 'anxiety-relief' && step !== 'generator';

  const handleStart = () => {
    track('flow_started');
    setStep('scenario');
  };

  const handleScenarioSelect = (selectedScenario: Scenario) => {
    track('scenario_selected', { scenario: selectedScenario });
    setScenario(selectedScenario);
    if (selectedScenario === 'graduate') {
      setStep('graduate-info');
    } else {
      setQuestions(getQuestionsByScenario(selectedScenario));
      setStep('questions');
    }
  };

  const handleQuestionsComplete = (finalAnswers: Record<string, string>) => {
    track('questions_completed');
    setAnswers(finalAnswers);
    setStep('job-select');
  };

  const handleShowGenerator = () => {
    setStep('generator');
  };

  const handleJobConfirm = async (jobTitle: string) => {
    track('job_selected', { job: jobTitle, major: answers.q1 || '' });
    setSelectedJobTitle(jobTitle);
    setIsLoading(true);
    const startTime = Date.now();

    // Derive basicInfo from answers
    const derivedBasicInfo: BasicInfo = {
      major: answers.q1 || '',
      workInMajor: true,
      skills: answers.q8 || '',
      desiredJob: jobTitle,
    };

    // Collect reflection from the last open-ended answer
    const reflectionText = answers.q9 || answers.q8 || '';

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicInfo: derivedBasicInfo,
          answers,
          selectedJob: jobTitle,
          scenario,
          reflection: reflectionText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        track('api_generate_success', { latency_ms: Date.now() - startTime });
        setResult(data.result);
        setHasError(false);
        setStep('result');
      } else {
        track('api_generate_error', { error: data.error || 'unknown' });
        setHasError(true);
        showToast(data.error || '生成失败，请重试', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      track('api_generate_error', { error: 'network_error' });
      setHasError(true);
      showToast('生成失败，请重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (mode: 'resume' | 'full') => {
    if (!result) return;
    track('result_copied', { mode });
    const text = mode === 'resume'
      ? generateResumeText(result)
      : generateFullReportText(result);
    navigator.clipboard.writeText(text).then(() => {
      showToast('已复制到剪贴板！', 'success');
    }).catch(() => {
      showToast('复制失败，请手动复制', 'error');
    });
  };

  const handleReset = () => {
    resetFeedbackHistory();
    setStep('anxiety-relief');
    setScenario('internship');
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setHasError(false);
    setSelectedExpTypes([]);
    setGraduateExpData({});
    setSelectedJobTitle('');
    setGraduateBasicInfo({
      name: '', gender: '', phone: '', email: '', school: '', major: '',
      degree: '本科', graduationYear: '', gpa: '', ranking: '',
      englishLevel: '', englishScore: '', targetSchool: '', targetMajor: '',
      targetDirection: '', examScore: '',
    });
  };

  const handleToggleExpType = (typeId: string) => {
    setSelectedExpTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <ToastContainer />
        <LoadingProgress />
      </>
    );
  }

  // Error retry page
  if (hasError) {
    return (
      <>
        <ToastContainer />
        <div className="relative min-h-[100dvh] flex items-center justify-center p-4 safe-bottom overflow-hidden">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] rounded-full bg-red-50/30 blur-[120px]" />
          </div>
          <div className="max-w-md w-full">
            <div className="card-shell">
              <div className="card-core text-center" role="alertdialog" aria-label="生成失败提示">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5 ring-1 ring-red-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-surface-900 mb-2 tracking-[-0.02em]">生成失败</h1>
                <p className="text-surface-500 text-sm mb-6">AI 服务暂时不可用，请稍后重试</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleJobConfirm(selectedJobTitle)}
                    className="btn-primary flex-1"
                    aria-label="重试生成简历"
                  >
                    重试
                  </button>
                  <button
                    onClick={() => { setHasError(false); setStep('scenario'); }}
                    className="btn-secondary flex-1"
                    aria-label="重新选择场景"
                  >
                    重新选择
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render by step
  let content;
  switch (step) {
    case 'anxiety-relief':
      content = <AnxietyRelief onStart={handleStart} />;
      break;

    case 'scenario':
      content = <ScenarioSelector onSelect={handleScenarioSelect} />;
      break;

    case 'job-select':
      content = (
        <JobSelector
          basicInfo={{
            major: answers.q1 || '',
            workInMajor: true,
            skills: answers.q8 || '',
            desiredJob: '',
          }}
          answers={answers}
          onConfirm={handleJobConfirm}
          onBack={() => setStep('questions')}
        />
      );
      break;

    case 'questions':
      content = (
        <QuestionFlow
          questions={questions}
          scenario={scenario}
          onComplete={handleQuestionsComplete}
          onBack={() => setStep('scenario')}
          initialAnswers={answers}
        />
      );
      break;

    case 'result':
      content = result ? (
        <ResultDisplay
          result={result}
          onCopy={handleCopy}
          onReset={handleReset}
          onShowGenerator={handleShowGenerator}
          answers={answers}
          questions={questions}
          scenario={scenario}
        />
      ) : null;
      break;

    case 'generator':
      content = (
        <div className="relative min-h-[100dvh] py-8 md:py-16 px-4 safe-bottom">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-1/4 right-1/4 w-[40%] h-[40%] rounded-full bg-brand-50/20 blur-[120px]" />
          </div>
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setStep('result')}
              className="btn-ghost mb-8 -ml-2"
              aria-label="返回结果页面"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="text-xs">返回结果页</span>
            </button>

            <div className="text-center mb-12">
              <span className="eyebrow mb-3">学习展示</span>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-2 tracking-[-0.02em]">
                Few-Shot 学习展示
              </h1>
              <p className="text-surface-500">
                了解AI是如何学习优秀范本，为你生成高质量简历的
              </p>
            </div>

            <ResumeGenerator
              userInfo={{
                name: '用户',
                education: '某大学',
                major: answers.q1 || '未提供',
                graduationYear: '2025',
              }}
              targetJob={`${answers.q1 || '未提供'}相关岗位`}
              experiences={Object.entries(answers)
                .filter(([key]) => key !== 'q1' && key !== 'direction')
                .map(([, value]) => value as string)}
            />
          </div>
        </div>
      );
      break;

    case 'graduate-info':
      content = (
        <GraduateBasicInfoForm
          data={graduateBasicInfo}
          onChange={setGraduateBasicInfo}
          onBack={() => setStep('scenario')}
          onNext={() => setStep('graduate-experience-select')}
        />
      );
      break;

    case 'graduate-experience-select':
      content = (
        <GraduateExperienceSelector
          selectedTypes={selectedExpTypes}
          onToggle={handleToggleExpType}
          onBack={() => setStep('graduate-info')}
          onNext={() => setStep('graduate-experience-form')}
        />
      );
      break;

    case 'graduate-experience-form':
      content = (
        <GraduateExperienceForm
          selectedTypes={selectedExpTypes}
          onDataChange={setGraduateExpData}
          data={graduateExpData}
          onBack={() => setStep('graduate-experience-select')}
          onComplete={() => setStep('graduate-result')}
        />
      );
      break;

    case 'graduate-result':
      content = (
        <GraduateResumeResult
          basicInfo={graduateBasicInfo}
          experienceData={graduateExpData}
          selectedTypes={selectedExpTypes}
          onReset={handleReset}
        />
      );
      break;

    default:
      content = <AnxietyRelief onStart={handleStart} />;
  }

  return (
    <>
      <ToastContainer />
      {showStepIndicator && (
        <div className="sticky top-0 z-20 px-4 pt-4 safe-top">
          <StepIndicator
            currentStep={currentStepIndex}
            totalSteps={stepLabels.length}
            stepLabels={stepLabels}
          />
        </div>
      )}
      <main id="main-content" role="main">
        {content}
      </main>
    </>
  );
}

function generateResumeText(result: ResumeResult): string {
  let text = '';

  if (result.summary) {
    text += `【个人简介】\n${result.summary}\n\n`;
  }

  text += `【项目经历】\n`;
  result.experiences?.forEach((exp) => {
    text += `\n${exp.title}`;
    if (exp.organization) text += ` | ${exp.organization}`;
    if (exp.role) text += ` | ${exp.role}`;
    if (exp.period) text += ` | ${exp.period}`;
    text += '\n';
    if (exp.bullets) {
      exp.bullets.forEach((bullet: string) => {
        text += `- ${bullet}\n`;
      });
    }
  });

  if (result.skills?.professional?.length > 0) {
    text += `\n【专业技能】\n${result.skills.professional.join('、')}\n`;
  }

  if (result.skills?.general?.length > 0) {
    text += `\n【通用能力】\n${result.skills.general.join('、')}\n`;
  }

  return text;
}

function generateFullReportText(result: ResumeResult): string {
  let text = '';

  if (result.confidence_boost) {
    text += `【你的隐藏价值】\n${result.confidence_boost.hidden_value}\n\n`;
    text += `【支撑证据】\n${result.confidence_boost.evidence}\n\n`;
    if (result.confidence_boost.abilities?.length > 0) {
      text += `【能力标签】\n${result.confidence_boost.abilities.join('、')}\n\n`;
    }
  }

  text += generateResumeText(result);

  if (result.interview_tips?.length > 0) {
    text += `\n【面试建议】\n`;
    result.interview_tips.forEach((tip: string, i: number) => {
      text += `${i + 1}. ${tip}\n`;
    });
  }

  return text;
}
