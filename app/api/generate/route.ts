// app/api/generate/route.ts - API路由（Few-Shot增强版）
import { NextRequest, NextResponse } from 'next/server';
import { RESUME_SYSTEM_PROMPT, RESUME_USER_PROMPT_TEMPLATE, RESUME_BASIC_INFO_PROMPT, Scenario } from '@/lib/prompts';
import { generateFewShotPrompt } from '@/lib/fewShotPromptGenerator';
import { selectFewShotExamples } from '@/lib/fewShotExamples';

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
    const { answers, scenario, basicInfo, selectedJob, reflection } = body;

    const isBasicInfoFlow = basicInfo && selectedJob;

    console.log(JSON.stringify({
      event: 'api_generate_called',
      scenario,
      flow: isBasicInfoFlow ? 'basic-info' : 'questions',
      prompt_version: PROMPT_VERSION,
      question_count: isBasicInfoFlow ? 0 : Object.keys(answers || {}).length,
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

    // 构建用户提示词
    let userPrompt: string;

    if (isBasicInfoFlow) {
      // 新流程：基础信息 + 8问回答 + 选定岗位
      const answersText = Object.entries(answers || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const promptText = RESUME_BASIC_INFO_PROMPT
        .replace(/\{\{major\}\}/g, basicInfo.major || '未提供')
        .replace(/\{\{workInMajor\}\}/g, basicInfo.workInMajor ? '是，想从事本专业' : '否，想跨专业求职')
        .replace(/\{\{skills\}\}/g, basicInfo.skills || '未提供')
        .replace(/\{\{selectedJob\}\}/g, selectedJob)
        .replace(/\{\{scenario\}\}/g, scenario === 'internship' ? '找实习' : '找工作')
        .replace(/\{\{answers\}\}/g, answersText || '未提供')
        + (reflection ? `\n\n【用户的自我反思】\n用户觉得最有价值的经历：${reflection}\n（请特别关注这条经历，它是用户自己认可的价值点）` : '');

      // 附加 few-shot 示例帮助 AI 理解输出格式
      const examples = selectFewShotExamples(
        `${basicInfo.major} ${basicInfo.skills || ''} ${selectedJob}`,
        selectedJob,
        2
      );
      const examplesText = examples.length > 0
        ? `\n\n<参考示例（学习格式，不要照搬内容）>\n${examples.map((ex, i) =>
            `示例${i + 1}（${ex.category}）：\n输入："${ex.input}"\n输出：\n${ex.output}`
          ).join('\n\n')}\n</参考示例>`
        : '';

      userPrompt = promptText + examplesText;
    } else {
      // 旧流程：8 问题问答
      const major = answers.q1 || '未提供';
      const direction = answers.direction || '未提供';
      const targetJob = `${major}相关${direction !== '未提供' ? `·${direction}` : ''}岗位`;

      const answersText = Object.entries(answers)
        .filter(([key]) => key !== 'q1' && key !== 'direction')
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join('\n');

      userPrompt = generateFewShotPrompt(
        answersText || '未提供',
        targetJob,
        { name: '用户', education: '某大学', major, graduationYear: '2025' }
      );
    }

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
    if (!result.confidence_boost || !result.summary || !result.experiences) {
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
