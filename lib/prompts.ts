/**
 * Prompt配置文件
 * 包含所有场景的问题集和AI生成的Prompt模板
 */

// 问题接口定义
export interface Question {
  id: string;
  question: string;
  placeholder: string;
  example: string;
  psychology_intent: string;
  type: 'input' | 'textarea';
}

// 场景类型
export type Scenario = 'internship' | 'job';

/**
 * 实习场景问题集（8个问题）
 * 侧重：学习能力、主动性、潜力、基础素质
 */
export const INTERN_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: '哪门课或作业让你觉得"这门课我没白学"?',
    placeholder: '比如：某门课的大作业，我自己做了一个XX...',
    example: '✏️ 案例：大三的机械设计课，我用SolidWorks做了个减速器模型，老师夸我思路清晰。第一次觉得学的东西能用上，特别有成就感。',
    psychology_intent: '挖掘学习成果，唤醒胜任感',
    type: 'textarea',
  },
  {
    id: 'q2',
    question: '有没有哪次小组作业，你做的部分被队友夸了？',
    placeholder: '比如：我负责的部分是XX，队友说做得不错...',
    example: '✏️ 案例：有一次市场营销课小组作业，我负责做竞品分析PPT。一个队友说"你找的数据太全了"，另一个说"逻辑很清楚"。虽然只是小事，但被认可的感觉很好。',
    psychology_intent: '发现协作优势和隐性能力',
    type: 'textarea',
  },
  {
    id: 'q3',
    question: '有没有帮谁解决过什么问题？（室友、同学、家里人都算）',
    placeholder: '比如：帮室友解决了XX问题，帮家人弄好了XX...',
    example: '✏️ 案例：室友电脑老是蓝屏，我查了各种教程，最后发现是驱动问题，帮他重装了驱动就好了。虽然不是什么大事，但他之后电脑有问题都来找我。',
    psychology_intent: '发现解决问题的能力和主动性',
    type: 'textarea',
  },
  {
    id: 'q4',
    question: '有没有哪个瞬间，让你觉得"这个我好像挺擅长的"？',
    placeholder: '比如：有次XX，别人搞不定但我觉得很简单...',
    example: '✏️ 案例：有次班级活动要做海报，我用Canva做了一个，发到群里大家都说好看。我才发现原来我对设计审美还挺有感觉的。',
    psychology_intent: '识别天赋和隐性优势',
    type: 'textarea',
  },
  {
    id: 'q5',
    question: '如果让你给学弟学妹讲一节课，你会讲什么？',
    placeholder: '比如：我会讲XX，因为我在这方面有点心得...',
    example: '✏️ 案例：我会讲"怎么高效做PPT"，因为我之前帮很多人改过PPT，发现大家最大的问题是逻辑不清、配色乱。我有一套自己的方法。',
    psychology_intent: '发现知识积累和教学能力',
    type: 'textarea',
  },
  {
    id: 'q6',
    question: '有没有什么事情，是你主动去做的，没人要求你？',
    placeholder: '比如：我自己学了XX，自己做了XX...',
    example: '✏️ 案例：大二的时候我自己学了Python爬虫，因为我好奇B站视频的数据是什么样的。后来爬了一些数据做了个简单的分析，虽然没什么用，但挺好玩的。',
    psychology_intent: '发现自驱力和学习能力',
    type: 'textarea',
  },
  {
    id: 'q7',
    question: '你平时会关注什么领域的内容？（公众号、B站、小红书都算）',
    placeholder: '比如：我经常看XX方面的内容，因为...',
    example: '✏️ 案例：我经常看产品经理和互联网运营的内容，因为觉得分析用户心理很有意思。虽然还没做过相关的事，但积累了不少理论知识。',
    psychology_intent: '发现兴趣方向和知识储备',
    type: 'input',
  },
  {
    id: 'q8',
    question: '如果给你一个实习机会，你最想尝试什么岗位？为什么？',
    placeholder: '比如：我想尝试XX岗位，因为...',
    example: '✏️ 案例：我想尝试用户运营，因为我觉得跟人打交道很有意思，而且我之前组织过班级活动，发现自己挺擅长调动气氛的。',
    psychology_intent: '明确求职意向，建立目标感',
    type: 'input',
  },
];

/**
 * 就业场景问题集（8个问题）
 * 侧重：专业能力、项目成果、量化成果、职业素养
 */
export const JOB_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: '大学期间最有成就感的一件事是什么？',
    placeholder: '比如：我完成了XX，达到了XX效果...',
    example: '✏️ 案例：大三参加了一个数据分析比赛，我们团队从200多支队伍里拿了第三名。我负责数据清洗和可视化，用了两周时间处理了50万条数据。',
    psychology_intent: '发现核心成就，唤醒胜任感',
    type: 'textarea',
  },
  {
    id: 'q2',
    question: '有没有哪个课程项目/作业，你做得特别认真？',
    placeholder: '比如：XX课的项目，我花了XX时间，做了XX...',
    example: '✏️ 案例：软件工程课的期末项目，我用React+Node.js做了一个在线协作文档。虽然只是课程作业，但我加了实时同步功能，写了详细的文档。',
    psychology_intent: '发现专业能力和项目经验',
    type: 'textarea',
  },
  {
    id: 'q3',
    question: '有没有帮同学/朋友解决过什么技术问题？',
    placeholder: '比如：帮XX解决了XX问题，用了XX方法...',
    example: '✏️ 案例：同学做毕业设计时Python代码一直报错，我帮他debug后发现是数据类型的问题。后来我还教他怎么用断点调试，他说效率提高了很多。',
    psychology_intent: '发现技术能力和问题解决能力',
    type: 'textarea',
  },
  {
    id: 'q4',
    question: '有没有自学过什么技能或工具？学到什么程度？',
    placeholder: '比如：我自学了XX，能用它完成XX...',
    example: '✏️ 案例：自学了Figma，从零开始到能独立完成完整的UI设计稿。做了3个练习项目，包括一个电商App的全套界面。',
    psychology_intent: '发现学习能力和自驱力',
    type: 'textarea',
  },
  {
    id: 'q5',
    question: '有没有用专业知识做过什么实际的东西？（课程设计、比赛、个人项目都算）',
    placeholder: '比如：用XX知识做了XX，效果是XX...',
    example: '✏️ 案例：用机器学习课程学的知识，做了一个房价预测模型。虽然数据量不大，但准确率达到了85%，代码放到了GitHub上。',
    psychology_intent: '发现知识应用能力和项目经验',
    type: 'textarea',
  },
  {
    id: 'q6',
    question: '你觉得自己的核心优势是什么？有什么证据？',
    placeholder: '比如：我比较擅长XX，因为XX事证明了这一点...',
    example: '✏️ 案例：我比较擅长逻辑分析和数据处理。证据是：数据分析课拿了95分，参加数学建模比赛拿了省奖，帮导师处理过科研数据。',
    psychology_intent: '提炼核心优势，建立自信',
    type: 'textarea',
  },
  {
    id: 'q7',
    question: '你期望从事什么方向的工作？为什么？',
    placeholder: '比如：我想做XX方向，因为...',
    example: '✏️ 案例：我想做数据分析方向，因为：1）对数据敏感，喜欢从数据里找规律；2）有Python和SQL基础；3）做过几个数据分析项目。',
    psychology_intent: '明确职业方向，建立目标感',
    type: 'textarea',
  },
  {
    id: 'q8',
    question: '为了这个目标，你做过哪些准备？',
    placeholder: '比如：我学了XX，做了XX，考了XX证书...',
    example: '✏️ 案例：为了做数据分析，我：1）自学了Python数据分析库；2）做了3个数据分析项目放到GitHub；3）正在准备考CDA数据分析师证书。',
    psychology_intent: '发现行动力和职业准备度',
    type: 'textarea',
  },
];

/**
 * 根据场景获取对应问题集
 */
export function getQuestionsByScenario(scenario: Scenario): Question[] {
  return scenario === 'internship' ? INTERN_QUESTIONS : JOB_QUESTIONS;
}

/**
 * AI生成简历的系统Prompt
 */
export const RESUME_SYSTEM_PROMPT = `你是一位融合了心理学洞察力的资深HR专家和职业发展顾问。

## 你的核心能力
- 5年互联网大厂招聘经验，面试过1000+候选人
- 深谙面试官心理：知道面试官真正看重什么
- 精通认知重构技术：能把"平凡经历"翻译成"可迁移能力"

## 设计心理学理论基础
1. 自我效能感理论：从用户回答中提取"成功证据"，强化"我能行"的信念
2. 认知重构：把"我没有XX"重构为"我通过XX证明了XX能力"
3. 峰终定律：创造"惊喜发现"的峰值体验，以"自信确认"收尾

## 翻译原则（必须严格遵守）

### 禁用词汇
绝对禁止使用以下弱动词：
- "参与了、学习了、了解了、帮助了、协助了"
- "负责、做了、弄了、搞了"
- "能够、可能、或许、大概"

### 必须使用
强制使用以下强动词（优先级从高到低）：
- 主导、推动、驱动、统筹、规划
- 搭建、构建、实现、落地、交付
- 优化、提升、改进、突破、创新
- 赋能、支持、指导、培养、引领

### 能力映射规则
从用户回答中自动识别隐性能力：
- "自己查资料搞定" → 独立学习能力、问题解决能力
- "帮别人解决问题" → 知识转移能力、沟通协作能力
- "主动提出想法" → 主动性、创新思维
- "协调大家分工" → 项目管理、领导力
- "遇到困难克服" → 抗压能力、坚韧品质

### 面试官视角翻译
把学术语言翻译成业务语言：
- "课程大作业" → "产品项目"
- "小组合作" → "跨职能协作"
- "老师布置的任务" → "业务需求"
- "拿到高分" → "获得认可/验证可行性"

你的输出将直接影响用户对自己价值的认知，请务必：
1. 用第二人称"你"与用户对话
2. 引用用户原话作为证据（增强可信度）
3. 强调"你已经具备的能力"而非"你可能会"
4. 用数据和具体成果说话`;

/**
 * AI生成简历的用户Prompt模板
 */
export const RESUME_USER_PROMPT_TEMPLATE = `请根据以下信息，生成简历内容。

【用户背景信息】
- 专业/学校：{{major}}
- 想投递的方向：{{direction}}
- 求职场景：{{scenario}}

【用户的回答】
{{answers}}

【输出要求】
请严格按以下JSON格式输出（不要输出其他任何内容）：

{
  "confidence_boost": {
    "hidden_value": "告诉用户一个他可能没意识到的核心价值（用第二人称，引用原话证据）",
    "evidence": "从用户回答中提取1-2句原话作为证据，证明他的价值",
    "reassurance": "针对场景的安抚语",
    "growth_mindset": "用成长型思维重构用户的叙事",
    "abilities": ["能力标签1", "能力标签2", "能力标签3"]
  },
  "headline": {
    "realistic": "用用户原话提炼的一句话介绍",
    "optimized": "翻译成面试官视角的一句话介绍（强动词+核心能力+独特价值）"
  },
  "experiences": [
    {
      "title": "项目/经历标题（用面试官视角命名）",
      "role": "角色定位",
      "realistic": "用用户原话客观描述",
      "optimized": "翻译成面试官视角的经历描述（STAR法则，强动词，量化结果）",
      "abilities": ["这个经历证明的能力1", "能力2"],
      "impact": "这个经历的实际影响（尽量量化）"
    }
  ],
  "skills": {
    "realistic": ["用户明确提到的技能"],
    "optimized": ["从经历中推断的可迁移技能"]
  },
  "self_evaluation": {
    "realistic": "用用户原话的自我评价",
    "optimized": "翻译成面试官视角的自我评价（强调独特价值）"
  },
  "interview_tips": [
    "面试时如何讲这段经历的具体建议1",
    "建议2",
    "建议3"
  ]
}

现在请开始生成。记住：你的目标不是"扩写简历"，而是"帮用户重新认识自己的价值"。`;
