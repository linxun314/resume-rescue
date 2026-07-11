// 根布局文件 - 所有页面的父级布局
// 引入全局样式
import "./globals.css";

// 元数据配置
export const metadata = {
  // 页面标题
  title: "三无简历急救室",
  // 页面描述
  description: "帮助没有实习、项目、竞赛的大学生，通过8步对话挖掘经历，生成STAR法则简历文案",
};

/**
 * 根布局组件
 * @param children - 子页面内容
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // HTML 根元素，设置语言为中文
    <html lang="zh-CN">
      {/* body 样式：最小高度占满屏幕、浅灰背景、深灰文字、抗锯齿渲染 */}
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        {/* 渲染子页面内容 */}
        {children}
      </body>
    </html>
  );
}
