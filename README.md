# 三无简历急救室

> 没经验、没实习、没奖项？别怕，你的价值只是还没被翻译。

在线体验：https://resume-rescue-rescue.netlify.app

## 这是什么？

一个专为"三无大学生"设计的AI简历生成工具。

不是让你造假，而是帮你发现那些被忽略的价值——课堂作业里的团队协作、社团活动中的组织能力、甚至帮室友修电脑背后的技术思维。

## 核心功能

- **心理预设**：先缓解焦虑，建立信心
- **10道引导问题**：基于设计心理学，帮你挖掘隐藏经历
- **心理赋能面板**：发现你的"可迁移能力"
- **面试官视角翻译**：把日常经历翻译成HR听得懂的语言
- **一键复制**：生成标准简历格式，直接粘贴使用

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- DeepSeek Chat API
- 设计心理学理论（峰终定律、自我效能感、认知重构等）

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

## 许可

MIT

---

**作者**：linxun314
