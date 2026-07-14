import { Resume, ResumeMeta } from './resumeTypes';
import { allKaoyanResumes } from './graduateResumeData';

/**
 * 4类高分简历范本数据
 */

// ==================== 范本一：通用应届生简历 ====================
export const generalGraduateResume: Resume = {
  id: 'general-graduate',
  title: '通用应届生简历',
  description: '适合大多数应届生，强调学习能力、主动性、基础能力',
  targetJobs: ['行政助理', '运营助理', '市场助理', '人力资源助理'],
  tags: ['无实习', '有社团', '有课程项目'],
  difficulty: 'easy',
  writingTime: '2-3小时',

  basicInfo: {
    name: '张三',
    phone: '138-0000-0000',
    email: 'zhangsan@email.com',
    location: '北京市朝阳区',
    education: '某某大学',
    major: '工商管理',
    graduationYear: '2021-2025',
    targetPosition: '运营助理/行政助理',
  },

  education: {
    school: '某某大学',
    major: '工商管理专业',
    degree: '本科',
    period: '2021.09 - 2025.06',
    gpa: 'GPA: 3.6/4.0, 专业排名前15%',
    courses: ['管理学原理', '市场营销', '组织行为学', '数据分析基础'],
    honors: ['校级三好学生(2023)', '优秀学生干部(2024)'],
  },

  projectExperiences: [
    {
      title: '课程项目：校园咖啡厅市场调研与运营策划',
      role: '组长',
      period: '2023.09 - 2023.12',
      situation: '市场营销课程要求为校园咖啡厅制定运营优化方案',
      task: '负责市场调研、用户访谈、方案设计，带领4人小组完成项目',
      action: '设计问卷调研300+学生消费习惯，访谈10位常客，发现午间高峰排队严重问题；提出"线上预点单+午间套餐"方案；制作PPT展示并获小组最高分',
      result: '方案获课程优秀项目(全班前5%)，被咖啡厅采纳试点，午间订单量提升25%',
      tags: ['市场调研', '团队协作', '数据分析'],
    },
    {
      title: '校园公众号运营项目',
      role: '主编',
      period: '2022.09 - 2023.06',
      situation: '学院公众号粉丝停滞在2000人，月均阅读量仅5000',
      task: '负责内容策划、排版优化、粉丝增长，目标提升影响力',
      action: '调研用户兴趣，推出"职场干货"系列专栏；优化推送时间至晚8点；设计互动话题增加评论率；组织3次线上活动',
      result: '10个月内粉丝从2000增长至4500+(增长125%)，月均阅读量提升至15000+(增长200%)',
      tags: ['内容运营', '用户增长', '数据分析'],
    },
  ],

  practiceExperiences: [
    {
      organization: '校学生会宣传部',
      role: '干事 → 副部长',
      period: '2021.09 - 2023.06',
      achievements: [
        '策划并执行年度迎新晚会宣传方案，设计海报、视频预热，吸引800+学生参与(同比提升33%)',
        '管理宣传团队5人，制定内容日历，保证公众号每周更新3次，全年零断更',
        '协助社团活动宣传，累计服务10+社团，制作宣传物料50+份',
      ],
    },
    {
      organization: '志愿者服务',
      role: '志愿者',
      period: '2022.07 - 2022.08',
      achievements: [
        '参与社区疫情防控志愿服务，协助核酸检测信息登记，累计服务时长120小时',
        '获"优秀志愿者"称号，锻炼了应急沟通能力和抗压能力',
      ],
    },
  ],

  skills: {
    categories: [
      {
        name: '办公技能',
        items: ['精通Word、Excel、PPT', '掌握Excel数据透视表、VLOOKUP函数'],
      },
      {
        name: '数据分析',
        items: ['熟练使用Python进行数据清洗和可视化(自学Coursera课程并获证书)'],
      },
      {
        name: '语言能力',
        items: ['CET-6(520分)', '普通话二级甲等'],
      },
      {
        name: '其他证书',
        items: ['计算机二级(MS Office)', '普通话水平测试'],
      },
    ],
  },

  selfEvaluation: [
    {
      title: '学习能力强',
      description: '自学Python数据分析，3个月完成Coursera课程并应用于课程项目',
    },
    {
      title: '责任心强',
      description: '担任社团干部期间，多次主动承担紧急任务，保证活动顺利开展',
    },
    {
      title: '沟通协作',
      description: '在小组项目中多次担任组长，协调团队成员分工，获组员好评',
    },
    {
      title: '目标导向',
      description: '运营公众号期间设定明确的粉丝增长目标，通过数据分析和优化策略达成目标',
    },
  ],

  writingTips: [
    '从课程项目、社团经历中挖掘价值，用STAR法则量化成果',
    '突出学习能力(自学Python)、责任心(主动承担)、沟通协作(团队协调)',
    '使用具体数字支撑：粉丝增长125%、阅读量提升200%、订单量提升25%等',
    '弱经历转化："参与宣传活动"→"策划并执行宣传方案，吸引800+学生参与"',
  ],

  starExamples: [
    {
      category: '社团活动',
      original: '参加学生会宣传部，做了海报和视频',
      optimized: '策划并执行年度迎新晚会宣传方案，设计海报、视频预热，吸引800+学生参与(同比提升33%)',
    },
    {
      category: '课程项目',
      original: '做了一个市场调研的小组作业',
      optimized: '设计问卷调研300+学生消费习惯，访谈10位常客，发现午间高峰排队严重问题；提出"线上预点单+午间套餐"方案，被咖啡厅采纳试点，午间订单量提升25%',
    },
  ],
};

// ==================== 范本二：产品运营方向简历 ====================
export const productOperationResume: Resume = {
  id: 'product-operation',
  title: '产品运营方向简历',
  description: '适合想转产品/运营的同学，强调用户洞察、数据思维',
  targetJobs: ['产品助理', '运营专员', '用户运营', '活动运营'],
  tags: ['有项目经历', '有社团组织经历', '对用户需求敏感'],
  difficulty: 'medium',
  writingTime: '3-4小时',

  basicInfo: {
    name: '李四',
    phone: '139-0000-0000',
    email: 'lisi@email.com',
    location: '上海市浦东新区',
    education: '某某大学',
    major: '信息管理与信息系统',
    graduationYear: '2020-2024',
    targetPosition: '产品助理/运营专员',
  },

  education: {
    school: '某某大学',
    major: '信息管理与信息系统',
    degree: '本科',
    period: '2020.09 - 2024.06',
    gpa: 'GPA: 3.7/4.0, 专业排名前10%',
    courses: ['数据库原理', '用户体验设计', '产品管理', '数据分析'],
    honors: ['校级优秀毕业生', '国家励志奖学金(2022、2023)'],
  },

  projectExperiences: [
    {
      title: '校园二手交易平台"闲置宝"产品设计',
      role: '产品负责人',
      period: '2023.03 - 2023.09',
      situation: '团队发现校园二手交易主要靠微信群，信息分散、效率低下',
      task: '负责用户调研、需求分析、原型设计，带领3人团队开发MVP版本',
      action: '访谈50+学生，提炼"快速匹配"、"线下交易安全"等核心需求；使用Figma设计产品原型；协调技术开发，2个月上线小程序',
      result: '上线3个月累计用户800+，促成交易300+笔，获校级创新创业大赛二等奖，被校团委推荐参加省级比赛',
      tags: ['产品调研', '原型设计', '团队协作'],
    },
    {
      title: '社团招新活动运营',
      role: '活动策划',
      period: '2022.09 - 2022.10',
      situation: '社团每年招新效果不稳定，需要提升新会员数量和质量',
      task: '策划线上线下结合的招新方案，目标招募80名新会员',
      action: '设计"社团体验日"活动，让新生体验社团活动；制作创意海报和短视频预热；设置推荐奖励机制鼓励老会员带新人',
      result: '活动期间吸引200+学生报名，最终招募新会员95人(目标达成率119%)，同比增长38%',
      tags: ['活动策划', '用户增长', '数据驱动'],
    },
  ],

  practiceExperiences: [
    {
      organization: '校学生会外联部',
      role: '部长',
      period: '2021.09 - 2023.06',
      achievements: [
        '负责社团赞助洽谈，累计对接企业20+，为社团活动筹集赞助资金15000元',
        '策划"校园企业行"活动，组织100+学生参观互联网公司，提升学生职业认知',
      ],
    },
    {
      organization: '线上社群运营',
      role: '群主',
      period: '2022.03 - 至今',
      achievements: [
        '建立"产品学习交流群"，从0开始运营，目前群成员500+',
        '组织线上分享会20次，邀请互联网从业者分享产品/运营经验',
      ],
    },
  ],

  skills: {
    categories: [
      {
        name: '产品技能',
        items: ['熟练使用Figma、Axure、XMind进行原型设计和思维导图'],
      },
      {
        name: '数据分析',
        items: ['Python数据分析(pandas、matplotlib、seaborn)', 'SQL基础'],
      },
      {
        name: '办公技能',
        items: ['Excel数据透视表', 'PPT制作', '文档撰写'],
      },
      {
        name: '语言能力',
        items: ['CET-6(550分)', '能阅读英文产品文档'],
      },
    ],
  },

  selfEvaluation: [
    {
      title: '用户思维',
      description: '在产品设计中始终从用户需求出发，善于通过访谈和数据分析发现真实需求',
    },
    {
      title: '数据驱动',
      description: '具备Python数据分析能力，能够用数据支撑产品决策',
    },
    {
      title: '快速学习',
      description: '自学Figma、Python数据分析，3个月掌握并能独立完成项目',
    },
    {
      title: '结果导向',
      description: '在社团招新中设定明确目标，通过优化策略超额完成目标',
    },
  ],

  writingTips: [
    '从社团活动、课程项目中提取产品和运营相关经历，用产品思维重构',
    '突出能力：用户思维(用户调研)、数据驱动(Python分析)、结果导向(目标达成率)',
    '植入关键词："用户调研"、"需求分析"、"原型设计"、"用户分群"等',
  ],

  starExamples: [
    {
      category: '课程项目',
      original: '做了一个用户数据分析的作业',
      optimized: '使用Python处理10万条用户行为数据，设计用户分群模型(RFM模型)，识别出3类典型流失用户特征，提出"新手引导优化"方案',
    },
    {
      category: '社团活动',
      original: '组织了社团招新活动',
      optimized: '设计"社团体验日"活动，让新生体验社团活动；制作创意海报和短视频预热；设置推荐奖励机制，最终招募新会员95人(目标达成率119%)',
    },
  ],
};

// ==================== 范本三：商科创业方向简历 ====================
export const businessStartupResume: Resume = {
  id: 'business-startup',
  title: '商科创业方向简历',
  description: '适合有创业/兼职经历的同学，强调商业敏感度和执行力',
  targetJobs: ['销售管培生', '市场专员', '创业公司运营'],
  tags: ['有创业经历', '有销售经历', '商业敏感度高'],
  difficulty: 'medium',
  writingTime: '3-4小时',

  basicInfo: {
    name: '王五',
    phone: '137-0000-0000',
    email: 'wangwu@email.com',
    location: '广州市天河区',
    education: '某某大学',
    major: '市场营销',
    graduationYear: '2020-2024',
    targetPosition: '销售管培生/市场专员',
  },

  education: {
    school: '某某大学',
    major: '市场营销',
    degree: '本科',
    period: '2020.09 - 2024.06',
    gpa: 'GPA: 3.5/4.0, 专业排名前20%',
    courses: ['市场营销学', '消费者行为学', '品牌管理', '销售管理'],
    honors: ['校级优秀学生干部', '创业大赛省级三等奖'],
  },

  projectExperiences: [
    {
      title: '校园跑腿服务平台"帮帮"',
      role: '联合创始人',
      period: '2022.03 - 2023.06',
      situation: '发现校园快递代取、外卖代买需求旺盛，但缺少统一平台',
      task: '负责业务拓展、用户增长、团队管理，带领5人团队运营平台',
      action: '设计"帮帮"小程序，对接校内快递点、外卖商家；制定跑腿员培训体系；策划"首单免费"活动获客；建立用户反馈机制优化服务',
      result: '15个月累计服务用户3000+，完成订单15000+，月流水达3万元，获校级创新创业大赛一等奖',
      tags: ['创业', '团队管理', '业务拓展'],
    },
    {
      title: '校园奶茶店兼职',
      role: '店长助理',
      period: '2021.09 - 2022.02',
      situation: '奶茶店地处校园边缘，客流量少，老板希望提升销量',
      task: '负责店铺日常运营、促销活动策划、客户关系维护',
      action: '分析客群，推出"学生套餐+第二杯半价"组合；建立微信群，每日推送优惠信息；培训新员工提升服务效率',
      result: '3个月内月销售额从2万提升至3.5万(增长75%)，客户复购率从40%提升至65%',
      tags: ['销售', '促销策划', '客户关系'],
    },
  ],

  practiceExperiences: [
    {
      organization: '校园代理销售',
      role: '区域代理',
      period: '2022.09 - 2023.06',
      achievements: [
        '代理某品牌护肤品，负责校园推广和销售',
        '建立销售团队5人，制定销售激励制度，累计销售额8万元',
      ],
    },
  ],

  skills: {
    categories: [
      {
        name: '商务技能',
        items: ['熟练掌握销售技巧', '客户关系管理', '商务谈判'],
      },
      {
        name: '营销技能',
        items: ['社群运营', '短视频运营', '活动策划', '市场调研'],
      },
      {
        name: '数据分析',
        items: ['Excel数据透视表', '基础SQL'],
      },
      {
        name: '语言能力',
        items: ['CET-6(500分)', '粤语流利'],
      },
    ],
  },

  selfEvaluation: [
    {
      title: '商业敏感度',
      description: '在校期间创业和兼职经历培养了对商业机会的敏锐洞察',
    },
    {
      title: '结果导向',
      description: '创业项目月流水3万、奶茶店销售增长75%，习惯用数据说话',
    },
    {
      title: '抗压能力',
      description: '创业期间多次面对困难，能够快速调整策略，坚持不懈',
    },
    {
      title: '团队协作',
      description: '带领5人创业团队、3人销售团队，善于激励和管理团队',
    },
  ],

  writingTips: [
    '将创业、兼职经历用STAR法则量化，展示商业成果和执行能力',
    '突出能力：商业敏感度(创业项目)、结果导向(销售增长75%)、抗压能力(创业经历)',
    '使用数据支撑：月流水3万、销售增长75%、用户3000+、订单15000+等',
  ],

  starExamples: [
    {
      category: '创业经历',
      original: '做了一个校园跑腿平台',
      optimized: '设计"帮帮"小程序，对接校内快递点、外卖商家；制定跑腿员培训体系；策划"首单免费"活动获客，15个月累计服务用户3000+，完成订单15000+，月流水达3万元',
    },
    {
      category: '兼职经历',
      original: '在奶茶店打工，卖奶茶',
      optimized: '负责店铺日常运营、促销活动策划，推出"学生套餐+第二杯半价"组合；建立微信群，每日推送优惠信息，3个月内月销售额从2万提升至3.5万(增长75%)',
    },
  ],
};

// ==================== 范本四：技术自学方向简历 ====================
export const techSelfLearnResume: Resume = {
  id: 'tech-self-learn',
  title: '技术自学方向简历',
  description: '适合非科班转技术的同学，强调自学能力和项目经验',
  targetJobs: ['前端开发工程师', '后端开发工程师', '数据分析'],
  tags: ['自学编程', '有个人项目', '非科班转技术'],
  difficulty: 'hard',
  writingTime: '4-5小时',

  basicInfo: {
    name: '赵六',
    phone: '136-0000-0000',
    email: 'zhaoliu@email.com',
    location: '深圳市南山区',
    education: '某某大学',
    major: '机械工程',
    graduationYear: '2020-2024',
    targetPosition: '前端开发工程师',
  },

  education: {
    school: '某某大学',
    major: '机械工程',
    degree: '本科',
    period: '2020.09 - 2024.06',
    gpa: 'GPA: 3.4/4.0, 专业排名前30%',
    courses: ['C语言程序设计', '数据结构与算法(自学)', '计算机网络(自学)'],
    honors: ['校级优秀毕业生(因自学编程成果突出)'],
  },

  projectExperiences: [
    {
      title: '个人项目：在线笔记应用"NoteHub"',
      role: '独立开发',
      period: '2023.06 - 2023.09',
      situation: '自学前端3个月后，希望做一个完整项目巩固所学',
      task: '独立设计并开发一个在线笔记应用，实现用户注册、笔记创建、编辑、删除、搜索功能',
      action: '使用Vue.js + Node.js + MongoDB技术栈；设计RESTful API接口；实现用户认证(JWT)；使用Markdown编辑器支持富文本；部署到阿里云服务器',
      result: '项目上线，支持多用户使用，GitHub获得50+ Star，上线3个月注册用户300+',
      tags: ['Vue.js', 'Node.js', 'MongoDB', '全栈开发'],
    },
    {
      title: '课程项目：实验室设备管理系统',
      role: '前端开发',
      period: '2023.03 - 2023.06',
      situation: '实验室设备借用主要靠Excel记录，效率低、易出错',
      task: '负责前端开发，实现设备借用申请、审批、归还流程',
      action: '使用React开发前端界面；设计响应式布局适配手机和PC；使用Ant Design组件库提升开发效率',
      result: '系统上线后，实验室设备借用效率提升50%，借用记录查询时间从5分钟缩短至10秒',
      tags: ['React', '响应式设计', '组件库'],
    },
  ],

  practiceExperiences: [
    {
      organization: '社团网站维护',
      role: '技术负责人',
      period: '2022.09 - 2023.06',
      achievements: [
        '负责校学生会官网的技术维护和功能迭代',
        '优化网站加载速度，页面加载时间从3秒降至1.5秒',
      ],
    },
  ],

  skills: {
    categories: [
      {
        name: '编程语言',
        items: ['JavaScript(熟练)', 'Python(基础)', 'C语言(基础)'],
      },
      {
        name: '框架库',
        items: ['Vue.js(熟练)', 'React(熟悉)', 'Node.js(熟悉)'],
      },
      {
        name: '数据库',
        items: ['MySQL', 'MongoDB'],
      },
      {
        name: '工具',
        items: ['Git', 'Webpack', 'VS Code', 'Postman'],
      },
      {
        name: '英语能力',
        items: ['CET-6(480分)', '能阅读英文技术文档'],
      },
    ],
  },

  selfEvaluation: [
    {
      title: '自学能力强',
      description: '从零开始自学前端，12个月独立完成完整项目并上线',
    },
    {
      title: '技术热情',
      description: '每天学习技术博客、参与开源社区、写技术文章分享',
    },
    {
      title: '问题解决',
      description: '在项目开发中遇到问题时，能够快速通过文档、社区找到解决方案',
    },
    {
      title: '持续成长',
      description: '制定清晰的学习计划，每月完成100+小时的技术学习',
    },
  ],

  writingTips: [
    '用项目经历证明技术能力，突出自学能力和技术热情',
    '突出能力：自学能力(12个月掌握前端)、技术热情(持续学习)、问题解决(独立开发项目)',
    '数据支撑：GitHub 50+ Star、注册用户300+、算法题200+道等',
  ],

  starExamples: [
    {
      category: '个人项目',
      original: '做了一个笔记网站',
      optimized: '使用Vue.js + Node.js + MongoDB技术栈独立开发在线笔记应用，实现用户认证、RESTful API、Markdown编辑等功能；部署到阿里云服务器，GitHub获得50+ Star，上线3个月注册用户300+',
    },
    {
      category: '开源贡献',
      original: '给开源项目提过代码',
      optimized: '为开源Vue组件库贡献代码，修复bug 3个，新增功能1个；按照贡献指南提交Pull Request，学习开源项目协作流程、代码规范',
    },
  ],
};

// ==================== 导出所有简历数据（含考研范本） ====================
export const allResumes: Resume[] = [
  generalGraduateResume,
  productOperationResume,
  businessStartupResume,
  techSelfLearnResume,
  ...allKaoyanResumes,
];

// ==================== 导出简历元数据 ====================
export const resumeMetas: ResumeMeta[] = allResumes.map((resume) => ({
  id: resume.id,
  title: resume.title,
  description: resume.description,
  tags: resume.tags,
  targetJobs: resume.targetJobs,
  difficulty: resume.difficulty,
  writingTime: resume.writingTime,
  highlight: resume.id === 'general-graduate',
}));

// ==================== 工具函数 ====================

/**
 * 根据ID获取简历详情
 */
export function getResumeById(id: string): Resume | undefined {
  return allResumes.find((resume) => resume.id === id);
}

/**
 * 根据标签筛选简历
 */
export function filterResumeByTags(tags: string[]): ResumeMeta[] {
  if (tags.length === 0) return resumeMetas;

  return resumeMetas.filter((meta) =>
    tags.some((tag) => meta.tags.includes(tag))
  );
}
