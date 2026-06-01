# WestlakeCafe

> 一个专注于校内学术交流的论坛，用 AI 拆掉跨学科的墙。

## 项目背景

读完一篇论文，想找人讨论一下，却发现这事儿出乎意料地难：同组的同学方向不同、没读过；隔壁实验室的人完全不接触这个领域；上网发问吧，水平参差不齐，还经常石沉大海。

校园里有那么多聪明的头脑，每天读着各式各样的论文、产生着各式各样的想法，却散落在各个角落，难以碰撞。**WestlakeCafe** 就是为了解决这个问题而生：把校园里的学术对话从线下的“私聊”搬到线上的“广场”，并用 AI 帮所有人跨过学科的门槛。

## 核心理念

> **用交流加深认识，通过跨领域激发灵感。**

我们相信三件事：

- **学术交流应该是开放的**。一次走廊里的偶遇、一次午餐桌上的讨论，过去只能惠及在场的几个人。把它们搬到线上，能让更多人受益，也能让好的问题和观点持续沉淀。
- **跨学科视野应该是触手可及的**。拓宽学科视野被普遍认为重要，但实际参与门槛很高：缺少背景知识，也缺少判断外领域文献质量的能力。WestlakeCafe 用 AI 解决“读懂第一步”，用校内社区解决“判断与讨论”。
- **人类专家和 AI 的认识是互补的**。专家有深度、经验和可靠性，AI 有广度、即时性和低门槛解释能力。把两者整合在同一个讨论场景里，比单独使用任何一种都更有价值。

## 核心功能

### 按学院组织的讨论广场

首页以四个学院作为入口：工学院、理学院、生命科学、医学院。点击学院后进入子学科，再进入具体 topic。

这个结构的目标不是把人困在自己的学科里，而是让用户能用很低成本“逛到别人的学科”：两次点击，就能从自己的研究方向跳到一个陌生领域，看到别人正在读什么、困惑什么、讨论什么。

### Topic：以清晰主题组织讨论

WestlakeCafe 的基本单位是 **topic**。它可以是一篇论文、一个问题、一个研究直觉，或者一次求推荐。

每个 topic 包含：

- 标题与正文
- 可选论文标题和论文链接
- 一个或多个 tag
- 实际归属的学科分类
- 回复讨论区
- AI 概览与 AI 对话助手

相比普通论坛帖子，topic 更强调“明确的讨论对象”。用户进入页面后，应该能快速知道：大家到底在围绕什么问题展开讨论。

### AI 帖子概览

每个 topic 可以生成一份 AI 概览，帮助外领域读者先进入语境。概览包含：

- **术语解释**：解释理解主楼所需的关键概念或领域黑话
- **一句话摘要**：快速说明这个 topic 在讨论什么
- **展开解释**：补充讨论背景、问题焦点和可参与角度

帖主可以更新公共概览，并保存到数据库，避免每个用户重复调用 AI。其他浏览者也可以生成临时概览，仅在本页面展示，不影响公共版本。

### 三模式 AI 对话助手

topic 页面内置 AI 助手，支持三种模式：

| 模式 | 适用场景 | 作用 |
| --- | --- | --- |
| **随时问** | 看不懂术语、方法或背景 | 面向外领域读者解释概念和上下文 |
| **澄清思路** | 有模糊想法但说不清 | AI 通过复述和追问帮助用户收束观点 |
| **形成回复** | 想参与讨论但不知道怎么写 | 根据前面的 AI 对话生成可发布回复草稿 |

这三种模式覆盖了从“看不懂”到“想清楚”再到“敢发言”的完整链路。AI 回复支持流式输出，用户不需要等待完整生成结束，能即时看到回答逐步出现。

### 可生长的学科和 tag 系统

现实中的学科边界并不固定，新 PI、新方向、新交叉领域都会不断出现。因此 WestlakeCafe 没有把分类系统写死。

当前实现支持：

- 已审核学科和 tag：作为公共分类资产，所有用户都能选择
- 用户新建学科和 tag：发帖时可以添加，但会标记为“未审核”
- topic 实际归属：由用户发帖时最终选择的学科决定，而不是简单按发帖人学院归类
- 未分类入口：学院下存在未审核子学科时，对应 topic 会进入“未分类”区域，等待管理员后续整理

这样既能鼓励用户使用规范分类，也不会因为分类不全而阻止真实讨论发生。

### 推荐 topic

首页提供随机推荐 topic，用最简单的方式制造跨领域偶遇。它不追求复杂算法，而是服务一个明确目标：让用户在进入平台时，有机会看到自己学科之外的问题。

## 当前完成度

这个仓库实现的是一版可运行的 MVP，已覆盖：

- 用户注册与登录
- 首页学院入口
- 学院、子学科、topic 列表浏览
- 随机推荐 topic
- topic 创建、浏览、删除
- 回复创建与软删除
- tag 系统
- 用户新建未审核 tag / 学科
- AI 概览生成与持久化
- AI 三模式对话助手
- AI 回复流式输出
- PostgreSQL 数据持久化

## 技术实现概览

WestlakeCafe 使用典型的全栈 Web 应用架构：

- **前端**：Next.js App Router + React + TypeScript
- **后端**：Next.js API Routes
- **数据库**：PostgreSQL
- **ORM**：Prisma
- **AI 接口**：OpenAI-compatible Chat Completions，可接入阿里云百炼 DashScope、DeepSeek、硅基流动等平台
- **样式**：原生 CSS，保持界面轻量、清晰、适合学术工具场景

前端负责页面展示和交互；后端 API 处理注册登录、topic、回复、分类、AI 调用等逻辑；数据库负责持久化用户、topic、回复、tag、学科和 AI 概览。

## 快速开始

### 1. 安装依赖

```powershell
npm.cmd install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填写数据库和 AI 配置。

最小配置示例：

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/WestlakeCafe"
SESSION_COOKIE_NAME="westlakecafe_session"
AI_PROVIDER="mock"
```

如果要接入真实 AI，可使用 OpenAI-compatible Chat Completions：

```env
AI_PROVIDER="dashscope"
AI_API_KEY="your-api-key"
AI_MODEL="qwen-plus"
AI_FAST_MODEL="qwen-turbo"
AI_QUALITY_MODEL="qwen-plus"
AI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
AI_TEMPERATURE="0.4"
AI_TIMEOUT_MS="60000"
```

### 3. 初始化数据库

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate dev
npm.cmd run seed
```

### 4. 启动开发服务器

```powershell
npm.cmd run dev
```

浏览器打开：

```text
http://127.0.0.1:3000
```

## 项目结构

```text
prisma/
  schema.prisma          数据库模型
  seed.ts                示例学院、学科、tag、topic 和用户数据

src/app/
  page.tsx               首页
  topics/                topic 列表、详情、创建页面
  disciplines/           学院、子学科和未分类页面
  api/                   后端 API

src/components/
  ai-tools.tsx           topic 页面 AI 概览和三模式助手
  forms/                 登录、注册、发帖、回复表单
  topic-card.tsx         topic 卡片展示

src/lib/
  repository.ts          数据库读写逻辑
  ai-service.ts          AI prompt、模型调用和流式输出逻辑
  session.ts             登录会话逻辑
  types.ts               TypeScript 类型定义
```

## 展示账号

seed 数据中包含演示用户，可用于本地测试：

```text
邮箱：demo@university.edu
密码：demo1234
```

## 未来扩展方向

- 管理员后台：审核、合并、重命名用户新建的学科和 tag
- 更细致的推荐机制：在随机推荐基础上加入跨领域探索权重
- 论文解析：支持上传 PDF 或粘贴 DOI，自动提取论文元信息
- 讨论质量机制：邀请相关领域用户、标记高质量回复、沉淀共识总结
- 校内身份认证：接入学校统一身份认证，限制为校内用户使用

## 一句话总结

**WestlakeCafe 希望成为校园里的学术咖啡馆：每个 topic 是一张桌子，AI 负责递上入门地图，人负责贡献真正的判断、经验和灵感。**
