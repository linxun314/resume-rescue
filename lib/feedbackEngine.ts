// lib/feedbackEngine.ts — 客户端即时反馈引擎
// 不调用API，基于关键词检测生成鼓励性反馈
// 内置去重机制：同一会话内不重复展示相同的反馈文案

export interface FeedbackResult {
  type: 'affirmation' | 'discovery' | 'encouragement' | 'connection' | 'quote';
  message: string;
  abilityTags?: string[];
}

// ===== 去重机制 =====
const usedIndices: Record<string, Set<number>> = {};

function pickNoRepeat<T>(category: string, arr: T[]): T {
  if (!usedIndices[category]) usedIndices[category] = new Set();
  const used = usedIndices[category];

  // 所有都用过了 → 重置
  if (used.size >= arr.length) used.clear();

  // 找一个没用过的
  const available: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (!used.has(i)) available.push(i);
  }
  const idx = available[Math.floor(Math.random() * available.length)];
  used.add(idx);
  return arr[idx];
}

/** 重置去重状态（页面重新开始时调用） */
export function resetFeedbackHistory(): void {
  for (const key in usedIndices) delete usedIndices[key];
}

// ===== 能力关键词检测 =====
const ABILITY_PATTERNS: Array<{ keywords: RegExp; ability: string }> = [
  { keywords: /自学|自己学|看视频学|看教程|摸索|网课|MOOC/i, ability: '自学能力' },
  { keywords: /帮.{0,4}(修|装|解决|弄|搞|调试|debug)/i, ability: '技术支持' },
  { keywords: /做PPT|做幻灯片|做演示|做报告/i, ability: '文档制作' },
  { keywords: /剪辑|剪视频|做视频|拍视频|后期|PR|剪映/i, ability: '内容创作' },
  { keywords: /编程|写代码|Python|Java|C\+\+|前端|后端|网站|小程序|爬虫/i, ability: '编程能力' },
  { keywords: /设计|海报|UI|Figma|PS|Canva|审美/i, ability: '设计能力' },
  { keywords: /组织|策划|带队|分工|协调|管理/i, ability: '组织协调' },
  { keywords: /写作|文案|公众号|推文|文章|小红书/i, ability: '文字表达' },
  { keywords: /数据|分析|Excel|统计|可视化|图表/i, ability: '数据分析' },
  { keywords: /比赛|竞赛|获奖|得奖|拿奖|名次/i, ability: '竞赛能力' },
  { keywords: /调研|问卷|访谈|用户研究/i, ability: '调研能力' },
  { keywords: /沟通|说服|谈判|协调.{0,4}(同学|团队|老师)/i, ability: '沟通协调' },
  { keywords: /坚持|毅力|不放弃|克服|扛住|熬过/i, ability: '韧性' },
  { keywords: /主动|自愿|自发|自己想|好奇心/i, ability: '自驱力' },
  { keywords: /学弟|学妹|教|讲|分享|带人/i, ability: '知识传递' },
];

// ===== 发现型反馈（检测到新能力时）=====
const DISCOVERY_TEMPLATES = [
  // 共情 + 发现
  '等一下——你说的这个{ability}，可不是谁都有的。很多人专门花钱去学，你已经在做了。',
  '停一下，你刚才提到的这件事，其实就是{ability}。你知道吗，很多公司招人就看这个。',
  '我注意到一个有意思的事——你其实已经有{ability}了，只是你可能没把它当"能力"看。',
  '你可能觉得这是小事，但{ability}是很多人缺少的。你已经在路上了。',
  '说实话，{ability}这件事，很多人到工作几年后才意识到它的重要性。你现在已经有了。',
  '你刚才说的让我眼前一亮——{ability}是简历上非常值钱的关键词，而你有真实的例子。',
  '很多人会低估{ability}，但在面试官眼里，这是区分候选人的重要维度。你有。',
  '你有没有意识到，你刚才描述的其实就是{ability}？大多数人没有这样的经历。',
  // 新增：更走心的表达
  '你刚才随口说的这件事，放在简历上就是一个闪光点——{ability}，而且是真实的。',
  '我认真听完了，{ability}不是谁都能做到的。你做到了，只是没意识到而已。',
  '换个角度想：如果别人有你这段经历，你觉得他会怎么写简历？答案是——{ability}。',
  '你知道最让我意外的是什么吗？你说得那么轻描淡写，但这明明就是{ability}。',
  '有一个事实你可能不知道：招聘时，{ability}的权重比实习经历还高。你已经有了。',
  '你刚才那段话，如果让一个HR来听，她会直接在简历上标注"具备{ability}"。',
  '你没有在"吹牛"，你只是在陈述事实——你确实有{ability}，证据就在你自己的话里。',
  '说真的，很多工作了三年的人还没有你现在展现出的{ability}。',
];

// ===== 肯定型反馈（正常回答时）=====
const AFFIRMATION_TEMPLATES = [
  '好的，我记下了。继续说。',
  '收到，这很有价值。',
  '明白了。我正在整理你说的这些。',
  '好，这让我更了解你了。',
  '嗯，这个信息很有帮助。',
  '有意思，我在记了。',
  '很好，这些细节很重要。',
  '嗯，我理解了。你的经历比你想象的丰富。',
  '好的，我正在把这些串起来。',
  '收到。你说的每一个细节都可能成为简历上的亮点。',
  '好的，继续。你越说越清楚了。',
  '嗯，我已经记下来了。你说得比我预期的详细。',
  // 新增：更有温度的肯定
  '好，这条线索我抓住了。你继续。',
  '嗯，有意思。你在描述这些的时候可能没感觉，但信息量其实很大。',
  '收到。你知道吗，能把事情讲清楚，本身就是一种能力。',
  '好，这个细节很重要。很多人答到这里就含糊了，你说得很具体。',
  '嗯，我在给你的回答"画像"了——越画越清晰。',
  '好，我已经找到好几个可以写进简历的点了。继续。',
  '收到。你的坦诚比任何包装都有说服力。',
  '好。你可能觉得自己在"随便说说"，但每一句都在帮我理解你。',
  '嗯，这条回答让我觉得你比你表现出来的更厉害。',
  '好的。你不需要用"高大上"的词汇，真实就是最好的表达。',
];

// ===== 鼓励型反馈（回答太短时）=====
const ENCOURAGEMENT_TEMPLATES = [
  '没关系，不用想太多。哪怕是模糊的印象也行——能再具体说说吗？',
  '想到什么说什么就好。不需要完整的故事，几个关键词也行。',
  '不用急着给"标准答案"。你觉得是什么就说什么。',
  '没事，不用组织语言。"帮室友修过电脑"这种一句话也行。',
  '没想好也没关系，先说个大概，后面可以补充。',
  '不确定的话，先写个关键词，我来帮你展开。',
  // 新增：减轻压力
  '其实很多人在这个问题上也会犹豫。随便写点什么都好。',
  '没有"太小"的经历。你帮人查过资料？修过电脑？这些都是线索。',
  '你可以想象你在跟朋友聊天——"诶，你大学做过什么？"你的第一反应是什么？写下来就行。',
  '答案不重要，重要的是你在回忆。能想到什么就写什么。',
  '你知道吗，最精彩的回答往往就是这种"突然想起来的"小事。',
  '不用给我写作文。"有一次帮同学做了个PPT"——这种就够了。',
];

// ===== 连接型反馈（发现跨回答的共同能力）=====
const CONNECTION_TEMPLATES = [
  '我注意到你前面也提到过类似的——你好像天然擅长{ability}。',
  '这和你之前说的其实是一个能力：{ability}。你可以在这上面多想想。',
  '有意思，你两次都提到了跟{ability}相关的事。这可能不是巧合。',
  '你刚才说的又跟{ability}有关了。看来这是你的一个核心特质。',
  '又是{ability}——你在这方面的经历真的不少。',
  // 新增：强调模式
  '你看，你又提到{ability}了。一次是偶然，两次是习惯，三次就是天赋了。',
  '我开始看到一个规律了——{ability}好像贯穿了你很多经历。',
  '你可能没注意，但你已经连续两次展现出{ability}了。这不是巧合。',
  '如果要给你贴一个标签，{ability}可能是最准的那个。因为你总是不经意间就在做这件事。',
  '又是{ability}。你有没有想过，这可能就是你最大的优势？',
];

// ===== 名言 / 有力量的句子（随机穿插，增加深度）=====
const QUOTES = [
  { text: '你不需要看到整条路，只需要迈出第一步。', author: '马丁·路德·金' },
  { text: '知道自己不知道，是真正的智慧。', author: '苏格拉底' },
  { text: '勇气不是没有恐惧，而是战胜恐惧。', author: '纳尔逊·曼德拉' },
  { text: '每个人都是自己人生的设计师。', author: '歌德' },
  { text: '千里之行，始于足下。', author: '老子' },
  { text: '不要因为走得太远，就忘了为什么出发。', author: '纪伯伦' },
  { text: '世上没有白走的路，每一步都算数。', author: '松浦弥太郎' },
  { text: '种一棵树最好的时间是十年前，其次是现在。', author: '中国谚语' },
  { text: '人生没有白读的书，你触碰过的那些文字，会悄悄帮你认识这个世界。', author: '三毛' },
  { text: '不必匆忙，不必火花四溅，不必成为别人，只需做自己。', author: '弗吉尼亚·伍尔夫' },
  { text: '最困难的时刻，就是离成功不远的时刻。', author: '拿破仑' },
  { text: '真正的发现之旅，不在于寻找新的风景，而在于拥有新的眼光。', author: '马塞尔·普鲁斯特' },
  { text: '你今天受的苦，吃的亏，担的责，忍的痛，到最后都会变成光，照亮你的路。', author: '泰戈尔' },
  { text: '不是因为事情困难，我们才不敢做；而是因为我们不敢做，事情才变得困难。', author: '塞涅卡' },
  { text: '做你害怕做的事，害怕自然会消失。', author: '爱默生' },
  { text: '山不辞土，故能成其高；海不辞水，故能成其深。', author: '管子' },
  { text: '当你觉得晚了的时候，恰恰是最早的时候。', author: '哈佛校训' },
  { text: '每一次记录，都是在给未来的自己写一封推荐信。', author: '——' },
  { text: '你以为的"没什么经历"，可能只是你还没学会看见它。', author: '——' },
  { text: '真正的自信不是"我什么都行"，而是"我知道我擅长什么"。', author: '——' },
  { text: '你的价值，不由你的简历定义；但你的简历，可以帮你看见自己的价值。', author: '——' },
];

export function pickQuote(): string {
  const q = pickNoRepeat('quote', QUOTES);
  return q.author === '——' ? q.text : `${q.text} —— ${q.author}`;
}

/**
 * 分析用户回答，提取能力标签
 */
export function detectAbilities(answer: string): string[] {
  const found = new Set<string>();
  for (const pattern of ABILITY_PATTERNS) {
    if (pattern.keywords.test(answer)) {
      found.add(pattern.ability);
    }
  }
  return Array.from(found);
}

/**
 * 生成回答后的即时反馈
 * 会话内不重复，偶尔穿插名言
 */
export function generateFeedback(
  answer: string,
  questionIndex: number,
  allPreviousAbilities: string[] = []
): FeedbackResult {
  const trimmedAnswer = answer.trim();

  // 回答太短 → 鼓励
  if (trimmedAnswer.length < 15) {
    return {
      type: 'encouragement',
      message: pickNoRepeat('encouragement', ENCOURAGEMENT_TEMPLATES),
    };
  }

  // 检测能力
  const abilities = detectAbilities(trimmedAnswer);

  // 发现新能力 → discovery
  if (abilities.length > 0) {
    const newAbility = abilities.find(a => !allPreviousAbilities.includes(a)) || abilities[0];
    const template = pickNoRepeat('discovery', DISCOVERY_TEMPLATES);
    return {
      type: 'discovery',
      message: template.replace(/\{ability\}/g, newAbility),
      abilityTags: abilities,
    };
  }

  // 之前已发现相同能力 → connection
  if (allPreviousAbilities.length > 0) {
    const overlap = abilities.filter(a => allPreviousAbilities.includes(a));
    if (overlap.length > 0) {
      const template = pickNoRepeat('connection', CONNECTION_TEMPLATES);
      return {
        type: 'connection',
        message: template.replace(/\{ability\}/g, overlap[0]),
        abilityTags: overlap,
      };
    }
  }

  // 每 3 题左右穿插一次名言（概率约 25%，且不是第一题）
  if (questionIndex > 0 && Math.random() < 0.25) {
    return {
      type: 'quote',
      message: pickQuote(),
    };
  }

  // 默认肯定
  return {
    type: 'affirmation',
    message: pickNoRepeat('affirmation', AFFIRMATION_TEMPLATES),
  };
}

/**
 * 生成阶段小结（每2-3题后）
 */
export function generateStageSummary(
  abilities: Array<{ ability: string; fromQuestion: string }>
): string {
  if (abilities.length === 0) return '';

  const lines = abilities.map(a => `你提到「${a.fromQuestion}」—— 这说明你有${a.ability}`).join('。\n');

  const closers = [
    '这些不是小事，这些是能力。',
    '你比你以为的更有料。',
    '继续往下聊，还有更多等你发现。',
    '很多人到这一步就开始有感觉了——你呢？',
  ];

  return lines + '。\n\n' + pickNoRepeat('stageSummary', closers);
}

/**
 * 生成开场数据事实（消除"我最差"的焦虑）
 */
export function getWelcomeFact(): string {
  const facts = [
    '67% 的应届生简历写的是课堂项目，不是实习。你并不特殊。',
    '面试官说：比起经历多，更看重你能不能把一件事讲清楚。',
    '83% 的 HR 表示：应届生简历上最有价值的，是"主动学习"这件事本身。',
    '数据显示：能把一件小事讲明白的候选人，通过率比"经历多但讲不清"的人高出 40%。',
    '超过一半的成功求职者，在面试中讲的故事都是"不值一提"的小事。',
    '研究发现：能把经历说清楚的人，面试通过率是其他人的 2.3 倍。你正在练习的就是这个。',
    '招聘数据表明：应届生简历中最有说服力的不是实习，而是"主动做过什么"。',
    'HR 透露：看应届生简历时，最怕看到的是"精通XX"，最想看到的是"我做了一个XX"。',
  ];
  return pickNoRepeat('welcome', facts);
}
