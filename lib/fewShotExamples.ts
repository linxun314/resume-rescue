// lib/fewShotExamples.ts
// Few-Shot示例库，从简历范本中提取核心示例片段

import { Resume } from './resumeTypes';
import {
  generalGraduateResume,
  productOperationResume,
  businessStartupResume,
  techSelfLearnResume
} from './resumeData';

/**
 * Few-Shot示例类型定义
 */
export interface FewShotExample {
  id: string;
  category: string; // 示例类别：课程项目、社团活动、创业经历等
  input: string; // 用户原始输入（弱表达）
  output: string; // STAR优化后的输出（强表达）
  templateId: string; // 关联的简历范本ID
  difficulty: 'easy' | 'medium' | 'hard'; // 难度等级
  tags: string[]; // 关键词标签
}

/**
 * 从简历范本中提取Few-Shot示例
 */
function extractExamplesFromResume(resume: Resume): FewShotExample[] {
  const examples: FewShotExample[] = [];

  // 提取项目经历示例
  resume.projectExperiences.forEach((exp, index) => {
    const originalInput = constructOriginalInput(exp);
    const optimizedOutput = constructSTAROutput(exp);

    examples.push({
      id: `${resume.id}-project-${index}`,
      category: '项目经历',
      input: originalInput,
      output: optimizedOutput,
      templateId: resume.id,
      difficulty: resume.difficulty,
      tags: exp.tags || [],
    });
  });

  // 提取STAR案例对比示例
  if (resume.starExamples) {
    resume.starExamples.forEach((example, index) => {
      examples.push({
        id: `${resume.id}-star-${index}`,
        category: example.category,
        input: example.original,
        output: example.optimized,
        templateId: resume.id,
        difficulty: resume.difficulty,
        tags: [],
      });
    });
  }

  return examples;
}

/**
 * 构造原始输入（模拟用户简单描述）
 */
function constructOriginalInput(exp: any): string {
  const simplified = exp.title
    .replace('课程项目：', '')
    .replace('个人项目：', '')
    .replace('校园', '')
    .toLowerCase();

  return `${simplified}，做了${exp.role === '组长' ? '组织协调' : '具体工作'}`;
}

/**
 * 构造STAR格式的输出
 */
function constructSTAROutput(exp: any): string {
  return `**${exp.title}** | ${exp.role} | ${exp.period}

**情境(S)**：${exp.situation}
**任务(T)**：${exp.task}
**行动(A)**：${exp.action}
**结果(R)**：${exp.result}`;
}

/**
 * Few-Shot示例库
 * 从4个简历范本中提取 + 手动精选补充
 */
export const fewShotExampleBank: FewShotExample[] = [
  // 从通用应届生简历提取示例
  ...extractExamplesFromResume(generalGraduateResume),

  // 从产品运营简历提取示例
  ...extractExamplesFromResume(productOperationResume),

  // 从商科创业简历提取示例
  ...extractExamplesFromResume(businessStartupResume),

  // 从技术自学简历提取示例
  ...extractExamplesFromResume(techSelfLearnResume),

  // 手动精选补充示例（覆盖更多场景）
  {
    id: 'manual-1',
    category: '社团活动',
    input: '参加学生会宣传部，做了海报和视频',
    output: `**校学生会宣传部** | 副部长 | 2021.09 - 2023.06

- 策划并执行年度迎新晚会宣传方案，设计海报、视频预热，吸引800+学生参与（同比提升33%）
- 管理宣传团队5人，制定内容日历，保证公众号每周更新3次，全年零断更`,
    templateId: 'general-graduate',
    difficulty: 'easy',
    tags: ['社团', '宣传', '团队管理'],
  },
  {
    id: 'manual-2',
    category: '课程作业',
    input: '做了一个市场调研的小组作业',
    output: `**课程项目：校园咖啡厅市场调研与运营策划** | 组长 | 2023.09 - 2023.12

- 设计问卷调研300+学生消费习惯，访谈10位常客，发现午间高峰排队严重问题
- 提出"线上预点单+午间套餐"方案，被咖啡厅采纳试点，午间订单量提升25%`,
    templateId: 'general-graduate',
    difficulty: 'easy',
    tags: ['市场调研', '数据分析', '团队协作'],
  },
  {
    id: 'manual-3',
    category: '兼职经历',
    input: '在奶茶店打工，卖奶茶',
    output: `**校园奶茶店兼职** | 店长助理 | 2021.09 - 2022.02

- 分析客群，推出"学生套餐+第二杯半价"组合；建立微信群，每日推送优惠信息
- 3个月内月销售额从2万提升至3.5万（增长75%），客户复购率从40%提升至65%`,
    templateId: 'business-startup',
    difficulty: 'medium',
    tags: ['销售', '促销策划', '客户关系'],
  },
  {
    id: 'manual-4',
    category: '自学项目',
    input: '自学编程，做了一个笔记网站',
    output: `**个人项目：在线笔记应用"NoteHub"** | 独立开发 | 2023.06 - 2023.09

- 使用Vue.js + Node.js + MongoDB技术栈；实现用户认证（JWT）、RESTful API、Markdown编辑
- 部署到阿里云服务器，GitHub获得50+ Star，上线3个月注册用户300+`,
    templateId: 'tech-self-learn',
    difficulty: 'hard',
    tags: ['自学', '全栈开发', '项目部署'],
  },
  {
    id: 'manual-5',
    category: '创业经历',
    input: '做了一个校园跑腿平台',
    output: `**校园跑腿服务平台"帮帮"** | 联合创始人 | 2022.03 - 2023.06

- 设计"帮帮"小程序，对接校内快递点、外卖商家；制定跑腿员培训体系
- 15个月累计服务用户3000+，完成订单15000+，月流水达3万元`,
    templateId: 'business-startup',
    difficulty: 'medium',
    tags: ['创业', '团队管理', '业务拓展'],
  },
  {
    id: 'manual-6',
    category: '数据分析',
    input: '做了一个用户数据分析的作业',
    output: `**课程项目：用户行为数据分析** | 组长 | 2023.09 - 2023.12

- 使用Python处理10万条用户行为数据；设计用户分群模型（RFM模型）
- 识别出3类典型流失用户特征，提出"新手引导优化"方案，课程报告获优秀（全班前3名）`,
    templateId: 'product-operation',
    difficulty: 'medium',
    tags: ['数据分析', 'Python', '用户分群'],
  },
  {
    id: 'manual-7',
    category: '产品设计',
    input: '做了一个校园二手交易平台',
    output: `**校园二手交易平台"闲置宝"产品设计** | 产品负责人 | 2023.03 - 2023.09

- 访谈50+学生，提炼核心需求；使用Figma设计产品原型；协调技术开发，2个月上线小程序
- 上线3个月累计用户800+，促成交易300+笔，获校级创新创业大赛二等奖`,
    templateId: 'product-operation',
    difficulty: 'medium',
    tags: ['产品设计', '用户调研', '团队协作'],
  },
];

/**
 * 智能示例检索系统
 * 根据用户输入特征，动态选择最相关的Few-Shot示例
 *
 * 最佳实践：
 * - 选择3-5个示例（性价比最优）
 * - 示例多样化（覆盖不同类型）
 * - 与输入相似度高的示例优先
 */
export function selectFewShotExamples(
  userInput: string,
  targetJob: string,
  maxExamples: number = 3
): FewShotExample[] {

  // 1. 根据岗位类型匹配相关范本
  const jobKeywords = targetJob.toLowerCase();
  let relevantTemplateIds: string[] = [];

  if (jobKeywords.includes('产品') || jobKeywords.includes('运营')) {
    relevantTemplateIds = ['product-operation', 'general-graduate'];
  } else if (jobKeywords.includes('前端') || jobKeywords.includes('后端') || jobKeywords.includes('开发')) {
    relevantTemplateIds = ['tech-self-learn'];
  } else if (jobKeywords.includes('销售') || jobKeywords.includes('市场')) {
    relevantTemplateIds = ['business-startup'];
  } else if (jobKeywords.includes('行政') || jobKeywords.includes('人力')) {
    relevantTemplateIds = ['general-graduate'];
  } else {
    relevantTemplateIds = ['general-graduate'];
  }

  // 2. 根据输入关键词匹配示例
  const inputKeywords = userInput.toLowerCase();
  const keywordScores: Map<string, number> = new Map();

  fewShotExampleBank.forEach((example) => {
    let score = 0;

    // 检查模板ID是否匹配
    if (relevantTemplateIds.includes(example.templateId)) {
      score += 10;
    }

    // 检查标签匹配
    example.tags.forEach((tag) => {
      if (inputKeywords.includes(tag.toLowerCase())) {
        score += 5;
      }
    });

    // 检查类别匹配
    if (inputKeywords.includes(example.category.toLowerCase())) {
      score += 3;
    }

    // 检查输入相似度（简单关键词匹配）
    const inputWords = example.input.toLowerCase().split(' ');
    inputWords.forEach((word) => {
      if (inputKeywords.includes(word) && word.length > 2) {
        score += 1;
      }
    });

    keywordScores.set(example.id, score);
  });

  // 3. 选择得分最高的示例
  const sortedExamples = fewShotExampleBank
    .map((example) => ({
      example,
      score: keywordScores.get(example.id) || 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxExamples * 2);

  // 4. 确保示例多样化（覆盖不同类别）
  const selectedExamples: FewShotExample[] = [];
  const selectedCategories: Set<string> = new Set();

  sortedExamples.forEach(({ example }) => {
    if (!selectedCategories.has(example.category) && selectedExamples.length < maxExamples) {
      selectedExamples.push(example);
      selectedCategories.add(example.category);
    }
  });

  // 如果不够，补充剩余示例
  if (selectedExamples.length < maxExamples) {
    sortedExamples.forEach(({ example }) => {
      if (!selectedExamples.includes(example) && selectedExamples.length < maxExamples) {
        selectedExamples.push(example);
      }
    });
  }

  // 5. 按难度排序（从简单到复杂）
  selectedExamples.sort((a, b) => {
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  return selectedExamples;
}

/**
 * 获取示例的详细说明（用于展示给用户）
 */
export function getExampleExplanation(example: FewShotExample): string {
  return `
**原始表达（弱动词）：**
"${example.input}"

**STAR优化后（强动词+量化）：**
${example.output}

**优化要点：**
- 情境(S)：明确背景和问题
- 任务(T)：说明你的职责
- 行动(A)：用强动词描述具体行动
- 结果(R)：量化成果，用具体数字
`;
}
