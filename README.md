# Campus Topic Lab

一个面向校内博士生跨领域学术讨论的 MVP 网页应用骨架。

## 已覆盖的 MVP

- 用户注册/登录
- 首页学科分类
- 随机推荐 topic
- 学科/topic 列表页
- topic 创建、浏览、回复
- tag 系统
- AI 导读区域 UI
- AI 问答 UI
- AI 辅助发言 UI
- AI 后端接口占位，当前返回 mock 内容

## 技术栈

- Next.js App Router
- TypeScript
- Prisma schema + PostgreSQL 设计
- 当前运行时数据层为内存 mock repository，便于快速预览

## 本地运行

```bash
npm install
npm run dev
```

打开 http://127.0.0.1:3000。

Windows PowerShell 如果禁止执行 `npm.ps1`，可使用：

```powershell
npm.cmd install
npm.cmd run dev
```

## 后续接数据库

1. 配置 `.env` 中的 `DATABASE_URL`
2. 执行 `npm run prisma:generate`
3. 执行 `npm run prisma:migrate`
4. 将 `src/lib/repository.ts` 替换为 Prisma repository 实现
