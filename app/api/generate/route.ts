// app/api/generate/route.ts - API路由（心理赋能版）
import { NextRequest, NextResponse } from 'next/server';
import { RESUME_SYSTEM_PROMPT, RESUME_USER_PROMPT_TEMPLATE } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    // 从环境变量获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '服务器未配置 API 密钥' },
        { status: 500 }
      );
    }

    // 构建用户提示词
    let userPrompt = RESUME_USER_PROMPT_TEMPLATE;
    userPrompt = userPrompt.replace('{{major}}', answers.major || '未提供');
    userPrompt = userPrompt.replace('{{direction}}', answers.direction || '未提供');
    userPrompt = userPrompt.replace('{{q1}}', answers.q1 || '未提供');
    userPrompt = userPrompt.replace('{{q2}}', answers.q2 || '未提供');
    userPrompt = userPrompt.replace('{{q3}}', answers.q3 || '未提供');
    userPrompt = userPrompt.replace('{{q4}}', answers.q4 || '未提供');
    userPrompt = userPrompt.replace('{{q5}}', answers.q5 || '未提供');
    userPrompt = userPrompt.replace('{{q6}}', answers.q6 || '未提供');
    userPrompt = userPrompt.replace('{{q7}}', answers.q7 || '未提供');
    userPrompt = userPrompt.replace('{{q8}}', answers.q8 || '未提供');

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
