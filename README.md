# Campus Topic Lab

面向校内博士生跨领域学术讨论的 MVP 网页应用。

## 已覆盖的 MVP

- 用户注册/登录
- 首页学科分类
- 随机推荐 topic
- 学科/topic 列表页
- topic 创建、浏览、回复
- tag 系统
- AI 导读、AI 问答、AI 辅助发言
- PostgreSQL + Prisma 持久化
- AI provider 可切换 mock、国产 OpenAI-compatible Chat Completions、Poe 或 OpenAI-compatible Responses API

## 技术栈

- Next.js App Router
- React
- TypeScript
- PostgreSQL
- Prisma
- OpenAI-compatible Chat Completions API / Responses API / Poe API

## 本地运行

Windows PowerShell 如果禁止执行 `npm.ps1`，使用 `npm.cmd`：

```powershell
npm.cmd install
npm.cmd run dev
```

打开 http://127.0.0.1:3000。

## 数据库配置

当前本地开发使用 PostgreSQL：

```env
DATABASE_URL="postgresql://postgres:1001word@localhost:5432/WestlakeCafe"
SESSION_COOKIE_NAME="ctl_session"
```

第一次初始化数据库：

```powershell
npm.cmd run prisma:generate
npx.cmd prisma migrate dev --name init
npm.cmd run seed
```

## AI 配置

默认使用 mock，不需要 API key：

```env
AI_PROVIDER="mock"
```

推荐先用阿里云百炼 DashScope 的 OpenAI 兼容模式。在 `.env` 里改成：

```env
AI_PROVIDER="openai-chat-compatible"
AI_API_KEY="在这里填阿里云百炼 DashScope API key"
AI_MODEL="qwen-plus"
AI_FAST_MODEL="qwen-turbo"
AI_QUALITY_MODEL="qwen-plus"
AI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
AI_TEMPERATURE="0.4"
AI_TIMEOUT_MS="60000"
```

也可以把 `AI_PROVIDER` 写成下面这些别名之一，后端都会走同一个 `/chat/completions` 调用：

```env
AI_PROVIDER="dashscope"
AI_PROVIDER="deepseek"
AI_PROVIDER="siliconflow"
```

常用国产平台配置示例：

```env
# 阿里云百炼 / 通义千问
AI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
AI_MODEL="qwen-plus"

# DeepSeek
AI_BASE_URL="https://api.deepseek.com"
AI_MODEL="deepseek-chat"

# 硅基流动
AI_BASE_URL="https://api.siliconflow.cn/v1"
AI_MODEL="Qwen/Qwen2.5-72B-Instruct"
```

连通性测试：

```powershell
npm.cmd run ai:test-chat
```

如果还要启用之前的 Responses 转接平台，在 `.env` 里改成：

```env
AI_PROVIDER="openai-responses"
OPENAI_API_KEY="在这里填转接平台 API key"
OPENAI_MODEL="gpt-5.4"
OPENAI_BASE_URL="https://capi.quan2go.com/openai"
OPENAI_REASONING_EFFORT="medium"
OPENAI_DISABLE_RESPONSE_STORAGE="true"
AI_TIMEOUT_MS="60000"
```

后端会请求 `OPENAI_BASE_URL + /responses`。如果某个转接平台要求 `/v1/responses`，把 `OPENAI_BASE_URL` 改成带 `/v1` 的地址即可。

也可以启用 Poe，在 `.env` 里改成：

```env
AI_PROVIDER="poe"
POE_API_KEY="在这里填你的 Poe API key"
POE_MODEL="Claude-Sonnet-4.6"
POE_BASE_URL="https://api.poe.com/v1"
AI_TIMEOUT_MS="60000"
```

Poe API key 获取入口：

```text
https://poe.com/api/keys
```

当前 topic 页 AI 功能都会走同一个 provider：

- 公共 AI 概览：作者生成/更新会保存到数据库；其他用户临时生成只在当前页面展示
- AI 助手：支持“随时问 / 澄清思路 / 形成回复”三种模式，共享同一段页面内对话历史
- `@2楼`、`#2`、`2楼` 会把指定楼层加入“澄清思路”的上下文

公共 AI 概览会保存进数据库的 `AIGuide` 表；AI 助手对话目前只保存在当前页面状态里，刷新后不会保留。

## 示例账号

```text
demo@university.edu
demo1234
```

seed 脚本还会创建：

```text
bio@university.edu / demo1234
med@university.edu / demo1234
```

## 重要文件

- `prisma/schema.prisma`：数据库表结构
- `prisma/seed.ts`：初始化示例数据
- `src/lib/prisma.ts`：Prisma Client 单例
- `src/lib/repository.ts`：数据库读写入口
- `src/lib/ai-service.ts`：AI provider，包含 mock、OpenAI-compatible Chat Completions、Poe 和 OpenAI-compatible Responses API 实现
- `src/app/api/*`：后端 API
- `src/app/*/page.tsx`：页面
- `src/components/*`：前端组件

## 当前仍是简化实现的部分

- 没有 PDF 上传和论文解析
- 没有向量检索/RAG
- 没有 AI 问答历史保存
- 用户登录还没有邮箱验证、SSO、找回密码
- 推荐仍是随机推荐
- 没有管理员后台、举报审核、通知、点赞收藏等功能
