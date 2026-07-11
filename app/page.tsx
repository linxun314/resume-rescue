// app/page.tsx - 主页面（设计心理学版）
'use client';
import { useState } from 'react';
import AnxietyRelief from '@/components/AnxietyRelief';
import QuestionFlow from '@/components/QuestionFlow';
import ResultDisplay from '@/components/ResultDisplay';
import { QUESTIONS } from '@/lib/prompts';

type Step = 'anxiety-relief' | 'questions' | 'result';

export default function Home() {
  const [step, setStep] = useState<Step>('anxiety-relief');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setStep('questions');
  };

  const handleQuestionsComplete = async (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: finalAnswers }),
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

  const handleCopy = () => {
    const text = generateCopyText(result);
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板！');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  const handleReset = () => {
    setStep('anxiety-relief');
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
    case 'questions':
      return (
        <QuestionFlow
          questions={QUESTIONS}
          onComplete={handleQuestionsComplete}
          onBack={() => setStep('anxiety-relief')}
        />
      );
    case 'result':
      return (
        <ResultDisplay
          result={result}
          onCopy={handleCopy}
          onReset={handleReset}
        />
      );
    default:
      return <AnxietyRelief onStart={handleStart} />;
  }
}

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
