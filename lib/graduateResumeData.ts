// lib/graduateResumeData.ts
// 考研简历范本数据

import { Resume } from './resumeTypes';

/**
 * 考研简历范本数据
 * 注意：变量名和ID使用 'kaoyan' 前缀以避免与 resumeData.ts 中的求职简历数据冲突
 */

// ==================== 范本一：计算机考研简历 ====================
export const csKaoyanResume: Resume = {
  id: 'cs-kaoyan',
  title: '计算机考研简历',
  description: '适合计算机相关专业考研，强调编程能力和科研潜力',
  targetJobs: ['计算机科学与技术', '软件工程', '人工智能', '大数据'],
  tags: ['考研', '有项目经历', '有竞赛经历', '编程能力强'],
  difficulty: 'medium',
  writingTime: '3-4小时',

  basicInfo: {
    name: '李明',
    phone: '138-0000-0000',
    email: 'liming@email.com',
    location: '北京市海淀区',
    education: '某某大学',
    major: '计算机科学与技术',
    graduationYear: '2021-2025',
    targetPosition: '计算机科学与技术（学硕）',
  },

  education: {
    school: '某某大学',
    major: '计算机科学与技术',
    degree: '本科',
    period: '2021.09 - 2025.06',
    gpa: 'GPA: 3.8/4.0, 专业排名 3/120',
    courses: ['数据结构', '算法设计与分析', '机器学习', '深度学习', '计算机视觉'],
    honors: ['国家奖学金(2022、2023)', '省级优秀毕业生'],
  },

  projectExperiences: [
    {
      title: '课程项目：基于深度学习的图像分类系统',
      role: '组长',
      period: '2023.09 - 2023.12',
      situation: '机器学习课程要求完成一个深度学习项目',
      task: '负责项目设计、模型训练和论文撰写',
      action: '使用PyTorch框架实现ResNet、VGG等模型；在CIFAR-10数据集上进行实验；对比不同模型的效果',
      result: '模型准确率达92%；完成实验报告一份；获课程优秀项目（全班前5%）',
      tags: ['深度学习', 'PyTorch', '计算机视觉'],
    },
    {
      title: '学科竞赛：全国大学生数学建模竞赛',
      role: '建模手',
      period: '2023.09',
      situation: '参加数学建模竞赛，解决XX问题',
      task: '负责模型建立、求解和论文写作',
      action: '建立多目标优化模型；使用MATLAB求解；撰写论文',
      result: '获省一等奖（队长）；论文被评为优秀论文',
      tags: ['数学建模', 'MATLAB', '论文写作'],
    },
    {
      title: '科研经历：计算机视觉实验室',
      role: '研究助理',
      period: '2022.09 - 2023.06',
      situation: '加入导师实验室，参与目标检测研究',
      task: '负责文献调研、实验设计和数据分析',
      action: '阅读相关论文30+篇；复现YOLOv5算法并改进；完成实验报告',
      result: '参与撰写论文一篇（在投）；掌握科研方法',
      tags: ['科研', '文献调研', '实验设计'],
    },
  ],

  skills: {
    categories: [
      { name: '编程语言', items: ['Python（熟练）', 'C++（熟悉）', 'Java（基础）'] },
      { name: '框架工具', items: ['PyTorch', 'TensorFlow', 'Scikit-learn'] },
      { name: '英语水平', items: ['CET-6（580分）', '能阅读英文文献'] },
      { name: '其他', items: ['GitHub活跃用户', 'LeetCode刷题200+'] },
    ],
  },

  selfEvaluation: [
    { title: '学习能力', description: '自学深度学习，完成多个项目' },
    { title: '科研热情', description: '参与实验室科研，阅读论文30+篇' },
    { title: '编程能力', description: '熟练使用Python，LeetCode刷题200+' },
    { title: '研究方向', description: '对计算机视觉有浓厚兴趣，了解目标检测领域' },
  ],

  writingTips: [
    '考研简历重点突出科研潜力，即使没有论文也要展现研究能力',
    '强调方法论和学术素养，用"研究"、"分析"等学术语言',
    '英语成绩高的要突出，导师看重阅读英文文献的能力',
    '研究方向要具体，展现对目标方向的理解',
  ],

  starExamples: [
    {
      category: '课程项目',
      original: '做了一个机器学习的课程项目',
      optimized: '使用PyTorch框架实现ResNet、VGG等模型，在CIFAR-10数据集上进行实验，模型准确率达92%，获课程优秀项目（全班前5%）',
    },
  ],
};

// ==================== 范本二：通用考研简历 ====================
export const generalKaoyanResume: Resume = {
  id: 'general-kaoyan',
  title: '通用考研简历',
  description: '适合大多数专业考研，强调学习能力和学术热情',
  targetJobs: ['各专业通用'],
  tags: ['考研', '有课程项目', '学习成绩好', '英语较好'],
  difficulty: 'easy',
  writingTime: '2-3小时',

  basicInfo: {
    name: '张华',
    phone: '139-0000-0000',
    email: 'zhanghua@email.com',
    location: '某某省某某市',
    education: '某某大学',
    major: '工商管理',
    graduationYear: '2021-2025',
    targetPosition: '企业管理（学硕）',
  },

  education: {
    school: '某某大学',
    major: '工商管理',
    degree: '本科',
    period: '2021.09 - 2025.06',
    gpa: 'GPA: 3.6/4.0, 专业排名前10%',
    courses: ['管理学原理', '市场营销', '组织行为学', '战略管理'],
    honors: ['校级三好学生(2022、2023)', '国家励志奖学金'],
  },

  projectExperiences: [
    {
      title: '课程项目：企业数字化转型研究',
      role: '组长',
      period: '2023.09 - 2023.12',
      situation: '战略管理课程要求研究企业转型案例',
      task: '负责文献调研、案例分析和报告撰写',
      action: '阅读相关文献20+篇；分析XX企业数字化转型案例；撰写研究报告',
      result: '完成研究报告一份；获课程优秀作业；对数字化转型有了深入理解',
      tags: ['文献调研', '案例分析', '报告写作'],
    },
  ],

  practiceExperiences: [
    {
      organization: '学术论文写作',
      role: '第一作者',
      period: '2023.03 - 2023.06',
      achievements: [
        '撰写论文《XX问题研究》，投稿XX期刊（在审）',
        '掌握学术论文写作规范和文献检索方法',
      ],
    },
  ],

  skills: {
    categories: [
      { name: '研究方法', items: ['文献调研', '案例分析', '定量分析'] },
      { name: '软件工具', items: ['SPSS', 'Excel数据分析', 'NVivo'] },
      { name: '英语水平', items: ['CET-6（520分）', '能阅读英文文献'] },
    ],
  },

  selfEvaluation: [
    { title: '学习能力', description: '成绩优异，专业排名前10%' },
    { title: '研究兴趣', description: '对企业数字化转型有浓厚兴趣' },
    { title: '学术素养', description: '掌握文献检索和论文写作方法' },
  ],

  writingTips: [
    '文科类专业考研简历强调学术素养和研究方法',
    '突出文献阅读量和论文写作经历',
    '研究方向要具体，展现对目标方向的理解',
  ],

  starExamples: [
    {
      category: '课程项目',
      original: '做了一个课程作业',
      optimized: '阅读相关文献20+篇，分析XX企业数字化转型案例，撰写研究报告，获课程优秀作业',
    },
  ],
};

// ==================== 导出所有考研简历范本 ====================
export const allKaoyanResumes: Resume[] = [
  csKaoyanResume,
  generalKaoyanResume,
];
