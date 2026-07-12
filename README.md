# 三无简历急救室

> 没经验、没实习、没奖项？别怕，你的价值只是还没被翻译。

在线体验：https://resume-rescue-rescue.netlify.app

## 这是什么？

一个专为"三无大学生"设计的AI简历生成工具。

不是让你造假，而是帮你发现那些被忽略的价值——课堂作业里的团队协作、社团活动中的组织能力、甚至帮室友修电脑背后的技术思维。

## 核心功能

### 心理赋能系统
- **焦虑缓解**：5条心理学提示，缓解简历焦虑
- **诚信承诺**：勾选承诺，确保真实经历
- **心理赋能面板**：发现你的"可迁移能力"

### 智能简历生成
- **场景选择**：找实习 / 找工作，定制专属策略
- **8道引导问题**：每题附带真实案例引导
- **智能岗位推荐**：输入专业自动推荐相关岗位（30+专业）
- **面试官视角翻译**：弱动词→强动词，STAR法则量化成果
- **一键复制**：生成标准简历格式，直接粘贴使用

### 简历范本库
- **4类高分范本**：通用应届生、产品运营、商科创业、技术自学
- **STAR案例对比**：原始表达 vs 优化后，学习职场语言
- **撰写要点**：每份范本附带专业撰写建议
- **标签筛选**：按"无实习"、"有社团"、"有创业经历"等标签筛选

## 技术栈

- **前端**：Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **后端**：DeepSeek Chat API
- **设计心理学**：峰终定律、自我效能感、认知重构、宜家效应、锚定效应

## 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 DEEPSEEK_API_KEY

# 启动开发服务器
npm run dev
```

## 部署

```bash
# 部署到 Netlify
netlify deploy --prod
```

## 项目结构

```
resume-rescue/
├── app/
│   ├── page.tsx                  # 主流程控制
│   ├── api/generate/route.ts     # AI生成接口
│   └── templates/
│       ├── page.tsx              # 简历范本列表
│       └── [id]/page.tsx         # 简历范本详情
├── components/
│   ├── AnxietyRelief.tsx         # 焦虑缓解组件
│   ├── ScenarioSelector.tsx      # 场景选择组件
│   ├── QuestionFlow.tsx          # 问题流程组件
│   ├── PsychologyPanel.tsx       # 心理赋能面板
│   ├── ResultDisplay.tsx         # 结果展示
│   └── TipCard.tsx               # 提示卡片组件
├── lib/
│   ├── prompts.ts                # Prompt配置
│   ├── jobRecommendations.ts     # 岗位推荐映射
│   ├── resumeTypes.ts            # 简历类型定义
│   └── resumeData.ts             # 简历范本数据
└── README.md
```

## 设计理念

### 诚信求职
- 绝不虚构经历
- 绝不夸大成果
- 绝不造假简历
- 只帮你梳理真实经历

### 心理学驱动
- **峰终定律**：创造"惊喜发现"的峰值体验
- **自我效能感**：从回答中提取"成功证据"
- **认知重构**：把"没有经历"重构为"没有发现经历"
- **宜家效应**：用户参与越多，越认可结果

## 许可

MIT

---

**作者**：linxun314

**在线体验**：https://resume-rescue-rescue.netlify.app
