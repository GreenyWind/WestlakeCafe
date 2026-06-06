--
-- PostgreSQL database dump
--

\restrict X95cdf7bLyy4BzkpkHAHeRsGEP0zJt6rQdNoDnbDwo5OTnfnVftJTKrukuKS8hw

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."UserTopicPreference" DROP CONSTRAINT IF EXISTS "UserTopicPreference_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Topic" DROP CONSTRAINT IF EXISTS "Topic_primaryDisciplineId_fkey";
ALTER TABLE IF EXISTS ONLY public."Topic" DROP CONSTRAINT IF EXISTS "Topic_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."TopicView" DROP CONSTRAINT IF EXISTS "TopicView_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."TopicView" DROP CONSTRAINT IF EXISTS "TopicView_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."TopicTag" DROP CONSTRAINT IF EXISTS "TopicTag_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."TopicTag" DROP CONSTRAINT IF EXISTS "TopicTag_tagId_fkey";
ALTER TABLE IF EXISTS ONLY public."TopicDiscipline" DROP CONSTRAINT IF EXISTS "TopicDiscipline_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."TopicDiscipline" DROP CONSTRAINT IF EXISTS "TopicDiscipline_disciplineId_fkey";
ALTER TABLE IF EXISTS ONLY public."Tag" DROP CONSTRAINT IF EXISTS "Tag_disciplineId_fkey";
ALTER TABLE IF EXISTS ONLY public."Tag" DROP CONSTRAINT IF EXISTS "Tag_createdById_fkey";
ALTER TABLE IF EXISTS ONLY public."TagDiscipline" DROP CONSTRAINT IF EXISTS "TagDiscipline_tagId_fkey";
ALTER TABLE IF EXISTS ONLY public."TagDiscipline" DROP CONSTRAINT IF EXISTS "TagDiscipline_disciplineId_fkey";
ALTER TABLE IF EXISTS ONLY public."Reply" DROP CONSTRAINT IF EXISTS "Reply_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."Reply" DROP CONSTRAINT IF EXISTS "Reply_parentReplyId_fkey";
ALTER TABLE IF EXISTS ONLY public."Reply" DROP CONSTRAINT IF EXISTS "Reply_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."RecommendationItem" DROP CONSTRAINT IF EXISTS "RecommendationItem_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."RecommendationItem" DROP CONSTRAINT IF EXISTS "RecommendationItem_batchId_fkey";
ALTER TABLE IF EXISTS ONLY public."RecommendationBatch" DROP CONSTRAINT IF EXISTS "RecommendationBatch_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Discipline" DROP CONSTRAINT IF EXISTS "Discipline_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Discipline" DROP CONSTRAINT IF EXISTS "Discipline_createdById_fkey";
ALTER TABLE IF EXISTS ONLY public."AIGuide" DROP CONSTRAINT IF EXISTS "AIGuide_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIDraft" DROP CONSTRAINT IF EXISTS "AIDraft_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIDraft" DROP CONSTRAINT IF EXISTS "AIDraft_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIChatSession" DROP CONSTRAINT IF EXISTS "AIChatSession_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIChatSession" DROP CONSTRAINT IF EXISTS "AIChatSession_topicId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIChatMessage" DROP CONSTRAINT IF EXISTS "AIChatMessage_sessionId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."TopicView_userId_topicId_key";
DROP INDEX IF EXISTS public."TopicView_topicId_idx";
DROP INDEX IF EXISTS public."Tag_slug_key";
DROP INDEX IF EXISTS public."RecommendationItem_topicId_idx";
DROP INDEX IF EXISTS public."RecommendationItem_batchId_position_key";
DROP INDEX IF EXISTS public."RecommendationBatch_userId_key";
DROP INDEX IF EXISTS public."Discipline_slug_key";
DROP INDEX IF EXISTS public."AIGuide_topicId_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."UserTopicPreference" DROP CONSTRAINT IF EXISTS "UserTopicPreference_pkey";
ALTER TABLE IF EXISTS ONLY public."Topic" DROP CONSTRAINT IF EXISTS "Topic_pkey";
ALTER TABLE IF EXISTS ONLY public."TopicView" DROP CONSTRAINT IF EXISTS "TopicView_pkey";
ALTER TABLE IF EXISTS ONLY public."TopicTag" DROP CONSTRAINT IF EXISTS "TopicTag_pkey";
ALTER TABLE IF EXISTS ONLY public."TopicDiscipline" DROP CONSTRAINT IF EXISTS "TopicDiscipline_pkey";
ALTER TABLE IF EXISTS ONLY public."Tag" DROP CONSTRAINT IF EXISTS "Tag_pkey";
ALTER TABLE IF EXISTS ONLY public."TagDiscipline" DROP CONSTRAINT IF EXISTS "TagDiscipline_pkey";
ALTER TABLE IF EXISTS ONLY public."Reply" DROP CONSTRAINT IF EXISTS "Reply_pkey";
ALTER TABLE IF EXISTS ONLY public."RecommendationItem" DROP CONSTRAINT IF EXISTS "RecommendationItem_pkey";
ALTER TABLE IF EXISTS ONLY public."RecommendationBatch" DROP CONSTRAINT IF EXISTS "RecommendationBatch_pkey";
ALTER TABLE IF EXISTS ONLY public."Discipline" DROP CONSTRAINT IF EXISTS "Discipline_pkey";
ALTER TABLE IF EXISTS ONLY public."AIGuide" DROP CONSTRAINT IF EXISTS "AIGuide_pkey";
ALTER TABLE IF EXISTS ONLY public."AIDraft" DROP CONSTRAINT IF EXISTS "AIDraft_pkey";
ALTER TABLE IF EXISTS ONLY public."AIChatSession" DROP CONSTRAINT IF EXISTS "AIChatSession_pkey";
ALTER TABLE IF EXISTS ONLY public."AIChatMessage" DROP CONSTRAINT IF EXISTS "AIChatMessage_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."UserTopicPreference";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."TopicView";
DROP TABLE IF EXISTS public."TopicTag";
DROP TABLE IF EXISTS public."TopicDiscipline";
DROP TABLE IF EXISTS public."Topic";
DROP TABLE IF EXISTS public."TagDiscipline";
DROP TABLE IF EXISTS public."Tag";
DROP TABLE IF EXISTS public."Reply";
DROP TABLE IF EXISTS public."RecommendationItem";
DROP TABLE IF EXISTS public."RecommendationBatch";
DROP TABLE IF EXISTS public."Discipline";
DROP TABLE IF EXISTS public."AIGuide";
DROP TABLE IF EXISTS public."AIDraft";
DROP TABLE IF EXISTS public."AIChatSession";
DROP TABLE IF EXISTS public."AIChatMessage";
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."TopicType";
DROP TYPE IF EXISTS public."TopicStatus";
DROP TYPE IF EXISTS public."RecommendationSlotType";
DROP TYPE IF EXISTS public."ApprovalStatus";
DROP TYPE IF EXISTS public."AIMessageRole";
DROP TYPE IF EXISTS public."AIJobStatus";
--
-- Name: AIJobStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AIJobStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);


--
-- Name: AIMessageRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AIMessageRole" AS ENUM (
    'USER',
    'ASSISTANT',
    'SYSTEM'
);


--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


--
-- Name: RecommendationSlotType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RecommendationSlotType" AS ENUM (
    'FAMILIAR',
    'ADJACENT',
    'CROSS_FIELD'
);


--
-- Name: TopicStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TopicStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'HIDDEN'
);


--
-- Name: TopicType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TopicType" AS ENUM (
    'PAPER',
    'QUESTION',
    'IDEA',
    'RECOMMENDATION'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'STUDENT',
    'MODERATOR',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AIChatMessage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIChatMessage" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    role public."AIMessageRole" NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AIChatSession; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIChatSession" (
    id text NOT NULL,
    "topicId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AIDraft; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIDraft" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "topicId" text NOT NULL,
    input text NOT NULL,
    output text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AIGuide; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AIGuide" (
    id text NOT NULL,
    "topicId" text NOT NULL,
    content text NOT NULL,
    model text NOT NULL,
    status public."AIJobStatus" DEFAULT 'COMPLETED'::public."AIJobStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "oneLineSummary" text
);


--
-- Name: Discipline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Discipline" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "parentId" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "reviewStatus" public."ApprovalStatus" DEFAULT 'APPROVED'::public."ApprovalStatus" NOT NULL,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: RecommendationBatch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RecommendationBatch" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "dateKey" text NOT NULL,
    "algorithmVersion" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: RecommendationItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RecommendationItem" (
    id text NOT NULL,
    "batchId" text NOT NULL,
    "topicId" text NOT NULL,
    "slotType" public."RecommendationSlotType" NOT NULL,
    "position" integer NOT NULL,
    score double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Reply; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Reply" (
    id text NOT NULL,
    "topicId" text NOT NULL,
    "authorId" text NOT NULL,
    body text NOT NULL,
    "parentReplyId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "disciplineId" text,
    "reviewStatus" public."ApprovalStatus" DEFAULT 'APPROVED'::public."ApprovalStatus" NOT NULL,
    "reviewReason" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TagDiscipline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TagDiscipline" (
    "tagId" text NOT NULL,
    "disciplineId" text NOT NULL
);


--
-- Name: Topic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Topic" (
    id text NOT NULL,
    title text NOT NULL,
    type public."TopicType" NOT NULL,
    body text NOT NULL,
    "paperTitle" text,
    "paperUrl" text,
    "authorId" text NOT NULL,
    "primaryDisciplineId" text NOT NULL,
    status public."TopicStatus" DEFAULT 'PUBLISHED'::public."TopicStatus" NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastActivityAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TopicDiscipline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TopicDiscipline" (
    "topicId" text NOT NULL,
    "disciplineId" text NOT NULL
);


--
-- Name: TopicTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TopicTag" (
    "topicId" text NOT NULL,
    "tagId" text NOT NULL
);


--
-- Name: TopicView; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TopicView" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "topicId" text NOT NULL,
    "firstViewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastViewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "viewCount" integer DEFAULT 1 NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    school text,
    department text,
    "researchField" text,
    role public."UserRole" DEFAULT 'STUDENT'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    identity text,
    schools text[] DEFAULT ARRAY[]::text[]
);


--
-- Name: UserTopicPreference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserTopicPreference" (
    "userId" text NOT NULL,
    "tagIds" text[] DEFAULT ARRAY[]::text[],
    "disciplineIds" text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: AIChatMessage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AIChatMessage" (id, "sessionId", role, content, "createdAt") FROM stdin;
\.


--
-- Data for Name: AIChatSession; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AIChatSession" (id, "topicId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: AIDraft; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AIDraft" (id, "userId", "topicId", input, output, "createdAt") FROM stdin;
\.


--
-- Data for Name: AIGuide; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AIGuide" (id, "topicId", content, model, status, "createdAt", "updatedAt", "oneLineSummary") FROM stdin;
cmp2s9f4k0005tnugoia1gutb	cmp2s9eki0001tnug5cfbl52h	这个 topic 属于计算机，相关 tag 包括：Human-AI Interaction。\n\n外领域读者可以先抓住讨论主线：???? API ???,???? topic ??? PostgreSQL?\n\n建议从三个角度参与：它试图解决什么问题、使用了哪些关键概念、哪些假设可能需要其他领域的人来质疑。\n\n当前 AI 导读为 mock 版本，后续可以替换为真实模型并加入论文 PDF 解析和引用溯源。	mock-guide-v1	COMPLETED	2026-05-12 15:26:09.62	2026-05-12 15:26:09.62	\N
cmp6zzhed0002tnn4yiex4mos	cmp6zzhed0001tnn4ytzhcpfm	## 术语解释  \n- **生物标志物（Biomarker）**：指可客观测量并反映生理、病理过程或药物干预效果的指标，如脑脊液或血液中的淀粉样蛋白、Tau蛋白、神经丝轻链（NfL）等，常用于替代临床终点评估疾病进展或治疗效应。  \n- **CDR-SB（Clinical Dementia Rating Scale–Sum of Boxes）**：一种标准化的临床量表，通过访谈患者及知情者评估认知与功能6个维度（判断、记忆、判断与计算、社区事务、家庭与爱好、个人照料），总分越高提示痴呆严重程度越重，是阿尔茨海默病（AD）III期试验常用的主要临床终点。  \n- **GLP-1（胰高血糖素样肽-1）**：一种肠源性激素，可促进胰岛素分泌、抑制胰高血糖素释放；其受体激动剂（如司美格鲁肽）已获批用于2型糖尿病和肥胖，近年被探索用于CNS疾病（如AD），因其具有潜在的抗炎、神经营养和血脑屏障穿透能力。  \n- **回顾性队列研究（Retrospective cohort study）**：利用既往医疗记录等现成数据，按是否暴露于某因素（如使用GLP-1类药物）分组，回溯比较结局（如痴呆发生率）差异；易受混杂偏倚影响，证据等级低于随机对照试验（RCT）。  \n- **III期临床试验（Phase III trial）**：在大规模患者群体中验证干预措施对预设临床终点的有效性与安全性，是药物上市前最关键的证据来源；通常需满足统计学显著性与临床意义双重标准。\n\n## 一句话摘要  \n该话题围绕GLP-1受体激动剂（口服司美格鲁肽）在阿尔茨海默病III期试验（EVOKE/EVOKE+）中出现“生物标志物显著改善但核心临床终点（CDR-SB）无变化”的结果，探讨这一现象对靶点验证逻辑、临床开发策略及监管评估框架的深层含义。\n\n## 展开解释  \n- 这是转化医学中一个典型张力场景：基础与早期临床研究提示GLP-1通路可能调节AD相关神经退行过程，但关键III期试验未能将生物标志物获益转化为可测量的患者功能改善。  \n- 讨论焦点不在于数据真伪或试验执行质量，而在于如何解释“生物标志物有效但临床无效”这一模式——它挑战了当前广泛依赖替代终点加速研发的实践惯性。  \n- 外领域读者（如统计学家、监管政策研究者、药物经济学从业者）可能关注：此类结果是否应触发对替代终点资格认定标准、试验设计灵活性（如终点选择、人群定义）、以及失败归因方法论的系统性反思。  \n- 该案例也折射出流行病学信号（如回顾性研究显示GLP-1使用者痴呆风险降低）与因果推断金标准（RCT）之间的常见落差，对跨学科合作中证据权重分配具有普遍启示。  \n- 尽管聚焦AD与GLP-1，其核心问题——“机制合理≠临床有效”——适用于任何以生物标志物为桥梁的慢病干预开发（如帕金森病、肌萎缩侧索硬化症等神经退行性疾病）。	chat-completions:qwen-plus	COMPLETED	2026-05-15 14:13:27.637	2026-05-15 14:13:45.724	\N
cmp6oadol0001tnxgw0ld9tdo	cmp2thbn00007tnugfpb8m3h3	## 一句话摘要  \n这个帖子（标题为“a test”）意在发起一个关于神经编码建模中统计方法适用性的初步探讨，核心关切可能是：当面对高维、稀疏、非平稳的神经活动数据时，传统生物统计工具（如广义线性模型、主成分分析等）是否仍能稳健地揭示潜在的编码结构；若不能，哪些跨学科方法（如因果表征学习、随机过程建模、信息几何）可能提供更合理的替代路径。\n\n## 讨论脉络  \n- **研究/问题背景**：神经科学实验正产出越来越大规模、多尺度（单细胞钙成像、多电极阵列、fMRI时间序列）的动态数据，但主流分析仍大量依赖上世纪发展起来的线性/稳态假设统计模型。  \n- **发帖人关心的核心点**：尚未明确——因正文为空，仅能从标题“a test”和标签“生物统计、神经编码”推测其意图是试探性提出一个方法论层面的质疑或接口设想（例如：“能否用X方法重释Y类编码现象？”），而非报告具体结果。  \n- **已有回复里出现的方向**：目前唯一回复“Good point!”无实质内容，故尚无可见方向；但结合标签可合理预期后续讨论可能涉及计算神经科学、统计机器学习、信息论或动力系统等视角。\n\n## 外领域读者需要补的背景  \n- **神经编码（neural coding）**：指神经系统如何将外界刺激或内部状态转化为神经元活动模式（如发放率、峰电位时序、群体协变），核心问题是“什么特征被编码？如何被读出？”——类比于“大脑的通信协议”。  \n- **生物统计（biostatistics）在此语境下的典型任务**：不是流行病学式的群体推断，而是对单个实验对象（如一只小鼠）的长时间、多通道神经记录做建模（如用GLM拟合发放率与刺激的关系），强调小样本、强相关、非独立观测。  \n- **“非平稳性”（non-stationarity）**：指神经响应特性随时间变化（如注意状态切换、疲劳、学习过程），导致统计分布不恒定——这对依赖“数据同分布”假设的传统模型构成根本挑战。  \n- **“稀疏性”（sparsity）**：在任一时刻，仅极少数神经元活跃；且对特定刺激，仅特定子集神经元有响应。这使协方差结构高度退化，PCA等方法易受噪声主导。  \n- **IDEA 类帖子的惯例**：在校内学术平台中，“IDEA”类型通常表示尚未形成完整方案的雏形思考，重在激发协作，而非寻求技术答疑；常隐含“我卡在某个跨学科接口上”的潜台词。\n\n## 可能值得追问  \n- 如果把神经群体活动看作一个随时间演化的随机过程，哪些经典随机过程模型（如扩散过程、点过程、隐马尔可夫模型）的假设最容易被当前实验数据证伪？  \n- 在缺乏真实“ground truth 编码函数”的情况下，我们用什么可操作的标准来判断一个统计模型是否“过度简化”了神经编码？（例如：预测精度提升 ≠ 编码机制揭示）  \n- 神经数据中的“伪相关”（如共同输入导致的同步发放）常被GLM误读为功能连接——有没有来自因果推断领域的工具（如do-calculus、不变风险最小化）能部分规避？  \n- 是否存在某些数学结构（如群作用、纤维丛）天然适配“刺激→神经响应”的映射关系？这类几何视角在现有生物统计框架中为何罕见？  \n- 当发帖人说“a test”，ta 想测试的是一个具体算法、一类假设、还是某种跨学科类比的有效性？能否用一句话描述待验证的“零假设”？\n\n## 需要谨慎的地方  \n- 发帖人是否实际拥有未公开的数据/预实验结果（如某模型在特定数据集上失效），仅以“a test”为引子；目前无法判断。  \n- “生物统计”在此处具体指哪类方法（贝叶斯？频率学派？半参数？）——不同流派对“稳健性”的定义差异极大。  \n- 神经编码的“目标层级”未明：是单神经元调谐曲线？群体低维流形？还是跨脑区的信息传递路径？方法选择高度依赖此定位。  \n- 所有对“现有方法不足”的判断，均需具体数据模态（如电生理 vs. fMRI）、采样率、信噪比支撑，目前无任何参数信息。  \n- “Good point!”是否真为认同，还是礼貌性回应？在学术社区中，此类简短回复常不反映实质性共识。	chat-completions:qwen-plus	COMPLETED	2026-05-15 08:46:00.645	2026-05-15 08:46:00.645	\N
cmp6qng480007tnjgp7lx24tw	cmp6qng480006tnjgr2iwppya	## 一句话摘要  \n该话题聚焦于Mila新发布的AI模型DISCO在酶设计任务中的**跨反应类型泛化能力**：它已成功设计出催化非天然卡宾反应的酶，但尚不清楚其对其他（尤其非卡宾类）酶促反应是否同样有效。\n\n## 讨论脉络  \n- **研究背景**：传统酶设计依赖物理建模或定向进化，成本高、周期长；近年AI模型（如ProteinMPNN、RFdiffusion）开始支持从头设计具有特定功能的蛋白质，但多数针对天然反应或有限化学空间。  \n- **发帖人关心的核心点**：DISCO宣称“通用多模态蛋白设计”，但实证仅展示卡宾反应案例；用户想了解其在**未见反应类型上的泛化鲁棒性**——是真通用，还是卡宾特化？  \n- **已有回复里出现的方向**：暂无回复，故当前讨论空白集中在**泛化性验证方法论**（如：应测试哪些反应类别？用什么指标衡量“成功设计”？如何区分模型能力与数据偏差？）\n\n## 外领域读者需要补的背景  \n- **卡宾反应（Carbene transfer）**：一类涉及高活性卡宾中间体（:CH₂等）的有机反应，在自然界极罕见，常需贵金属催化剂；能催化它的酶属人工设计突破，但不代表覆盖主流酶促反应（如水解、氧化还原）。  \n- **酶设计（Enzyme design）**：指从头构建或重编程蛋白质结构，使其具备指定催化功能；不同于蛋白质结构预测（如AlphaFold），它要求**功能可计算→结构可实现→实验可验证**三重闭环。  \n- **泛化性（Generalization）在AI4Biology中特指**：模型在训练未覆盖的**反应机理类型、底物化学空间、或催化残基组合**上仍能生成有效酶的设计能力，而非仅在相似序列/结构上插值。  \n- **DNA-Encoding of Chemistry**（论文副标题关键词）：指模型输出不仅含蛋白质序列，还直接关联可合成的DNA编码及对应小分子转化路径，强调“设计-合成-测试”链路的可执行性，非纯计算模拟。  \n- **DISCO的“多模态”含义**：据标题及领域惯例，指同时建模**蛋白质结构、氨基酸序列、配体化学图、反应过渡态几何**等异构数据，而非单模态（如仅序列或仅结构）。\n\n## 可能值得追问  \n- 如果DISCO在卡宾反应上成功，但换作一个机制迥异的反应（比如磷酸转移或C–H活化），它需要重新微调、还是零样本迁移即可？有无消融实验提示模态融合的必要性？  \n- “泛化性”在这里更接近化学空间泛化（新底物），还是反应类型泛化（新机理）？二者对模型能力的要求差异很大，原文是否做了区分？  \n- 实验验证环节中，多少比例的设计蛋白实际表现出催化活性？这个“成功率”是否随反应类型变化？现有数据能否支撑泛化结论？  \n- 对比同类模型（如Chroma、ESM-IF），DISCO在输入表征（如是否显式编码过渡态）、输出约束（如是否保证可表达性）上有何关键差异？这些是否影响泛化上限？  \n- 若目标是工业应用，哪些反应类型最急需AI设计支持（如C–F键形成、手性胺合成）？DISCO当前架构是否预留了向这些方向扩展的接口？\n\n## 需要谨慎的地方  \n- DISCO是否真正“通用”，完全依赖论文中**未展示的跨反应基准测试结果**（目前仅知卡宾案例）；仅凭标题和摘要无法判断泛化范围。  \n- “DNA-Encoding”是否意味着所有设计均可直接基因合成并表达？这涉及密码子优化、可溶性、折叠稳定性等**实验可及性瓶颈**，原文未提失败率或纯化/活性检测细节。  \n- 所谓“多模态”具体融合了哪些模态、如何对齐（如反应坐标与蛋白口袋的几何映射），需看方法章节；当前仅从标题无法确认是否存在模态缺失或权重偏差。  \n- 卡宾反应的成功是否受益于该反应**过渡态相对刚性、易建模**的特点？若换作高度动态的协同催化机制（如丙酮酸脱氢酶复合物），DISCO是否仍适用？无数据支撑。  \n- “泛化性”评估标准未明：是看生成结构的Rosetta能量分数？MD模拟稳定性？还是必须实验测得k<sub>cat</sub>/K<sub>M</sub>？不同标准下结论可能矛盾。	chat-completions:qwen-plus	COMPLETED	2026-05-15 09:52:09.561	2026-05-15 09:53:09.592	\N
cmp704crb000ctnn461sufh6y	cmp704crb000btnn4958x2tgb	## 术语解释  \n- **生物标志物（Biomarker）**：指可客观测量并反映生理、病理过程或药物干预效果的指标，如脑脊液或血液中的淀粉样蛋白、Tau 蛋白、神经丝轻链（NfL）等，常用于替代临床终点评估疾病进展。  \n- **CDR-SB（Clinical Dementia Rating Scale–Sum of Boxes）**：一种标准化的临床量表，通过访谈患者及知情者评估认知与功能多个维度（如记忆、判断、家庭生活等），总分越高提示痴呆严重程度越高，是阿尔茨海默病（AD）III期试验常用的主要临床终点。  \n- **GLP-1（胰高血糖素样肽-1）**：一种肠道激素，可促进胰岛素分泌、抑制胰高血糖素释放；其类似物（如司美格鲁肽）已广泛用于2型糖尿病和肥胖治疗，近年被探索用于CNS疾病（如AD），因其具有潜在的抗炎、神经保护及血脑屏障穿透能力。  \n- **回顾性队列研究**：利用已有医疗记录等历史数据，按是否暴露于某因素（如使用GLP-1类药物）分组，回溯比较结局（如痴呆发生率）差异的研究设计，易受混杂偏倚影响，证据等级低于随机对照试验（RCT）。  \n- **转化医学（Translational Medicine）**：连接基础研究与临床应用的学科，核心目标是将实验室发现（如靶点机制、生物标志物变化）有效转化为可改善患者预后的诊断工具或治疗策略。\n\n## 一句话摘要  \n该话题围绕GLP-1类药物（口服司美格鲁肽）在阿尔茨海默病III期临床试验（EVOKE/EVOKE+）中生物标志物显著改善但主要临床终点（CDR-SB）未达显著差异的现象，探讨“生物标志物改善是否足以支持临床获益推断”这一转化医学中的根本性问题。\n\n## 展开解释  \n- 这一讨论源于近期Novo Nordisk公布的两项大型III期试验结果：尽管药物在多个AD相关生物标志物（淀粉样、Tau、NfL）上呈现稳健改善，但患者整体认知与功能衰退（以CDR-SB衡量）未减缓——构成典型的“生物标志物-临床终点分离”。  \n- 该现象并非孤立事件，而是重复出现在GLP-1类药物针对AD的临床开发中（此前流行病学提示保护效应，RCT却未证实），引发对现有证据链条（从机制→生物标志物→临床获益）可靠性的系统性质疑。  \n- 外领域读者（如统计学家、监管事务人员、药企研发管理者）可能关注：当生物标志物成功而临床终点失败时，是否应建立独立的失败分类框架？这关系到审评标准、试验设计优化（如终点选择、人群富集）及资源分配逻辑。  \n- 对机制研究者而言，该案例挑战了“靶点调控关键病理蛋白即能改变疾病进程”的简化假设，提示AD等复杂CNS疾病中，单一通路干预可能不足以突破病理代偿、时间窗限制或临床表型异质性等瓶颈。  \n- 行业层面，EVOKE结果直接影响数十个处于早期开发阶段的GLP-1及其类似物CNS适应症管线的价值评估与决策节奏，也促使各方重新权衡“老药新用”路径在神经退行性疾病中的可行性边界。	chat-completions:qwen-plus	COMPLETED	2026-05-15 14:17:14.903	2026-05-15 14:17:32.734	\N
cmpvb8r6u0006tn3spxemfwz8	cmpvb8r6u0005tn3shznwbtd6	## 术语解释  \n- **酶（Enzyme）**：一类由生物细胞合成的蛋白质，能特异性催化特定化学反应，是生命体内代谢反应的核心执行者。  \n- **蛋白质设计（Protein design）**：通过计算或实验方法从头构建具有预定结构与功能的蛋白质序列，而非仅改造天然蛋白。  \n- **活性位点（Active site）**：酶分子中直接参与底物结合与催化的局部三维区域，其几何构型和化学环境决定催化能力。  \n- **血红素酶（Heme enzyme）**：一类以血红素（含铁卟啉辅基）为催化中心的酶，常参与氧化还原、小分子插入等反应。  \n- **碳烯转移反应（Carbene-transfer reaction）**：一类将碳烯（:CR₂）中间体转移到底物（如烯烃、C–H键）上的有机转化，自然界中极少由天然酶催化。\n\n## 一句话摘要  \n该工作提出DISCO模型，首次实现仅凭反应中间体（无需预设催化残基）即可同步生成全新蛋白质序列与三维结构，并成功设计出能高效催化多种“非天然”碳烯转移反应的血红素酶。\n\n## 展开解释  \n- 传统酶工程依赖对已知天然酶的定向进化或理性改造，而本工作探索的是“从零设计”具备全新催化功能的酶，属于合成生物学与计算生物学的交叉前沿。  \n- DISCO的关键创新在于“多模态协同生成”——同时优化蛋白质序列和3D结构，并以小分子反应中间体为唯一输入条件，跳过了人工定义催化位点的步骤。  \n- 所设计的酶能催化自然界中罕见或不存在的碳烯反应（如环丙烷化、C–H插入），拓展了可由基因编码实现的化学反应类型，对药物合成、绿色化工等有潜在意义。  \n- 实验验证表明这些AI设计的酶具有真实催化活性，且可通过常规实验室手段（随机突变+筛选）进一步优化，说明其具备可进化性，符合生物系统的基本属性。  \n- 对非计算机领域的研究者而言，这项工作代表了一种新型“AI驱动的分子创造范式”，其输出不是预测结果，而是可实验验证、可遗传操作的功能性生物大分子实体。	chat-completions:qwen-plus	COMPLETED	2026-06-01 14:35:04.23	2026-06-01 14:35:20.258	\N
cmpvbk45m0002tnccazzi5i4o	cmpvbk45m0001tncc85uboy2p	## 术语解释  \n- **酶（Enzyme）**：生物体内催化化学反应的蛋白质，具有高度特异性和高效性；本帖关注其人工设计与新催化功能的实现。  \n- **活性位点（Active site）**：酶分子中直接参与底物结合与催化的三维局部结构区域；DISCO 被强调能设计“新颖的活性位点几何构型”。  \n- **血红素酶（Heme enzyme）**：一类含血红素辅基（铁卟啉）的氧化还原酶，常参与小分子活化（如 O₂、卡宾）；本帖中 DISCO 设计的对象类型。  \n- **卡宾转移反应（Carbene-transfer reaction）**：将卡宾（:CR₂）插入到化学键（如 C=C、B–H、C–H）中的有机转化；属“非天然”但具合成价值的反应类型。  \n- **定向进化（Directed evolution）**：通过随机突变与功能筛选模拟自然进化过程，优化蛋白质性能；文中用于验证所设计酶的可进化性。\n\n## 一句话摘要  \n该话题介绍 DISCO——一种能同时生成蛋白质序列与三维结构的多模态 AI 模型，仅以反应中间体为输入，即可从头设计具备新型催化功能的血红素酶，拓展遗传编码可实现的化学反应范围。\n\n## 展开解释  \n- 传统酶设计通常需预先指定关键催化残基，而 DISCO 不依赖此类先验约束，直接从反应需求出发生成完整可折叠蛋白。  \n- 它聚焦于“新-to-nature”反应（即自然界未被报道的酶促转化），如烯烃环丙烷化、硼氢键插入等，旨在突破生物催化在合成化学中的应用边界。  \n- 所设计酶经实验验证具有高催化活性，且可通过常规分子生物学手段（如随机突变+筛选）进一步优化，表明其具备遗传可操作性。  \n- 该工作连接了 AI 模型能力（跨模态生成）、蛋白质工程（从头设计）与化学生物学（扩展可编码反应空间）三个层面，为跨学科工具开发提供新范式。  \n- 对非计算机领域读者（如化学生物学、药物发现、代谢工程方向），其意义在于：提供一条不依赖天然模板、可按需定制催化功能的路径，潜在影响新酶试剂开发、绿色合成及人工生物系统构建。	chat-completions:qwen-plus	COMPLETED	2026-06-01 14:43:54.25	2026-06-01 14:44:06.92	\N
cmp2qtp6p0001tn2kw5r9stf3	topic-ai-discussion	这个 topic 讨论的是 AI 能否成为跨领域学术交流的脚手架。外领域读者可以重点关注三个问题：AI 导读是否能补齐背景知识、AI 问答是否能减少提问焦虑、AI 辅助发言是否能帮助把模糊直觉变成可讨论的论点。	mock-seed	COMPLETED	2026-05-12 14:45:56.545	2026-06-06 17:07:54.336	\N
cmp2qtp6r0003tn2kxx4rh2x5	topic-neural-compression	这个 topic 试图比较神经科学中的高效编码和机器学习中的表示学习。参与讨论时，可以先区分两者的目标函数、数据来源和验证方式，再判断类比是否只是启发式语言，还是能形成可检验的假设。	mock-seed	COMPLETED	2026-05-12 14:45:56.548	2026-06-06 17:07:54.339	\N
cmp2qtp6t0005tn2km7i02y6l	topic-medical-imaging-bias	这个 topic 关注医学影像 AI 的外部验证问题。外领域读者可以把它理解为：模型在一个环境中学到的规律，换到另一个医院后是否仍然成立。关键切入点包括数据分布变化、标注标准变化、设备差异和临床流程差异。	mock-seed	COMPLETED	2026-05-12 14:45:56.55	2026-06-06 17:07:54.342	\N
cmq29e0g60007tn9s634rbw4x	topic-materials-active-learning	术语解释：主动学习是让模型根据不确定性或信息增益挑选下一批实验样本；材料筛选指在大量候选材料中寻找性能最优或最稳健的组合。一句话摘要：这个 topic 想讨论机器学习能否真正减少材料实验中的试错成本。展开解释：关键问题不只是算法是否先进，而是已有数据是否覆盖足够多的失败样本、模型不确定性是否可信、实验噪声是否被纳入设计，以及下一批样本是否真的能改变研究判断。	mock-seed	COMPLETED	2026-06-06 11:17:33.51	2026-06-06 17:07:54.345	材料筛选实验成本很高，主动学习到底是在节省试错，还是把不确定性包装得更漂亮？
cmq29e0gs000ptn9s4dzewa03	topic-bci-chip-bottleneck	术语解释：脑机接口芯片把神经信号采集和处理集成到硬件系统里；信号处理瓶颈可能来自生物界面、电子噪声或算法泛化。一句话摘要：这个 topic 讨论脑机接口系统失效时如何定位主要限制。展开解释：讨论可以沿着信号链展开：神经信号源、电极接触、模拟前端、数字处理、模型解码和长期稳定性。	mock-seed	COMPLETED	2026-06-06 11:17:33.532	2026-06-06 17:07:54.367	脑机接口解码不好时，问题可能不在算法，而在整条神经信号链的任意一环。
cmq29e0gu000rtn9sri4qm6tp	topic-terahertz-photonic-sensing	术语解释：太赫兹和光子器件利用特定频段电磁波与材料或生物样品相互作用；传感优势需要和已有技术比较。一句话摘要：这个 topic 讨论新型光电子传感路线的评价标准。展开解释：不要只看实验室灵敏度，还要看样品制备、环境鲁棒性、设备复杂度、校准成本和目标应用是否真的需要这种频段。	mock-seed	COMPLETED	2026-06-06 11:17:33.534	2026-06-06 17:07:54.37	新型光子传感器要证明自己，不是参数漂亮就够了，而是要在真实场景里赢过成熟方案。
cmq29e0gv000ttn9s9agizfbq	topic-flexible-electronics-health	术语解释：柔性电子强调器件可弯折、贴附或随人体运动；健康监测要求长期、稳定、可解释的数据。一句话摘要：这个 topic 讨论可穿戴健康电子从实验室演示到真实使用的落差。展开解释：关键变量包括机械舒适性、传感漂移、运动干扰、供电方式、数据隐私和医学解释责任。	mock-seed	COMPLETED	2026-06-06 11:17:33.536	2026-06-06 17:07:54.372	柔性健康电子最难的不是贴上去能测到信号，而是长期佩戴还稳定、舒适、可解释。
cmq29e0gc0009tn9s2f20i6ml	topic-ai-physical-simulation	术语解释：生成模型用于学习数据分布并生成新样本；数值求解器依据物理方程和边界条件求解系统状态。一句话摘要：这个 topic 讨论 AI 生成模型在物理仿真中能替代多少传统数值计算。展开解释：跨领域读者可以重点区分三件事：生成结果是否满足守恒律，模型在外推场景是否可靠，以及它在研究流程中承担的是快速近似、实验设计，还是最终证据。	mock-seed	COMPLETED	2026-06-06 11:17:33.516	2026-06-06 17:07:54.347	AI 生成的物理状态看起来越来越像真仿真，但它什么时候能成为证据，什么时候只是候选？
cmq29e0ge000btn9se6xg8pdm	topic-embodied-data-loop	术语解释：具身智能强调智能体通过身体与环境交互学习；数据闭环指系统根据真实或仿真反馈持续采集、训练和验证数据。一句话摘要：这个 topic 讨论具身智能系统如何从仿真表现走向真实可用。展开解释：重点可以放在 sim-to-real gap、任务分布变化、失败案例采集、长期稳定性和安全边界上，而不只是单次任务成功率。	mock-seed	COMPLETED	2026-06-06 11:17:33.518	2026-06-06 17:07:54.35	机器人在仿真里成功不等于真实环境可靠，关键是怎样设计能暴露失败的数据闭环。
cmq29e0gg000dtn9s3d77vjpx	topic-protein-language-models	术语解释：蛋白质语言模型把氨基酸序列当作类似语言的对象学习表示；数据库偏差指训练集中某些蛋白家族、功能或物种被过度代表。一句话摘要：这个 topic 讨论蛋白质语言模型的泛化能力该如何验证。展开解释：可以从远缘同源蛋白、低相似度序列、实验突变数据和全新功能设计几个角度看模型是不是真的学到了结构和功能规律。	mock-seed	COMPLETED	2026-06-06 11:17:33.52	2026-06-06 17:07:54.353	蛋白质语言模型很会补全序列，但它学到的是生物规律，还是公共数据库里的偏好？
cmq29e0gi000ftn9sbgyvbc6e	topic-medical-ai-validation	术语解释：跨院泛化指模型从一个医院迁移到另一个医院仍保持性能；外部验证是在训练数据来源之外检验模型。一句话摘要：这个 topic 讨论医学影像大模型进入临床前最关键的验证环节。展开解释：外领域读者可以把问题拆成数据分布、设备差异、标注一致性、临床流程和失败后果五层，再判断单一指标是否足够。	mock-seed	COMPLETED	2026-06-06 11:17:33.522	2026-06-06 17:07:54.355	医学影像模型不是在一个数据集上赢就够了，真正难的是跨医院仍然可信。
cmq29e0gk000htn9sjjoj39je	topic-solid-state-interfaces	术语解释：固态离子材料依靠离子在固体中迁移实现储能或信息功能；界面问题指不同材料接触处的反应、缺陷和电荷传输障碍。一句话摘要：这个 topic 讨论能源器件性能瓶颈到底来自材料本体还是界面。展开解释：参与讨论时可以比较体相电导率、界面阻抗、原位表征和循环后失效形貌，避免只凭最终器件性能推断机制。	mock-seed	COMPLETED	2026-06-06 11:17:33.524	2026-06-06 17:07:54.358	固态能源器件的瓶颈常常藏在界面里，而不是材料体相的漂亮参数里。
cmq29e0gm000jtn9sc1vgdpxj	topic-nanophotonic-materials	术语解释：纳米光子材料通过纳米尺度结构调控光与物质相互作用；器件应用要求材料性能能在可制造系统中稳定复现。一句话摘要：这个 topic 讨论纳米光子材料从基础表征到真实应用的转化障碍。展开解释：关键问题包括材料寿命、批次一致性、微纳加工兼容性、封装环境和应用指标是否与材料优势匹配。	mock-seed	COMPLETED	2026-06-06 11:17:33.526	2026-06-06 17:07:54.36	纳米光子材料的谱图可以很漂亮，但真正难的是把优势稳定地做进器件里。
cmq29e0go000ltn9ss4zandbo	topic-biomaterials-immunity	术语解释：可降解医用材料会在体内逐步分解；免疫反应决定材料周围组织是修复、炎症还是纤维化。一句话摘要：这个 topic 讨论医用材料评价时如何同时看力学和免疫结果。展开解释：跨领域读者可以把它理解为材料不是静态支架，而是会与细胞和组织长期互动的系统。	mock-seed	COMPLETED	2026-06-06 11:17:33.528	2026-06-06 17:07:54.362	医用材料不能只看强度和降解速度，局部免疫反应可能决定它最终能不能用。
cmq29e0gq000ntn9shvv6k817	topic-optoelectronic-fabrication	术语解释：微纳光电芯片把光学、电学和纳米加工结合到小尺度器件中；可制造性关注工艺是否稳定、可重复和可放大。一句话摘要：这个 topic 讨论早期光电子器件研究该如何平衡性能和工艺。展开解释：可从单器件指标、批量良率、封装兼容性、测试标准和系统级收益几个角度展开。	mock-seed	COMPLETED	2026-06-06 11:17:33.531	2026-06-06 17:07:54.365	微纳光电芯片不只要单个器件跑得好，还要能被稳定地做出来。
cmq29vcpl0017tnro1auxg8kn	topic-quantum-sensing-biology	术语解释：量子传感利用量子态对外界扰动的敏感性测量微弱信号；生物测量需要在复杂、噪声多的环境中工作。一句话摘要：这个 topic 讨论量子传感在生物场景中的真实优势来源。展开解释：评估时要区分量子极限、工程优化、样品处理和数据分析带来的改进。	mock-seed	COMPLETED	2026-06-06 11:31:02.554	2026-06-06 17:07:54.39	量子传感听起来很强，但在生物测量里真正赢的可能是整套工程系统。
cmq29vcp5000xtnrorhwtkjl5	topic-optimal-transport-biology	术语解释：最优传输研究如何以最小代价把一个分布搬运到另一个分布；单细胞轨迹推断试图从不同时间点细胞状态估计发育路径。一句话摘要：这个 topic 讨论优雅数学框架在生物数据中的假设是否过强。展开解释：关键问题包括细胞是否守恒、代价函数是否有生物意义、采样时间是否足够密，以及推断轨迹能否被实验验证。	mock-seed	COMPLETED	2026-06-06 11:31:02.537	2026-06-06 17:07:54.377	最优传输让单细胞轨迹看起来很清楚，但它背后的守恒和代价假设是否真的成立？
cmq29vcpp001btnrorq6ewsb2	topic-artificial-photosynthesis-selectivity	术语解释：人工光合作用试图模拟自然光合作用，把太阳能转化为化学燃料；选择性指反应主要生成目标产物。一句话摘要：这个 topic 讨论能源催化中效率、选择性和稳定性的取舍。展开解释：跨领域读者可以把它理解为不仅要反应快，还要产物对、寿命长，并且能在实际系统中运行。	mock-seed	COMPLETED	2026-06-06 11:31:02.558	2026-06-06 17:07:54.395	人工光合作用不只是效率竞赛，产物选择性和稳定性常常决定路线是否有意义。
cmq29vcpr001dtnro8jc3rmte	topic-co2-reduction-operando	术语解释：CO2 还原把二氧化碳转化为一氧化碳、甲酸或多碳产物；原位表征是在反应过程中观察催化剂状态。一句话摘要：这个 topic 讨论如何证明催化剂的真实活性位点。展开解释：需要结合反应前后结构、原位谱学、同位素实验、动力学关系和理论计算，避免把伴随变化误认为因果机制。	mock-seed	COMPLETED	2026-06-06 11:31:02.56	2026-06-06 17:07:54.398	CO2 还原催化剂会在反应中变化，真正难的是证明哪个结构才是活性位点。
cmq29vcpt001ftnroa0ebc0kn	topic-water-splitting-stability	术语解释：水分解催化剂帮助把水转化为氢气和氧气；稳定性测试评估催化剂长时间工作后性能是否衰减。一句话摘要：这个 topic 讨论实验室稳定性数据能否支撑实际应用判断。展开解释：需要看测试电流密度、电解质条件、器件结构、失活机制和是否有加速老化证据。	mock-seed	COMPLETED	2026-06-06 11:31:02.561	2026-06-06 17:07:54.4	水分解催化剂跑几十小时不坏很重要，但离真实器件寿命还有很长距离。
cmq29vcpf0011tnrojjly1tl8	topic-dynamical-systems-neurons	术语解释：低维动力学把高维神经活动表示成少数关键变量随时间演化；机制解释需要能产生可验证预测。一句话摘要：这个 topic 讨论神经数据中的低维结构到底代表什么。展开解释：重点在于区分数据压缩、统计描述和因果机制，尤其要看模型能否预测扰动、行为变化或跨任务泛化。	mock-seed	COMPLETED	2026-06-06 11:31:02.547	2026-06-06 17:07:54.382	神经活动降到低维后很漂亮，但漂亮轨迹不一定就是神经系统的机制。
cmq29vcpb000ztnro1n23i168	topic-random-matrix-deep-learning	术语解释：随机矩阵理论研究大规模随机矩阵的谱性质；深度网络泛化指模型在未见数据上的表现。一句话摘要：这个 topic 讨论数学理论能否真正解释深度学习的经验现象。展开解释：可以区分理论模型、真实网络、可观测指标和可干预实验，避免把漂亮的谱图直接等同于机制解释。	mock-seed	COMPLETED	2026-06-06 11:31:02.543	2026-06-06 17:07:54.38	随机矩阵给深度网络提供了漂亮解释，但这些解释能不能被真正检验？
cmq29vcph0013tnroh4cnnltr	topic-quantum-materials-defects	术语解释：量子材料的电子、磁性或拓扑性质依赖量子效应；缺陷是晶体结构中的局域不完美。一句话摘要：这个 topic 讨论材料缺陷到底是问题还是机会。展开解释：可以从缺陷浓度、空间分布、能级结构、可控制备和器件需求几个维度判断缺陷是噪声还是功能来源。	mock-seed	COMPLETED	2026-06-06 11:31:02.549	2026-06-06 17:07:54.385	量子材料里的缺陷不一定只是坏事，有时它本身就是可以设计的功能单元。
cmq29vcpj0015tnroyikgvjer	topic-ultrafast-spectroscopy	术语解释：超快光谱用极短激光脉冲观察物质的快速响应；相变指材料电子、结构或磁性状态发生改变。一句话摘要：这个 topic 讨论动态光谱信号如何与材料结构证据互相验证。展开解释：关键是把时间尺度、泵浦强度、热效应、对照实验和其他表征手段结合起来判断。	mock-seed	COMPLETED	2026-06-06 11:31:02.552	2026-06-06 17:07:54.387	超快光谱能拍到很快的材料响应，但要证明那真是相变，需要和结构证据对上。
cmq29vcpn0019tnroc35q2v3a	topic-moire-correlations	术语解释：莫尔超晶格由两层材料错角叠加形成长周期结构；强关联指电子之间相互作用主导材料性质。一句话摘要：这个 topic 旨在为外领域读者拆解莫尔材料论文的入门路径。展开解释：可以从能带、填充数、相互作用、低温输运和实验可调参数几个概念开始，不必一开始就追完整理论细节。	mock-seed	COMPLETED	2026-06-06 11:31:02.555	2026-06-06 17:07:54.392	莫尔材料论文概念密度很高，但可以从能带、填充数和电子相互作用三件事进入。
cmq29vcpv001htnro9srwl3k9	topic-solar-fuels-systems	术语解释：太阳能燃料体系把光能转成可储存化学能；系统耦合指吸光、电荷转移、催化和分离过程必须协同。一句话摘要：这个 topic 讨论能源化学从单组件性能走向完整系统的挑战。展开解释：参与者可以关注组件匹配、能量损失、质量传输、产物分离和可放大性。	mock-seed	COMPLETED	2026-06-06 11:31:02.563	2026-06-06 17:07:54.403	太阳能燃料不只是催化剂问题，完整系统里的耦合损失可能才是瓶颈。
cmq29vcp0000vtnropap9y58r	topic-pde-neural-operator	术语解释：PDE 是描述连续系统变化的偏微分方程；神经算子试图学习从方程参数到解函数的映射。一句话摘要：这个 topic 讨论机器学习求解 PDE 的适用边界。展开解释：跨领域读者可以从误差可控性、分布外泛化、几何变化、计算成本和物理约束五个角度比较神经方法与传统数值方法。	mock-seed	COMPLETED	2026-06-06 11:31:02.532	2026-06-06 17:07:54.375	神经算子可以很快给出 PDE 近似解，但它什么时候比成熟数值方法更可靠？
cmq2a40m7001ttnhc4u7876dy	topic-neuroimmune-brain-disease	术语解释：神经免疫研究免疫系统与神经系统的相互作用；CNS 疾病包括中枢神经系统退行、炎症或损伤相关疾病。一句话摘要：这个 topic 讨论脑疾病中的免疫变化如何被解释为原因或结果。展开解释：关键在时间序列、细胞类型、干预实验、疾病模型和人类样本证据之间建立联系。	mock-seed	COMPLETED	2026-06-06 11:37:46.783	2026-06-06 17:07:54.418	脑疾病里看到免疫变化不等于找到病因，它也可能是损伤后的修复或副作用。
cmq2a40m9001vtnhct4wyvlmy	topic-behavioral-decision-models	术语解释：行为决策模型用实验任务描述动物如何根据感知和奖励做选择；跨物种比较试图寻找不同动物共有或不同的机制。一句话摘要：这个 topic 讨论神经行为模型跨物种迁移的边界。展开解释：需要同时考虑任务结构、感知通道、生态行为、神经解剖和可测量变量。	mock-seed	COMPLETED	2026-06-06 11:37:46.785	2026-06-06 17:07:54.421	动物决策模型跨物种比较很诱人，但抽象过头可能会抹掉真实生态差异。
cmq2a40ma001xtnhckgc5j0qr	topic-neurovascular-coupling	术语解释：神经血管耦合指神经活动引发局部血流和代谢变化；许多脑成像信号间接依赖这一关系。一句话摘要：这个 topic 讨论脑成像中的血管信号是否能代表神经活动。展开解释：要考虑疾病状态、血管反应性、时间分辨率、空间分辨率和是否有电生理或钙成像验证。	mock-seed	COMPLETED	2026-06-06 11:37:46.787	2026-06-06 17:07:54.423	脑成像里的血流信号很有用，但它不是神经放电的直接替身。
cmq2a40md001ztnhc09uaje7e	topic-synthetic-biology-kill-switch	术语解释：安全开关是让工程化生物系统在特定条件下停止生长或失活的设计；选择压力可能让系统逃逸设计约束。一句话摘要：这个 topic 讨论合成生物安全机制从实验室走向复杂环境的验证问题。展开解释：关键在突变率、长期稳定性、生态竞争、检测方式和失败后果。	mock-seed	COMPLETED	2026-06-06 11:37:46.789	2026-06-06 17:07:54.426	合成生物安全开关在培养皿里有效，不代表它在复杂环境里不会被进化绕过。
cmq2a40me0021tnhcbuyd6xiv	topic-gene-circuits-noise	术语解释：基因线路是用调控元件构建的可编程生物系统；噪声指细胞间或时间上的随机波动。一句话摘要：这个 topic 讨论合成生物系统是否应该利用噪声。展开解释：可从任务目标、反馈结构、群体效应、鲁棒性和可测量性几个方面判断噪声是风险还是功能来源。	mock-seed	COMPLETED	2026-06-06 11:37:46.791	2026-06-06 17:07:54.428	基因线路的噪声不一定只是坏事，有时它能提供分化、记忆和群体多样性。
cmq2a40mg0023tnhcz6kfbhb5	topic-biomanufacturing-scaleup	术语解释：生物制造用微生物或细胞生产化学品、材料或药物；放大过程会改变传质、混合和细胞压力。一句话摘要：这个 topic 讨论生物制造从实验室到工程规模的失真问题。展开解释：关键变量包括氧传递、底物梯度、剪切力、代谢负担、污染风险和过程控制。	mock-seed	COMPLETED	2026-06-06 11:37:46.792	2026-06-06 17:07:54.431	生物制造小规模产量好不等于能放大，反应器里的传质和代谢压力会改写结果。
cmq2a40lx001jtnhcbvygapfl	topic-cryoem-conformational-heterogeneity	术语解释：冷冻电镜用于解析生物大分子结构；构象异质性指同一种分子在样品中存在多个形态。一句话摘要：这个 topic 讨论冷冻电镜中的多个结构状态如何被解释为生物机制。展开解释：关键在于结合样品制备、三维分类、功能实验、突变验证和动力学证据，避免把算法分群直接当作机制。	mock-seed	COMPLETED	2026-06-06 11:37:46.774	2026-06-06 17:07:54.405	冷冻电镜看到多个构象很兴奋，但要证明它们是功能状态，还需要结构之外的证据。
cmq2a40lz001ltnhc7mj6plb4	topic-membrane-protein-lipid-context	术语解释：膜蛋白嵌在细胞膜中执行转运、信号和感知功能；脂质环境会影响膜蛋白构象和活性。一句话摘要：这个 topic 讨论体外结构能否充分解释细胞内功能。展开解释：可以比较纯化体系、纳米盘、细胞内定位、功能读数和突变实验，判断结构解释是否脱离真实环境。	mock-seed	COMPLETED	2026-06-06 11:37:46.776	2026-06-06 17:07:54.407	膜蛋白结构很精细，但离开真实脂质环境后，机制解释可能会少一块。
cmq2a40m1001ntnhclg13kiw4	topic-protein-modification-structure	术语解释：蛋白质修饰是在蛋白特定位点添加化学基团；相互作用网络指蛋白与其他分子之间的结合关系。一句话摘要：这个 topic 讨论蛋白修饰的机制解释到底该落在结构变化还是网络变化上。展开解释：可以从修饰位点位置、构象变化、结合实验、细胞表型和可逆性几个层次来判断。	mock-seed	COMPLETED	2026-06-06 11:37:46.778	2026-06-06 17:07:54.41	一个修饰位点不一定直接改结构，也可能是在重排蛋白之间的关系。
cmq2a40m5001rtnhcu5xepxiq	topic-neural-circuit-causality	术语解释：神经环路是相互连接的神经元网络；因果机制要求干预神经活动会改变行为或生理结果。一句话摘要：这个 topic 讨论神经记录中的相关性如何走向因果解释。展开解释：需要结合时间顺序、光遗传或药理干预、行为对照、细胞类型特异性和模型预测。	mock-seed	COMPLETED	2026-06-06 11:37:46.781	2026-06-06 17:07:54.416	神经元活动和行为相关很常见，真正难的是证明它们在因果链上。
cmq2a40m3001ptnhcx52rkswy	topic-ai-protein-complex-design	术语解释：蛋白复合物由多个蛋白组装执行功能；AI 蛋白设计用模型生成候选序列或结构。一句话摘要：这个 topic 讨论 AI 设计蛋白从计算模型走向实验功能的验证路径。展开解释：关键步骤包括表达、纯化、结合测定、结构验证、稳定性测试和功能实验，而不是只看预测结构是否好看。	mock-seed	COMPLETED	2026-06-06 11:37:46.779	2026-06-06 17:07:54.413	AI 设计的蛋白复合物看起来像真的，下一步要证明它能表达、结合并产生功能。
cmq2ahng0002ntnw8zsck8o4g	topic-tumor-microenvironment-resistance	术语解释：肿瘤微环境包括肿瘤周围的免疫细胞、血管、基质和代谢状态；耐药指治疗后肿瘤仍能生长。一句话摘要：这个 topic 讨论肿瘤微环境在耐药中的因果角色。展开解释：关键在治疗前预测、时间序列采样、空间证据、微环境干预和耐药逆转实验。	mock-seed	COMPLETED	2026-06-06 11:48:22.897	2026-06-06 17:07:54.457	肿瘤微环境常被说成耐药原因，但要证明因果，需要治疗前后和干预证据。
cmq2ahnfu002htnw8boe1ct2b	topic-macrophage-plasticity	术语解释：巨噬细胞是重要的先天免疫细胞；极化常用来描述它们向不同功能状态转变。一句话摘要：这个 topic 讨论免疫细胞状态分类是否过度简化。展开解释：可以从单细胞转录组、空间位置、功能实验、时间变化和疾病场景来重新理解巨噬细胞状态。	mock-seed	COMPLETED	2026-06-06 11:48:22.891	2026-06-06 17:07:54.45	M1/M2 这类标签很方便，但真实巨噬细胞状态可能远比二分法复杂。
cmq2ahnfw002jtnw8m5f1uran	topic-immune-checkpoint-autoimmunity	术语解释：免疫检查点是限制免疫反应过度激活的调控机制；检查点抑制剂通过解除限制增强抗肿瘤免疫。一句话摘要：这个 topic 讨论抗肿瘤免疫和自身免疫副作用之间的平衡。展开解释：核心在于免疫激活的组织特异性、抗原谱、患者基础免疫状态和风险预测指标。	mock-seed	COMPLETED	2026-06-06 11:48:22.893	2026-06-06 17:07:54.452	免疫检查点治疗的难点在于同一套免疫激活既能打肿瘤，也可能伤正常组织。
cmq2ahng4002rtnw8sbri8zam	topic-cell-therapy-solid-tumor	术语解释：细胞治疗用改造或扩增的免疫细胞攻击疾病；实体瘤有复杂微环境和空间屏障。一句话摘要：这个 topic 讨论细胞治疗在实体瘤中的主要瓶颈。展开解释：靶点异质性、肿瘤浸润、免疫抑制、细胞耗竭和安全性都可能决定疗效。	mock-seed	COMPLETED	2026-06-06 11:48:22.9	2026-06-06 17:07:54.462	细胞治疗进实体瘤不只缺靶点，还要面对难以进入和难以存活的肿瘤微环境。
cmq2ahnfk0027tnw8ekjh361x	topic-glp1-cns-translation	术语解释：GLP-1 类药物最初主要用于代谢疾病；CNS 疾病指中枢神经系统相关疾病；转化医学关注从机制到临床应用的证据链。一句话摘要：这个 topic 讨论 GLP-1 类药物进入神经疾病场景时该如何评估证据。展开解释：可从动物模型相关性、药物能否进入目标组织、机制是否可测、临床终点是否合理和安全性边界几方面判断。	mock-seed	COMPLETED	2026-06-06 11:48:22.88	2026-06-06 17:07:54.436	GLP-1 进入 CNS 疾病讨论很热，但真正关键的是机制、biomarker 和临床终点能否连起来。
cmq2ahnfm0029tnw8najayrxp	topic-biomarkers-patient-stratification	术语解释：biomarker 是可测量的生物指标；患者分层是根据指标把患者分成更可能受益或风险不同的人群。一句话摘要：这个 topic 讨论 biomarker 从研究发现走向临床试验分层的门槛。展开解释：关键在检测稳定性、独立队列验证、机制关联、预测能力、阈值选择和临床决策价值。	mock-seed	COMPLETED	2026-06-06 11:48:22.883	2026-06-06 17:07:54.44	biomarker 不只是能测出来，还要能稳定地区分谁会受益、谁风险更高。
cmq2ahnfo002btnw80lzaffue	topic-real-world-evidence-trials	术语解释：真实世界研究使用临床实践中的数据；随机对照试验通过严格设计估计干预效果。一句话摘要：这个 topic 讨论真实世界证据和临床试验如何互补。展开解释：真实世界研究更适合看长期安全性、复杂人群、依从性和推广效果，但需要处理选择偏倚和混杂因素。	mock-seed	COMPLETED	2026-06-06 11:48:22.885	2026-06-06 17:07:54.442	真实世界研究不能简单替代临床试验，但很适合补上复杂人群和长期使用的盲区。
cmq2ahnfq002dtnw83rqgkj6e	topic-drug-target-validation	术语解释：药物靶点是药物作用的分子对象；可成药性指靶点是否能被安全、有效地调控。一句话摘要：这个 topic 讨论疾病机制发现如何走向药物研发。展开解释：可从遗传证据、疾病模型、靶点位置、调控方式、毒性风险和患者分层几个维度评估。	mock-seed	COMPLETED	2026-06-06 11:48:22.886	2026-06-06 17:07:54.445	一个靶点和疾病有关还不够，真正难的是证明它能被安全有效地做成药。
cmq2ahnfs002ftnw8cvpw1qrd	topic-tcell-inflammation-memory	术语解释：T 细胞分化指 T 细胞形成不同功能状态；组织驻留免疫细胞长期停留在局部组织。一句话摘要：这个 topic 讨论慢性炎症反复发作是否与免疫记忆状态有关。展开解释：关键证据包括复发前后细胞状态变化、空间定位、克隆追踪、干预清除和疾病表型改变。	mock-seed	COMPLETED	2026-06-06 11:48:22.889	2026-06-06 17:07:54.447	慢性炎症反复发作可能和局部免疫记忆有关，但要证明它是原因需要时间和干预证据。
cmq2ahnfy002ltnw8v8sjvg8a	topic-tissue-resident-immunity	术语解释：组织驻留免疫细胞长期生活在特定组织中；它们既能保护局部环境，也可能维持慢性炎症。一句话摘要：这个 topic 讨论局部免疫记忆的双重作用。展开解释：需要看细胞来源、驻留时间、空间位置、刺激反应、组织损伤和干预后的功能变化。	mock-seed	COMPLETED	2026-06-06 11:48:22.895	2026-06-06 17:07:54.455	组织驻留免疫细胞既可能是第一道防线，也可能成为慢性炎症的长期火种。
cmq2ahng2002ptnw8gxi7pjmo	topic-radiotherapy-immunity-abscopal	术语解释：远隔效应是局部放疗后非照射部位肿瘤也发生反应；放疗免疫研究放疗如何影响抗肿瘤免疫。一句话摘要：这个 topic 讨论放疗和免疫治疗联用中的系统性反应。展开解释：需要考虑抗原释放、免疫细胞浸润、剂量分割、检查点通路和患者免疫状态。	mock-seed	COMPLETED	2026-06-06 11:48:22.898	2026-06-06 17:07:54.46	放疗有时能点燃系统性抗肿瘤免疫，但这种远隔效应需要合适剂量和免疫背景。
cmq2ahng6002ttnw8p4vvyn9k	topic-tumor-organoids-drug-response	术语解释：肿瘤类器官是在体外培养、保留部分肿瘤特征的三维模型；药物反应预测试图用模型指导治疗选择。一句话摘要：这个 topic 讨论类器官距离个体化肿瘤治疗还有多远。展开解释：需要评估样本代表性、培养速度、微环境缺失、药物暴露条件和临床结果相关性。	mock-seed	COMPLETED	2026-06-06 11:48:22.902	2026-06-06 17:07:54.465	肿瘤类器官能帮助筛药，但要直接指导个体化治疗，还要跨过时间和代表性门槛。
cmq2a52680025tnwggu8243e5	topic-computational-biology-perturbation	## 术语解释  \n- **单细胞扰动预测模型**：一类计算模型，输入为特定基因扰动（如敲除、过表达）或药物处理等干预条件，输出为单细胞分辨率下的细胞状态变化（如基因表达谱）。  \n- **细胞状态**：指单个细胞在特定时刻的分子表型，常通过单细胞RNA测序（scRNA-seq）测量的全转录组表达谱来表征。  \n- **扰动组合**：指同时施加两种及以上干预（如两个基因同时敲除，或一种药物联合一种基因编辑），其效应常非简单叠加。  \n- **指导真实实验**：指模型预测结果能用于设计后续湿实验（如选择哪组扰动优先测试），且该决策带来可验证的生物学收益（如更高成功率、更少试错轮次）。  \n\n## 一句话摘要  \n该话题探讨：当单细胞扰动预测模型面对训练中未见过的干预组合时，应采用何种实验验证策略，才能客观判断该模型是否具备实际指导湿实验的能力。\n\n## 展开解释  \n- 当前许多模型在已知扰动上表现良好，但真实科研常需预测“全新组合”——这类外推能力无法仅靠留出集（hold-out set）评估。  \n- 实验验证成本高（单细胞测序耗时耗力），因此需设计高效、信息量足的验证方案，例如聚焦关键生物学场景（如细胞周期阻滞、命运决定节点）而非随机采样。  \n- “有指导价值”不等于“预测误差小”，而强调模型输出能否提升实验决策质量（如排序候选组合、规避无效干预）。  \n- 合成生物学和药物联用研究高度依赖此类预测，跨领域读者若涉及多因素干预设计（如材料刺激+基因编辑、微环境调控+靶向治疗），同样面临类似验证挑战。	chat-completions:qwen-plus	COMPLETED	2026-06-06 11:38:35.456	2026-06-06 17:10:45.374	如何设计实验验证单细胞扰动预测模型在未测组合中的实际指导价值？
\.


--
-- Data for Name: Discipline; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Discipline" (id, name, slug, "parentId", "sortOrder", "reviewStatus", "createdById", "createdAt", "updatedAt") FROM stdin;
oncology-therapy	肿瘤生物学与治疗	oncology-therapy	medicine	7	APPROVED	\N	2026-06-05 18:41:35.908	2026-06-06 17:07:53.864
chemical-biological-engineering	化学与生物工程	chemical-biological-engineering	engineering	7	APPROVED	\N	2026-06-05 18:41:35.897	2026-06-06 17:07:53.852
sustainable-environment-engineering	可持续发展与环境工程	sustainable-environment-engineering	engineering	8	APPROVED	\N	2026-06-05 18:41:35.898	2026-06-06 17:07:53.853
mathematics	数学	mathematics	science	1	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.853
physics	物理	physics	science	2	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.854
chemistry	化学	chemistry	science	3	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.854
molecular-energy-chemistry	分子科学与能源化学	molecular-energy-chemistry	science	4	APPROVED	\N	2026-06-05 18:41:35.9	2026-06-06 17:07:53.855
physiology-metabolism	生理学与代谢	physiology-metabolism	medicine	8	APPROVED	\N	2026-06-05 18:41:35.908	2026-06-06 17:07:53.865
medical-genetics-rare-disease	医学遗传与罕见病	medical-genetics-rare-disease	medicine	9	APPROVED	\N	2026-06-05 18:41:35.909	2026-06-06 17:07:53.865
drug-discovery-public-health	药物研发与公共健康	drug-discovery-public-health	medicine	10	APPROVED	\N	2026-06-05 18:41:35.909	2026-06-06 17:07:53.866
biology	生物学	biology	life-science	1	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.856
engineering	工学院	engineering	\N	1	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.845
science	理学院	science	\N	2	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.847
life-science	生命科学	life-science	\N	3	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.848
medicine	医学院	medicine	\N	4	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.848
computer-science	计算机科学	computer-science	engineering	1	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.849
ai-data-science	人工智能与数据科学	ai-data-science	engineering	2	APPROVED	\N	2026-06-05 18:41:35.893	2026-06-06 17:07:53.85
robotics-mechanical-systems	机器人与机械系统	robotics-mechanical-systems	engineering	3	APPROVED	\N	2026-06-05 18:41:35.895	2026-06-06 17:07:53.85
electronic-info	电子信息科学与技术	electronic-info	engineering	4	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.851
materials	材料科学与工程	materials	engineering	5	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.851
biophysics-biochemistry	生物物理与生物化学	biophysics-biochemistry	life-science	2	APPROVED	\N	2026-06-05 18:41:35.901	2026-06-06 17:07:53.856
cell-biology	细胞生物学	cell-biology	life-science	3	APPROVED	\N	2026-06-05 18:41:35.902	2026-06-06 17:07:53.857
genetics-development	遗传与发育生物学	genetics-development	life-science	4	APPROVED	\N	2026-06-05 18:41:35.902	2026-06-06 17:07:53.857
neuroscience	神经生物学	neuroscience	life-science	5	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.858
immunology-microbiology	免疫与微生物学	immunology-microbiology	life-science	6	APPROVED	\N	2026-06-05 18:41:35.903	2026-06-06 17:07:53.858
systems-synthetic-biology	系统与合成生物学	systems-synthetic-biology	life-science	7	APPROVED	\N	2026-06-05 18:41:35.904	2026-06-06 17:07:53.859
cmpvb8r6o0001tn3sb1vtiawx	人工智能	engineering-人工智能	engineering	999	PENDING	user-demo	2026-06-01 14:35:04.224	2026-06-01 14:35:04.224
chemical-biology	化学生物学	chemical-biology	life-science	8	APPROVED	\N	2026-06-05 18:41:35.904	2026-06-06 17:07:53.859
ecology	生态学	ecology	life-science	9	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.86
basic-medicine	基础医学	basic-medicine	medicine	1	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.86
clinical-medicine	临床医学	clinical-medicine	medicine	2	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.861
public-health	公共卫生	public-health	medicine	3	APPROVED	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:53.862
translational-medicine	转化医学	translational-medicine	medicine	4	APPROVED	\N	2026-05-15 14:09:59.096	2026-06-06 17:07:53.862
immunology-inflammation	免疫学与炎症	immunology-inflammation	medicine	5	APPROVED	\N	2026-06-05 18:41:35.907	2026-06-06 17:07:53.863
biomedical-engineering	生物医学工程	biomedical-engineering	engineering	6	APPROVED	\N	2026-06-05 18:41:35.897	2026-06-06 17:07:53.852
microbiology-vaccines	微生物学与疫苗	microbiology-vaccines	medicine	6	APPROVED	\N	2026-06-05 18:41:35.907	2026-06-06 17:07:53.863
\.


--
-- Data for Name: RecommendationBatch; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RecommendationBatch" (id, "userId", "dateKey", "algorithmVersion", "createdAt", "updatedAt") FROM stdin;
cmq2b81yi0001tnccghopys8j	user-oncology	2026-06-06	daily-deck-v2	2026-06-06 12:08:54.762	2026-06-06 12:08:54.762
cmq2lci4q0051tne4xd52cyqb	user-demo	2026-06-06	daily-deck-v2	2026-06-06 16:52:18.506	2026-06-06 16:52:18.506
cmq2ld13x005atne4gh6snqrf	cmp45u9g10000tnx45ri7ae4d	2026-06-06	daily-deck-v2	2026-06-06 16:52:43.101	2026-06-06 16:52:43.136
cmq2mo7cq006qtne4esm2gwpu	user-synbio	2026-06-06	daily-deck-v2	2026-06-06 17:29:24.026	2026-06-06 17:29:24.026
\.


--
-- Data for Name: RecommendationItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RecommendationItem" (id, "batchId", "topicId", "slotType", "position", score, "createdAt") FROM stdin;
cmq2mo7cu006rtne4ey79lu8v	cmq2mo7cq006qtne4esm2gwpu	topic-ai-physical-simulation	FAMILIAR	0	69.759	2026-06-06 17:29:24.03
cmq2mo7cu006stne4gdlzkse8	cmq2mo7cq006qtne4esm2gwpu	topic-pde-neural-operator	FAMILIAR	1	69.675	2026-06-06 17:29:24.03
cmq2mo7cu006ttne4mp6jiisa	cmq2mo7cq006qtne4esm2gwpu	topic-optoelectronic-fabrication	FAMILIAR	2	69.4545	2026-06-06 17:29:24.03
cmq2mo7cu006utne4baalqxw6	cmq2mo7cq006qtne4esm2gwpu	topic-co2-reduction-operando	ADJACENT	3	69.984	2026-06-06 17:29:24.03
cmq2mo7cu006vtne47uvthh1e	cmq2mo7cq006qtne4esm2gwpu	topic-biomaterials-immunity	ADJACENT	4	69.025	2026-06-06 17:29:24.03
cmq2mo7cu006wtne44boso61o	cmq2mo7cq006qtne4esm2gwpu	cmp704crb000btnn4958x2tgb	CROSS_FIELD	5	79.7575	2026-06-06 17:29:24.03
cmq2mo7cu006xtne4tyyhzhle	cmq2mo7cq006qtne4esm2gwpu	topic-tumor-microenvironment-resistance	CROSS_FIELD	6	69.5975	2026-06-06 17:29:24.03
cmq2b81yk0002tnccipknssko	cmq2b81yi0001tnccghopys8j	cmp704crb000btnn4958x2tgb	FAMILIAR	0	78.87950000000001	2026-06-06 12:08:54.765
cmq2b81yk0003tnccyae7utcf	cmq2b81yi0001tnccghopys8j	topic-tcell-inflammation-memory	FAMILIAR	1	69.67	2026-06-06 12:08:54.765
cmq2b81yk0004tnccc32nvbve	cmq2b81yi0001tnccghopys8j	topic-real-world-evidence-trials	FAMILIAR	2	69.5805	2026-06-06 12:08:54.765
cmq2b81yk0005tncc2b1pq3fg	cmq2b81yi0001tnccghopys8j	topic-gene-circuits-noise	ADJACENT	3	69.569	2026-06-06 12:08:54.765
cmq2b81yk0006tnccj0tsou60	cmq2b81yi0001tnccghopys8j	topic-cryoem-conformational-heterogeneity	ADJACENT	4	68.887	2026-06-06 12:08:54.765
cmq2b81yk0007tncc0wlcmjod	cmq2b81yi0001tnccghopys8j	topic-behavioral-decision-models	CROSS_FIELD	5	69.9815	2026-06-06 12:08:54.765
cmq2b81yk0008tncc4p4gtjt1	cmq2b81yi0001tnccghopys8j	topic-membrane-protein-lipid-context	CROSS_FIELD	6	69.845	2026-06-06 12:08:54.765
cmq2lci4t0052tne4og9n4lg2	cmq2lci4q0051tne4xd52cyqb	topic-quantum-sensing-biology	FAMILIAR	0	88.807	2026-06-06 16:52:18.509
cmq2lci4t0053tne4ni3a3dqw	cmq2lci4q0051tne4xd52cyqb	topic-ai-physical-simulation	FAMILIAR	1	69.9315	2026-06-06 16:52:18.509
cmq2lci4t0054tne4vg0iyder	cmq2lci4q0051tne4xd52cyqb	topic-radiotherapy-immunity-abscopal	FAMILIAR	2	69.416	2026-06-06 16:52:18.509
cmq2lci4t0055tne4tw0wff5x	cmq2lci4q0051tne4xd52cyqb	topic-moire-correlations	ADJACENT	3	69.684	2026-06-06 16:52:18.509
cmq2lci4t0056tne4bntrrckz	cmq2lci4q0051tne4xd52cyqb	topic-terahertz-photonic-sensing	ADJACENT	4	68.814	2026-06-06 16:52:18.509
cmq2lci4t0057tne4xg6kzqk5	cmq2lci4q0051tne4xd52cyqb	topic-bci-chip-bottleneck	CROSS_FIELD	5	49.728	2026-06-06 16:52:18.509
cmq2lci4t0058tne4bsmy5s19	cmq2lci4q0051tne4xd52cyqb	topic-artificial-photosynthesis-selectivity	CROSS_FIELD	6	48.498	2026-06-06 16:52:18.509
cmq2ld150005ktne47nhn64n3	cmq2ld13x005atne4gh6snqrf	topic-drug-target-validation	FAMILIAR	0	68.545	2026-06-06 16:52:43.14
cmq2ld150005ltne4df3qyh8v	cmq2ld13x005atne4gh6snqrf	topic-biomarkers-patient-stratification	FAMILIAR	1	67.85	2026-06-06 16:52:43.14
cmq2ld150005mtne447ijw3mg	cmq2ld13x005atne4gh6snqrf	topic-neuroimmune-brain-disease	FAMILIAR	2	66.761	2026-06-06 16:52:43.14
cmq2ld150005ntne4wgy6cpto	cmq2ld13x005atne4gh6snqrf	topic-macrophage-plasticity	ADJACENT	3	69.87049999999999	2026-06-06 16:52:43.14
cmq2ld150005otne4l5wx5jp5	cmq2ld13x005atne4gh6snqrf	topic-radiotherapy-immunity-abscopal	ADJACENT	4	69.753	2026-06-06 16:52:43.14
cmq2ld150005ptne45pu379rp	cmq2ld13x005atne4gh6snqrf	topic-computational-biology-perturbation	CROSS_FIELD	5	89.065	2026-06-06 16:52:43.14
cmq2ld150005qtne4u1e1y0z5	cmq2ld13x005atne4gh6snqrf	topic-quantum-sensing-biology	CROSS_FIELD	6	88.5995	2026-06-06 16:52:43.14
\.


--
-- Data for Name: Reply; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reply" (id, "topicId", "authorId", body, "parentReplyId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmp2s9eui0003tnugod2w51uy	cmp2s9eki0001tnug5cfbl52h	user-demo	??????????? PostgreSQL?	\N	2026-05-12 15:26:09.259	2026-05-12 15:26:09.259	\N
cmp44hen70001tn8cql34pz3c	cmp2s9eki0001tnug5cfbl52h	user-demo	Good point.	\N	2026-05-13 13:56:03.812	2026-05-13 13:56:03.812	\N
cmp44idvq0003tn8crbxjdtaw	cmp2thbn00007tnugfpb8m3h3	user-demo	Good point!	\N	2026-05-13 13:56:49.479	2026-05-13 13:56:49.479	\N
cmp45im160003tnhwxyf6sie5	cmp45ilr60001tnhwrz15g295	user-demo	first reply should remain floor 1	\N	2026-05-13 14:24:59.658	2026-05-13 14:24:59.658	\N
cmp45im200005tnhwugbphjc1	cmp45ilr60001tnhwrz15g295	user-demo	second reply will be soft deleted	\N	2026-05-13 14:24:59.688	2026-05-13 14:25:00.04	2026-05-13 14:25:00.039
cmp45vtnd0002tnx465chb7x7	cmp2thbn00007tnugfpb8m3h3	cmp45u9g10000tnx45ri7ae4d	I don't think so.	\N	2026-05-13 14:35:16.057	2026-05-13 14:37:28.635	2026-05-13 14:37:28.634
cmp478z0b0004tnz0bp6qksz0	cmp2s9eki0001tnug5cfbl52h	cmp45u9g10000tnx45ri7ae4d	I don't think so.	\N	2026-05-13 15:13:29.148	2026-05-13 15:13:29.148	\N
cmp47993g0006tnz08em4oxst	cmp2s9eki0001tnug5cfbl52h	cmp45u9g10000tnx45ri7ae4d	Maybe we should try this.	\N	2026-05-13 15:13:42.22	2026-05-13 15:13:42.22	\N
cmp6qt4r2000btnjg8kh5cg24	cmp6qng480006tnjgr2iwppya	user-demo	有人用过这个模型吗？	\N	2026-05-15 09:56:34.766	2026-05-15 09:56:34.766	\N
reply-ai-1	topic-ai-discussion	user-bio	我觉得最大的帮助可能不是总结论文，而是把参与讨论的第一句话变简单。很多时候我不是没有想法，是不确定自己的问题会不会太外行。	\N	2026-05-12 14:45:56.552	2026-06-06 17:07:54.467	\N
reply-ai-2	topic-ai-discussion	user-med	医学方向还有一个问题是术语很密。AI 如果能把临床指标、数据来源和评价指标讲清楚，外领域同学可能更容易指出方法上的问题。	\N	2026-05-12 14:45:56.553	2026-06-06 17:07:54.468	\N
reply-single-cell-2	topic-computational-biology-perturbation	user-ai-eng	同意 1 楼。现在很多模型在 benchmark 上比较的是预测表达谱，但实验设计更关心 ranking：哪些 perturbation 最值得做。也许评价指标应该从 Pearson correlation 换成 top-k hit rate、enrichment，或者更直接地看能不能更快找到有效组合。	reply-single-cell-1	2026-06-06 13:55:35.395	2026-06-06 17:07:54.47	\N
reply-single-cell-3	topic-computational-biology-perturbation	user-synbio	从实验角度我会谨慎一点。单细胞数据本身噪声很大，而且不同批次、细胞状态、MOI、guide efficiency 都会影响结果。模型如果没把这些不确定性输出出来，实验室很难根据它直接省钱。	reply-single-cell-2	2026-06-06 13:55:35.396	2026-06-06 17:07:54.471	\N
reply-single-cell-4	topic-computational-biology-perturbation	user-math	top-k 也要小心。如果 ground truth 只测了很小一部分组合，top-k hit rate 会依赖你怎么定义“hit”。我更希望模型给出 uncertainty，然后设计一个主动学习循环：预测、实验、更新模型，再预测。	reply-single-cell-2	2026-06-06 13:55:35.397	2026-06-06 17:07:54.472	\N
reply-single-cell-5	topic-computational-biology-perturbation	user-bio	我关心的是模型有没有提出“反直觉但可验证”的组合。比如两个单独扰动都没明显 phenotype，但组合后出现状态转换。如果只是复现已知通路，那对实验设计帮助有限。	reply-single-cell-1	2026-06-06 13:55:35.398	2026-06-06 17:07:54.472	\N
reply-single-cell-6	topic-computational-biology-perturbation	user-ai-eng	这可能需要分两层验证：第一层是表达谱预测，第二层是生物决策预测。表达谱预测不一定要完美，但如果能稳定排除一批低价值实验，或者优先找到 genetic interaction，就已经有价值。	reply-single-cell-3	2026-06-06 13:55:35.398	2026-06-06 17:07:54.473	\N
reply-neural-1	topic-neural-compression	user-demo	从机器学习角度看，representation learning 更强调任务目标和可优化损失。神经科学里的高效编码如果缺少明确 objective，类比时可能要小心。	\N	2026-05-12 14:45:56.554	2026-06-06 17:07:54.468	\N
reply-med-1	topic-medical-imaging-bias	user-demo	可以先区分 covariate shift 和 label shift，再看医院之间扫描设备、协议、患者群体和标注流程有没有变化。单看 AUC 下降可能很难定位原因。	\N	2026-05-12 14:45:56.554	2026-06-06 17:07:54.469	\N
reply-dyn-1	topic-dynamical-systems-biology	user-med	我会关心这个语言能不能产生新的实验设计。如果只是画出 landscape 解释已有现象，可能解释力强但预测力弱。	\N	2026-05-12 14:45:56.555	2026-06-06 17:07:54.469	\N
reply-single-cell-7	topic-computational-biology-perturbation	user-synbio	所以这个 topic 的核心可能不是“模型准不准”，而是“准到什么程度才足以改变实验设计”。我觉得可以把验证标准写成：比基线节省多少实验量、能否发现新组合、失败时能否解释失败来源。	reply-single-cell-4	2026-06-06 13:55:35.399	2026-06-06 17:07:54.473	\N
reply-quantum-bio-1	topic-quantum-sensing-biology	user-physics	我觉得这个题要先拆开。NV center 的“量子”部分确实提供了室温下可读出的自旋态，对磁场、温度等量很敏感。但真正进入生物样品后，光路、样品制备、定位、数据反演可能同样决定效果。	\N	2026-06-06 13:55:35.4	2026-06-06 17:07:54.474	\N
reply-quantum-bio-2	topic-quantum-sensing-biology	user-bio	外行问题：如果最后测到的是温度或磁场，那和传统荧光探针、电生理、MRI 类方法相比，量子传感到底赢在哪里？空间分辨率？非侵入？还是能测传统方法测不到的物理量？	\N	2026-06-06 13:55:35.4	2026-06-06 17:07:54.474	\N
reply-quantum-bio-3	topic-quantum-sensing-biology	user-electronic	很多时候优势可能来自整套工程，而不是单个 quantum sensor。比如 diamond 表面处理、光收集效率、微流控、噪声隔离、锁相读出，任何一环不好，量子态再漂亮也没用。	reply-quantum-bio-1	2026-06-06 13:55:35.401	2026-06-06 17:07:54.475	\N
cmp701e5b0008tnn4wu1kapor	cmp6zzhed0001tnn4ytzhcpfm	cmp45u9g10000tnx45ri7ae4d	楼主问到统计/监管角度，我说几句。\n\n"生物标志物有效但临床终点失败"早就该被当作一种独立的失败模式了，而且事实上业内已经在反思这件事——只是反思的速度远远跟不上 pipeline 推进的速度。\n\n我给你一组数字：在 2023 年那篇 JAMA 的回顾性研究里，FDA 在批准失败 pivotal 试验的药物时，最常援引的理由是"其他关键研究成功" (62%)，其次是"次要或探索性终点提示获益" (48%)，再就是"事后效力分析" (33%)。换句话说，监管层自己心里也清楚——生物标志物 + 单一阳性试验 ≠ 真实疗效，但在政治和病人压力下，这套话术系统会被反复启用。\n\nEVOKE 这种情况更尴尬：它根本没有阳性的临床终点，只有 biomarker。如果 Novo 真的拿这个去申请 accelerated approval（我不认为他们会，但要是真去），那就是 Aduhelm 2.0。\n\n我现在写论文的一个观点是：应该把"biomarker 阳性 + 临床终点阴性"明确定义为"机制部分验证、临床获益未证明"，而不是含糊地叫"mixed results"。语言会塑造判断。	\N	2026-05-15 14:14:56.735	2026-05-15 14:15:11.502	2026-05-15 14:15:11.5
cmp706tbe000jtnn4ikw580eg	cmp704crb000btnn4958x2tgb	cmp706n70000htnn45gj5v85x	楼主问到统计/监管角度，我说几句。\n\n"生物标志物有效但临床终点失败"早就该被当作一种独立的失败模式了，而且事实上业内已经在反思这件事——只是反思的速度远远跟不上 pipeline 推进的速度。\n\n我给你一组数字：在 2023 年那篇 JAMA 的回顾性研究里，FDA 在批准失败 pivotal 试验的药物时，最常援引的理由是"其他关键研究成功" (62%)，其次是"次要或探索性终点提示获益" (48%)，再就是"事后效力分析" (33%)。换句话说，监管层自己心里也清楚——生物标志物 + 单一阳性试验 ≠ 真实疗效，但在政治和病人压力下，这套话术系统会被反复启用。\n\nEVOKE 这种情况更尴尬：它根本没有阳性的临床终点，只有 biomarker。如果 Novo 真的拿这个去申请 accelerated approval（我不认为他们会，但要是真去），那就是 Aduhelm 2.0。\n\n我现在写论文的一个观点是：应该把"biomarker 阳性 + 临床终点阴性"明确定义为"机制部分验证、临床获益未证明"，而不是含糊地叫"mixed results"。语言会塑造判断。	\N	2026-05-15 14:19:09.674	2026-05-15 14:19:09.674	\N
cmp707vux000mtnn4ttjuwzo0	cmp704crb000btnn4958x2tgb	cmp707p8t000ktnn44wxxxh35	跟楼主和 1 楼略有不同意见。\n\n我不认为 EVOKE 证明了"GLP-1 通路在 AD 里没用"。我认为它证明了我们对 AD 的"疾病时间窗"理解还是太粗糙。\n\n几个事实：\n\nEVOKE 入组的是 early symptomatic AD，也就是 MCI 到 mild dementia 之间。这个阶段，神经元已经死了相当一部分了。GLP-1 假说的核心是"神经保护"——但神经都没了，你保护谁？\nNfL（神经丝轻链）下降了，这其实是神经损伤速率下降的信号。说明药在生物学层面是有事干的。但 CDR-SB 这种行为学终点，至少需要 18-24 个月才能反映出干预的累积效应，而 EVOKE 的随访期可能根本不够。\n真正能验证 GLP-1 假说的，应该是在 preclinical AD（淀粉样阳性但还没症状）人群里做 5-7 年的预防试验。但那个试验贵到没人愿意做。\n所以我倾向楼主你老板的判断——不是 GLP-1 没用，而是 EVOKE 这种 trial design 注定看不见它的好处。这就是 CNS 药物开发的诅咒：等你能在金标准终点上证明它有效的时候，疾病已经晚到药救不回来了。	\N	2026-05-15 14:19:59.625	2026-05-15 14:19:59.625	\N
cmp709ngm000ptnn4oyfsfkki	cmp704crb000btnn4958x2tgb	cmp709evr000ntnn4e98k8q6h	临床医生角度补一刀。\n\n你们在讨论 trial design 和监管的时候，别忘了我们门诊里坐着的那些家属。\n\n自从 lecanemab 和 donanemab 上市，每周都有家属拿着新闻问我"医生，那个新药我们能用吗"。我得花 20 分钟解释：药价 2.6 万美金一年、需要每两周输液、有 ARIA（脑水肿/微出血）风险、临床获益的程度差不多是 CDR-SB 减缓 0.45 分——这个数字对家庭意味着什么，老实说我自己都说不清楚。\n\n然后 EVOKE 出来，家属又来问"那个减肥药能治老年痴呆吗"。我又得解释一遍 biomarker 改善但临床终点没动是什么意思。\n\n我想表达的是："biomarker 阳性、临床终点阴性"这种结果，对临床实践是一种伤害。它制造了一种"接近成功"的幻觉，让家属持续抱有期待，让医生持续被迫做翻译工作，让支付方持续焦虑下一个 Aduhelm 什么时候出现。\n\n楼主问以后是不是该单独分析这种失败模式——我作为开处方的那个人，强烈支持。	\N	2026-05-15 14:21:22.055	2026-05-15 14:21:22.055	\N
cmp70awn2000stnn4p817y683	cmp704crb000btnn4958x2tgb	cmp70ahql000qtnn4zxalm723	蹲一个不太成熟的问题🙋‍♀️\n\n看完楼上各位的讨论我有点疑惑：如果说"生物标志物 → 临床终点"这条转化路径这么不靠谱，那为什么药企还要花钱做生物标志物呢？是不是应该一开始就直接打临床终点？\n\n还有就是 2 楼说的"preclinical AD 阶段做预防试验"——这种试验入组标准怎么定？淀粉样 PET 阳性但完全无症状的人，伦理上能让他们参加一个 7 年的安慰剂对照试验吗？\n\n求科普🙏	\N	2026-05-15 14:22:20.606	2026-05-15 14:22:20.606	\N
cmp738a270001tns4tzytsm0x	cmp704crb000btnn4958x2tgb	user-demo	各位老师好，我是做AI建模的，最近被EVOKE的结果和Aduhelm的老问题反复“击中”——尤其是二楼提到的那句：“入组时病人已经晚期了”。这让我想到一个朴素但关键的问题，想向临床和基础研究的老师们请教：\n\n如果AI真能帮我们更早、更准地识别出那些**“用当前金标准（如NIA-AA 2018）还不能诊断为AD，但生物标志物/影像/认知轨迹已出现异常信号”**的人群（比如Aβ-PET阳性+血浆p-tau181升高+CDR-SB仍=0的“前驱高危者”），那么像EVOKE这样的试验，是否就有可能在**更敏感的时间窗**里捕捉到GLP-1类药物的临床获益？\n\n但我也意识到这个想法落地远没那么简单。所以特别想请教几个实操层面的问题：\n\n1. **数据层面**：要训练这样一个AI模型，理想情况下需要哪些类型的数据？比如：多中心纵向队列中的标准化生物标志物（CSF/Aβ42、p-tau217、NfL）、3T+ MRI/tau-PET、数字认知工具（如CANTAB或语音/步态行为数据）、甚至电子健康记录中的用药与代谢指标？这些数据在真实世界中是否具备足够的覆盖度、质量一致性与共享可行性？\n\n2. **模型层面**：现有研究（如TRAILBLAZER-ALZ 2的预筛选分析、AIBL或ADNI的亚组建模）是否已尝试过类似思路？如果做过，模型在独立验证集上的AUC、PPV/NPV如何？更重要的是——它能否给出**临床可解释的决策依据**（比如“该患者未来2年内进展为MCI的风险↑3.2倍，主要驱动因素是海马萎缩速率+血浆GFAP”），而不仅是黑箱概率？\n\n3. **转化鸿沟**：即使模型性能达标，从“预测高风险”到“启动干预试验”，中间还隔着伦理审查（对无症状者长期用药）、医保支付逻辑（谁为筛查买单？）、以及最关键的——我们**真的知道在这个阶段干预GLP-1，机制上是否足够靶向、剂量是否足够穿透血脑屏障、疗程是否足够阻断下游级联？**\n\n说到底，我不是在质疑EVOKE的设计，而是想理解：当“生物标志物改善 ≠ 临床获益”反复出现时，我们是否缺的不是新靶点，而是**一套把“时间维度”和“异质性分层”真正嵌入临床试验设计的基础设施**——而AI或许只是其中一环，且必须和神经病理、药代动力学、临床分期标准深度咬合。\n\n非常期待各位老师从各自视角给点“泼冷水”或“指条路”。谢谢！	\N	2026-05-15 15:44:16.879	2026-06-02 15:09:39.711	2026-06-02 15:09:39.71
cmpwryrp90003tnvwdg7kmbl1	cmp704crb000btnn4958x2tgb	cmp709evr000ntnn4e98k8q6h	测试回复索引	cmpwrxusm0001tnvwaulhyrks	2026-06-02 15:10:57.981	2026-06-02 15:10:57.981	\N
cmpwrz7h60005tnvwx1jyc718	cmp704crb000btnn4958x2tgb	cmp709evr000ntnn4e98k8q6h	测试热点回复	cmp706tbe000jtnn4ikw580eg	2026-06-02 15:11:18.426	2026-06-02 15:11:18.426	\N
cmpws5mcu0007tnvw141ixqeq	cmp704crb000btnn4958x2tgb	cmp45u9g10000tnx45ri7ae4d	测试热点回复功能	cmp707vux000mtnn4ttjuwzo0	2026-06-02 15:16:17.646	2026-06-02 15:16:17.646	\N
cmpws63q30009tnvwnexrfv52	cmp704crb000btnn4958x2tgb	cmp45u9g10000tnx45ri7ae4d	测试热点回复功能	cmpwrxusm0001tnvwaulhyrks	2026-06-02 15:16:40.156	2026-06-02 15:16:40.156	\N
cmpws71cl000btnvwv6p8vbq7	cmp704crb000btnn4958x2tgb	cmp702t5x0009tnn45hgeuoxs	测试热点回复功能	cmp709ngm000ptnn4oyfsfkki	2026-06-02 15:17:23.733	2026-06-02 15:17:23.733	\N
cmpwrxusm0001tnvwaulhyrks	cmp704crb000btnn4958x2tgb	user-demo	测试回复索引	cmp706tbe000jtnn4ikw580eg	2026-06-02 15:10:15.335	2026-06-03 07:03:26.727	2026-06-03 07:03:26.725
cmp73f0sc0003tns4f0i7sel6	cmp704crb000btnn4958x2tgb	user-demo	各位老师好，我是做AI建模的，最近被EVOKE的结果“震”得有点懵，也跟着翻了Aduhelm的老账，越看越觉得问题可能不在药，而在“人”——不是药没用，而是我们总在**用晚期患者的躯体，去验证一个本该作用于早期病理的机制**。	\N	2026-05-15 15:49:31.453	2026-06-03 07:11:22.61	2026-06-03 07:11:22.609
cmpxqaj8x0001tnr0ud3bvga1	cmp704crb000btnn4958x2tgb	user-demo	测试删除需询问功能	cmpws63q30009tnvwnexrfv52	2026-06-03 07:11:53.842	2026-06-03 07:11:56.969	2026-06-03 07:11:56.968
cmpxqmmd20001tnykvy5zxbb9	cmp704crb000btnn4958x2tgb	user-demo	测试评论删除需确认功能	cmpws63q30009tnvwnexrfv52	2026-06-03 07:21:17.75	2026-06-03 07:21:17.75	\N
reply-single-cell-1	topic-computational-biology-perturbation	user-structural-bio	我觉得“指导真实实验”不能只看 held-out perturbation 的表达相关性。真正有用应该是：模型给出一组实验优先级，实验后发现它比随机选、按 differential expression 选、按已知通路选更省实验量。	\N	2026-06-06 13:55:35.389	2026-06-06 17:07:54.47	\N
reply-quantum-bio-4	topic-quantum-sensing-biology	user-physics	可能最合理的优势不是“全面替代传统方法”，而是在特定窗口：室温、纳米尺度、局域磁场或温度、对活体相对友好。比如测单细胞附近的磁结构或局部热变化，这类问题传统方法不一定舒服。	reply-quantum-bio-2	2026-06-06 13:55:35.401	2026-06-06 17:07:54.475	\N
reply-quantum-bio-5	topic-quantum-sensing-biology	user-neuro	神经动作电位磁检测这个应用很吸引我，因为磁场不太受组织电导率影响。但我会问：信噪比能否支持真实神经网络记录？如果只能在很受控的单神经元样品里做，离神经科学常规工具还远。	reply-quantum-bio-4	2026-06-06 13:55:35.402	2026-06-06 17:07:54.476	\N
reply-quantum-bio-6	topic-quantum-sensing-biology	user-structural-bio	还有一个现实问题：生物样品本身差异很大。量子传感如果需要复杂校准，那最后可能是物理实验很漂亮，但生物重复性不够。对生物人来说，可重复、低扰动、样品兼容性比极限灵敏度更重要。	reply-quantum-bio-3	2026-06-06 13:55:35.402	2026-06-06 17:07:54.476	\N
reply-quantum-bio-7	topic-quantum-sensing-biology	user-physics	所以这个问题可以改写成：量子传感的“不可替代性”要在具体任务里证明。不是问它量子不量子，而是问在某个生物测量任务中，它是否同时赢下空间分辨率、扰动程度、信噪比和可重复性。	reply-quantum-bio-5	2026-06-06 13:55:35.403	2026-06-06 17:07:54.477	\N
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tag" (id, name, slug, "disciplineId", "reviewStatus", "reviewReason", "createdById", "createdAt", "updatedAt") FROM stdin;
cmp6qng450002tnjg99prnd2o	酶设计	酶设计	computer-science	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-05-15 21:40:23.504
cmp6qng470004tnjgecugmvqo	AI4Biology	ai4biology	computer-science	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-05-15 21:40:23.504
tag-analytical-methods	分析方法	analytical-methods	chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.022	2026-06-06 17:07:54.238
tag-ai-science	AI for Science	ai-for-science	ai-data-science	APPROVED	\N	\N	2026-06-05 18:41:35.981	2026-06-06 17:07:54.184
tag-bioinformatics-ai	AI+生物信息	ai-bioinformatics	ai-data-science	APPROVED	\N	\N	2026-06-05 18:41:35.984	2026-06-06 17:07:54.188
tag-humanoid-robots	人形机器人	humanoid-robots	robotics-mechanical-systems	APPROVED	\N	\N	2026-06-05 18:41:35.984	2026-06-06 17:07:54.189
cmpvb8r6r0003tn3skktguetu	蛋白质设计	蛋白质设计	cmpvb8r6o0001tn3sb1vtiawx	PENDING	\N	user-demo	2026-06-01 14:35:04.227	2026-06-01 14:35:04.227
tag-embodied-intelligence	具身智能	embodied-intelligence	robotics-mechanical-systems	APPROVED	\N	\N	2026-06-05 18:41:35.985	2026-06-06 17:07:54.19
tag-motion-control	运动控制	motion-control	robotics-mechanical-systems	APPROVED	\N	\N	2026-06-05 18:41:35.986	2026-06-06 17:07:54.191
tag-carbon-capture	碳捕集	carbon-capture	sustainable-environment-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.004	2026-06-06 17:07:54.215
tag-computational-biology	计算生物学	computational-biology	ai-data-science	APPROVED	\N	\N	2026-06-05 18:41:35.982	2026-06-06 17:07:54.185
tag-protein-language-models	蛋白质语言模型	protein-language-models	ai-data-science	APPROVED	\N	\N	2026-06-05 18:41:35.983	2026-06-06 17:07:54.186
tag-autonomous-systems	自主系统	autonomous-systems	robotics-mechanical-systems	APPROVED	\N	\N	2026-06-05 18:41:35.987	2026-06-06 17:07:54.193
tag-robot-learning	机器人学习	robot-learning	robotics-mechanical-systems	APPROVED	\N	\N	2026-06-05 18:41:35.988	2026-06-06 17:07:54.194
tag-micro-nano-optoelectronics	微纳光电	micro-nano-optoelectronics	electronic-info	APPROVED	\N	\N	2026-06-05 18:41:35.989	2026-06-06 17:07:54.195
tag-integrated-circuits	集成电路	integrated-circuits	electronic-info	APPROVED	\N	\N	2026-06-05 18:41:35.989	2026-06-06 17:07:54.196
tag-intelligent-sensing	智能传感	intelligent-sensing	electronic-info	APPROVED	\N	\N	2026-06-05 18:41:35.99	2026-06-06 17:07:54.197
tag-semiconductor-devices	半导体器件	semiconductor-devices	electronic-info	APPROVED	\N	\N	2026-06-05 18:41:35.991	2026-06-06 17:07:54.199
tag-brain-computer-chips	脑机接口芯片	brain-computer-interface-chips	electronic-info	APPROVED	\N	\N	2026-06-05 18:41:35.992	2026-06-06 17:07:54.2
tag-materials-screening	材料筛选	materials-screening	materials	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:54.201
tag-energy-materials	能源材料	energy-materials	materials	APPROVED	\N	\N	2026-06-05 18:41:35.994	2026-06-06 17:07:54.202
tag-nanomaterials	纳米材料	nanomaterials	materials	APPROVED	\N	\N	2026-06-05 18:41:35.995	2026-06-06 17:07:54.203
tag-biomaterials	生物材料	biomaterials	materials	APPROVED	\N	\N	2026-06-05 18:41:35.996	2026-06-06 17:07:54.204
tag-materials-characterization	材料表征	materials-characterization	materials	APPROVED	\N	\N	2026-06-05 18:41:35.997	2026-06-06 17:07:54.206
tag-computational-materials	材料计算	computational-materials	materials	APPROVED	\N	\N	2026-06-05 18:41:35.998	2026-06-06 17:07:54.207
tag-medical-ai	医疗AI	medical-ai	biomedical-engineering	APPROVED	\N	\N	2026-06-05 18:41:36	2026-06-06 17:07:54.209
tag-bioelectronics	生物电子	bioelectronics	biomedical-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.001	2026-06-06 17:07:54.21
tag-medical-materials	医用材料	medical-materials	biomedical-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.001	2026-06-06 17:07:54.211
tag-smart-healthcare-systems	智能医疗系统	smart-healthcare-systems	biomedical-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.002	2026-06-06 17:07:54.213
tag-co2-conversion	CO2转化	co2-conversion	sustainable-environment-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.005	2026-06-06 17:07:54.216
tag-environmental-monitoring	环境监测	environmental-monitoring	sustainable-environment-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.006	2026-06-06 17:07:54.217
tag-green-chemical-engineering	绿色化工	green-chemical-engineering	sustainable-environment-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.006	2026-06-06 17:07:54.219
tag-number-theory	数论	number-theory	mathematics	APPROVED	\N	\N	2026-06-05 18:41:36.007	2026-06-06 17:07:54.22
tag-algebraic-geometry	代数几何	algebraic-geometry	mathematics	APPROVED	\N	\N	2026-06-05 18:41:36.008	2026-06-06 17:07:54.221
tag-analysis	分析	analysis	mathematics	APPROVED	\N	\N	2026-06-05 18:41:36.009	2026-06-06 17:07:54.222
tag-pde	偏微分方程	partial-differential-equations	mathematics	APPROVED	\N	\N	2026-06-05 18:41:36.01	2026-06-06 17:07:54.223
tag-probability-statistics	概率统计	probability-statistics	mathematics	APPROVED	\N	\N	2026-06-05 18:41:36.011	2026-06-06 17:07:54.224
tag-scientific-computing	科学计算	scientific-computing	mathematics	APPROVED	\N	\N	2026-06-05 18:41:36.012	2026-06-06 17:07:54.225
tag-dynamical-systems	动力系统	dynamical-systems	mathematics	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:54.226
tag-condensed-matter	凝聚态物理	condensed-matter-physics	physics	APPROVED	\N	\N	2026-06-05 18:41:36.014	2026-06-06 17:07:54.228
tag-quantum-physics	量子物理	quantum-physics	physics	APPROVED	\N	\N	2026-06-05 18:41:36.015	2026-06-06 17:07:54.229
tag-atomic-molecular-physics	原子分子物理	atomic-molecular-physics	physics	APPROVED	\N	\N	2026-06-05 18:41:36.016	2026-06-06 17:07:54.23
tag-optics	光学	optics	physics	APPROVED	\N	\N	2026-06-05 18:41:36.017	2026-06-06 17:07:54.231
tag-laser-nanotechnology	激光与纳米技术	laser-nanotechnology	physics	APPROVED	\N	\N	2026-06-05 18:41:36.018	2026-06-06 17:07:54.232
tag-catalysis-synthesis	催化与合成	catalysis-synthesis	chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.018	2026-06-06 17:07:54.233
tag-chemical-biology-chem	化学生物学	chemical-biology-chemistry	chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.019	2026-06-06 17:07:54.234
tag-materials-chemistry	材料化学	materials-chemistry	chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.02	2026-06-06 17:07:54.235
tag-theoretical-computational-chemistry	理论与计算化学	theoretical-computational-chemistry	chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.021	2026-06-06 17:07:54.237
tag-artificial-photosynthesis	人工光合作用	artificial-photosynthesis	molecular-energy-chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.023	2026-06-06 17:07:54.239
tag-glp-1	GLP-1	glp-1	physiology-metabolism	APPROVED	\N	\N	2026-05-15 14:09:59.17	2026-06-06 17:07:54.303
tag-cns-diseases	CNS疾病	cns-diseases	translational-medicine	APPROVED	\N	\N	2026-05-15 14:09:59.169	2026-06-06 17:07:54.315
tag-bio-statistics	生物统计	biostatistics	public-health	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:54.327
tag-medical-imaging	医学影像	medical-imaging	clinical-medicine	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:54.328
tag-human-ai	Human-AI Interaction	human-ai-interaction	computer-science	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:54.174
tag-ml	机器学习	machine-learning	ai-data-science	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:54.178
tag-multimodal-models	多模态模型	multimodal-models	ai-data-science	APPROVED	\N	\N	2026-06-05 18:41:35.977	2026-06-06 17:07:54.179
tag-generative-models	生成模型	generative-models	ai-data-science	APPROVED	\N	\N	2026-06-05 18:41:35.978	2026-06-06 17:07:54.181
tag-reinforcement-learning	强化学习	reinforcement-learning	ai-data-science	APPROVED	\N	\N	2026-06-05 18:41:35.979	2026-06-06 17:07:54.182
tag-cell-migration	细胞迁移	cell-migration	cell-biology	APPROVED	\N	\N	2026-06-05 18:41:36.034	2026-06-06 17:07:54.252
tag-organelles	细胞器	organelles	cell-biology	APPROVED	\N	\N	2026-06-05 18:41:36.035	2026-06-06 17:07:54.253
tag-signal-transduction	信号转导	signal-transduction	cell-biology	APPROVED	\N	\N	2026-06-05 18:41:36.036	2026-06-06 17:07:54.254
tag-tumor-cells	肿瘤细胞	tumor-cells	cell-biology	APPROVED	\N	\N	2026-06-05 18:41:36.037	2026-06-06 17:07:54.255
tag-model-organisms	模式生物	model-organisms	genetics-development	APPROVED	\N	\N	2026-06-05 18:41:36.038	2026-06-06 17:07:54.257
tag-stem-cells	干细胞	stem-cells	genetics-development	APPROVED	\N	\N	2026-06-05 18:41:36.038	2026-06-06 17:07:54.258
tag-organ-development	器官发育	organ-development	genetics-development	APPROVED	\N	\N	2026-06-05 18:41:36.039	2026-06-06 17:07:54.259
tag-regeneration	再生	regeneration	genetics-development	APPROVED	\N	\N	2026-06-05 18:41:36.04	2026-06-06 17:07:54.26
tag-gene-regulation	基因调控	gene-regulation	genetics-development	APPROVED	\N	\N	2026-06-05 18:41:36.041	2026-06-06 17:07:54.261
tag-neural-coding	神经编码	neural-coding	neuroscience	APPROVED	\N	\N	2026-05-15 21:40:23.504	2026-06-06 17:07:54.262
tag-neural-circuits	神经环路	neural-circuits	neuroscience	APPROVED	\N	\N	2026-06-05 18:41:36.043	2026-06-06 17:07:54.263
tag-neuroimmunology	神经免疫	neuroimmunology	neuroscience	APPROVED	\N	\N	2026-06-05 18:41:36.045	2026-06-06 17:07:54.266
tag-brain-diseases	脑疾病	brain-diseases	neuroscience	APPROVED	\N	\N	2026-06-05 18:41:36.046	2026-06-06 17:07:54.267
tag-neurovascular	神经血管	neurovascular	neuroscience	APPROVED	\N	\N	2026-06-05 18:41:36.047	2026-06-06 17:07:54.268
tag-infection-immunity	感染免疫	infection-immunity	immunology-microbiology	APPROVED	\N	\N	2026-06-05 18:41:36.048	2026-06-06 17:07:54.27
tag-pathogen-host-interaction	病原宿主互作	pathogen-host-interaction	immunology-microbiology	APPROVED	\N	\N	2026-06-05 18:41:36.049	2026-06-06 17:07:54.271
tag-tissue-immunity	组织免疫	tissue-immunity	immunology-microbiology	APPROVED	\N	\N	2026-06-05 18:41:36.05	2026-06-06 17:07:54.272
tag-vaccines	疫苗	vaccines	immunology-microbiology	APPROVED	\N	\N	2026-06-05 18:41:36.05	2026-06-06 17:07:54.273
tag-immunotherapy	免疫治疗	immunotherapy	immunology-microbiology	APPROVED	\N	\N	2026-06-05 18:41:36.051	2026-06-06 17:07:54.274
tag-synthetic-biology	合成生物学	synthetic-biology	systems-synthetic-biology	APPROVED	\N	\N	2026-06-05 18:41:36.052	2026-06-06 17:07:54.275
tag-biomanufacturing	生物制造	biomanufacturing	systems-synthetic-biology	APPROVED	\N	\N	2026-06-05 18:41:36.053	2026-06-06 17:07:54.276
tag-gene-circuits	基因线路	gene-circuits	systems-synthetic-biology	APPROVED	\N	\N	2026-06-05 18:41:36.054	2026-06-06 17:07:54.278
tag-protein-engineering	蛋白工程	protein-engineering	systems-synthetic-biology	APPROVED	\N	\N	2026-06-05 18:41:36.055	2026-06-06 17:07:54.279
tag-small-molecule-probes	小分子探针	small-molecule-probes	chemical-biology	APPROVED	\N	\N	2026-06-05 18:41:36.056	2026-06-06 17:07:54.28
tag-drug-design	药物设计	drug-design	chemical-biology	APPROVED	\N	\N	2026-06-05 18:41:36.056	2026-06-06 17:07:54.281
tag-peptide-design	多肽设计	peptide-design	chemical-biology	APPROVED	\N	\N	2026-06-05 18:41:36.057	2026-06-06 17:07:54.282
tag-bioanalysis	生物分析	bioanalysis	chemical-biology	APPROVED	\N	\N	2026-06-05 18:41:36.058	2026-06-06 17:07:54.284
tag-natural-products	天然产物	natural-products	chemical-biology	APPROVED	\N	\N	2026-06-05 18:41:36.059	2026-06-06 17:07:54.285
tag-t-cell-differentiation	T细胞分化	t-cell-differentiation	immunology-inflammation	APPROVED	\N	\N	2026-06-05 18:41:36.06	2026-06-06 17:07:54.286
tag-macrophages	巨噬细胞	macrophages	immunology-inflammation	APPROVED	\N	\N	2026-06-05 18:41:36.061	2026-06-06 17:07:54.287
tag-immune-checkpoints	免疫检查点	immune-checkpoints	immunology-inflammation	APPROVED	\N	\N	2026-06-05 18:41:36.063	2026-06-06 17:07:54.288
tag-tissue-resident-immunity	组织驻留免疫	tissue-resident-immunity	immunology-inflammation	APPROVED	\N	\N	2026-06-05 18:41:36.065	2026-06-06 17:07:54.289
tag-autoimmunity	自身免疫	autoimmunity	immunology-inflammation	APPROVED	\N	\N	2026-06-05 18:41:36.066	2026-06-06 17:07:54.29
tag-pathogenic-microbes	病原微生物	pathogenic-microbes	microbiology-vaccines	APPROVED	\N	\N	2026-06-05 18:41:36.067	2026-06-06 17:07:54.291
tag-viral-immunity	病毒免疫	viral-immunity	microbiology-vaccines	APPROVED	\N	\N	2026-06-05 18:41:36.067	2026-06-06 17:07:54.292
tag-universal-vaccines	通用疫苗	universal-vaccines	microbiology-vaccines	APPROVED	\N	\N	2026-06-05 18:41:36.068	2026-06-06 17:07:54.293
tag-microbiome	微生物组	microbiome	microbiology-vaccines	APPROVED	\N	\N	2026-06-05 18:41:36.069	2026-06-06 17:07:54.294
tag-vaccine-design	疫苗设计	vaccine-design	microbiology-vaccines	APPROVED	\N	\N	2026-06-05 18:41:36.07	2026-06-06 17:07:54.296
tag-tumor-immunotherapy	肿瘤免疫治疗	tumor-immunotherapy	oncology-therapy	APPROVED	\N	\N	2026-06-05 18:41:36.071	2026-06-06 17:07:54.297
tag-tumor-microenvironment	肿瘤微环境	tumor-microenvironment	oncology-therapy	APPROVED	\N	\N	2026-06-05 18:41:36.072	2026-06-06 17:07:54.298
tag-tumor-drug-resistance	肿瘤耐药	tumor-drug-resistance	oncology-therapy	APPROVED	\N	\N	2026-06-05 18:41:36.073	2026-06-06 17:07:54.3
tag-cell-therapy	细胞治疗	cell-therapy	oncology-therapy	APPROVED	\N	\N	2026-06-05 18:41:36.076	2026-06-06 17:07:54.302
tag-metabolic-disease	代谢疾病	metabolic-disease	physiology-metabolism	APPROVED	\N	\N	2026-06-05 18:41:36.079	2026-06-06 17:07:54.304
tag-obesity	肥胖	obesity	physiology-metabolism	APPROVED	\N	\N	2026-06-05 18:41:36.08	2026-06-06 17:07:54.306
tag-lipid-metabolism	脂代谢	lipid-metabolism	physiology-metabolism	APPROVED	\N	\N	2026-06-05 18:41:36.081	2026-06-06 17:07:54.307
tag-organ-crosstalk	器官互作	organ-crosstalk	physiology-metabolism	APPROVED	\N	\N	2026-06-05 18:41:36.082	2026-06-06 17:07:54.308
tag-gene-editing	基因编辑	gene-editing	medical-genetics-rare-disease	APPROVED	\N	\N	2026-06-05 18:41:36.083	2026-06-06 17:07:54.309
tag-gene-therapy	基因治疗	gene-therapy	medical-genetics-rare-disease	APPROVED	\N	\N	2026-06-05 18:41:36.084	2026-06-06 17:07:54.31
tag-genetic-screening	遗传筛查	genetic-screening	medical-genetics-rare-disease	APPROVED	\N	\N	2026-06-05 18:41:36.085	2026-06-06 17:07:54.311
tag-rare-disease-models	罕见病模型	rare-disease-models	medical-genetics-rare-disease	APPROVED	\N	\N	2026-06-05 18:41:36.086	2026-06-06 17:07:54.312
tag-electrocatalysis	电催化	electrocatalysis	molecular-energy-chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.025	2026-06-06 17:07:54.241
tag-water-splitting	水分解	water-splitting	molecular-energy-chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.026	2026-06-06 17:07:54.242
tag-co2-reduction	CO2还原	co2-reduction	molecular-energy-chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.027	2026-06-06 17:07:54.243
tag-structural-biology	结构生物学	structural-biology	biophysics-biochemistry	APPROVED	\N	\N	2026-06-05 18:41:36.028	2026-06-06 17:07:54.245
tag-cryo-em	冷冻电镜	cryo-em	biophysics-biochemistry	APPROVED	\N	\N	2026-06-05 18:41:36.028	2026-06-06 17:07:54.246
tag-protein-complexes	蛋白质复合物	protein-complexes	biophysics-biochemistry	APPROVED	\N	\N	2026-06-05 18:41:36.029	2026-06-06 17:07:54.247
tag-protein-modification	蛋白质修饰	protein-modification	biophysics-biochemistry	APPROVED	\N	\N	2026-06-05 18:41:36.031	2026-06-06 17:07:54.248
tag-molecular-mechanisms	分子机制	molecular-mechanisms	biophysics-biochemistry	APPROVED	\N	\N	2026-06-05 18:41:36.032	2026-06-06 17:07:54.249
tag-cell-cycle	细胞周期	cell-cycle	cell-biology	APPROVED	\N	\N	2026-06-05 18:41:36.033	2026-06-06 17:07:54.251
tag-biomedical-imaging	生物医学成像	biomedical-imaging	biomedical-engineering	APPROVED	\N	\N	2026-06-05 18:41:35.999	2026-06-06 17:07:54.208
tag-low-carbon-biosynthesis	低碳生物合成	low-carbon-biosynthesis	sustainable-environment-engineering	APPROVED	\N	\N	2026-06-05 18:41:36.003	2026-06-06 17:07:54.214
tag-solar-fuels	太阳能燃料	solar-fuels	molecular-energy-chemistry	APPROVED	\N	\N	2026-06-05 18:41:36.024	2026-06-06 17:07:54.24
tag-behavioral-decision-making	行为决策	behavioral-decision-making	neuroscience	APPROVED	\N	\N	2026-06-05 18:41:36.044	2026-06-06 17:07:54.265
tag-radiotherapy-immunity	放疗免疫	radiotherapy-immunity	oncology-therapy	APPROVED	\N	\N	2026-06-05 18:41:36.075	2026-06-06 17:07:54.301
tag-mitochondrial-disease	线粒体病	mitochondrial-disease	medical-genetics-rare-disease	APPROVED	\N	\N	2026-06-05 18:41:36.087	2026-06-06 17:07:54.313
tag-clinical-trials	临床试验	clinical-trials	translational-medicine	APPROVED	\N	\N	2026-06-05 18:41:36.089	2026-06-06 17:07:54.316
tag-biomarkers	生物标志物	biomarkers	translational-medicine	APPROVED	\N	\N	2026-06-05 18:41:36.09	2026-06-06 17:07:54.317
tag-patient-stratification	患者分层	patient-stratification	translational-medicine	APPROVED	\N	\N	2026-06-05 18:41:36.091	2026-06-06 17:07:54.319
tag-real-world-evidence	真实世界研究	real-world-evidence	translational-medicine	APPROVED	\N	\N	2026-06-05 18:41:36.092	2026-06-06 17:07:54.32
tag-drug-targets	药物靶点	drug-targets	drug-discovery-public-health	APPROVED	\N	\N	2026-06-05 18:41:36.092	2026-06-06 17:07:54.321
tag-drug-toxicology	药物毒理	drug-toxicology	drug-discovery-public-health	APPROVED	\N	\N	2026-06-05 18:41:36.093	2026-06-06 17:07:54.322
tag-epidemiology	流行病学	epidemiology	drug-discovery-public-health	APPROVED	\N	\N	2026-06-05 18:41:36.094	2026-06-06 17:07:54.323
tag-public-health	公共健康	public-health-tag	drug-discovery-public-health	APPROVED	\N	\N	2026-06-05 18:41:36.095	2026-06-06 17:07:54.325
tag-drug-delivery	药物递送	drug-delivery	drug-discovery-public-health	APPROVED	\N	\N	2026-06-05 18:41:36.096	2026-06-06 17:07:54.326
\.


--
-- Data for Name: TagDiscipline; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TagDiscipline" ("tagId", "disciplineId") FROM stdin;
tag-human-ai	computer-science
tag-ml	ai-data-science
tag-ml	computer-science
tag-ml	mathematics
tag-multimodal-models	ai-data-science
tag-generative-models	ai-data-science
tag-generative-models	mathematics
cmp6qng450002tnjg99prnd2o	computer-science
cmp6qng470004tnjgecugmvqo	computer-science
tag-reinforcement-learning	ai-data-science
tag-reinforcement-learning	robotics-mechanical-systems
tag-ai-science	ai-data-science
tag-ai-science	molecular-energy-chemistry
tag-computational-biology	ai-data-science
tag-computational-biology	systems-synthetic-biology
tag-protein-language-models	ai-data-science
tag-protein-language-models	systems-synthetic-biology
tag-bioinformatics-ai	ai-data-science
tag-bioinformatics-ai	systems-synthetic-biology
tag-humanoid-robots	robotics-mechanical-systems
tag-embodied-intelligence	robotics-mechanical-systems
tag-embodied-intelligence	ai-data-science
tag-motion-control	robotics-mechanical-systems
tag-autonomous-systems	robotics-mechanical-systems
tag-robot-learning	robotics-mechanical-systems
tag-robot-learning	ai-data-science
tag-micro-nano-optoelectronics	electronic-info
tag-integrated-circuits	electronic-info
tag-intelligent-sensing	electronic-info
tag-semiconductor-devices	electronic-info
tag-brain-computer-chips	electronic-info
tag-materials-screening	materials
tag-energy-materials	materials
tag-nanomaterials	materials
tag-biomaterials	materials
tag-biomaterials	biomedical-engineering
tag-materials-characterization	materials
tag-computational-materials	materials
tag-computational-materials	ai-data-science
tag-biomedical-imaging	biomedical-engineering
tag-biomedical-imaging	clinical-medicine
tag-medical-ai	biomedical-engineering
tag-medical-ai	ai-data-science
tag-bioelectronics	biomedical-engineering
tag-medical-materials	biomedical-engineering
tag-medical-materials	materials
tag-smart-healthcare-systems	biomedical-engineering
tag-low-carbon-biosynthesis	sustainable-environment-engineering
tag-low-carbon-biosynthesis	chemical-biological-engineering
tag-carbon-capture	sustainable-environment-engineering
tag-co2-conversion	sustainable-environment-engineering
tag-co2-conversion	molecular-energy-chemistry
tag-environmental-monitoring	sustainable-environment-engineering
tag-green-chemical-engineering	sustainable-environment-engineering
tag-green-chemical-engineering	chemical-biological-engineering
tag-number-theory	mathematics
cmpvb8r6r0003tn3skktguetu	cmpvb8r6o0001tn3sb1vtiawx
tag-algebraic-geometry	mathematics
tag-analysis	mathematics
tag-pde	mathematics
tag-probability-statistics	mathematics
tag-probability-statistics	public-health
tag-scientific-computing	mathematics
tag-scientific-computing	ai-data-science
tag-dynamical-systems	mathematics
tag-dynamical-systems	physics
tag-dynamical-systems	biology
tag-condensed-matter	physics
tag-quantum-physics	physics
tag-atomic-molecular-physics	physics
tag-optics	physics
tag-laser-nanotechnology	physics
tag-laser-nanotechnology	materials
tag-catalysis-synthesis	chemistry
tag-chemical-biology-chem	chemistry
tag-chemical-biology-chem	chemical-biology
tag-materials-chemistry	chemistry
tag-materials-chemistry	materials
tag-theoretical-computational-chemistry	chemistry
tag-theoretical-computational-chemistry	molecular-energy-chemistry
tag-analytical-methods	chemistry
tag-artificial-photosynthesis	molecular-energy-chemistry
tag-solar-fuels	molecular-energy-chemistry
tag-electrocatalysis	molecular-energy-chemistry
tag-water-splitting	molecular-energy-chemistry
tag-co2-reduction	molecular-energy-chemistry
tag-structural-biology	biophysics-biochemistry
tag-cryo-em	biophysics-biochemistry
tag-protein-complexes	biophysics-biochemistry
tag-protein-modification	biophysics-biochemistry
tag-molecular-mechanisms	biophysics-biochemistry
tag-cell-cycle	cell-biology
tag-cell-migration	cell-biology
tag-organelles	cell-biology
tag-signal-transduction	cell-biology
tag-tumor-cells	cell-biology
tag-tumor-cells	oncology-therapy
tag-model-organisms	genetics-development
tag-stem-cells	genetics-development
tag-organ-development	genetics-development
tag-regeneration	genetics-development
tag-gene-regulation	genetics-development
tag-neural-coding	neuroscience
tag-neural-coding	biology
tag-neural-circuits	neuroscience
tag-behavioral-decision-making	neuroscience
tag-neuroimmunology	neuroscience
tag-neuroimmunology	immunology-microbiology
tag-brain-diseases	neuroscience
tag-brain-diseases	translational-medicine
tag-neurovascular	neuroscience
tag-infection-immunity	immunology-microbiology
tag-pathogen-host-interaction	immunology-microbiology
tag-tissue-immunity	immunology-microbiology
tag-vaccines	immunology-microbiology
tag-vaccines	microbiology-vaccines
tag-immunotherapy	immunology-microbiology
tag-immunotherapy	oncology-therapy
tag-synthetic-biology	systems-synthetic-biology
tag-biomanufacturing	systems-synthetic-biology
tag-gene-circuits	systems-synthetic-biology
tag-protein-engineering	systems-synthetic-biology
tag-small-molecule-probes	chemical-biology
tag-drug-design	chemical-biology
tag-drug-design	drug-discovery-public-health
tag-peptide-design	chemical-biology
tag-bioanalysis	chemical-biology
tag-natural-products	chemical-biology
tag-t-cell-differentiation	immunology-inflammation
tag-macrophages	immunology-inflammation
tag-immune-checkpoints	immunology-inflammation
tag-immune-checkpoints	oncology-therapy
tag-tissue-resident-immunity	immunology-inflammation
tag-autoimmunity	immunology-inflammation
tag-pathogenic-microbes	microbiology-vaccines
tag-viral-immunity	microbiology-vaccines
tag-universal-vaccines	microbiology-vaccines
tag-microbiome	microbiology-vaccines
tag-vaccine-design	microbiology-vaccines
tag-tumor-immunotherapy	oncology-therapy
tag-tumor-microenvironment	oncology-therapy
tag-tumor-drug-resistance	oncology-therapy
tag-radiotherapy-immunity	oncology-therapy
tag-cell-therapy	oncology-therapy
tag-glp-1	physiology-metabolism
tag-glp-1	translational-medicine
tag-metabolic-disease	physiology-metabolism
tag-obesity	physiology-metabolism
tag-lipid-metabolism	physiology-metabolism
tag-organ-crosstalk	physiology-metabolism
tag-gene-editing	medical-genetics-rare-disease
tag-gene-therapy	medical-genetics-rare-disease
tag-genetic-screening	medical-genetics-rare-disease
tag-rare-disease-models	medical-genetics-rare-disease
tag-mitochondrial-disease	medical-genetics-rare-disease
tag-cns-diseases	translational-medicine
tag-clinical-trials	translational-medicine
tag-biomarkers	translational-medicine
tag-patient-stratification	translational-medicine
tag-real-world-evidence	translational-medicine
tag-real-world-evidence	public-health
tag-drug-targets	drug-discovery-public-health
tag-drug-toxicology	drug-discovery-public-health
tag-epidemiology	drug-discovery-public-health
tag-epidemiology	public-health
tag-public-health	drug-discovery-public-health
tag-public-health	public-health
tag-drug-delivery	drug-discovery-public-health
tag-bio-statistics	public-health
tag-bio-statistics	biology
tag-bio-statistics	mathematics
tag-medical-imaging	clinical-medicine
tag-medical-imaging	biomedical-engineering
tag-medical-imaging	ai-data-science
\.


--
-- Data for Name: Topic; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Topic" (id, title, type, body, "paperTitle", "paperUrl", "authorId", "primaryDisciplineId", status, "viewCount", "createdAt", "updatedAt", "lastActivityAt") FROM stdin;
topic-random-matrix-deep-learning	随机矩阵理论能解释深度网络的泛化吗，还是只是事后语言？	IDEA	很多深度学习论文会用谱分布、Hessian、随机矩阵来解释训练稳定性和泛化。数学上这些工具很有力量，但真实网络结构、优化过程和数据分布都很复杂。想讨论哪些结论是真的可检验，哪些只是给经验现象换了一套语言。	\N	\N	user-math	mathematics	PUBLISHED	135	2026-06-06 11:31:02.54	2026-06-06 17:07:54.378	2026-06-06 11:31:02.54
topic-dynamical-systems-neurons	神经元群体活动的低维动力学，是机制还是可视化工具？	QUESTION	神经科学里常用低维流形、吸引子和动力系统描述群体神经活动。它们能把复杂数据画得很清楚，但我想知道：这些低维结构什么时候可以被当作机制，什么时候只是降维后的可视化结果？	\N	\N	user-math	mathematics	PUBLISHED	117	2026-06-06 11:31:02.546	2026-06-06 17:07:54.38	2026-06-06 11:31:02.546
cmp6qng480006tnjgr2iwppya	Mila最近的这个酶设计模型DISCO的泛化性怎么样？	PAPER	他们设计了能催化自然界不存在的卡宾反应的酶。就是不清楚在其它类型的酶促反应上性能如何	General Multimodal Protein Design Enables DNA-Encoding of Chemistry	https://arxiv.org/abs/2604.05181	cmp6qjhcb0000tnjgypowcnaj	computer-science	PUBLISHED	18	2026-05-15 09:52:09.561	2026-05-15 10:22:04.562	2026-05-15 09:56:34.767
topic-quantum-materials-defects	量子材料里的缺陷，是噪声来源还是可利用的自由度？	QUESTION	在凝聚态和量子材料研究里，缺陷常常被当作样品不完美的来源。但在某些体系中，缺陷态也可能带来局域磁性、发光中心或新的输运行为。想讨论：什么时候应该把缺陷消掉，什么时候应该把它当作可设计对象？	\N	\N	user-physics	physics	PUBLISHED	128	2026-06-06 11:31:02.548	2026-06-06 17:07:54.383	2026-06-06 11:31:02.548
cmp2s9eki0001tnug5cfbl52h	???????? topic	QUESTION	???? API ???,???? topic ??? PostgreSQL?	\N	\N	user-demo	computer-science	HIDDEN	32	2026-05-12 15:26:08.898	2026-06-02 13:42:52.17	2026-06-02 13:42:52.168
topic-pde-neural-operator	神经算子求解 PDE，什么时候比传统数值方法更值得用？	QUESTION	最近看到不少 neural operator、physics-informed learning 用来近似 PDE 解算子。它们在很多 benchmark 上很快，但传统有限元、谱方法也有成熟误差分析。想讨论：如果问题几何、边界条件或参数分布变化，神经算子的优势还在吗？	\N	\N	user-math	mathematics	PUBLISHED	122	2026-06-06 11:31:02.53	2026-06-06 17:07:54.373	2026-06-06 11:31:02.53
cmp2thbn00007tnugfpb8m3h3	a test	IDEA	no content here	\N	\N	user-demo	biology	HIDDEN	32	2026-05-12 16:00:17.965	2026-05-15 13:59:13.144	2026-05-13 14:37:28.635
cmp46ajuv0002tnz0uisu5npr	permission smoke topic 1778683602801	QUESTION	temp user owns this topic	\N	\N	cmp46aju00000tnz0jz3a3dod	computer-science	HIDDEN	0	2026-05-13 14:46:43.208	2026-05-13 14:46:43.615	2026-05-13 14:46:43.208
topic-moire-correlations	莫尔超晶格中的强关联现象，外领域读者该从哪儿进入？	QUESTION	莫尔材料里常出现超导、关联绝缘态和拓扑能带等现象。对非凝聚态方向的人来说，概念密度非常高。想请做物理的同学帮忙拆一下：如果只想理解这类论文的核心逻辑，最少需要先掌握哪些背景？	\N	\N	user-physics	physics	PUBLISHED	147	2026-06-06 11:31:02.554	2026-06-06 17:07:54.39	2026-06-06 11:31:02.554
cmp45ilr60001tnhwrz15g295	delete api smoke test	QUESTION	temporary topic for delete API validation	\N	\N	user-demo	computer-science	HIDDEN	3	2026-05-13 14:24:59.299	2026-05-13 14:25:00.416	2026-05-13 14:25:00.042
topic-artificial-photosynthesis-selectivity	人工光合作用里，选择性和效率哪个更应该先优化？	QUESTION	人工光合作用和太阳能燃料研究常同时追求高效率、高选择性和长期稳定性。但在 CO2 还原、水分解等体系里，这几个指标经常互相牵制。想讨论：早期催化剂设计到底应该先看选择性，还是先把总效率做上去？	\N	\N	user-energy-chem	molecular-energy-chemistry	PUBLISHED	138	2026-06-06 11:31:02.556	2026-06-06 17:07:54.393	2026-06-06 11:31:02.556
topic-ai-discussion	AI 导读真的能降低跨领域论文讨论门槛吗？	QUESTION	最近在想，很多博士生愿意了解别的方向，但卡在第一步：不知道背景、概念和核心争议。AI 如果能在 topic 顶部提供外行可读导读，是否能让更多人敢于参与讨论？想听听不同学科的体验。	\N	\N	user-demo	computer-science	PUBLISHED	128	2026-05-12 14:45:56.542	2026-06-06 17:07:54.332	2026-05-12 14:45:56.542
topic-materials-active-learning	主动学习能不能减少材料实验里的试错成本？	QUESTION	材料筛选实验成本很高，看到有人用 active learning 选择下一批实验样本。想请教做机器学习和材料的同学：这种方法在哪些场景下真的有效，什么时候只是把不确定性包装得很好看？	\N	\N	user-materials	materials	PUBLISHED	76	2026-05-12 14:45:56.55	2026-06-06 17:07:54.343	2026-05-12 14:45:56.55
topic-medical-imaging-bias	医学影像 AI 模型在跨医院数据上的失效该怎么讨论？	PAPER	一篇论文提到模型在训练医院表现很好，但换到另一个医院后性能明显下降。想从统计、机器学习和临床实践三个角度讨论：这是 dataset shift、标注差异，还是 workflow 差异？	External validation of medical imaging models	https://example.edu/papers/external-validation	user-med	clinical-medicine	PUBLISHED	177	2026-05-12 14:45:56.548	2026-06-06 17:07:54.34	2026-05-12 14:45:56.548
topic-neural-compression	神经系统里的压缩表征和机器学习的表示学习有多像？	IDEA	读到一篇关于感觉系统高效编码的综述，里面把神经活动看作对外界信息的压缩。我想知道这和机器学习中的 representation learning、信息瓶颈有没有可比之处，哪些类比是危险的？	Efficient coding and sensory representation	https://example.edu/papers/efficient-coding	user-bio	neuroscience	PUBLISHED	94	2026-05-12 14:45:56.547	2026-06-06 17:07:54.337	2026-05-12 14:45:56.547
topic-ultrafast-spectroscopy	超快光谱看到的相变过程，如何和静态结构表征对上？	PAPER	超快光谱能看到飞秒到皮秒尺度的电子和晶格响应，但材料结构表征往往是静态或较慢时间尺度。想讨论：当超快信号显示某种瞬态相变时，我们该如何确认它不是热效应、载流子动力学或仪器响应造成的假象？	\N	\N	user-physics	physics	PUBLISHED	101	2026-06-06 11:31:02.55	2026-06-06 17:07:54.385	2026-06-06 11:31:02.55
topic-optimal-transport-biology	最优传输用于单细胞轨迹推断，数学假设会不会太强？	QUESTION	单细胞数据分析里常用 optimal transport 推断细胞群体从一个状态到另一个状态的迁移。这个框架很优雅，但我不确定它对细胞数量守恒、代价函数和时间采样的假设是否符合真实发育过程。想听数学和生物方向的看法。	\N	\N	user-math	mathematics	PUBLISHED	98	2026-06-06 11:31:02.534	2026-06-06 17:07:54.375	2026-06-06 11:31:02.534
topic-quantum-sensing-biology	量子传感用于生物测量，优势究竟来自量子效应还是工程优化？	IDEA	量子传感常被用于高灵敏磁场、温度或微弱信号检测，也有人讨论它在生物体系中的应用。想问物理、生物和电子方向的同学：如果一个传感系统表现很好，我们怎么判断优势来自量子态本身，而不是样品制备、光学系统或信号处理优化？	\N	\N	user-physics	physics	PUBLISHED	90	2026-06-06 11:31:02.552	2026-06-06 17:08:58.653	2026-06-06 14:04:36.596
topic-co2-reduction-operando	CO2 还原催化剂的真实活性位点，原位表征能证明到什么程度？	PAPER	CO2 电还原论文里经常讨论催化剂在反应中重构，真正活性位点可能不是反应前看到的结构。原位/准原位表征能提供很多证据，但我想知道：什么组合证据足以支持一个活性位点判断，而不是只是相关性？	\N	\N	user-energy-chem	molecular-energy-chemistry	PUBLISHED	119	2026-06-06 11:31:02.558	2026-06-06 17:07:54.395	2026-06-06 11:31:02.558
topic-water-splitting-stability	水分解催化剂的稳定性测试，多少小时才算有说服力？	QUESTION	水分解和电催化论文里经常给出几十小时或上百小时稳定性测试。但如果未来要进入实际器件，这个时间尺度可能仍然很短。想请教做催化、材料和工程的同学：实验室论文中的稳定性证据应该怎样解读？	\N	\N	user-energy-chem	molecular-energy-chemistry	PUBLISHED	106	2026-06-06 11:31:02.56	2026-06-06 17:07:54.398	2026-06-06 11:31:02.56
topic-solar-fuels-systems	太阳能燃料体系的瓶颈，是催化剂本身还是系统耦合？	IDEA	很多太阳能燃料工作会分别优化吸光材料、催化剂和反应器，但完整系统中光吸收、电荷分离、传质和产物分离会相互影响。想讨论：如果单个组件指标已经不错，下一步最应该补的是哪类系统级评价？	\N	\N	user-energy-chem	molecular-energy-chemistry	PUBLISHED	94	2026-06-06 11:31:02.562	2026-06-06 17:07:54.401	2026-06-06 11:31:02.562
topic-dynamical-systems-biology	用动力系统语言理解细胞命运转换，会不会过度数学化？	IDEA	很多文章用 attractor landscape 描述细胞状态转换。这个比喻很有启发，但我不确定它在实验可验证层面能给出多少东西。想邀请数学、生物和物理方向的同学一起拆一下。	\N	\N	user-bio	biology	PUBLISHED	112	2026-05-12 14:45:56.551	2026-06-06 17:07:54.465	2026-05-12 14:45:56.551
topic-neuroimmune-brain-disease	神经免疫在脑疾病里是原因、结果，还是修复反应？	QUESTION	很多 CNS 疾病研究都会看到小胶质细胞、炎症因子和免疫通路变化。但这些变化可能是病因，也可能是神经损伤后的反应。想请教神经、免疫和医学方向的同学：怎么设计实验区分这几种解释？	\N	\N	user-neuro	neuroscience	PUBLISHED	126	2026-06-06 11:37:46.782	2026-06-06 17:07:54.416	2026-06-06 11:37:46.782
topic-behavioral-decision-models	动物行为决策模型，能不能跨物种比较？	IDEA	行为决策研究常用小鼠、果蝇或灵长类动物建立任务模型。模型越抽象越容易比较，但也越可能丢掉物种特异的生态背景。想讨论：跨物种比较时，应该保留哪些行为变量，哪些神经机制不应该强行类比？	\N	\N	user-neuro	neuroscience	PUBLISHED	83	2026-06-06 11:37:46.784	2026-06-06 17:07:54.419	2026-06-06 11:37:46.784
topic-neurovascular-coupling	神经血管耦合信号能代表神经活动本身吗？	PAPER	fMRI、光学成像和一些脑疾病研究都依赖神经血管耦合信号。但血流、代谢和神经放电之间不是一一对应关系。想讨论：在解释脑功能或病理变化时，哪些情况下可以信任血管信号，哪些情况下需要额外神经记录？	\N	\N	user-neuro	neuroscience	PUBLISHED	97	2026-06-06 11:37:46.786	2026-06-06 17:07:54.422	2026-06-06 11:37:46.786
topic-synthetic-biology-kill-switch	合成生物学里的安全开关，实验室有效就够了吗？	QUESTION	工程化微生物或细胞治疗系统常会设计 kill switch、营养依赖或环境响应开关。实验室环境下这些开关可能很好用，但真实环境有突变、选择压力和复杂生态位。想讨论：安全开关需要怎样验证，才足以进入更复杂场景？	\N	\N	user-synbio	systems-synthetic-biology	PUBLISHED	129	2026-06-06 11:37:46.787	2026-06-06 17:07:54.424	2026-06-06 11:37:46.787
topic-gene-circuits-noise	基因线路里的噪声，是设计缺陷还是可利用资源？	IDEA	合成基因线路常希望输出稳定、可控，但细胞内噪声不可避免。有些系统甚至利用噪声产生分化、记忆或群体层面的多样性。想问做系统生物学、数学和工程的同学：什么时候应该压低噪声，什么时候应该把噪声纳入设计？	\N	\N	user-synbio	systems-synthetic-biology	PUBLISHED	114	2026-06-06 11:37:46.79	2026-06-06 17:07:54.427	2026-06-06 11:37:46.79
topic-biomanufacturing-scaleup	生物制造从摇瓶到反应器，最容易失真的变量是什么？	QUESTION	很多生物制造路线在小规模培养里产量不错，但放大到反应器后会遇到氧传递、剪切力、代谢负担和污染控制等问题。想讨论：早期论文里的产量数据应该怎样解读，哪些变量最需要在放大前就被测出来？	\N	\N	user-synbio	systems-synthetic-biology	PUBLISHED	103	2026-06-06 11:37:46.791	2026-06-06 17:07:54.429	2026-06-06 11:37:46.791
topic-cryoem-conformational-heterogeneity	冷冻电镜里的构象异质性，是噪声还是生物机制？	QUESTION	很多膜蛋白和蛋白复合物的冷冻电镜数据里会看到多个构象状态。结构生物学上这很诱人，但也可能来自样品制备、分类算法或颗粒质量差异。想讨论：什么证据能支持这些构象状态真的对应功能循环，而不是数据处理出来的分类？	\N	\N	user-structural-bio	biophysics-biochemistry	PUBLISHED	131	2026-06-06 11:37:46.772	2026-06-06 17:07:54.403	2026-06-06 11:37:46.772
topic-membrane-protein-lipid-context	膜蛋白结构如果脱离脂质环境，还能解释真实功能吗？	QUESTION	很多膜蛋白结构是在去垢剂、纳米盘或人工体系中解析的，但真实细胞膜里的脂质组成、曲率和局部拥挤可能影响功能。想问做结构、生物物理和细胞方向的同学：什么时候体外结构足够解释机制，什么时候必须回到细胞环境？	\N	\N	user-structural-bio	biophysics-biochemistry	PUBLISHED	109	2026-06-06 11:37:46.775	2026-06-06 17:07:54.405	2026-06-06 11:37:46.775
topic-protein-modification-structure	蛋白质修饰改变结构，还是只是改变相互作用网络？	IDEA	磷酸化、乙酰化、泛素化等蛋白质修饰经常被说成调控蛋白功能。有些修饰可能直接改变构象，也有些只是改变蛋白之间的结合。想讨论：在解释一个修饰位点时，结构证据和细胞功能证据应该怎么配合？	\N	\N	user-structural-bio	biophysics-biochemistry	PUBLISHED	92	2026-06-06 11:37:46.776	2026-06-06 17:07:54.408	2026-06-06 11:37:46.776
topic-ai-protein-complex-design	AI 设计蛋白复合物，怎么证明它不是只会生成漂亮模型？	QUESTION	蛋白设计模型现在能生成很像真的复合物结构，也能给出很高的预测置信度。但真正有用的复合物要能表达、折叠、结合、稳定，还要有功能。想问做结构、生物化学和 AI 的同学：实验验证应该从哪几步开始？	\N	\N	user-structural-bio	biophysics-biochemistry	PUBLISHED	158	2026-06-06 11:37:46.778	2026-06-06 17:07:54.411	2026-06-06 11:37:46.778
topic-neural-circuit-causality	神经环路研究里，相关活动什么时候能算因果机制？	QUESTION	钙成像、电生理和行为实验可以记录大量神经元活动，但从相关活动到因果机制之间隔着很远。想讨论：如果某群神经元在行为前被激活，什么干预和对照能支持它们真的参与决策，而不是只是伴随变化？	\N	\N	user-neuro	neuroscience	PUBLISHED	144	2026-06-06 11:37:46.78	2026-06-06 17:07:54.414	2026-06-06 11:37:46.78
topic-computational-biology-perturbation	单细胞扰动预测模型，怎么证明它能指导真实实验？	QUESTION	计算生物学里越来越多模型想预测基因扰动、药物处理或组合干预后的细胞状态。问题是训练数据通常只覆盖少量扰动。想讨论：模型预测一个未测组合时，需要什么实验设计来判断它真的有指导价值？	\N	\N	user-synbio	systems-synthetic-biology	PUBLISHED	162	2026-06-06 11:38:35.454	2026-06-06 17:25:27.546	2026-06-06 17:10:35.139
cmp6zzhed0001tnn4ytzhcpfm	EVOKE 又挂了——我们是不是该重新审视"生物标志物改善 ≠ 临床获益"这件事？	PAPER	上周 Novo 公布的 EVOKE 和 EVOKE+ 顶线数据，两个 III 期试验，3800+ 患者，口服司美格鲁肽 vs 安慰剂在标准治疗之上加用。生物标志物（淀粉样、Tau、神经丝轻链 NfL 等）都改善了，但是临床终点（CDR-SB）没动。\n\n这已经是 GLP-1 在 AD 上第 N 次"机制看着对、流行病学数据看着诱人、最后 RCT 翻车"了。回顾性队列研究今年 7 月还在说 GLP-1 患者痴呆风险低 37%，结果一上 RCT 就原形毕露。我们是不是对回顾性数据太宽容了？\n而且EVOKE 在生物标志物上指标很好的。如果你只看那张图，你会觉得这是个 home run。但 CDR-SB 纹丝不动。这跟 Aduhelm 那套"清掉了 plaque 但患者没好转"的争议本质上是同一个问题。\n我们组里有人在做 GLP-1 类似物的 CNS 适应症拓展，老板的态度是"EVOKE 是剂量不够 / 入组太晚期 / 终点选错"。我私下觉得这是 cope。有没有可能 GLP-1 通路对 AD 进展的影响就是不够大，再调参也没用？\n\n想听听同行怎么看。\n统计 / 监管角度：以后是不是应该把"生物标志物有效但临床终点失败"也当作一种独立的失败模式来分析？\n机制角度：这件事对靶点验证范式意味着什么？\n行业角度：Novo 这一棒下去，后面跟进 GLP-1 神经退行性的那一堆 pipeline 是不是都要重新评估？	\N	\N	user-demo	translational-medicine	HIDDEN	12	2026-05-15 14:13:27.637	2026-05-15 14:15:20.654	2026-05-15 14:15:11.503
topic-glp1-cns-translation	GLP-1 类药物用于 CNS 疾病，证据链应该从哪里开始看？	QUESTION	GLP-1 类药物在代谢疾病之外被讨论到神经保护、炎症调控和认知相关疾病。可是从动物模型、机制假说到临床终点之间距离很大。想请教转化医学、神经和代谢方向的同学：判断这条路线是否值得推进时，最关键的证据是什么？	\N	\N	user-trans-med	translational-medicine	PUBLISHED	164	2026-06-06 11:48:22.878	2026-06-06 17:07:54.434	2026-06-06 11:48:22.878
topic-drug-target-validation	一个药物靶点从机制上成立，到值得做药还差几步？	QUESTION	基础研究里经常发现某个通路或蛋白和疾病相关，但药物研发需要考虑靶点可成药性、疾病相关性、动物模型、毒性和患者选择。想讨论：看到一个新靶点时，怎么判断它只是机制有趣，还是有转化价值？	\N	\N	user-trans-med	translational-medicine	PUBLISHED	149	2026-06-06 11:48:22.885	2026-06-06 17:07:54.443	2026-06-06 11:48:22.885
topic-biomarkers-patient-stratification	转化医学里的 biomarker，什么时候能真正用于患者分层？	QUESTION	很多疾病机制研究都会提出 biomarker，但从发现一个指标到用它做患者分层，中间需要可靠检测、机制相关性、预测价值和临床可解释性。想讨论：一个 biomarker 要进入临床试验设计，至少需要哪些证据？	\N	\N	user-trans-med	translational-medicine	PUBLISHED	137	2026-06-06 11:48:22.881	2026-06-06 17:07:54.437	2026-06-06 11:48:22.881
topic-cell-therapy-solid-tumor	细胞治疗进入实体瘤，最大的障碍是靶点还是微环境？	QUESTION	CAR-T 等细胞治疗在血液肿瘤中效果显著，但实体瘤里常遇到靶点异质性、浸润困难、免疫抑制和毒性风险。想讨论：如果要优先解决一个瓶颈，应该是寻找更好的靶点，还是改造细胞让它适应肿瘤微环境？	\N	\N	user-oncology	oncology-therapy	PUBLISHED	152	2026-06-06 11:48:22.899	2026-06-06 17:07:54.46	2026-06-06 11:57:23.141
topic-real-world-evidence-trials	真实世界研究能补临床试验的哪些盲区？	IDEA	随机对照试验能提供高质量证据，但入组标准严格，真实患者常常更复杂。真实世界数据可以观察长期疗效和安全性，但混杂因素很多。想讨论：在药物或医疗 AI 转化中，真实世界研究最适合回答哪些问题？	\N	\N	user-trans-med	translational-medicine	PUBLISHED	121	2026-06-06 11:48:22.883	2026-06-06 17:07:54.44	2026-06-06 11:48:22.883
topic-tcell-inflammation-memory	T 细胞分化里的记忆状态，能否解释慢性炎症反复发作？	QUESTION	慢性炎症疾病常常反复发作，T 细胞亚群和组织驻留免疫被认为可能参与维持病灶。想讨论：如果要证明某类 T 细胞记忆状态是疾病复发的关键，而不是炎症后的残留，需要哪些时间序列和干预证据？	\N	\N	user-immunology	immunology-inflammation	PUBLISHED	132	2026-06-06 11:48:22.887	2026-06-06 17:07:54.445	2026-06-06 11:48:22.887
topic-macrophage-plasticity	巨噬细胞极化这个说法，会不会把真实状态过度简化？	IDEA	很多文章用 M1/M2 或促炎/抗炎来描述巨噬细胞状态，但单细胞和空间组学显示状态远比二分法复杂。想问免疫、肿瘤和组织修复方向的同学：在讨论疾病机制时，巨噬细胞状态应该怎样命名和验证？	\N	\N	user-immunology	immunology-inflammation	PUBLISHED	118	2026-06-06 11:48:22.889	2026-06-06 17:07:54.448	2026-06-06 11:48:22.889
topic-immune-checkpoint-autoimmunity	免疫检查点调控为什么会在抗肿瘤和自身免疫之间摇摆？	QUESTION	免疫检查点抑制剂能增强抗肿瘤免疫，但也可能带来自身免疫样副作用。想讨论：同一个免疫通路为什么既能帮助清除肿瘤，又可能破坏组织稳态？有没有办法用患者分层或 biomarker 预测这种风险？	\N	\N	user-immunology	immunology-inflammation	PUBLISHED	156	2026-06-06 11:48:22.891	2026-06-06 17:07:54.45	2026-06-06 11:48:22.891
topic-tissue-resident-immunity	组织驻留免疫细胞，是局部防线还是慢病风险？	QUESTION	组织驻留免疫细胞能快速应对感染和损伤，但长期存在的局部免疫记忆也可能参与慢性炎症。想讨论：在皮肤、肠道、肺或脑等组织中，如何判断驻留免疫细胞是在保护组织，还是在维持病理状态？	\N	\N	user-immunology	immunology-inflammation	PUBLISHED	104	2026-06-06 11:48:22.893	2026-06-06 17:07:54.453	2026-06-06 11:48:22.893
topic-tumor-microenvironment-resistance	肿瘤微环境导致耐药，怎么区分是机制还是结果？	QUESTION	肿瘤耐药常被归因于肿瘤微环境，包括免疫抑制、缺氧、基质屏障和代谢重编程。但治疗后微环境变化也可能只是耐药细胞扩增后的结果。想讨论：什么实验能区分微环境是耐药原因，还是耐药后的伴随变化？	\N	\N	user-oncology	oncology-therapy	PUBLISHED	143	2026-06-06 11:48:22.895	2026-06-06 17:07:54.456	2026-06-06 11:59:27.242
topic-radiotherapy-immunity-abscopal	放疗诱导免疫反应，什么时候可能产生远隔效应？	PAPER	放疗除了杀伤局部肿瘤细胞，也可能释放抗原、改变免疫微环境，甚至与免疫治疗联用产生远隔效应。但这种现象并不稳定。想讨论：剂量、分割方式、肿瘤类型和免疫状态中，哪些因素最可能决定是否出现系统性免疫反应？	\N	\N	user-oncology	oncology-therapy	PUBLISHED	111	2026-06-06 11:48:22.897	2026-06-06 17:07:54.458	2026-06-06 11:58:53.48
topic-tumor-organoids-drug-response	肿瘤类器官预测药物反应，离个体化治疗还有多远？	IDEA	肿瘤类器官可以保留部分患者肿瘤特征，并用于药物敏感性测试。但培养时间、样本代表性、微环境缺失和临床决策窗口都会限制应用。想讨论：它最适合用于机制研究、药物筛选，还是已经能进入个体化治疗决策？	\N	\N	user-oncology	oncology-therapy	PUBLISHED	96	2026-06-06 11:48:22.901	2026-06-06 17:07:54.463	2026-06-06 11:58:20.364
cmpvbk45m0001tncc85uboy2p	test_AI_summary_streaming_display	QUESTION	Evolution is an extraordinary engine for enzymatic diversity, yet the chemistry it\nhas explored remains a narrow slice of what DNA can encode. Deep generative models can\ndesign new proteins that bind ligands, but none have created enzymes without pre-specifying\ncatalytic residues. We introduce DISCO, a multimodal model that co-designs protein sequence\nand 3D structure around arbitrary biomolecules, as well as inference-time scaling methods that\noptimize objectives across both modalities. Conditioned solely on reactive intermediates, DISCOdesigns diverse heme enzymes with novel active-site geometries. These enzymes catalyze newto-nature carbene-transfer reactions, including alkene cyclopropanation, spirocyclopropanation,\nB–H, and C(sp3)–H insertions, with high activities exceeding those of engineered enzymes.\nRandom mutagenesis of a selected design further confirmed that enzyme activity can be improved\nthrough directed evolution. By providing a scalable route to evolvable enzymes, DISCO broadens\nthe potential scope of genetically encodable transformations.	\N	\N	user-demo	computer-science	PUBLISHED	7	2026-06-01 14:43:54.25	2026-06-03 08:22:48.284	2026-06-01 14:43:54.25
cmpvb8r6u0005tn3shznwbtd6	test_AI_summary_sync_function	PAPER	Evolution is an extraordinary engine for enzymatic diversity, yet the chemistry it\nhas explored remains a narrow slice of what DNA can encode. Deep generative models can\ndesign new proteins that bind ligands, but none have created enzymes without pre-specifying\ncatalytic residues. We introduce DISCO, a multimodal model that co-designs protein sequence\nand 3D structure around arbitrary biomolecules, as well as inference-time scaling methods that\noptimize objectives across both modalities. Conditioned solely on reactive intermediates, DISCOdesigns diverse heme enzymes with novel active-site geometries. These enzymes catalyze newto-nature carbene-transfer reactions, including alkene cyclopropanation, spirocyclopropanation,\nB–H, and C(sp3)–H insertions, with high activities exceeding those of engineered enzymes.\nRandom mutagenesis of a selected design further confirmed that enzyme activity can be improved\nthrough directed evolution. By providing a scalable route to evolvable enzymes, DISCO broadens\nthe potential scope of genetically encodable transformations.	DISCO	https://arxiv.org/pdf/2604.05181#page=17.09	user-demo	computer-science	HIDDEN	5	2026-06-01 14:35:04.23	2026-06-01 14:43:00	2026-06-01 14:35:04.23
cmp704crb000btnn4958x2tgb	EVOKE 又挂了——我们是不是该重新审视"生物标志物改善 ≠ 临床获益"这件事？	QUESTION	看到上周 Novo 公布的 EVOKE 和 EVOKE+ 顶线数据，两个 III 期试验，3800+ 患者，口服司美格鲁肽 vs 安慰剂在标准治疗之上加用。生物标志物（淀粉样、Tau、神经丝轻链 NfL 等）都改善了，临床终点（CDR-SB）没动。\n其实这已经是 GLP-1 在 AD 上第 N 次"机制看着对、流行病学数据看着诱人、最后 RCT 翻车"了。回顾性队列研究今年 7 月还在说 GLP-1 患者痴呆风险低 37%，结果一上 RCT 就原形毕露。我们是不是对回顾性数据太宽容了？\n而且EVOKE 在生物标志物上表现很好。如果你只看那张图，你会觉得这是个 home run。但 CDR-SB 纹丝不动。这跟 Aduhelm 那套"清掉了 plaque 但患者没好转"的争议本质上是同一个问题。\n我们组里有人在做 GLP-1 类似物的 CNS 适应症拓展，老板的态度是"EVOKE 是剂量不够 / 入组太晚期 / 终点选错"。我私下觉得这是 cope。有没有可能 GLP-1 通路对 AD 进展的影响就是不够大，再调参也没用？\n\n想听听同行怎么看。\n统计 / 监管角度：以后是不是应该把"生物标志物有效但临床终点失败"也当作一种独立的失败模式来分析？\n机制角度：这件事对靶点验证范式意味着什么？\n行业角度：Novo 这一棒下去，后面跟进 GLP-1 神经退行性的那一堆 pipeline 是不是都要重新评估？	\N	\N	cmp702t5x0009tnn45hgeuoxs	translational-medicine	PUBLISHED	80	2026-05-15 14:17:14.903	2026-06-06 10:44:06.963	2026-06-03 07:21:17.751
topic-bci-chip-bottleneck	脑机接口芯片的信号处理瓶颈是在电极、算法还是系统封装？	QUESTION	脑机接口智能芯片系统涉及神经信号采集、低噪声电路、片上处理、无线通信和长期植入安全性。想请教电子、神经和医学方向的同学：如果一个系统解码效果不好，我们怎么判断问题主要来自电极质量、算法建模，还是封装和生物环境？	\N	\N	user-electronic	electronic-info	PUBLISHED	133	2026-06-06 11:17:33.531	2026-06-06 17:07:54.366	2026-06-06 11:17:33.531
topic-terahertz-photonic-sensing	太赫兹/光子器件做传感，怎么判断它比传统方案真的有优势？	IDEA	太赫兹光子学、计算成像和智能传感都能提供新的检测方式，但很多应用场景已经有成熟的电学、光学或化学传感方案。想讨论：在什么指标上赢，才算这种新器件路线真的值得推进？灵敏度、选择性、速度、成本还是可部署性？	\N	\N	user-electronic	electronic-info	PUBLISHED	73	2026-06-06 11:17:33.533	2026-06-06 17:07:54.368	2026-06-06 11:17:33.533
topic-flexible-electronics-health	柔性电子用于健康监测，实验室 demo 到长期佩戴差在哪？	QUESTION	柔性电子和生物电子很适合做可穿戴健康监测，但 demo 里的短时信号往往不能代表长期使用。皮肤贴附、汗液、运动伪影、功耗和数据解释都会影响实际效果。想问做电子、材料和医学的同学：长期佩戴最容易被低估的问题是什么？	\N	\N	user-electronic	electronic-info	PUBLISHED	91	2026-06-06 11:17:33.535	2026-06-06 17:07:54.37	2026-06-06 11:17:33.535
topic-ai-physical-simulation	物理仿真里的生成模型，能不能替代一部分数值求解？	QUESTION	看到 AI for Science 方向里很多工作在用 diffusion、flow matching 或 surrogate model 加速复杂物理系统仿真。想讨论一个边界问题：如果生成模型能很快给出看似合理的流场或等离子体状态，它到底是在替代求解器，还是只适合做候选筛选和初值生成？	\N	\N	user-ai-eng	ai-data-science	PUBLISHED	142	2026-06-06 11:17:33.511	2026-06-06 17:07:54.345	2026-06-06 11:17:33.511
topic-embodied-data-loop	具身智能的数据闭环该怎么评估：仿真成功算不算成功？	QUESTION	具身智能和自动驾驶都很依赖场景构建、数据闭环和世界模型。可是很多系统在仿真里表现不错，一到真实环境就掉得很厉害。想问做机器人、控制、计算机视觉的同学：我们该怎么设计一个不只看 benchmark 分数的评估方式？	\N	\N	user-ai-eng	ai-data-science	PUBLISHED	118	2026-06-06 11:17:33.517	2026-06-06 17:07:54.348	2026-06-06 11:17:33.517
topic-protein-language-models	蛋白质语言模型到底学到了结构规律，还是数据库偏差？	QUESTION	现在蛋白质语言模型可以做结构预测、突变效应估计和序列生成。直觉上它像是学到了生物分子的语法，但训练数据又高度依赖已知序列库。想请教做 AI、生物信息和蛋白工程的同学：怎么判断模型学到的是可迁移规律，而不是数据库里的家族偏差？	\N	\N	user-ai-eng	ai-data-science	PUBLISHED	165	2026-06-06 11:17:33.519	2026-06-06 17:07:54.351	2026-06-06 11:17:33.519
topic-medical-ai-validation	医学影像大模型做跨院泛化，最应该先卡哪一道验证？	PAPER	智能生物医学电子和医学 AI 都在推动影像模型进入临床流程，但跨医院验证经常是最大阻力。除了 AUC、Dice 这类指标，我更想知道：不同设备、扫描协议、标注习惯和病例结构变化时，模型应该先通过哪种验证，才值得继续往临床协作推进？	\N	\N	user-ai-eng	ai-data-science	PUBLISHED	151	2026-06-06 11:17:33.521	2026-06-06 17:07:54.353	2026-06-06 11:17:33.521
topic-solid-state-interfaces	固态离子材料做能源器件，界面问题是不是比体相更关键？	QUESTION	固态离子材料常被放在电池、能源和信息器件语境里讨论。很多性能瓶颈看起来不像来自材料体相本身，而是在电极/电解质界面、缺陷和局域化学环境。想问材料、电化学和表征方向的同学：什么证据能说明界面才是主要限制？	\N	\N	user-materials	materials	PUBLISHED	104	2026-06-06 11:17:33.523	2026-06-06 17:07:54.356	2026-06-06 11:17:33.523
topic-nanophotonic-materials	纳米光子材料从漂亮谱图到器件应用，中间最难跨哪一步？	IDEA	纳米光子材料可以在 AR/VR、量子信息和健康传感里讲出很多应用前景，但论文里的光谱、显微表征和真实器件之间常有很长距离。想讨论：限制转化的主要是材料稳定性、加工一致性、集成工艺，还是应用场景本身不够明确？	\N	\N	user-materials	materials	PUBLISHED	96	2026-06-06 11:17:33.525	2026-06-06 17:07:54.358	2026-06-06 11:17:33.525
topic-biomaterials-immunity	可降解医用材料的免疫反应，应该怎样和力学性能一起讨论？	QUESTION	医用材料经常需要同时满足力学支撑、可降解性、生物相容性和免疫调控。可是材料论文里这些指标常被分开评价。想问做材料、免疫和组织工程的同学：如果一个材料力学性能很好，但诱导了不理想的局部免疫反应，应该怎么权衡？	\N	\N	user-materials	materials	PUBLISHED	87	2026-06-06 11:17:33.527	2026-06-06 17:07:54.36	2026-06-06 11:17:33.527
topic-optoelectronic-fabrication	微纳光电芯片里，器件性能和可制造性哪个应该先被优化？	QUESTION	微纳光电系统集成听起来同时依赖材料、器件设计、加工和封装。很多概念验证器件性能很高，但工艺窗口窄、良率低。想讨论：做早期研究时应该先追求极限性能，还是更早把可制造性和系统集成放进评价标准？	\N	\N	user-electronic	electronic-info	PUBLISHED	111	2026-06-06 11:17:33.529	2026-06-06 17:07:54.363	2026-06-06 11:17:33.529
\.


--
-- Data for Name: TopicDiscipline; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TopicDiscipline" ("topicId", "disciplineId") FROM stdin;
cmp2s9eki0001tnug5cfbl52h	computer-science
cmp6qng480006tnjgr2iwppya	computer-science
cmp2thbn00007tnugfpb8m3h3	biology
cmp46ajuv0002tnz0uisu5npr	computer-science
cmp45ilr60001tnhwrz15g295	computer-science
cmp6zzhed0001tnn4ytzhcpfm	translational-medicine
cmp704crb000btnn4958x2tgb	translational-medicine
cmpvb8r6u0005tn3shznwbtd6	computer-science
cmpvb8r6u0005tn3shznwbtd6	cmpvb8r6o0001tn3sb1vtiawx
cmpvbk45m0001tncc85uboy2p	computer-science
cmpvbk45m0001tncc85uboy2p	biology
topic-ai-discussion	computer-science
topic-neural-compression	neuroscience
topic-neural-compression	computer-science
topic-medical-imaging-bias	clinical-medicine
topic-medical-imaging-bias	public-health
topic-medical-imaging-bias	computer-science
topic-materials-active-learning	materials
topic-ai-physical-simulation	ai-data-science
topic-embodied-data-loop	ai-data-science
topic-protein-language-models	ai-data-science
topic-medical-ai-validation	ai-data-science
topic-solid-state-interfaces	materials
topic-nanophotonic-materials	materials
topic-biomaterials-immunity	materials
topic-optoelectronic-fabrication	electronic-info
topic-bci-chip-bottleneck	electronic-info
topic-terahertz-photonic-sensing	electronic-info
topic-flexible-electronics-health	electronic-info
topic-pde-neural-operator	mathematics
topic-pde-neural-operator	ai-data-science
topic-optimal-transport-biology	mathematics
topic-optimal-transport-biology	cell-biology
topic-optimal-transport-biology	genetics-development
topic-random-matrix-deep-learning	mathematics
topic-random-matrix-deep-learning	ai-data-science
topic-dynamical-systems-neurons	mathematics
topic-dynamical-systems-neurons	neuroscience
topic-quantum-materials-defects	physics
topic-quantum-materials-defects	materials
topic-ultrafast-spectroscopy	physics
topic-ultrafast-spectroscopy	materials
topic-ultrafast-spectroscopy	chemistry
topic-quantum-sensing-biology	physics
topic-quantum-sensing-biology	electronic-info
topic-quantum-sensing-biology	biology
topic-moire-correlations	physics
topic-moire-correlations	materials
topic-artificial-photosynthesis-selectivity	molecular-energy-chemistry
topic-artificial-photosynthesis-selectivity	chemistry
topic-co2-reduction-operando	molecular-energy-chemistry
topic-co2-reduction-operando	materials
topic-water-splitting-stability	molecular-energy-chemistry
topic-water-splitting-stability	materials
topic-solar-fuels-systems	molecular-energy-chemistry
topic-solar-fuels-systems	sustainable-environment-engineering
topic-cryoem-conformational-heterogeneity	biophysics-biochemistry
topic-cryoem-conformational-heterogeneity	ai-data-science
topic-membrane-protein-lipid-context	biophysics-biochemistry
topic-membrane-protein-lipid-context	cell-biology
topic-protein-modification-structure	biophysics-biochemistry
topic-protein-modification-structure	cell-biology
topic-ai-protein-complex-design	biophysics-biochemistry
topic-ai-protein-complex-design	ai-data-science
topic-ai-protein-complex-design	systems-synthetic-biology
topic-neural-circuit-causality	neuroscience
topic-neural-circuit-causality	mathematics
topic-neuroimmune-brain-disease	neuroscience
topic-neuroimmune-brain-disease	immunology-microbiology
topic-neuroimmune-brain-disease	translational-medicine
topic-behavioral-decision-models	neuroscience
topic-behavioral-decision-models	biology
topic-neurovascular-coupling	neuroscience
topic-neurovascular-coupling	clinical-medicine
topic-synthetic-biology-kill-switch	systems-synthetic-biology
topic-synthetic-biology-kill-switch	immunology-microbiology
topic-gene-circuits-noise	systems-synthetic-biology
topic-gene-circuits-noise	mathematics
topic-biomanufacturing-scaleup	systems-synthetic-biology
topic-biomanufacturing-scaleup	chemical-biological-engineering
topic-computational-biology-perturbation	systems-synthetic-biology
topic-computational-biology-perturbation	ai-data-science
topic-computational-biology-perturbation	cell-biology
topic-glp1-cns-translation	translational-medicine
topic-glp1-cns-translation	physiology-metabolism
topic-glp1-cns-translation	neuroscience
topic-biomarkers-patient-stratification	translational-medicine
topic-biomarkers-patient-stratification	clinical-medicine
topic-biomarkers-patient-stratification	public-health
topic-real-world-evidence-trials	translational-medicine
topic-real-world-evidence-trials	public-health
topic-drug-target-validation	translational-medicine
topic-drug-target-validation	drug-discovery-public-health
topic-drug-target-validation	chemical-biology
topic-tcell-inflammation-memory	immunology-inflammation
topic-tcell-inflammation-memory	immunology-microbiology
topic-macrophage-plasticity	immunology-inflammation
topic-macrophage-plasticity	oncology-therapy
topic-immune-checkpoint-autoimmunity	immunology-inflammation
topic-immune-checkpoint-autoimmunity	oncology-therapy
topic-immune-checkpoint-autoimmunity	translational-medicine
topic-tissue-resident-immunity	immunology-inflammation
topic-tissue-resident-immunity	immunology-microbiology
topic-tumor-microenvironment-resistance	oncology-therapy
topic-tumor-microenvironment-resistance	immunology-inflammation
topic-radiotherapy-immunity-abscopal	oncology-therapy
topic-radiotherapy-immunity-abscopal	immunology-inflammation
topic-radiotherapy-immunity-abscopal	clinical-medicine
topic-cell-therapy-solid-tumor	oncology-therapy
topic-cell-therapy-solid-tumor	translational-medicine
topic-tumor-organoids-drug-response	oncology-therapy
topic-tumor-organoids-drug-response	clinical-medicine
topic-dynamical-systems-biology	biology
topic-dynamical-systems-biology	mathematics
\.


--
-- Data for Name: TopicTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TopicTag" ("topicId", "tagId") FROM stdin;
topic-ai-discussion	tag-human-ai
topic-ai-discussion	tag-ml
topic-neural-compression	tag-neural-coding
topic-neural-compression	tag-ml
topic-medical-imaging-bias	tag-medical-imaging
topic-medical-imaging-bias	tag-bio-statistics
topic-medical-imaging-bias	tag-ml
topic-materials-active-learning	tag-materials-screening
topic-materials-active-learning	tag-computational-materials
topic-materials-active-learning	tag-ml
topic-ai-physical-simulation	tag-ai-science
cmp2s9eki0001tnug5cfbl52h	tag-human-ai
cmp2thbn00007tnugfpb8m3h3	tag-bio-statistics
cmp2thbn00007tnugfpb8m3h3	tag-neural-coding
cmp45ilr60001tnhwrz15g295	tag-human-ai
cmp46ajuv0002tnz0uisu5npr	tag-human-ai
cmp6qng480006tnjgr2iwppya	cmp6qng470004tnjgecugmvqo
cmp6qng480006tnjgr2iwppya	cmp6qng450002tnjg99prnd2o
topic-ai-physical-simulation	tag-generative-models
topic-ai-physical-simulation	tag-scientific-computing
topic-embodied-data-loop	tag-embodied-intelligence
topic-embodied-data-loop	tag-autonomous-systems
topic-embodied-data-loop	tag-robot-learning
topic-embodied-data-loop	tag-multimodal-models
topic-protein-language-models	tag-protein-language-models
topic-protein-language-models	tag-computational-biology
topic-protein-language-models	tag-protein-engineering
topic-protein-language-models	tag-ai-science
topic-medical-ai-validation	tag-medical-ai
topic-medical-ai-validation	tag-medical-imaging
topic-medical-ai-validation	tag-bio-statistics
topic-solid-state-interfaces	tag-energy-materials
topic-solid-state-interfaces	tag-materials-characterization
topic-solid-state-interfaces	tag-materials-chemistry
topic-nanophotonic-materials	tag-nanomaterials
topic-nanophotonic-materials	tag-materials-characterization
topic-nanophotonic-materials	tag-micro-nano-optoelectronics
topic-nanophotonic-materials	tag-optics
topic-biomaterials-immunity	tag-biomaterials
topic-biomaterials-immunity	tag-medical-materials
topic-biomaterials-immunity	tag-tissue-immunity
topic-biomaterials-immunity	tag-materials-characterization
topic-optoelectronic-fabrication	tag-micro-nano-optoelectronics
topic-optoelectronic-fabrication	tag-integrated-circuits
topic-optoelectronic-fabrication	tag-semiconductor-devices
topic-bci-chip-bottleneck	tag-brain-computer-chips
topic-bci-chip-bottleneck	tag-bioelectronics
topic-bci-chip-bottleneck	tag-intelligent-sensing
topic-bci-chip-bottleneck	tag-neural-coding
topic-terahertz-photonic-sensing	tag-intelligent-sensing
topic-terahertz-photonic-sensing	tag-micro-nano-optoelectronics
cmp6zzhed0001tnn4ytzhcpfm	tag-cns-diseases
cmp6zzhed0001tnn4ytzhcpfm	tag-glp-1
cmp704crb000btnn4958x2tgb	tag-cns-diseases
cmp704crb000btnn4958x2tgb	tag-glp-1
cmpvb8r6u0005tn3shznwbtd6	cmpvb8r6r0003tn3skktguetu
cmpvb8r6u0005tn3shznwbtd6	cmp6qng450002tnjg99prnd2o
cmpvb8r6u0005tn3shznwbtd6	cmp6qng470004tnjgecugmvqo
cmpvbk45m0001tncc85uboy2p	tag-bio-statistics
cmpvbk45m0001tncc85uboy2p	cmp6qng470004tnjgecugmvqo
topic-terahertz-photonic-sensing	tag-optics
topic-flexible-electronics-health	tag-bioelectronics
topic-flexible-electronics-health	tag-smart-healthcare-systems
topic-flexible-electronics-health	tag-intelligent-sensing
topic-flexible-electronics-health	tag-semiconductor-devices
topic-pde-neural-operator	tag-pde
topic-pde-neural-operator	tag-scientific-computing
topic-pde-neural-operator	tag-ml
topic-optimal-transport-biology	tag-analysis
topic-optimal-transport-biology	tag-probability-statistics
topic-optimal-transport-biology	tag-cell-cycle
topic-optimal-transport-biology	tag-gene-regulation
topic-random-matrix-deep-learning	tag-probability-statistics
topic-random-matrix-deep-learning	tag-ml
topic-random-matrix-deep-learning	tag-analysis
topic-dynamical-systems-neurons	tag-dynamical-systems
topic-dynamical-systems-neurons	tag-neural-coding
topic-dynamical-systems-neurons	tag-neural-circuits
topic-quantum-materials-defects	tag-condensed-matter
topic-quantum-materials-defects	tag-quantum-physics
topic-quantum-materials-defects	tag-materials-characterization
topic-ultrafast-spectroscopy	tag-optics
topic-ultrafast-spectroscopy	tag-condensed-matter
topic-ultrafast-spectroscopy	tag-materials-characterization
topic-ultrafast-spectroscopy	tag-analytical-methods
topic-quantum-sensing-biology	tag-quantum-physics
topic-quantum-sensing-biology	tag-intelligent-sensing
topic-quantum-sensing-biology	tag-bioanalysis
topic-moire-correlations	tag-condensed-matter
topic-moire-correlations	tag-quantum-physics
topic-moire-correlations	tag-nanomaterials
topic-artificial-photosynthesis-selectivity	tag-artificial-photosynthesis
topic-artificial-photosynthesis-selectivity	tag-solar-fuels
topic-artificial-photosynthesis-selectivity	tag-co2-reduction
topic-artificial-photosynthesis-selectivity	tag-electrocatalysis
topic-co2-reduction-operando	tag-co2-reduction
topic-co2-reduction-operando	tag-electrocatalysis
topic-co2-reduction-operando	tag-materials-characterization
topic-co2-reduction-operando	tag-catalysis-synthesis
topic-water-splitting-stability	tag-water-splitting
topic-water-splitting-stability	tag-electrocatalysis
topic-water-splitting-stability	tag-energy-materials
topic-solar-fuels-systems	tag-solar-fuels
topic-solar-fuels-systems	tag-artificial-photosynthesis
topic-solar-fuels-systems	tag-green-chemical-engineering
topic-solar-fuels-systems	tag-co2-conversion
topic-cryoem-conformational-heterogeneity	tag-cryo-em
topic-cryoem-conformational-heterogeneity	tag-protein-complexes
topic-cryoem-conformational-heterogeneity	tag-molecular-mechanisms
topic-cryoem-conformational-heterogeneity	tag-ml
topic-membrane-protein-lipid-context	tag-structural-biology
topic-membrane-protein-lipid-context	tag-protein-complexes
topic-membrane-protein-lipid-context	tag-organelles
topic-membrane-protein-lipid-context	tag-molecular-mechanisms
topic-protein-modification-structure	tag-protein-modification
topic-protein-modification-structure	tag-signal-transduction
topic-protein-modification-structure	tag-molecular-mechanisms
topic-ai-protein-complex-design	tag-protein-complexes
topic-ai-protein-complex-design	tag-protein-engineering
topic-ai-protein-complex-design	tag-protein-language-models
topic-ai-protein-complex-design	tag-ai-science
topic-neural-circuit-causality	tag-neural-circuits
topic-neural-circuit-causality	tag-behavioral-decision-making
topic-neural-circuit-causality	tag-neural-coding
topic-neural-circuit-causality	tag-dynamical-systems
topic-neuroimmune-brain-disease	tag-neuroimmunology
topic-neuroimmune-brain-disease	tag-brain-diseases
topic-neuroimmune-brain-disease	tag-tissue-immunity
topic-neuroimmune-brain-disease	tag-cns-diseases
topic-behavioral-decision-models	tag-behavioral-decision-making
topic-behavioral-decision-models	tag-model-organisms
topic-behavioral-decision-models	tag-neural-circuits
topic-neurovascular-coupling	tag-neurovascular
topic-neurovascular-coupling	tag-neural-coding
topic-neurovascular-coupling	tag-medical-imaging
topic-synthetic-biology-kill-switch	tag-synthetic-biology
topic-synthetic-biology-kill-switch	tag-gene-circuits
topic-synthetic-biology-kill-switch	tag-pathogen-host-interaction
topic-synthetic-biology-kill-switch	tag-biomanufacturing
topic-gene-circuits-noise	tag-gene-circuits
topic-gene-circuits-noise	tag-synthetic-biology
topic-gene-circuits-noise	tag-dynamical-systems
topic-gene-circuits-noise	tag-gene-regulation
topic-biomanufacturing-scaleup	tag-biomanufacturing
topic-biomanufacturing-scaleup	tag-low-carbon-biosynthesis
topic-biomanufacturing-scaleup	tag-synthetic-biology
topic-biomanufacturing-scaleup	tag-green-chemical-engineering
topic-computational-biology-perturbation	tag-computational-biology
topic-computational-biology-perturbation	tag-bioinformatics-ai
topic-computational-biology-perturbation	tag-gene-regulation
topic-computational-biology-perturbation	tag-cell-cycle
topic-glp1-cns-translation	tag-glp-1
topic-glp1-cns-translation	tag-cns-diseases
topic-glp1-cns-translation	tag-biomarkers
topic-glp1-cns-translation	tag-clinical-trials
topic-biomarkers-patient-stratification	tag-biomarkers
topic-biomarkers-patient-stratification	tag-patient-stratification
topic-biomarkers-patient-stratification	tag-clinical-trials
topic-biomarkers-patient-stratification	tag-real-world-evidence
topic-real-world-evidence-trials	tag-real-world-evidence
topic-real-world-evidence-trials	tag-clinical-trials
topic-real-world-evidence-trials	tag-bio-statistics
topic-real-world-evidence-trials	tag-public-health
topic-drug-target-validation	tag-drug-targets
topic-drug-target-validation	tag-drug-design
topic-drug-target-validation	tag-drug-toxicology
topic-drug-target-validation	tag-biomarkers
topic-tcell-inflammation-memory	tag-t-cell-differentiation
topic-tcell-inflammation-memory	tag-tissue-resident-immunity
topic-tcell-inflammation-memory	tag-autoimmunity
topic-tcell-inflammation-memory	tag-tissue-immunity
topic-macrophage-plasticity	tag-macrophages
topic-macrophage-plasticity	tag-tissue-immunity
topic-macrophage-plasticity	tag-tumor-microenvironment
topic-macrophage-plasticity	tag-biomarkers
topic-immune-checkpoint-autoimmunity	tag-immune-checkpoints
topic-immune-checkpoint-autoimmunity	tag-autoimmunity
topic-immune-checkpoint-autoimmunity	tag-tumor-immunotherapy
topic-immune-checkpoint-autoimmunity	tag-patient-stratification
topic-tissue-resident-immunity	tag-tissue-resident-immunity
topic-tissue-resident-immunity	tag-tissue-immunity
topic-tissue-resident-immunity	tag-autoimmunity
topic-tissue-resident-immunity	tag-infection-immunity
topic-tumor-microenvironment-resistance	tag-tumor-microenvironment
topic-tumor-microenvironment-resistance	tag-tumor-drug-resistance
topic-tumor-microenvironment-resistance	tag-macrophages
topic-tumor-microenvironment-resistance	tag-biomarkers
topic-radiotherapy-immunity-abscopal	tag-radiotherapy-immunity
topic-radiotherapy-immunity-abscopal	tag-tumor-immunotherapy
topic-radiotherapy-immunity-abscopal	tag-immune-checkpoints
topic-radiotherapy-immunity-abscopal	tag-clinical-trials
topic-cell-therapy-solid-tumor	tag-cell-therapy
topic-cell-therapy-solid-tumor	tag-tumor-microenvironment
topic-cell-therapy-solid-tumor	tag-tumor-immunotherapy
topic-cell-therapy-solid-tumor	tag-patient-stratification
topic-tumor-organoids-drug-response	tag-tumor-cells
topic-tumor-organoids-drug-response	tag-tumor-drug-resistance
topic-tumor-organoids-drug-response	tag-drug-design
topic-tumor-organoids-drug-response	tag-real-world-evidence
topic-dynamical-systems-biology	tag-dynamical-systems
topic-dynamical-systems-biology	tag-bio-statistics
\.


--
-- Data for Name: TopicView; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TopicView" (id, "userId", "topicId", "firstViewedAt", "lastViewedAt", "viewCount") FROM stdin;
cmq26rfx1000atne426rjytxp	cmp702t5x0009tnn45hgeuoxs	topic-medical-imaging-bias	2026-06-06 10:04:01.237	2026-06-06 10:04:29.56	2
cmq27ghj9000etne4zf1ja1zs	cmp702t5x0009tnn45hgeuoxs	topic-neural-compression	2026-06-06 10:23:29.734	2026-06-06 10:33:25.155	9
cmq2af0cw000wtne4ex767p7m	user-demo	topic-pde-neural-operator	2026-06-06 11:46:19.664	2026-06-06 11:46:19.687	2
cmq2afy200019tne4g9n6wktb	user-demo	topic-optimal-transport-biology	2026-06-06 11:47:03.336	2026-06-06 11:47:03.336	1
cmq2ak6rr001btne4ldbw3ws4	user-demo	topic-immune-checkpoint-autoimmunity	2026-06-06 11:50:21.255	2026-06-06 11:50:21.255	1
cmq2akq2t001dtne4rrlv5buh	cmp702t5x0009tnn45hgeuoxs	topic-immune-checkpoint-autoimmunity	2026-06-06 11:50:46.278	2026-06-06 11:50:46.296	2
cmq2apabq001ztne48wki2xm6	cmp709evr000ntnn4e98k8q6h	topic-tumor-organoids-drug-response	2026-06-06 11:54:19.142	2026-06-06 11:54:19.142	1
cmq2as9du0021tne4dqts89i2	cmp709evr000ntnn4e98k8q6h	topic-cell-therapy-solid-tumor	2026-06-06 11:56:37.89	2026-06-06 11:56:37.89	1
cmq2fe45y004ptne4iv5sh4v2	user-synbio	topic-computational-biology-perturbation	2026-06-06 14:05:36.022	2026-06-06 17:25:10.694	12
cmq2asslu0023tne4oalqo6bg	user-oncology	topic-cell-therapy-solid-tumor	2026-06-06 11:57:02.802	2026-06-06 11:58:06.275	6
cmq2auspw002rtne4d83kqhyi	user-oncology	topic-radiotherapy-immunity-abscopal	2026-06-06 11:58:36.261	2026-06-06 11:58:53.514	2
cmq2avjm40038tne4g0kdvmum	user-oncology	topic-tumor-microenvironment-resistance	2026-06-06 11:59:11.117	2026-06-06 11:59:27.278	2
cmq2au9w2002jtne4t8xpny8v	user-oncology	topic-tumor-organoids-drug-response	2026-06-06 11:58:11.859	2026-06-06 11:59:44.565	3
cmq2awetu003itne42j6njksm	user-oncology	topic-immune-checkpoint-autoimmunity	2026-06-06 11:59:51.57	2026-06-06 11:59:51.57	1
cmq2b0iy6003ktne4pbcpg51a	user-oncology	topic-ultrafast-spectroscopy	2026-06-06 12:03:03.535	2026-06-06 12:03:03.535	1
cmq2b1mzw003mtne4oic3je5r	user-oncology	topic-quantum-materials-defects	2026-06-06 12:03:55.436	2026-06-06 12:03:55.436	1
cmq2bbl48003xtne4ucn9i8c1	user-oncology	topic-moire-correlations	2026-06-06 12:11:39.56	2026-06-06 12:11:39.56	1
cmq2f6v6j003ztne4pzotyy09	user-oncology	topic-quantum-sensing-biology	2026-06-06 13:59:57.787	2026-06-06 13:59:57.787	1
cmq2f86mq0041tne4vncm8fye	user-oncology	topic-computational-biology-perturbation	2026-06-06 14:00:59.282	2026-06-06 14:03:44.065	2
cmq2fbvv70045tne4ghej185d	user-physics	topic-computational-biology-perturbation	2026-06-06 14:03:51.955	2026-06-06 14:04:13.989	2
cmq2fcqmj0049tne4rhhozw5a	user-physics	topic-quantum-sensing-biology	2026-06-06 14:04:31.82	2026-06-06 14:04:36.805	4
cmq2fdror004ltne43xgwj4ec	user-synbio	topic-quantum-sensing-biology	2026-06-06 14:05:19.852	2026-06-06 14:05:19.882	2
cmq2foeas004xtne4yhu74iqq	user-demo	topic-computational-biology-perturbation	2026-06-06 14:13:35.717	2026-06-06 14:13:35.737	2
cmq2lqmy4005utne47475fhiu	cmp45u9g10000tnx45ri7ae4d	topic-quantum-sensing-biology	2026-06-06 17:03:17.933	2026-06-06 17:08:58.736	2
cmq2lez6i005stne4syfl50ji	cmp45u9g10000tnx45ri7ae4d	topic-computational-biology-perturbation	2026-06-06 16:54:13.914	2026-06-06 17:10:06.527	3
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, email, "passwordHash", school, department, "researchField", role, "createdAt", "updatedAt", identity, schools) FROM stdin;
cmp45u9g10000tnx45ri7ae4d	Yuliang Lee	fake_email@fakeaddr.com	scrypt:6087c4db4cf38c92cb0cd0c8b2ea9246:5a4f48d2af4f7d703098a30c609f5ada1ac0458032c59578645570b5c00104104d693c3d37b952415a576c308c1b5c28f3aa6d05f4e0a098a05330ab35eb9c8f	示例大学	理学院	高温超导体	STUDENT	2026-05-13 14:34:03.218	2026-05-13 14:34:03.218	\N	{}
cmp46aju00000tnz0jz3a3dod	Permission Smoke	permission_smoke_1778683602801@example.com	scrypt:de5e985ea570f0498eb9fff54974dd32:abbe96efa1f9ad136e830928dee273fb69212631e1fd7a3bf7ab0b63464f680d234fb1d364e637833d9a6c53f7f3518550a8dc8024670d964a5a0a00c6127df5	示例大学	Test	Permission	STUDENT	2026-05-13 14:46:43.176	2026-05-13 14:46:43.176	\N	{}
cmp6qjhcb0000tnjgypowcnaj	Big BO	zhangyingqi@westlake.edu.cn	scrypt:69e2a070675fbf6d714b01f4cc41073e:2f0e1c65b4608355e779aa6d5e3833fec9d377ee10b82a53440b162d20167c31e3435d0e3ad470780bc0ecdde7f8d37cfe23ba6fc648657ae4c0242f7eb5ceb6	示例大学	工学院	蛋白质设计	STUDENT	2026-05-15 09:49:04.523	2026-05-15 09:49:04.523	\N	{}
user-med	王思雨	med@university.edu	scrypt:6e479bbc2ab518814fc1e5422e3caad8:c74f5216906803252e61b16dad584b48922661c96f865fdff3d2079b9b26eea4d1659c20d27365fa82469761af2178a161a4c442f301f9f9134b73b10b9e4413	示例大学	医学院	医学影像	STUDENT	2026-05-12 14:45:56.536	2026-06-06 17:07:53.927	\N	{}
user-electronic	赵明轩	electronic@university.edu	scrypt:068698cdcbf2f277e64c9e24c052f705:4c7bd4fa5608d294d8b4e9c3e3215aebf185890507e5ab713ff04df4fb8c3b3f59273bf206885f7777c1828f69f252d6c29b3b77ca2ed1c53da990d5815a82e1	示例大学	工学院	微纳光电与智能传感	STUDENT	2026-06-06 11:17:33.343	2026-06-06 17:07:53.989	\N	{}
user-energy-chem	黄俊杰	energy-chem@university.edu	scrypt:4e4367686d2e0f86d667207d184e8afb:ac16b379796bbd1dcfccf24ee827eda3f3359f0966a1950d1b8abc28dc1cff33141dd7f54f0122269c52a9458e8ac532e4ea6e44d7066f8eebfb55deab1602b9	示例大学	理学院	人工光合作用与电催化	STUDENT	2026-06-06 11:31:02.327	2026-06-06 17:07:54.051	\N	{}
user-structural-bio	孙佳怡	structural-bio@university.edu	scrypt:45703d58d8a4c7239762174a53aaac14:b022c71b678df8728ccc4281b3f8247a605eac0bb49f9bee9ad93c87d4ee09a4a7c355bca3f7d08a49e887b2cdcf177f5d77d8e0e545bb82f0b618bd3ca7d5e3	示例大学	生命科学学院	结构生物学与生物大分子机制	STUDENT	2026-06-06 11:37:46.518	2026-06-06 17:07:54.071	\N	{}
user-neuro	胡宇航	neuro@university.edu	scrypt:144b68111895b8736aec01e9aace4fc9:cad9812b20d63cf13d5e42834fc888a9106866758f85b69af5bcbf1d520cd5d7a89399a68e8ab6fc56026f15d3935a911db6ac2885677b1eac060cb56fade959	示例大学	生命科学学院	神经环路与行为	STUDENT	2026-06-06 11:37:46.54	2026-06-06 17:07:54.092	\N	{}
cmp702t5x0009tnn45hgeuoxs	trialista_xy	trialista_xy@demo.com	scrypt:24edfcd4e1b4cf2544bfb3fc049e64c3:3eae0f9c53f5175dde15d64afa7b2e2a4e6fc5c9866b9b70b634060b9e1e28ad8f00e86c76ee10b1d1a7cf381328dd11a6e2c8fd28375c9cee3dfb5f09bbc70c	示例大学	医学院	脑科学	STUDENT	2026-05-15 14:16:02.854	2026-05-15 14:16:02.854	\N	{}
cmp706n70000htnn45gj5v85x	biostatlab_W	biostatlab_w@demo.com	scrypt:428392d7d9a87b88a04420a959b11091:bcc9280287ce454fbdfbea1471b5f1d52f3eb626265bbc059357df604f55bf173493e8af6c20d559a225b38e71a99c727aa8d0140f3130140ad5f4b031dd9afb	示例大学	生命科学院	生物统计	STUDENT	2026-05-15 14:19:01.741	2026-05-15 14:19:01.741	\N	{}
cmp707p8t000ktnn44wxxxh35	transmed_K	transmed_k@demo.com	scrypt:38ca3ce21bea669d7c492b794ba2946a:e3f749974d94a37ec0345fb74049d92d89d809e7eeb307341e0616417ec2abf9c7019e28dc16ff8537c14c4aebf4eb6fe6e390262420522926cf59d609653a69	示例大学	医学院	AD动物模型	STUDENT	2026-05-15 14:19:51.053	2026-05-15 14:19:51.053	\N	{}
cmp709evr000ntnn4e98k8q6h	neurodoc_chen	neurodoc_chen@demo.com	scrypt:553a1cca1308086ce58a7fb963869fb8:ecd15ba8f3a954aa0f7e7788fd542e8525f137a3fcade7f1898b6f0d158c9a0f584f63644ff772e431b360553362faff6a178e00f77e1bd18faff9e12e130b5e	示例大学	医学院	临床	STUDENT	2026-05-15 14:21:10.935	2026-05-15 14:21:10.935	\N	{}
cmp70ahql000qtnn4zxalm723	rookie_pk	rookie_pk@demo.com	scrypt:6836975945a81484e32e37ab3b1a31f8:bc0f28ac7690e1734ca0f81fddef3c51d722557e0ee4e268a9f6cf7245aedfcdb0ea4a96ea788776941c2b327272b14923002fb58dca4f993565370762b16dcc	示例大学	医学院	药理学	STUDENT	2026-05-15 14:22:01.294	2026-05-15 14:22:01.294	\N	{}
user-demo	张一凡	demo@university.edu	scrypt:d47b8297e791c8e769351c5bf9bf43ee:dc12c9f9a3b73963a9781e7598e55983f3ce177bc00b81f1652e2a530e5c6c23a4c086496f5081a3e064654bedd725f3dff3dd62a6faf223b4f9483263704d52	示例大学	计算机学院	人机交互与科研工具	STUDENT	2026-05-12 14:45:56.495	2026-06-06 17:07:53.886	\N	{}
user-bio	李佳宁	bio@university.edu	scrypt:2b827761be4b9df6d662b3433913f091:1fb102eaf4bb14d701ff28504237e90c3029befce609f415a060e6ad205f11f1b9cff4f16602f4bf5f6a7e58450d1f6fc881c50e6e7c0dffba20a792246ea559	示例大学	生命科学学院	神经科学	STUDENT	2026-05-12 14:45:56.516	2026-06-06 17:07:53.907	\N	{}
user-math	周雨桐	math@university.edu	scrypt:8152095f8c033b6dc57dc43534913ae8:421c29f5e87e230af8d81b50ceb2eec066bb9e5f0229e30cd2fe3ab10a7e22b9c4f10ba10658bc1332d54e699905660c612c5ba8997b496db49fe5ea6870f966	示例大学	理学院	分析、几何与数学建模	STUDENT	2026-06-06 11:31:02.285	2026-06-06 17:07:54.01	\N	{}
user-physics	吴晨	physics@university.edu	scrypt:bc1f89ed2c5feedd38556ce50df56df5:34e8738fc713ae63c52c7b0c55f996160861415e750a6d16e4c91480ee4d83898567c91436471fd5f94d82ce3090411040b45b63f2b1927eb942a6ce4751cc2f	示例大学	理学院	凝聚态物理与量子材料	STUDENT	2026-06-06 11:31:02.306	2026-06-06 17:07:54.03	\N	{}
user-ai-eng	陈浩	ai-eng@university.edu	scrypt:4320673d4dc3ecae36499195cd1bad65:1ecb56b3d469b6051730b6566ef25e439a78747607eaef127fe8701d59be7839332e71f6a30d6b38492ead8ef9546e2ca38f1e385c20dae869ec2b182ed5226b	示例大学	工学院	AI for Science 与自主智能系统	STUDENT	2026-06-06 11:17:33.303	2026-06-06 17:07:53.948	\N	{}
user-materials	刘子涵	materials@university.edu	scrypt:ceeffe81f23abc3ada88b397eeb26fa4:4309f453501fcc936bec5347da967cc5d64bd507f22cc40ed1a1e6b58acc0e7f49e34c72f0887124eee03dfa127b185dde3c52d37ef2f364d39167bcfbbcd0aa	示例大学	工学院	材料设计与表征	STUDENT	2026-06-06 11:17:33.323	2026-06-06 17:07:53.969	\N	{}
user-synbio	何思远	synbio@university.edu	scrypt:cf21a01fb461bf3b72387e1664c10631:b4e9c6b2d42e7001b1d894bcf4ca40a769c5693c3ae9474b4008155d854182178e33f2fd6a50444f3037c0ec26b549a3a80ecf270736dc7d145f038958d6d992	示例大学	生命科学学院	系统与合成生物学	STUDENT	2026-06-06 11:37:46.561	2026-06-06 17:07:54.113	\N	{}
user-trans-med	郑晓彤	trans-med@university.edu	scrypt:4b2fa069c90324aea2082c72ee961e2e:cb07210ca51785d6b17a15b39495586b8b2593135b2fa3bf627b1ec2ad5b6a959b57d668791dba62526f7ece2a08bf3ee8311a175d978f19066154b776fcb259	示例大学	医学院	转化医学与临床试验	STUDENT	2026-06-06 11:48:22.596	2026-06-06 17:07:54.133	\N	{}
user-immunology	高雅雯	immunology@university.edu	scrypt:1ad431cc346c4195980d36f664282466:e363fcad0a0c03481bea925d4243ba52743d6a33c295bfb37b4128e4ffdf8ba92fafb83be40a982bb85e54788c40d4bf90bffb400066e8ad22b814d13291699f	示例大学	医学院	免疫学与炎症	STUDENT	2026-06-06 11:48:22.619	2026-06-06 17:07:54.153	\N	{}
user-oncology	许文博	oncology@university.edu	scrypt:0de7b00b7162e5459e77bc3026adeadf:40b847534f61b28a7e18cdf658121c3403e824b36eddbd6e9bebbb1047de98d3f05351939a94e2e82134291d51cb0077bf4aeb7573fa377136704707b9f5f6a9	示例大学	医学院	肿瘤生物学与治疗	STUDENT	2026-06-06 11:48:22.64	2026-06-06 17:07:54.173	\N	{}
\.


--
-- Data for Name: UserTopicPreference; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserTopicPreference" ("userId", "tagIds", "disciplineIds", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2a4bb615-9fce-4843-93a5-e67158015d16	971a184089c5c1cd36d0c504307a7a8f49012832de861ccd91b878cd5a47b880	2026-05-12 22:45:31.828638+08	20260512144531_init	\N	\N	2026-05-12 22:45:31.810396+08	1
8a13ea96-d8e8-42f4-864a-7bf2a946de3b	8361e966bce5c0ef28bb4a71f16a1e308b2410e97a225c38149c6978524b3700	2026-05-13 22:23:38.33342+08	20260513142338_add_reply_soft_delete	\N	\N	2026-05-13 22:23:38.323318+08	1
d804a080-21b8-4697-9d46-56c9c3e59f5f	e1b59733d8465ce47fb40a2b76b1f82595390cb03796ef789a37a2255a033f5a	2026-05-15 18:19:23.731384+08	20260515170000_add_tag_disciplines	\N	\N	2026-05-15 18:19:23.704049+08	1
9471857f-6099-4543-be57-18630ba37aaa	f3d600d55c27ecee65f4b82a2a97800f68067fd21a712803fe75f9a10f16f399	2026-05-15 21:40:23.510846+08	20260515190000_add_reviewable_taxonomy	\N	\N	2026-05-15 21:40:23.503729+08	1
3bf440bc-37cc-4a6f-85b6-bfa19c6b1519	c50b5c8b1f74158139b06a634a44036dcf3a6314d9eed3ebdd44b1135ed8b86d	2026-06-01 22:01:57.794938+08	20260601140157_add_user_profile_fields	\N	\N	2026-06-01 22:01:57.776452+08	1
28e378b1-4c1f-4a7b-8efa-4a19f3afcdb5	2cc2dad1a66dd69e6998ff284e23c66a6353a0f71bec4e047eaa5c3558313a7d	2026-06-01 22:52:08.577157+08	20260601145208_add_user_topic_preference	\N	\N	2026-06-01 22:52:08.556744+08	1
4282e106-25c4-4fa3-a3b5-7a2cc1530cf7	c723398c0c6647cb5a70fb043716b613438f3376c30a3ad41cd18fd0f2412c60	2026-06-03 23:07:44.653047+08	20260603150744_add_daily_recommendation_deck	\N	\N	2026-06-03 23:07:44.612576+08	1
\.


--
-- Name: AIChatMessage AIChatMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIChatMessage"
    ADD CONSTRAINT "AIChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: AIChatSession AIChatSession_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIChatSession"
    ADD CONSTRAINT "AIChatSession_pkey" PRIMARY KEY (id);


--
-- Name: AIDraft AIDraft_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIDraft"
    ADD CONSTRAINT "AIDraft_pkey" PRIMARY KEY (id);


--
-- Name: AIGuide AIGuide_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIGuide"
    ADD CONSTRAINT "AIGuide_pkey" PRIMARY KEY (id);


--
-- Name: Discipline Discipline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Discipline"
    ADD CONSTRAINT "Discipline_pkey" PRIMARY KEY (id);


--
-- Name: RecommendationBatch RecommendationBatch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecommendationBatch"
    ADD CONSTRAINT "RecommendationBatch_pkey" PRIMARY KEY (id);


--
-- Name: RecommendationItem RecommendationItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecommendationItem"
    ADD CONSTRAINT "RecommendationItem_pkey" PRIMARY KEY (id);


--
-- Name: Reply Reply_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reply"
    ADD CONSTRAINT "Reply_pkey" PRIMARY KEY (id);


--
-- Name: TagDiscipline TagDiscipline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TagDiscipline"
    ADD CONSTRAINT "TagDiscipline_pkey" PRIMARY KEY ("tagId", "disciplineId");


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: TopicDiscipline TopicDiscipline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicDiscipline"
    ADD CONSTRAINT "TopicDiscipline_pkey" PRIMARY KEY ("topicId", "disciplineId");


--
-- Name: TopicTag TopicTag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicTag"
    ADD CONSTRAINT "TopicTag_pkey" PRIMARY KEY ("topicId", "tagId");


--
-- Name: TopicView TopicView_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicView"
    ADD CONSTRAINT "TopicView_pkey" PRIMARY KEY (id);


--
-- Name: Topic Topic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_pkey" PRIMARY KEY (id);


--
-- Name: UserTopicPreference UserTopicPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserTopicPreference"
    ADD CONSTRAINT "UserTopicPreference_pkey" PRIMARY KEY ("userId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AIGuide_topicId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AIGuide_topicId_key" ON public."AIGuide" USING btree ("topicId");


--
-- Name: Discipline_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Discipline_slug_key" ON public."Discipline" USING btree (slug);


--
-- Name: RecommendationBatch_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RecommendationBatch_userId_key" ON public."RecommendationBatch" USING btree ("userId");


--
-- Name: RecommendationItem_batchId_position_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RecommendationItem_batchId_position_key" ON public."RecommendationItem" USING btree ("batchId", "position");


--
-- Name: RecommendationItem_topicId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "RecommendationItem_topicId_idx" ON public."RecommendationItem" USING btree ("topicId");


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: TopicView_topicId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TopicView_topicId_idx" ON public."TopicView" USING btree ("topicId");


--
-- Name: TopicView_userId_topicId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TopicView_userId_topicId_key" ON public."TopicView" USING btree ("userId", "topicId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: AIChatMessage AIChatMessage_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIChatMessage"
    ADD CONSTRAINT "AIChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."AIChatSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIChatSession AIChatSession_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIChatSession"
    ADD CONSTRAINT "AIChatSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIChatSession AIChatSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIChatSession"
    ADD CONSTRAINT "AIChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AIDraft AIDraft_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIDraft"
    ADD CONSTRAINT "AIDraft_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIDraft AIDraft_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIDraft"
    ADD CONSTRAINT "AIDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AIGuide AIGuide_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AIGuide"
    ADD CONSTRAINT "AIGuide_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discipline Discipline_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Discipline"
    ADD CONSTRAINT "Discipline_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Discipline Discipline_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Discipline"
    ADD CONSTRAINT "Discipline_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Discipline"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RecommendationBatch RecommendationBatch_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecommendationBatch"
    ADD CONSTRAINT "RecommendationBatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecommendationItem RecommendationItem_batchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecommendationItem"
    ADD CONSTRAINT "RecommendationItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES public."RecommendationBatch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecommendationItem RecommendationItem_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecommendationItem"
    ADD CONSTRAINT "RecommendationItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reply Reply_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reply"
    ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reply Reply_parentReplyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reply"
    ADD CONSTRAINT "Reply_parentReplyId_fkey" FOREIGN KEY ("parentReplyId") REFERENCES public."Reply"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Reply Reply_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reply"
    ADD CONSTRAINT "Reply_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TagDiscipline TagDiscipline_disciplineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TagDiscipline"
    ADD CONSTRAINT "TagDiscipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES public."Discipline"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TagDiscipline TagDiscipline_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TagDiscipline"
    ADD CONSTRAINT "TagDiscipline_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tag Tag_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tag Tag_disciplineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES public."Discipline"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TopicDiscipline TopicDiscipline_disciplineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicDiscipline"
    ADD CONSTRAINT "TopicDiscipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES public."Discipline"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TopicDiscipline TopicDiscipline_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicDiscipline"
    ADD CONSTRAINT "TopicDiscipline_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TopicTag TopicTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicTag"
    ADD CONSTRAINT "TopicTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TopicTag TopicTag_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicTag"
    ADD CONSTRAINT "TopicTag_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TopicView TopicView_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicView"
    ADD CONSTRAINT "TopicView_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TopicView TopicView_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TopicView"
    ADD CONSTRAINT "TopicView_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Topic Topic_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Topic Topic_primaryDisciplineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_primaryDisciplineId_fkey" FOREIGN KEY ("primaryDisciplineId") REFERENCES public."Discipline"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserTopicPreference UserTopicPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserTopicPreference"
    ADD CONSTRAINT "UserTopicPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict X95cdf7bLyy4BzkpkHAHeRsGEP0zJt6rQdNoDnbDwo5OTnfnVftJTKrukuKS8hw

