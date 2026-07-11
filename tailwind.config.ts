// Tailwind CSS 配置文件
import type { Config } from "tailwindcss";

const config: Config = {
  // 扫描所有组件和页面文件，自动生成对应的 CSS 类
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",    // app 目录下所有文件
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // components 目录下所有文件
  ],
  theme: {
    // 使用默认主题，不进行扩展
    extend: {},
  },
  // 不需要额外的插件
  plugins: [],
};

export default config;
