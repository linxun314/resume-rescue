// lib/graduatePromptGenerator.ts
// 考研简历生成Prompt，根据考研简历特点设计

import type { GraduateBasicInfo } from '@/components/GraduateBasicInfoForm';
import type { ExperienceFormData } from '@/components/GraduateExperienceForm';

/**
 * 考研简历生成Prompt
 * 根据考研简历特点设计，面向导师和招生办，突出科研潜力
 */
export function generateGraduateResumePrompt(
  basicInfo: GraduateBasicInfo,
  experienceData: ExperienceFormData,
  selectedTypes: string[]
): string {

  // 构建经历描述
  const experienceSections = selectedTypes.map((typeId) => {
    const data = experienceData[typeId] || {};
    return buildExperienceSection(typeId, data);
  }).join('\n\n');

  return `
<role>
你是一位资深的考研简历撰写专家，熟悉导师招生偏好和学术简历撰写规范。
你擅长从学生的课程项目、竞赛经历、自学经历中挖掘科研潜力。
你遵循诚信原则，绝不虚构经历，只翻译真实内容为学术语言。
</role>

<task>
请根据用户提供的信息，生成一份考研简历。
要求：
- 目标读者：导师、招生办
- 核心诉求：展现科研潜力、学习能力、学术热情
- 遵循学术简历规范，使用学术语言
- 重点突出：学业成绩、科研经历、英语水平
- 量化成果：论文、专利、竞赛奖项等
- 遵循诚信原则，不虚构经历
</task>

<writing_standards>
## 考研简历撰写标准

### 与求职简历的区别
| 维度 | 求职简历 | 考研简历 |
|------|---------|---------|
| 目标读者 | HR、业务经理 | 导师、招生办 |
| 核心诉求 | "能否胜任工作" | "是否有科研潜力" |
| 重点突出 | 实习经历、项目经验 | 成绩、科研经历、英语水平 |
| 经历描述 | 强调结果和业绩 | 强调过程和学术能力 |

### 考研简历结构
1. **基本信息**：姓名、联系方式、教育背景
2. **学业成绩**：GPA、排名、核心课程（重要）
3. **英语水平**：四六级、雅思托福（重要）
4. **科研经历**：课程项目、竞赛、实验室经历（最重要）
5. **论文专利**：如有，重点突出
6. **荣誉奖项**：奖学金、竞赛奖项
7. **自我评价**：学习能力、科研热情、研究方向理解

### 学术语言表达
- 用"研究"、"分析"、"实现"替代"做"、"完成"
- 强调方法论："使用XX方法"、"基于XX理论"
- 展现学术素养："文献调研"、"实验设计"、"数据分析"
- 体现学习能力："自学XX"、"通过XX途径"
</writing_standards>

<few_shot_examples>
以下是考研简历优秀示例：

### 示例1：课程项目（考研版）
原始输入："做了一个机器学习的课程项目"
优化输出：
**课程项目：基于机器学习的XX预测系统** | 组长 | 2023.09-2023.12
- 研究主题：使用机器学习方法预测XX问题
- 方法技术：使用Python实现XX算法，基于Scikit-learn框架
- 个人贡献：负责数据预处理、模型训练、结果分析
- 研究成果：完成实验报告一份，模型准确率达85%

### 示例2：竞赛经历（考研版）
原始输入："参加了数学建模比赛，得了省奖"
优化输出：
**全国大学生数学建模竞赛** | 建模手 | 2023.09
- 参赛题目：XX问题的建模与求解
- 方法技术：建立XX模型，使用MATLAB求解
- 个人贡献：负责模型建立和论文写作
- 获奖情况：省一等奖（队长）

### 示例3：自学经历（考研版）
原始输入："自学了Python"
优化输出：
**自学经历**
- 自学内容：Python编程与数据分析
- 学习途径：Coursera在线课程、GitHub开源项目
- 学习成果：掌握Python基础语法和数据分析库，完成在线课程并获得证书
- GitHub项目：XX项目，获得10+ Star
</few_shot_examples>

<user_info>
## 基本信息
- 姓名：${basicInfo.name}
- 性别：${basicInfo.gender}
- 学校：${basicInfo.school}
- 专业：${basicInfo.major}
- 学位：${basicInfo.degree}
- 毕业年份：${basicInfo.graduationYear}
- GPA：${basicInfo.gpa}
- 专业排名：${basicInfo.ranking}
- 英语：${basicInfo.englishLevel} ${basicInfo.englishScore}分
- 目标学校：${basicInfo.targetSchool}
- 目标专业：${basicInfo.targetMajor}
- 研究方向：${basicInfo.targetDirection}
${basicInfo.examScore ? `- 初试成绩：${basicInfo.examScore}` : ''}
</user_info>

<user_experiences>
${experienceSections}
</user_experiences>

<constraints>
重要约束：
1. 不虚构经历，只翻译用户提供的真实内容
2. 使用学术语言，体现研究思维
3. 重点突出科研潜力、学习能力、学术热情
4. 如果用户没有论文，不要虚构，可以通过课程项目展现科研潜力
5. 成绩不够好可以弱化，但不要隐瞒
6. 英语成绩高的一定要突出
7. 研究方向要体现理解，不要泛泛而谈
</constraints>

<output_format>
请按以下格式输出考研简历：

## 基本信息
[姓名] | [性别] | [联系方式] | [邮箱]
[学校] | [专业] | [学位] | [毕业年份]

## 学业成绩
- GPA：[GPA/均分]
- 排名：[专业排名]
- 核心课程：[与目标方向相关的课程]

## 英语水平
- [英语等级]：[分数]

## 科研经历（按重要性排序）
**[经历名称]** | [角色] | [时间]
- [用学术语言描述]
- [突出方法和贡献]
- [成果和收获]

## 荣誉奖项
- [奖项名称] | [级别] | [时间]

## 自我评价
- 学习能力：[具体事例]
- 科研热情：[具体事例]
- 研究方向：[对目标方向的理解]

## 补充建议（如果信息不足）
[提示用户补充的信息]
</output_format>

请现在开始生成考研简历：
`;
}

/**
 * 构建经历部分
 */
function buildExperienceSection(typeId: string, data: Record<string, string>): string {
  const typeNames: Record<string, string> = {
    'course-project': '课程项目',
    'competition': '学科竞赛',
    'research-project': '科研经历',
    'paper': '论文专利',
    'self-learning': '自学经历',
    'honor': '荣誉奖项',
    'student-work': '学生工作',
    'internship': '实习经历',
  };

  let section = `### ${typeNames[typeId] || typeId}\n`;

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      section += `- ${key}: ${value}\n`;
    }
  });

  return section;
}

/**
 * 考研简历Few-Shot示例（用于AI学习）
 */
export const graduateFewShotExamples = [
  {
    category: '课程项目',
    input: '做了一个机器学习的课程项目',
    output: `**课程项目：基于机器学习的房价预测系统** | 组长 | 2023.09-2023.12
- 研究主题：使用机器学习方法预测房价走势
- 方法技术：基于Python实现线性回归、随机森林等算法，使用Scikit-learn框架
- 个人贡献：负责数据预处理、特征工程、模型训练和结果分析
- 研究成果：完成实验报告一份，模型准确率达85%，获课程优秀项目`,
  },
  {
    category: '竞赛经历',
    input: '参加了数学建模比赛，得了省奖',
    output: `**全国大学生数学建模竞赛** | 建模手 | 2023.09
- 参赛题目：城市交通拥堵问题的建模与优化
- 方法技术：建立多目标优化模型，使用MATLAB求解
- 个人贡献：负责模型建立、求解和论文写作
- 获奖情况：省一等奖（队长，参赛队伍前5%）`,
  },
  {
    category: '自学经历',
    input: '自学了Python和机器学习',
    output: `**自学经历**
- 自学内容：Python编程与机器学习基础
- 学习途径：Coursera《Machine Learning》课程（Andrew Ng）、GitHub开源项目
- 学习成果：掌握Python基础语法和数据分析库（Pandas、NumPy），完成课程并获得证书
- 项目实践：GitHub开源项目"HousePricePrediction"，获得20+ Star`,
  },
  {
    category: '科研经历',
    input: '在实验室做过一段时间科研',
    output: `**XX大学计算机视觉实验室** | 研究助理 | 2022.09-2023.06
- 研究方向：目标检测与图像分割
- 个人贡献：负责文献调研、实验设计和数据分析
- 方法技术：使用PyTorch框架，复现YOLOv5算法并进行改进
- 研究成果：完成实验报告一份，参与撰写论文一篇（在投）`,
  },
];
