// app/page.tsx - 主页面（Few-Shot增强版）
'use client';
import { useState } from 'react';
import AnxietyRelief from '@/components/AnxietyRelief';
import ScenarioSelector from '@/components/ScenarioSelector';
import QuestionFlow from '@/components/QuestionFlow';
import ResultDisplay from '@/components/ResultDisplay';
import ResumeGenerator from '@/components/ResumeGenerator';
import { getQuestionsByScenario, Scenario, Question } from '@/lib/prompts';

type Step = 'anxiety-relief' | 'scenario' | 'questions' | 'result' | 'generator';

export default function Home() {
  const [step, setStep] = useState<Step>('anxiety-relief');
  const [scenario, setScenario] = useState<Scenario>('internship');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 从焦虑缓解页面进入场景选择
  const handleStart = () => {
    setStep('scenario');
  };

  // 选择场景后加载对应问题集
  const handleScenarioSelect = (selectedScenario: Scenario) => {
    setScenario(selectedScenario);
    setQuestions(getQuestionsByScenario(selectedScenario));
    setStep('questions');
  };

  // 完成问题后调用AI生成简历
  const handleQuestionsComplete = async (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setIsLoading(true);

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
        setResult(data.result);
        setStep('result');
      } else {
        alert(data.error || '生成失败，请重试');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('生成失败，请重试');
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
    const text = generateCopyText(result);
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板！');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  // 重置流程
  const handleReset = () => {
    setStep('anxiety-relief');
    setScenario('internship');
    setQuestions([]);
    setAnswers({});
    setResult(null);
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-4 animate-pulse">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">正在发现你的隐藏价值...</h2>
          <p className="text-gray-500">这可能需要 10-20 秒</p>
        </div>
      </div>
    );
  }

  // 根据步骤渲染不同组件
  switch (step) {
    case 'anxiety-relief':
      return <AnxietyRelief onStart={handleStart} />;

    case 'scenario':
      return <ScenarioSelector onSelect={handleScenarioSelect} />;

    case 'questions':
      return (
        <QuestionFlow
          questions={questions}
          scenario={scenario}
          onComplete={handleQuestionsComplete}
          onBack={() => setStep('scenario')}
        />
      );

    case 'result':
      return (
        <ResultDisplay
          result={result}
          onCopy={handleCopy}
          onReset={handleReset}
          onShowGenerator={handleShowGenerator}
        />
      );

    case 'generator':
      return (
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

    default:
      return <AnxietyRelief onStart={handleStart} />;
  }
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
