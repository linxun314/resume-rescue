// lib/fewShotPromptGenerator.ts
// Few-Shot Prompt生成器，构建结构化Prompt

import { selectFewShotExamples, FewShotExample } from './fewShotExamples';

/**
 * 生成Few-Shot Prompt
 *
 * 结构遵循Anthropic最佳实践：
 * - 使用XML标签分隔各部分
 * - 数据在前，指令在后
 * - 示例格式一致
 */
export function generateFewShotPrompt(
  userInput: string,
  targetJob: string,
  userInfo: {
    name: string;
    education: string;
    major: string;
    graduationYear: string;
  }
): string {

  // 1. 选择Few-Shot示例
  const examples = selectFewShotExamples(userInput, targetJob, 3);

  // 2. 构建Prompt（不重复系统提示词中已有的内容）
  const prompt = `<task>
根据用户提供的经历信息，生成简历内容。请严格按照指定JSON格式输出。
</task>

<writing_standards>
简历撰写标准：
1. 强动词开头：用"策划""优化""主导"替代"参与""协助"
2. 量化成果：用具体数字展示结果（如提升25%、增长75%）
3. 真实性：只翻译真实经历，绝不虚构
4. bullet point 格式：每条 bullet 是完整的一句话，动词开头，结果收尾
5. 禁止出现"情境(S)""任务(T)"等教学标签，直接输出成品简历格式
</writing_standards>

<few_shot_examples>
${examples.length}个优秀简历示例，请学习其写作风格：

${examples.map((example, index) => `示例${index + 1}（${example.category}）：
原始输入："${example.input}"
优化输出：${example.output}
`).join('\n')}
</few_shot_examples>

<user_info>
- 姓名：${userInfo.name}
- 学校：${userInfo.education}
- 专业：${userInfo.major}
- 毕业年份：${userInfo.graduationYear}
- 目标岗位：${targetJob}
</user_info>

<user_input>
用户经历信息：
${userInput}
</user_input>

<output_format>
请严格按照以下JSON格式输出（不要输出任何其他内容，不要用代码块包裹）：

{
  "confidence_boost": {
    "hidden_value": "发现的隐藏价值",
    "evidence": "支撑证据",
    "reassurance": "安慰鼓励",
    "growth_mindset": "成长型思维引导",
    "abilities": ["能力1", "能力2", "能力3"]
  },
  "summary": "3句话核心简介：学校+专业+核心能力+目标方向",
  "experiences": [
    {
      "title": "经历名称",
      "organization": "所属组织/课程/比赛",
      "role": "角色",
      "period": "时间跨度",
      "bullets": [
        "强动词开头+具体行动+量化结果的完整bullet",
        "第二条bullet"
      ],
      "real_ability": "这条经历证明的真实能力（诚实评估）",
      "gap": "距离目标岗位的差距（没有则留空）"
    }
  ],
  "skills": {
    "professional": ["Python（2年）", "SQL（1年）"],
    "general": ["数据分析", "跨团队协作"]
  },
  "interview_tips": ["面试建议1", "面试建议2", "面试建议3"],
  "job_fit": {
    "match_level": "高/中/低",
    "relevant_experiences": ["相关经历"],
    "transferable_experiences": ["可迁移经历"],
    "gap_analysis": "差距分析",
    "suggestion": "下一步建议"
  }
}
</output_format>`;

  return prompt;
}

/**
 * 获取示例的学习要点
 */
function getLearningPoints(example: FewShotExample): string {
  const points: string[] = [];

  // 检查是否包含强动词
  const strongVerbs = ['策划', '设计', '优化', '建立', '管理', '主导', '开发', '实现', '制定', '协调'];
  const hasStrongVerb = strongVerbs.some((verb) => example.output.includes(verb));
  if (hasStrongVerb) {
    points.push('使用强动词（如"策划"、"设计"、"优化"）替代弱动词');
  }

  // 检查是否包含量化数据
  const hasNumbers = /\d+/.test(example.output);
  if (hasNumbers) {
    points.push('量化成果，用具体数字展示结果');
  }

  // 检查是否使用 bullet point 格式
  const hasBullet = example.output.includes('- ') || example.output.includes('• ');
  if (hasBullet) {
    points.push('使用 bullet point 格式，每条以动词开头');
  }

  // 检查是否有简洁表达
  if (example.output.length < 200) {
    points.push('保持简洁，控制在80-100字');
  }

  return points.join('；') || '学习示例的整体结构和表达风格';
}

/**
 * 生成项目经历优化Prompt（单独优化某个项目）
 */
export function generateProjectExperiencePrompt(
  projectName: string,
  userRole: string,
  projectTime: string,
  projectDescription: string
): string {

  const examples = selectFewShotExamples(projectDescription, '通用', 2);

  return `<role>简历撰写专家，擅长用bullet point格式优化项目经历描述</role>

<task>将用户的项目经历转化为职场语言，使用bullet point格式</task>

<few_shot_examples>
${examples.map((example, index) => `
示例${index + 1}：
原始："${example.input}"
优化：${example.output}
`).join('\n')}
</few_shot_examples>

<user_input>
项目名称：${projectName}
角色：${userRole}
时间：${projectTime}
描述：${projectDescription}
</user_input>

<output_format>
**${projectName}** | ${userRole} | ${projectTime}

- [强动词开头]，[具体行动]，[量化结果]
</output_format>

请生成优化后的项目经历描述：`;
}

/**
 * 生成校园实践优化Prompt（单独优化某个实践）
 */
export function generateCampusPracticePrompt(
  organization: string,
  userRole: string,
  practiceTime: string,
  practiceDescription: string
): string {

  const examples = selectFewShotExamples(practiceDescription, '通用', 2);

  return `<role>简历撰写专家，擅长用bullet point格式优化校园实践描述</role>

<task>将用户的校园实践转化为职场语言，使用bullet point格式</task>

<few_shot_examples>
${examples.map((example, index) => `
示例${index + 1}：
原始："${example.input}"
优化：${example.output}
`).join('\n')}
</few_shot_examples>

<user_input>
组织：${organization}
角色：${userRole}
时间：${practiceTime}
描述：${practiceDescription}
</user_input>

<output_format>
**${organization}** | ${userRole} | ${practiceTime}

- [用强动词描述成就，量化成果]
- [用强动词描述成就，量化成果]
</output_format>

请生成优化后的校园实践描述：`;
}
