// app/api/generate/route.ts - API路由（Few-Shot增强版）
import { NextRequest, NextResponse } from 'next/server';
import { RESUME_SYSTEM_PROMPT, RESUME_USER_PROMPT_TEMPLATE, Scenario } from '@/lib/prompts';
import { generateFewShotPrompt } from '@/lib/fewShotPromptGenerator';

const PROMPT_VERSION = 'v1.2'; // 当前 Prompt 版本
const API_TIMEOUT_MS = 30000;  // 30秒超时

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const { answers, scenario } = body;

    console.log(JSON.stringify({
      event: 'api_generate_called',
      scenario,
      prompt_version: PROMPT_VERSION,
      question_count: Object.keys(answers || {}).length,
      timestamp: new Date().toISOString(),
    }));

    // 从环境变量获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '服务器未配置 API 密钥' },
        { status: 500 }
      );
    }

    // 构建用户提示词 - 使用Few-Shot Prompt生成器
    // 用户回答字段是 q1, q2, q3... 格式
    const major = answers.q1 || '未提供';
    const direction = answers.direction || '未提供';
    const targetJob = `${major}相关${direction !== '未提供' ? `·${direction}` : ''}岗位`;

    // 整合用户回答为经历描述（排除q1，因为它是专业信息）
    const answersText = Object.entries(answers)
      .filter(([key]) => key !== 'q1' && key !== 'direction')
      .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
      .join('\n');

    // 生成Few-Shot Prompt
    const fewShotPrompt = generateFewShotPrompt(
      answersText || '未提供',
      targetJob,
      {
        name: '用户',
        education: '某大学',
        major: major,
        graduationYear: '2025',
      }
    );

    // 使用Few-Shot Prompt作为用户提示词
    const userPrompt = fewShotPrompt;

    // 调用 DeepSeek API（带超时+指数退避重试）
    let response;
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        response = await fetchWithTimeout('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: RESUME_SYSTEM_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
          }),
        }, API_TIMEOUT_MS);

        if (response.ok) break;

        // 非 ok 响应，指数退避
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
      } catch (fetchError) {
        const isTimeout = fetchError instanceof DOMException && fetchError.name === 'AbortError';
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        } else {
          throw fetchError;
        }
      }
    }

    if (!response || !response.ok) {
      console.log(JSON.stringify({
        event: 'api_generate_error',
        error: `deepseek_api_failed_${response?.status || 'no_response'}`,
        latency_ms: Date.now() - startTime,
      }));
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
      // 先尝试直接解析
      result = JSON.parse(content);
    } catch {
      try {
        // 移除可能的 markdown 代码块标记
        let cleanedContent = content
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/gi, '')
          .trim();

        // 尝试提取 JSON 对象（找到第一个 { 和最后一个 }）
        const firstBrace = cleanedContent.indexOf('{');
        const lastBrace = cleanedContent.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonStr = cleanedContent.substring(firstBrace, lastBrace + 1);
          result = JSON.parse(jsonStr);
        } else {
          return NextResponse.json(
            { success: false, error: 'AI 返回格式异常，请重试' },
            { status: 500 }
          );
        }
      } catch (parseError) {
        console.error('JSON 解析失败:', parseError);
        return NextResponse.json(
          { success: false, error: 'AI 返回格式异常，请重试' },
          { status: 500 }
        );
      }
    }

    // 验证必需字段
    if (!result.confidence_boost || !result.headline || !result.experiences) {
      console.log(JSON.stringify({
        event: 'api_generate_error',
        error: 'missing_fields',
        latency_ms: Date.now() - startTime,
      }));
      return NextResponse.json(
        { success: false, error: 'AI 返回内容不完整，请重试' },
        { status: 500 }
      );
    }

    console.log(JSON.stringify({
      event: 'api_generate_success',
      latency_ms: Date.now() - startTime,
      result_length: content.length,
      prompt_version: PROMPT_VERSION,
    }));

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(JSON.stringify({
      event: 'api_generate_error',
      error: error instanceof Error ? error.message : 'unknown',
      latency_ms: Date.now() - startTime,
    }));
    console.error('生成简历时出错:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}
