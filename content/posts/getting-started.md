---
title: 如何用 Next.js 构建博客
date: 2026-05-28
excerpt: 了解如何使用 Next.js App Router 从零开始构建一个 Markdown 博客系统。
tags:
  - 技术
  - Next.js
  - 教程
---

## 为什么选择 Next.js？

[Next.js](https://nextjs.org) 是一个强大的 React 框架，非常适合构建博客系统：

1. **服务端渲染 (SSR)** — 文章内容直接在服务端渲染，SEO 友好
2. **文件系统路由** — 基于 `app/` 目录的直观路由设计
3. **Server Components** — 默认服务端组件，减少客户端 JS

### 技术栈

```typescript
// 核心依赖
const stack = {
  framework: "Next.js 16",
  styling: "Tailwind CSS v4",
  markdown: "react-markdown + remark-gfm",
  syntax: "rehype-highlight",
  frontmatter: "@11ty/gray-matter",
};
```

### 项目结构

一个典型的 Next.js 博客项目结构如下：

```
my-blog/
├── app/           # Next.js App Router
├── components/    # React 组件
├── content/posts/ # Markdown 文章
├── lib/           # 工具函数
└── public/        # 静态资源
```

### 小结

用 Next.js 构建博客非常高效，利用文件系统存储文章也避免了数据库的复杂性。加上 Tailwind CSS 的排版插件，文章的视觉效果很出色。

---

*想要了解更多？查看 [Next.js 官方文档](https://nextjs.org/docs)*
