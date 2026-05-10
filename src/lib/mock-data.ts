import type { AIGuide, Discipline, Reply, Tag, Topic, User } from "@/lib/types";

const now = new Date();
const minutesAgo = (minutes: number) =>
  new Date(now.getTime() - minutes * 60 * 1000).toISOString();

export const users: User[] = [
  {
    id: "user-demo",
    name: "林亦辰",
    email: "demo@university.edu",
    passwordHash: "demo1234",
    school: "示例大学",
    department: "计算机学院",
    researchField: "人机交互与科研工具",
    role: "STUDENT",
    createdAt: minutesAgo(5000)
  },
  {
    id: "user-bio",
    name: "周安",
    email: "bio@university.edu",
    passwordHash: "demo1234",
    school: "示例大学",
    department: "生命科学学院",
    researchField: "神经科学",
    role: "STUDENT",
    createdAt: minutesAgo(4200)
  },
  {
    id: "user-med",
    name: "陈墨",
    email: "med@university.edu",
    passwordHash: "demo1234",
    school: "示例大学",
    department: "医学院",
    researchField: "医学影像",
    role: "STUDENT",
    createdAt: minutesAgo(3600)
  }
];

export const disciplines: Discipline[] = [
  { id: "engineering", name: "工学院", slug: "engineering", sortOrder: 1 },
  { id: "science", name: "理学院", slug: "science", sortOrder: 2 },
  { id: "life-science", name: "生命科学", slug: "life-science", sortOrder: 3 },
  { id: "medicine", name: "医学院", slug: "medicine", sortOrder: 4 },
  {
    id: "computer-science",
    name: "计算机",
    slug: "computer-science",
    parentId: "engineering",
    sortOrder: 1
  },
  {
    id: "electronic-info",
    name: "电子信息",
    slug: "electronic-info",
    parentId: "engineering",
    sortOrder: 2
  },
  {
    id: "materials",
    name: "材料",
    slug: "materials",
    parentId: "engineering",
    sortOrder: 3
  },
  {
    id: "mathematics",
    name: "数学",
    slug: "mathematics",
    parentId: "science",
    sortOrder: 1
  },
  {
    id: "physics",
    name: "物理",
    slug: "physics",
    parentId: "science",
    sortOrder: 2
  },
  {
    id: "chemistry",
    name: "化学",
    slug: "chemistry",
    parentId: "science",
    sortOrder: 3
  },
  {
    id: "biology",
    name: "生物学",
    slug: "biology",
    parentId: "life-science",
    sortOrder: 1
  },
  {
    id: "neuroscience",
    name: "神经科学",
    slug: "neuroscience",
    parentId: "life-science",
    sortOrder: 2
  },
  {
    id: "ecology",
    name: "生态学",
    slug: "ecology",
    parentId: "life-science",
    sortOrder: 3
  },
  {
    id: "basic-medicine",
    name: "基础医学",
    slug: "basic-medicine",
    parentId: "medicine",
    sortOrder: 1
  },
  {
    id: "clinical-medicine",
    name: "临床医学",
    slug: "clinical-medicine",
    parentId: "medicine",
    sortOrder: 2
  },
  {
    id: "public-health",
    name: "公共卫生",
    slug: "public-health",
    parentId: "medicine",
    sortOrder: 3
  }
];

export const tags: Tag[] = [
  {
    id: "tag-human-ai",
    name: "Human-AI Interaction",
    slug: "human-ai-interaction",
    disciplineId: "computer-science"
  },
  {
    id: "tag-ml",
    name: "机器学习",
    slug: "machine-learning",
    disciplineId: "computer-science"
  },
  {
    id: "tag-materials-screening",
    name: "材料筛选",
    slug: "materials-screening",
    disciplineId: "materials"
  },
  {
    id: "tag-neural-coding",
    name: "神经编码",
    slug: "neural-coding",
    disciplineId: "neuroscience"
  },
  {
    id: "tag-bio-statistics",
    name: "生物统计",
    slug: "biostatistics",
    disciplineId: "public-health"
  },
  {
    id: "tag-medical-imaging",
    name: "医学影像",
    slug: "medical-imaging",
    disciplineId: "clinical-medicine"
  },
  {
    id: "tag-dynamical-systems",
    name: "动力系统",
    slug: "dynamical-systems",
    disciplineId: "mathematics"
  }
];

export const topics: Topic[] = [
  {
    id: "topic-ai-discussion",
    title: "AI 导读真的能降低跨领域论文讨论门槛吗？",
    type: "QUESTION",
    body:
      "最近在想，很多博士生愿意了解别的方向，但卡在第一步：不知道背景、概念和核心争议。AI 如果能在 topic 顶部提供外行可读导读，是否能让更多人敢于参与讨论？想听听不同学科的体验。",
    authorId: "user-demo",
    primaryDisciplineId: "computer-science",
    status: "PUBLISHED",
    tagIds: ["tag-human-ai", "tag-ml"],
    viewCount: 128,
    createdAt: minutesAgo(1400),
    updatedAt: minutesAgo(1200),
    lastActivityAt: minutesAgo(60)
  },
  {
    id: "topic-neural-compression",
    title: "神经系统里的压缩表征和机器学习的表示学习有多像？",
    type: "IDEA",
    body:
      "读到一篇关于感觉系统高效编码的综述，里面把神经活动看作对外界信息的压缩。我想知道这和机器学习中的 representation learning、信息瓶颈有没有可比之处，哪些类比是危险的？",
    paperTitle: "Efficient coding and sensory representation",
    paperUrl: "https://example.edu/papers/efficient-coding",
    authorId: "user-bio",
    primaryDisciplineId: "neuroscience",
    status: "PUBLISHED",
    tagIds: ["tag-neural-coding", "tag-ml"],
    viewCount: 94,
    createdAt: minutesAgo(960),
    updatedAt: minutesAgo(830),
    lastActivityAt: minutesAgo(45)
  },
  {
    id: "topic-medical-imaging-bias",
    title: "医学影像 AI 模型在跨医院数据上的失效该怎么讨论？",
    type: "PAPER",
    body:
      "一篇论文提到模型在训练医院表现很好，但换到另一个医院后性能明显下降。想从统计、机器学习和临床实践三个角度讨论：这是 dataset shift、标注差异，还是 workflow 差异？",
    paperTitle: "External validation of medical imaging models",
    paperUrl: "https://example.edu/papers/external-validation",
    authorId: "user-med",
    primaryDisciplineId: "clinical-medicine",
    status: "PUBLISHED",
    tagIds: ["tag-medical-imaging", "tag-bio-statistics", "tag-ml"],
    viewCount: 177,
    createdAt: minutesAgo(720),
    updatedAt: minutesAgo(710),
    lastActivityAt: minutesAgo(30)
  },
  {
    id: "topic-materials-active-learning",
    title: "主动学习能不能减少材料实验里的试错成本？",
    type: "QUESTION",
    body:
      "材料筛选实验成本很高，看到有人用 active learning 选择下一批实验样本。想请教做机器学习和材料的同学：这种方法在哪些场景下真的有效，什么时候只是把不确定性包装得很好看？",
    authorId: "user-demo",
    primaryDisciplineId: "materials",
    status: "PUBLISHED",
    tagIds: ["tag-materials-screening", "tag-ml"],
    viewCount: 76,
    createdAt: minutesAgo(600),
    updatedAt: minutesAgo(500),
    lastActivityAt: minutesAgo(110)
  },
  {
    id: "topic-dynamical-systems-biology",
    title: "用动力系统语言理解细胞命运转换，会不会过度数学化？",
    type: "IDEA",
    body:
      "很多文章用 attractor landscape 描述细胞状态转换。这个比喻很有启发，但我不确定它在实验可验证层面能给出多少东西。想邀请数学、生物和物理方向的同学一起拆一下。",
    authorId: "user-bio",
    primaryDisciplineId: "biology",
    status: "PUBLISHED",
    tagIds: ["tag-dynamical-systems", "tag-bio-statistics"],
    viewCount: 112,
    createdAt: minutesAgo(480),
    updatedAt: minutesAgo(470),
    lastActivityAt: minutesAgo(20)
  }
];

export const replies: Reply[] = [
  {
    id: "reply-ai-1",
    topicId: "topic-ai-discussion",
    authorId: "user-bio",
    body:
      "我觉得最大的帮助可能不是总结论文，而是把参与讨论的第一句话变简单。很多时候我不是没有想法，是不确定自己的问题会不会太外行。",
    createdAt: minutesAgo(1180),
    updatedAt: minutesAgo(1180)
  },
  {
    id: "reply-ai-2",
    topicId: "topic-ai-discussion",
    authorId: "user-med",
    body:
      "医学方向还有一个问题是术语很密。AI 如果能把临床指标、数据来源和评价指标讲清楚，外领域同学可能更容易指出方法上的问题。",
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(60)
  },
  {
    id: "reply-neural-1",
    topicId: "topic-neural-compression",
    authorId: "user-demo",
    body:
      "从机器学习角度看，representation learning 更强调任务目标和可优化损失。神经科学里的高效编码如果缺少明确 objective，类比时可能要小心。",
    createdAt: minutesAgo(45),
    updatedAt: minutesAgo(45)
  },
  {
    id: "reply-med-1",
    topicId: "topic-medical-imaging-bias",
    authorId: "user-demo",
    body:
      "可以先区分 covariate shift 和 label shift，再看医院之间扫描设备、协议、患者群体和标注流程有没有变化。单看 AUC 下降可能很难定位原因。",
    createdAt: minutesAgo(30),
    updatedAt: minutesAgo(30)
  },
  {
    id: "reply-dyn-1",
    topicId: "topic-dynamical-systems-biology",
    authorId: "user-med",
    body:
      "我会关心这个语言能不能产生新的实验设计。如果只是画出 landscape 解释已有现象，可能解释力强但预测力弱。",
    createdAt: minutesAgo(20),
    updatedAt: minutesAgo(20)
  }
];

export const aiGuides: AIGuide[] = [
  {
    id: "guide-ai-discussion",
    topicId: "topic-ai-discussion",
    content:
      "这个 topic 讨论的是 AI 能否成为跨领域学术交流的脚手架。外领域读者可以重点关注三个问题：AI 导读是否能补齐背景知识、AI 问答是否能减少提问焦虑、AI 辅助发言是否能帮助把模糊直觉变成可讨论的论点。",
    model: "mock-guide-v1",
    status: "COMPLETED",
    createdAt: minutesAgo(1390),
    updatedAt: minutesAgo(1390)
  },
  {
    id: "guide-neural-compression",
    topicId: "topic-neural-compression",
    content:
      "这个 topic 试图比较神经科学中的高效编码和机器学习中的表示学习。参与讨论时，可以先区分两者的目标函数、数据来源和验证方式，再判断类比是否只是启发式语言，还是能形成可检验的假设。",
    model: "mock-guide-v1",
    status: "COMPLETED",
    createdAt: minutesAgo(940),
    updatedAt: minutesAgo(940)
  },
  {
    id: "guide-medical-imaging-bias",
    topicId: "topic-medical-imaging-bias",
    content:
      "这个 topic 关注医学影像 AI 的外部验证问题。外领域读者可以把它理解为：模型在一个环境中学到的规律，换到另一个医院后是否仍然成立。关键切入点包括数据分布变化、标注标准变化、设备差异和临床流程差异。",
    model: "mock-guide-v1",
    status: "COMPLETED",
    createdAt: minutesAgo(700),
    updatedAt: minutesAgo(700)
  }
];
