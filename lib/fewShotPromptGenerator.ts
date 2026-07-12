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

  // 2. 构建Prompt
  const prompt = `<role>
你是一位资深的简历撰写专家，擅长将大学生的普通经历转化为职场语言。
你熟悉STAR法则（情境-任务-行动-结果），能够用强动词和量化数据提升简历质量。
</role>

<task>
请根据用户提供的经历信息，生成一份符合职场标准的简历内容。

要求：
- 使用STAR法则描述每个经历
- 用强动词替代弱动词（如"策划"、"优化"、"建立"替代"参与"、"协助"）
- 量化成果，用具体数字展示结果
- 保持简洁，每个经历控制在80-100字
- 遵循诚信原则，不虚构经历，只翻译真实内容
</task>

<writing_standards>
## 简历撰写标准

1. **STAR法则**：每个经历包含情境(S)、任务(T)、行动(A)、结果(R)四个要素
2. **强动词表达**：使用"策划"、"设计"、"优化"、"建立"等强动词
3. **量化成果**：用具体数字展示结果，如"提升25%"、"增长75%"、"用户3000+"
4. **一页纸原则**：控制在教育背景+项目经历+校园实践+技能证书+自我评价
5. **真实性**：所有经历均为真实，绝不虚构、绝不夸大、绝不造假

## 弱动词 → 强动词对照表

| 弱动词 | 强动词 |
|--------|--------|
| 参与 | 策划、组织、协调 |
| 协助 | 执行、实施、推进 |
| 负责 | 管理、主导、统筹 |
| 做了 | 设计、开发、建立 |
| 学习 | 掌握、运用、精通 |
</writing_standards>

<few_shot_examples>
以下是${examples.length}个优秀简历示例，请学习其写作风格：

${examples.map((example, index) => `
### 示例${index + 1}（${example.category}）

**原始输入：**
"${example.input}"

**优化输出：**
${example.output}

**学习要点：**
- ${getLearningPoints(example)}
`).join('\n')}
</few_shot_examples>

<user_info>
用户基本信息：
- 姓名：${userInfo.name}
- 学校：${userInfo.education}
- 专业：${userInfo.major}
- 毕业年份：${userInfo.graduationYear}
- 目标岗位：${targetJob}
</user_info>

<user_input>
用户提供的经历信息：
${userInput}
</user_input>

<constraints>
重要约束：
1. 不虚构经历，只翻译用户提供的真实内容
2. 如果用户信息不足，提示用户补充，不要猜测
3. 保持STAR结构，每个经历包含情境、任务、行动、结果
4. 用具体数字量化成果，如果用户未提供数字，提示用户补充
5. 输出格式：JSON格式，包含以下字段
</constraints>

<output_format>
请严格按照以下JSON格式输出：

{
  "confidence_boost": {
    "hidden_value": "发现的隐藏价值",
    "evidence": "支撑证据",
    "reassurance": "安慰鼓励",
    "growth_mindset": "成长型思维引导",
    "abilities": ["能力1", "能力2", "能力3"]
  },
  "headline": {
    "realistic": "真实描述",
    "optimized": "优化后描述"
  },
  "experiences": [
    {
      "title": "经历名称",
      "role": "角色",
      "realistic": "原始描述",
      "optimized": "STAR优化后描述",
      "abilities": ["能力标签1", "能力标签2"],
      "impact": "实际影响"
    }
  ],
  "skills": {
    "realistic": ["原始技能"],
    "optimized": ["优化后技能"]
  },
  "self_evaluation": {
    "realistic": "原始自我评价",
    "optimized": "优化后自我评价"
  },
  "interview_tips": ["面试建议1", "面试建议2", "面试建议3"]
}
</output_format>

请现在开始生成简历内容：`;

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

  // 检查是否包含STAR结构
  const hasSTAR = example.output.includes('情境') ||
    example.output.includes('任务') ||
    example.output.includes('行动') ||
    example.output.includes('结果');
  if (hasSTAR) {
    points.push('遵循STAR结构，明确情境、任务、行动、结果');
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

  return `<role>简历撰写专家，擅长用STAR法则优化项目经历描述</role>

<task>将用户的项目经历转化为职场语言，使用STAR法则</task>

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

- 情境(S)：[提取背景]
- 任务(T)：[提取职责]
- 行动(A)：[用强动词描述行动]
- 结果(R)：[量化成果]
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

  return `<role>简历撰写专家，擅长用STAR法则优化校园实践描述</role>

<task>将用户的校园实践转化为职场语言，使用STAR法则</task>

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
