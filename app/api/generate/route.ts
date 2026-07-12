// app/api/generate/route.ts - API路由（Few-Shot增强版）
import { NextRequest, NextResponse } from 'next/server';
import { RESUME_SYSTEM_PROMPT, RESUME_USER_PROMPT_TEMPLATE, Scenario } from '@/lib/prompts';
import { generateFewShotPrompt } from '@/lib/fewShotPromptGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, scenario } = body;

    // 从环境变量获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '服务器未配置 API 密钥' },
        { status: 500 }
      );
    }

    // 构建用户提示词 - 使用Few-Shot Prompt生成器
    const major = answers.major || answers.q1 || '未提供';
    const direction = answers.direction || '未提供';
    const targetJob = `${major}相关${direction !== '未提供' ? `·${direction}` : ''}岗位`;

    // 整合用户回答为经历描述
    const answersText = Object.entries(answers)
      .filter(([key]) => key !== 'major' && key !== 'direction')
      .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
      .join('\n');

    // 生成Few-Shot Prompt
    const fewShotPrompt = generateFewShotPrompt(
      answersText || '未提供',
      targetJob,
      {
        name: answers.name || '用户',
        education: answers.school || '某大学',
        major: major,
        graduationYear: answers.graduation || '2025',
      }
    );

    // 使用Few-Shot Prompt作为用户提示词
    const userPrompt = fewShotPrompt;

    // 调用 DeepSeek API（带重试逻辑）
    let response;
    let retries = 3;

    while (retries > 0) {
      try {
        response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: RESUME_SYSTEM_PROMPT,
              },
              {
                role: 'user',
                content: userPrompt,
              },
            ],
            temperature: 0.7,
          }),
        });

        if (response.ok) break;

        retries--;
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (fetchError) {
        retries--;
        if (retries === 0) throw fetchError;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        { success: false, error: 'AI 服务调用失败，请稍后重试' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // 尝试解析JSON
    let result;

    try {
      result = JSON.parse(content);
    } catch {
      // 尝试用正则提取JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          { success: false, error: 'AI 返回格式异常，请重试' },
          { status: 500 }
        );
      }
    }

    // 验证必需字段
    if (!result.confidence_boost || !result.headline || !result.experiences) {
      return NextResponse.json(
        { success: false, error: 'AI 返回内容不完整，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('生成简历时出错:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}
