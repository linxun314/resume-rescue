// app/page.tsx - 主页面（Few-Shot增强版）
'use client';
import { useState } from 'react';
import { showToast } from '@/lib/useToast';
import { track } from '@/lib/analytics';
import ToastContainer from '@/components/ToastContainer';
import LoadingProgress from '@/components/LoadingProgress';
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

type Step = 'anxiety-relief' | 'scenario' | 'questions' | 'result' | 'generator'
  | 'graduate-info' | 'graduate-experience-select' | 'graduate-experience-form' | 'graduate-result';

export default function Home() {
  const [step, setStep] = useState<Step>('anxiety-relief');
  const [scenario, setScenario] = useState<Scenario>('internship');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 考研流程状态
  const [graduateBasicInfo, setGraduateBasicInfo] = useState<GraduateBasicInfo>({
    name: '', gender: '', phone: '', email: '', school: '', major: '',
    degree: '本科', graduationYear: '', gpa: '', ranking: '',
    englishLevel: '', englishScore: '', targetSchool: '', targetMajor: '',
    targetDirection: '', examScore: '',
  });
  const [selectedExpTypes, setSelectedExpTypes] = useState<string[]>([]);
  const [graduateExpData, setGraduateExpData] = useState<ExperienceFormData>({});

  // 从焦虑缓解页面进入场景选择
  const handleStart = () => {
    track('flow_started');
    setStep('scenario');
  };

  // 选择场景后加载对应问题集
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

  // 完成问题后调用AI生成简历
  const handleQuestionsComplete = async (finalAnswers: Record<string, string>) => {
    track('questions_completed');
    setAnswers(finalAnswers);
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: finalAnswers,
          scenario: scenario,
        }),
      });

      const data = await response.json();

      if (data.success) {
        track('api_generate_success', { latency_ms: Date.now() - startTime });
        setResult(data.result);
        setStep('result');
      } else {
        track('api_generate_error', { error: data.error || 'unknown' });
        showToast(data.error || '生成失败，请重试', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      track('api_generate_error', { error: 'network_error' });
      showToast('生成失败，请重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 显示Few-Shot生成器
  const handleShowGenerator = () => {
    setStep('generator');
  };

  // 复制简历内容
  const handleCopy = () => {
    track('result_copied');
    const text = generateCopyText(result);
    navigator.clipboard.writeText(text).then(() => {
      showToast('已复制到剪贴板！', 'success');
    }).catch(() => {
      showToast('复制失败，请手动复制', 'error');
    });
  };

  // 重置流程
  const handleReset = () => {
    setStep('anxiety-relief');
    setScenario('internship');
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setSelectedExpTypes([]);
    setGraduateExpData({});
  };

  // 切换经历类型选中状态
  const handleToggleExpType = (typeId: string) => {
    setSelectedExpTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  // 加载中状态 - 分步进度感知
  if (isLoading) {
    return (
      <>
        <ToastContainer />
        <LoadingProgress />
      </>
    );
  }

  // 根据步骤渲染不同组件
  let content;
  switch (step) {
    case 'anxiety-relief':
      content = <AnxietyRelief onStart={handleStart} />;
      break;

    case 'scenario':
      content = <ScenarioSelector onSelect={handleScenarioSelect} />;
      break;

    case 'questions':
      content = (
        <QuestionFlow
          questions={questions}
          scenario={scenario}
          onComplete={handleQuestionsComplete}
          onBack={() => setStep('scenario')}
        />
      );
      break;

    case 'result':
      content = (
        <ResultDisplay
          result={result}
          onCopy={handleCopy}
          onReset={handleReset}
          onShowGenerator={handleShowGenerator}
        />
      );
      break;

    case 'generator':
      content = (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* 返回按钮 */}
            <button
              onClick={() => setStep('result')}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回结果页
            </button>

            {/* 标题 */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Few-Shot 学习展示
              </h1>
              <p className="text-gray-600">
                了解AI是如何学习优秀范本，为你生成高质量简历的
              </p>
            </div>

            {/* Few-Shot生成器 */}
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
      {content}
    </>
  );
}

// 生成可复制的简历文本
function generateCopyText(result: any): string {
  let text = `【一句话介绍】\n${result.headline.optimized}\n\n`;

  text += `【项目经历】\n`;
  result.experiences.forEach((exp: any) => {
    text += `\n${exp.title} | ${exp.role}\n`;
    text += `${exp.optimized}\n`;
    text += `能力标签：${exp.abilities.join('、')}\n`;
    text += `实际影响：${exp.impact}\n`;
  });

  text += `\n【技能标签】\n${result.skills.optimized.join('、')}\n`;

  text += `\n【自我评价】\n${result.self_evaluation.optimized}\n`;

  text += `\n【面试建议】\n`;
  result.interview_tips.forEach((tip: string, i: number) => {
    text += `${i + 1}. ${tip}\n`;
  });

  return text;
}
