import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const rootDisciplines = [
  { id: "engineering", name: "工学院", slug: "engineering", sortOrder: 1 },
  { id: "science", name: "理学院", slug: "science", sortOrder: 2 },
  { id: "life-science", name: "生命科学", slug: "life-science", sortOrder: 3 },
  { id: "medicine", name: "医学院", slug: "medicine", sortOrder: 4 }
];

const childDisciplines = [
  {
    id: "computer-science",
    name: "计算机科学",
    slug: "computer-science",
    parentId: "engineering",
    sortOrder: 1
  },
  {
    id: "ai-data-science",
    name: "人工智能与数据科学",
    slug: "ai-data-science",
    parentId: "engineering",
    sortOrder: 2
  },
  {
    id: "robotics-mechanical-systems",
    name: "机器人与机械系统",
    slug: "robotics-mechanical-systems",
    parentId: "engineering",
    sortOrder: 3
  },
  {
    id: "electronic-info",
    name: "电子信息科学与技术",
    slug: "electronic-info",
    parentId: "engineering",
    sortOrder: 4
  },
  {
    id: "materials",
    name: "材料科学与工程",
    slug: "materials",
    parentId: "engineering",
    sortOrder: 5
  },
  {
    id: "biomedical-engineering",
    name: "生物医学工程",
    slug: "biomedical-engineering",
    parentId: "engineering",
    sortOrder: 6
  },
  {
    id: "chemical-biological-engineering",
    name: "化学与生物工程",
    slug: "chemical-biological-engineering",
    parentId: "engineering",
    sortOrder: 7
  },
  {
    id: "sustainable-environment-engineering",
    name: "可持续发展与环境工程",
    slug: "sustainable-environment-engineering",
    parentId: "engineering",
    sortOrder: 8
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
    id: "molecular-energy-chemistry",
    name: "分子科学与能源化学",
    slug: "molecular-energy-chemistry",
    parentId: "science",
    sortOrder: 4
  },
  {
    id: "biology",
    name: "生物学",
    slug: "biology",
    parentId: "life-science",
    sortOrder: 1
  },
  {
    id: "biophysics-biochemistry",
    name: "生物物理与生物化学",
    slug: "biophysics-biochemistry",
    parentId: "life-science",
    sortOrder: 2
  },
  {
    id: "cell-biology",
    name: "细胞生物学",
    slug: "cell-biology",
    parentId: "life-science",
    sortOrder: 3
  },
  {
    id: "genetics-development",
    name: "遗传与发育生物学",
    slug: "genetics-development",
    parentId: "life-science",
    sortOrder: 4
  },
  {
    id: "neuroscience",
    name: "神经生物学",
    slug: "neuroscience",
    parentId: "life-science",
    sortOrder: 5
  },
  {
    id: "immunology-microbiology",
    name: "免疫与微生物学",
    slug: "immunology-microbiology",
    parentId: "life-science",
    sortOrder: 6
  },
  {
    id: "systems-synthetic-biology",
    name: "系统与合成生物学",
    slug: "systems-synthetic-biology",
    parentId: "life-science",
    sortOrder: 7
  },
  {
    id: "chemical-biology",
    name: "化学生物学",
    slug: "chemical-biology",
    parentId: "life-science",
    sortOrder: 8
  },
  {
    id: "ecology",
    name: "生态学",
    slug: "ecology",
    parentId: "life-science",
    sortOrder: 9
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
  },
  {
    id: "translational-medicine",
    name: "转化医学",
    slug: "translational-medicine",
    parentId: "medicine",
    sortOrder: 4
  },
  {
    id: "immunology-inflammation",
    name: "免疫学与炎症",
    slug: "immunology-inflammation",
    parentId: "medicine",
    sortOrder: 5
  },
  {
    id: "microbiology-vaccines",
    name: "微生物学与疫苗",
    slug: "microbiology-vaccines",
    parentId: "medicine",
    sortOrder: 6
  },
  {
    id: "oncology-therapy",
    name: "肿瘤生物学与治疗",
    slug: "oncology-therapy",
    parentId: "medicine",
    sortOrder: 7
  },
  {
    id: "physiology-metabolism",
    name: "生理学与代谢",
    slug: "physiology-metabolism",
    parentId: "medicine",
    sortOrder: 8
  },
  {
    id: "medical-genetics-rare-disease",
    name: "医学遗传与罕见病",
    slug: "medical-genetics-rare-disease",
    parentId: "medicine",
    sortOrder: 9
  },
  {
    id: "drug-discovery-public-health",
    name: "药物研发与公共健康",
    slug: "drug-discovery-public-health",
    parentId: "medicine",
    sortOrder: 10
  }
];

const users = [
  {
    id: "user-demo",
    name: "林亦辰",
    email: "demo@university.edu",
    department: "计算机学院",
    researchField: "人机交互与科研工具"
  },
  {
    id: "user-bio",
    name: "周安",
    email: "bio@university.edu",
    department: "生命科学学院",
    researchField: "神经科学"
  },
  {
    id: "user-med",
    name: "陈墨",
    email: "med@university.edu",
    department: "医学院",
    researchField: "医学影像"
  }
];

type SeedTag = {
  id: string;
  name: string;
  slug: string;
  disciplineId: string;
  disciplineIds: string[];
};

function tag(
  id: string,
  name: string,
  slug: string,
  disciplineId: string,
  disciplineIds: string[] = [disciplineId]
): SeedTag {
  return { id, name, slug, disciplineId, disciplineIds };
}

const tags: SeedTag[] = [
  tag("tag-human-ai", "Human-AI Interaction", "human-ai-interaction", "computer-science"),
  tag("tag-ml", "机器学习", "machine-learning", "ai-data-science", ["ai-data-science", "computer-science", "mathematics"]),
  tag("tag-multimodal-models", "多模态模型", "multimodal-models", "ai-data-science"),
  tag("tag-generative-models", "生成模型", "generative-models", "ai-data-science", ["ai-data-science", "mathematics"]),
  tag("tag-reinforcement-learning", "强化学习", "reinforcement-learning", "ai-data-science", ["ai-data-science", "robotics-mechanical-systems"]),
  tag("tag-ai-science", "AI for Science", "ai-for-science", "ai-data-science", ["ai-data-science", "molecular-energy-chemistry"]),
  tag("tag-computational-biology", "计算生物学", "computational-biology", "ai-data-science", ["ai-data-science", "systems-synthetic-biology"]),
  tag("tag-protein-language-models", "蛋白质语言模型", "protein-language-models", "ai-data-science", ["ai-data-science", "systems-synthetic-biology"]),
  tag("tag-bioinformatics-ai", "AI+生物信息", "ai-bioinformatics", "ai-data-science", ["ai-data-science", "systems-synthetic-biology"]),
  tag("tag-humanoid-robots", "人形机器人", "humanoid-robots", "robotics-mechanical-systems"),
  tag("tag-embodied-intelligence", "具身智能", "embodied-intelligence", "robotics-mechanical-systems", ["robotics-mechanical-systems", "ai-data-science"]),
  tag("tag-motion-control", "运动控制", "motion-control", "robotics-mechanical-systems"),
  tag("tag-autonomous-systems", "自主系统", "autonomous-systems", "robotics-mechanical-systems"),
  tag("tag-robot-learning", "机器人学习", "robot-learning", "robotics-mechanical-systems", ["robotics-mechanical-systems", "ai-data-science"]),
  tag("tag-micro-nano-optoelectronics", "微纳光电", "micro-nano-optoelectronics", "electronic-info"),
  tag("tag-integrated-circuits", "集成电路", "integrated-circuits", "electronic-info"),
  tag("tag-intelligent-sensing", "智能传感", "intelligent-sensing", "electronic-info"),
  tag("tag-semiconductor-devices", "半导体器件", "semiconductor-devices", "electronic-info"),
  tag("tag-brain-computer-chips", "脑机接口芯片", "brain-computer-interface-chips", "electronic-info"),
  tag("tag-materials-screening", "材料筛选", "materials-screening", "materials"),
  tag("tag-energy-materials", "能源材料", "energy-materials", "materials"),
  tag("tag-nanomaterials", "纳米材料", "nanomaterials", "materials"),
  tag("tag-biomaterials", "生物材料", "biomaterials", "materials", ["materials", "biomedical-engineering"]),
  tag("tag-materials-characterization", "材料表征", "materials-characterization", "materials"),
  tag("tag-computational-materials", "材料计算", "computational-materials", "materials", ["materials", "ai-data-science"]),
  tag("tag-biomedical-imaging", "生物医学成像", "biomedical-imaging", "biomedical-engineering", ["biomedical-engineering", "clinical-medicine"]),
  tag("tag-medical-ai", "医疗AI", "medical-ai", "biomedical-engineering", ["biomedical-engineering", "ai-data-science"]),
  tag("tag-bioelectronics", "生物电子", "bioelectronics", "biomedical-engineering"),
  tag("tag-medical-materials", "医用材料", "medical-materials", "biomedical-engineering", ["biomedical-engineering", "materials"]),
  tag("tag-smart-healthcare-systems", "智能医疗系统", "smart-healthcare-systems", "biomedical-engineering"),
  tag("tag-low-carbon-biosynthesis", "低碳生物合成", "low-carbon-biosynthesis", "sustainable-environment-engineering", ["sustainable-environment-engineering", "chemical-biological-engineering"]),
  tag("tag-carbon-capture", "碳捕集", "carbon-capture", "sustainable-environment-engineering"),
  tag("tag-co2-conversion", "CO2转化", "co2-conversion", "sustainable-environment-engineering", ["sustainable-environment-engineering", "molecular-energy-chemistry"]),
  tag("tag-environmental-monitoring", "环境监测", "environmental-monitoring", "sustainable-environment-engineering"),
  tag("tag-green-chemical-engineering", "绿色化工", "green-chemical-engineering", "sustainable-environment-engineering", ["sustainable-environment-engineering", "chemical-biological-engineering"]),
  tag("tag-number-theory", "数论", "number-theory", "mathematics"),
  tag("tag-algebraic-geometry", "代数几何", "algebraic-geometry", "mathematics"),
  tag("tag-analysis", "分析", "analysis", "mathematics"),
  tag("tag-pde", "偏微分方程", "partial-differential-equations", "mathematics"),
  tag("tag-probability-statistics", "概率统计", "probability-statistics", "mathematics", ["mathematics", "public-health"]),
  tag("tag-scientific-computing", "科学计算", "scientific-computing", "mathematics", ["mathematics", "ai-data-science"]),
  tag("tag-dynamical-systems", "动力系统", "dynamical-systems", "mathematics", ["mathematics", "physics", "biology"]),
  tag("tag-condensed-matter", "凝聚态物理", "condensed-matter-physics", "physics"),
  tag("tag-quantum-physics", "量子物理", "quantum-physics", "physics"),
  tag("tag-atomic-molecular-physics", "原子分子物理", "atomic-molecular-physics", "physics"),
  tag("tag-optics", "光学", "optics", "physics"),
  tag("tag-laser-nanotechnology", "激光与纳米技术", "laser-nanotechnology", "physics", ["physics", "materials"]),
  tag("tag-catalysis-synthesis", "催化与合成", "catalysis-synthesis", "chemistry"),
  tag("tag-chemical-biology-chem", "化学生物学", "chemical-biology-chemistry", "chemistry", ["chemistry", "chemical-biology"]),
  tag("tag-materials-chemistry", "材料化学", "materials-chemistry", "chemistry", ["chemistry", "materials"]),
  tag("tag-theoretical-computational-chemistry", "理论与计算化学", "theoretical-computational-chemistry", "chemistry", ["chemistry", "molecular-energy-chemistry"]),
  tag("tag-analytical-methods", "分析方法", "analytical-methods", "chemistry"),
  tag("tag-artificial-photosynthesis", "人工光合作用", "artificial-photosynthesis", "molecular-energy-chemistry"),
  tag("tag-solar-fuels", "太阳能燃料", "solar-fuels", "molecular-energy-chemistry"),
  tag("tag-electrocatalysis", "电催化", "electrocatalysis", "molecular-energy-chemistry"),
  tag("tag-water-splitting", "水分解", "water-splitting", "molecular-energy-chemistry"),
  tag("tag-co2-reduction", "CO2还原", "co2-reduction", "molecular-energy-chemistry"),
  tag("tag-structural-biology", "结构生物学", "structural-biology", "biophysics-biochemistry"),
  tag("tag-cryo-em", "冷冻电镜", "cryo-em", "biophysics-biochemistry"),
  tag("tag-protein-complexes", "蛋白质复合物", "protein-complexes", "biophysics-biochemistry"),
  tag("tag-protein-modification", "蛋白质修饰", "protein-modification", "biophysics-biochemistry"),
  tag("tag-molecular-mechanisms", "分子机制", "molecular-mechanisms", "biophysics-biochemistry"),
  tag("tag-cell-cycle", "细胞周期", "cell-cycle", "cell-biology"),
  tag("tag-cell-migration", "细胞迁移", "cell-migration", "cell-biology"),
  tag("tag-organelles", "细胞器", "organelles", "cell-biology"),
  tag("tag-signal-transduction", "信号转导", "signal-transduction", "cell-biology"),
  tag("tag-tumor-cells", "肿瘤细胞", "tumor-cells", "cell-biology", ["cell-biology", "oncology-therapy"]),
  tag("tag-model-organisms", "模式生物", "model-organisms", "genetics-development"),
  tag("tag-stem-cells", "干细胞", "stem-cells", "genetics-development"),
  tag("tag-organ-development", "器官发育", "organ-development", "genetics-development"),
  tag("tag-regeneration", "再生", "regeneration", "genetics-development"),
  tag("tag-gene-regulation", "基因调控", "gene-regulation", "genetics-development"),
  tag("tag-neural-coding", "神经编码", "neural-coding", "neuroscience", ["neuroscience", "biology"]),
  tag("tag-neural-circuits", "神经环路", "neural-circuits", "neuroscience"),
  tag("tag-behavioral-decision-making", "行为决策", "behavioral-decision-making", "neuroscience"),
  tag("tag-neuroimmunology", "神经免疫", "neuroimmunology", "neuroscience", ["neuroscience", "immunology-microbiology"]),
  tag("tag-brain-diseases", "脑疾病", "brain-diseases", "neuroscience", ["neuroscience", "translational-medicine"]),
  tag("tag-neurovascular", "神经血管", "neurovascular", "neuroscience"),
  tag("tag-infection-immunity", "感染免疫", "infection-immunity", "immunology-microbiology"),
  tag("tag-pathogen-host-interaction", "病原宿主互作", "pathogen-host-interaction", "immunology-microbiology"),
  tag("tag-tissue-immunity", "组织免疫", "tissue-immunity", "immunology-microbiology"),
  tag("tag-vaccines", "疫苗", "vaccines", "immunology-microbiology", ["immunology-microbiology", "microbiology-vaccines"]),
  tag("tag-immunotherapy", "免疫治疗", "immunotherapy", "immunology-microbiology", ["immunology-microbiology", "oncology-therapy"]),
  tag("tag-synthetic-biology", "合成生物学", "synthetic-biology", "systems-synthetic-biology"),
  tag("tag-biomanufacturing", "生物制造", "biomanufacturing", "systems-synthetic-biology"),
  tag("tag-gene-circuits", "基因线路", "gene-circuits", "systems-synthetic-biology"),
  tag("tag-protein-engineering", "蛋白工程", "protein-engineering", "systems-synthetic-biology"),
  tag("tag-small-molecule-probes", "小分子探针", "small-molecule-probes", "chemical-biology"),
  tag("tag-drug-design", "药物设计", "drug-design", "chemical-biology", ["chemical-biology", "drug-discovery-public-health"]),
  tag("tag-peptide-design", "多肽设计", "peptide-design", "chemical-biology"),
  tag("tag-bioanalysis", "生物分析", "bioanalysis", "chemical-biology"),
  tag("tag-natural-products", "天然产物", "natural-products", "chemical-biology"),
  tag("tag-t-cell-differentiation", "T细胞分化", "t-cell-differentiation", "immunology-inflammation"),
  tag("tag-macrophages", "巨噬细胞", "macrophages", "immunology-inflammation"),
  tag("tag-immune-checkpoints", "免疫检查点", "immune-checkpoints", "immunology-inflammation", ["immunology-inflammation", "oncology-therapy"]),
  tag("tag-tissue-resident-immunity", "组织驻留免疫", "tissue-resident-immunity", "immunology-inflammation"),
  tag("tag-autoimmunity", "自身免疫", "autoimmunity", "immunology-inflammation"),
  tag("tag-pathogenic-microbes", "病原微生物", "pathogenic-microbes", "microbiology-vaccines"),
  tag("tag-viral-immunity", "病毒免疫", "viral-immunity", "microbiology-vaccines"),
  tag("tag-universal-vaccines", "通用疫苗", "universal-vaccines", "microbiology-vaccines"),
  tag("tag-microbiome", "微生物组", "microbiome", "microbiology-vaccines"),
  tag("tag-vaccine-design", "疫苗设计", "vaccine-design", "microbiology-vaccines"),
  tag("tag-tumor-immunotherapy", "肿瘤免疫治疗", "tumor-immunotherapy", "oncology-therapy"),
  tag("tag-tumor-microenvironment", "肿瘤微环境", "tumor-microenvironment", "oncology-therapy"),
  tag("tag-tumor-drug-resistance", "肿瘤耐药", "tumor-drug-resistance", "oncology-therapy"),
  tag("tag-radiotherapy-immunity", "放疗免疫", "radiotherapy-immunity", "oncology-therapy"),
  tag("tag-cell-therapy", "细胞治疗", "cell-therapy", "oncology-therapy"),
  tag("tag-glp-1", "GLP-1", "glp-1", "physiology-metabolism", ["physiology-metabolism", "translational-medicine"]),
  tag("tag-metabolic-disease", "代谢疾病", "metabolic-disease", "physiology-metabolism"),
  tag("tag-obesity", "肥胖", "obesity", "physiology-metabolism"),
  tag("tag-lipid-metabolism", "脂代谢", "lipid-metabolism", "physiology-metabolism"),
  tag("tag-organ-crosstalk", "器官互作", "organ-crosstalk", "physiology-metabolism"),
  tag("tag-gene-editing", "基因编辑", "gene-editing", "medical-genetics-rare-disease"),
  tag("tag-gene-therapy", "基因治疗", "gene-therapy", "medical-genetics-rare-disease"),
  tag("tag-genetic-screening", "遗传筛查", "genetic-screening", "medical-genetics-rare-disease"),
  tag("tag-rare-disease-models", "罕见病模型", "rare-disease-models", "medical-genetics-rare-disease"),
  tag("tag-mitochondrial-disease", "线粒体病", "mitochondrial-disease", "medical-genetics-rare-disease"),
  tag("tag-cns-diseases", "CNS疾病", "cns-diseases", "translational-medicine"),
  tag("tag-clinical-trials", "临床试验", "clinical-trials", "translational-medicine"),
  tag("tag-biomarkers", "生物标志物", "biomarkers", "translational-medicine"),
  tag("tag-patient-stratification", "患者分层", "patient-stratification", "translational-medicine"),
  tag("tag-real-world-evidence", "真实世界研究", "real-world-evidence", "translational-medicine", ["translational-medicine", "public-health"]),
  tag("tag-drug-targets", "药物靶点", "drug-targets", "drug-discovery-public-health"),
  tag("tag-drug-toxicology", "药物毒理", "drug-toxicology", "drug-discovery-public-health"),
  tag("tag-epidemiology", "流行病学", "epidemiology", "drug-discovery-public-health", ["drug-discovery-public-health", "public-health"]),
  tag("tag-public-health", "公共健康", "public-health-tag", "drug-discovery-public-health", ["drug-discovery-public-health", "public-health"]),
  tag("tag-drug-delivery", "药物递送", "drug-delivery", "drug-discovery-public-health"),
  tag("tag-bio-statistics", "生物统计", "biostatistics", "public-health", ["public-health", "biology", "mathematics"]),
  tag("tag-medical-imaging", "医学影像", "medical-imaging", "clinical-medicine", ["clinical-medicine", "biomedical-engineering", "ai-data-science"])
];

const topics = [
  {
    id: "topic-ai-discussion",
    title: "AI 导读真的能降低跨领域论文讨论门槛吗？",
    type: "QUESTION" as const,
    body:
      "最近在想，很多博士生愿意了解别的方向，但卡在第一步：不知道背景、概念和核心争议。AI 如果能在 topic 顶部提供外行可读导读，是否能让更多人敢于参与讨论？想听听不同学科的体验。",
    authorId: "user-demo",
    primaryDisciplineId: "computer-science",
    disciplineIds: ["computer-science"],
    tagIds: ["tag-human-ai", "tag-ml"],
    viewCount: 128,
    aiGuide:
      "这个 topic 讨论的是 AI 能否成为跨领域学术交流的脚手架。外领域读者可以重点关注三个问题：AI 导读是否能补齐背景知识、AI 问答是否能减少提问焦虑、AI 辅助发言是否能帮助把模糊直觉变成可讨论的论点。"
  },
  {
    id: "topic-neural-compression",
    title: "神经系统里的压缩表征和机器学习的表示学习有多像？",
    type: "IDEA" as const,
    body:
      "读到一篇关于感觉系统高效编码的综述，里面把神经活动看作对外界信息的压缩。我想知道这和机器学习中的 representation learning、信息瓶颈有没有可比之处，哪些类比是危险的？",
    paperTitle: "Efficient coding and sensory representation",
    paperUrl: "https://example.edu/papers/efficient-coding",
    authorId: "user-bio",
    primaryDisciplineId: "neuroscience",
    disciplineIds: ["neuroscience", "computer-science"],
    tagIds: ["tag-neural-coding", "tag-ml"],
    viewCount: 94,
    aiGuide:
      "这个 topic 试图比较神经科学中的高效编码和机器学习中的表示学习。参与讨论时，可以先区分两者的目标函数、数据来源和验证方式，再判断类比是否只是启发式语言，还是能形成可检验的假设。"
  },
  {
    id: "topic-medical-imaging-bias",
    title: "医学影像 AI 模型在跨医院数据上的失效该怎么讨论？",
    type: "PAPER" as const,
    body:
      "一篇论文提到模型在训练医院表现很好，但换到另一个医院后性能明显下降。想从统计、机器学习和临床实践三个角度讨论：这是 dataset shift、标注差异，还是 workflow 差异？",
    paperTitle: "External validation of medical imaging models",
    paperUrl: "https://example.edu/papers/external-validation",
    authorId: "user-med",
    primaryDisciplineId: "clinical-medicine",
    disciplineIds: ["clinical-medicine", "public-health", "computer-science"],
    tagIds: ["tag-medical-imaging", "tag-bio-statistics", "tag-ml"],
    viewCount: 177,
    aiGuide:
      "这个 topic 关注医学影像 AI 的外部验证问题。外领域读者可以把它理解为：模型在一个环境中学到的规律，换到另一个医院后是否仍然成立。关键切入点包括数据分布变化、标注标准变化、设备差异和临床流程差异。"
  },
  {
    id: "topic-materials-active-learning",
    title: "主动学习能不能减少材料实验里的试错成本？",
    type: "QUESTION" as const,
    body:
      "材料筛选实验成本很高，看到有人用 active learning 选择下一批实验样本。想请教做机器学习和材料的同学：这种方法在哪些场景下真的有效，什么时候只是把不确定性包装得很好看？",
    authorId: "user-demo",
    primaryDisciplineId: "materials",
    disciplineIds: ["materials", "computer-science"],
    tagIds: ["tag-materials-screening", "tag-ml"],
    viewCount: 76
  },
  {
    id: "topic-dynamical-systems-biology",
    title: "用动力系统语言理解细胞命运转换，会不会过度数学化？",
    type: "IDEA" as const,
    body:
      "很多文章用 attractor landscape 描述细胞状态转换。这个比喻很有启发，但我不确定它在实验可验证层面能给出多少东西。想邀请数学、生物和物理方向的同学一起拆一下。",
    authorId: "user-bio",
    primaryDisciplineId: "biology",
    disciplineIds: ["biology", "mathematics"],
    tagIds: ["tag-dynamical-systems", "tag-bio-statistics"],
    viewCount: 112
  }
];

const replies = [
  {
    id: "reply-ai-1",
    topicId: "topic-ai-discussion",
    authorId: "user-bio",
    body:
      "我觉得最大的帮助可能不是总结论文，而是把参与讨论的第一句话变简单。很多时候我不是没有想法，是不确定自己的问题会不会太外行。"
  },
  {
    id: "reply-ai-2",
    topicId: "topic-ai-discussion",
    authorId: "user-med",
    body:
      "医学方向还有一个问题是术语很密。AI 如果能把临床指标、数据来源和评价指标讲清楚，外领域同学可能更容易指出方法上的问题。"
  },
  {
    id: "reply-neural-1",
    topicId: "topic-neural-compression",
    authorId: "user-demo",
    body:
      "从机器学习角度看，representation learning 更强调任务目标和可优化损失。神经科学里的高效编码如果缺少明确 objective，类比时可能要小心。"
  },
  {
    id: "reply-med-1",
    topicId: "topic-medical-imaging-bias",
    authorId: "user-demo",
    body:
      "可以先区分 covariate shift 和 label shift，再看医院之间扫描设备、协议、患者群体和标注流程有没有变化。单看 AUC 下降可能很难定位原因。"
  },
  {
    id: "reply-dyn-1",
    topicId: "topic-dynamical-systems-biology",
    authorId: "user-med",
    body:
      "我会关心这个语言能不能产生新的实验设计。如果只是画出 landscape 解释已有现象，可能解释力强但预测力弱。"
  }
];

async function main() {
  for (const discipline of rootDisciplines) {
    await prisma.discipline.upsert({
      where: { id: discipline.id },
      update: discipline,
      create: discipline
    });
  }

  for (const discipline of childDisciplines) {
    await prisma.discipline.upsert({
      where: { id: discipline.id },
      update: discipline,
      create: discipline
    });
  }

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        school: "示例大学",
        department: user.department,
        researchField: user.researchField
      },
      create: {
        ...user,
        school: "示例大学",
        passwordHash: hashPassword("demo1234")
      }
    });
  }

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        disciplineId: tag.disciplineId,
        disciplines: {
          deleteMany: {},
          create: tag.disciplineIds.map((disciplineId) => ({ disciplineId }))
        }
      },
      create: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        disciplineId: tag.disciplineId,
        disciplines: {
          create: tag.disciplineIds.map((disciplineId) => ({ disciplineId }))
        }
      }
    });
  }

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: {
        title: topic.title,
        type: topic.type,
        body: topic.body,
        paperTitle: topic.paperTitle ?? null,
        paperUrl: topic.paperUrl ?? null,
        authorId: topic.authorId,
        primaryDisciplineId: topic.primaryDisciplineId,
        viewCount: topic.viewCount,
        tags: {
          deleteMany: {},
          create: topic.tagIds.map((tagId) => ({ tagId }))
        },
        disciplines: {
          deleteMany: {},
          create: topic.disciplineIds.map((disciplineId) => ({ disciplineId }))
        }
      },
      create: {
        id: topic.id,
        title: topic.title,
        type: topic.type,
        body: topic.body,
        paperTitle: topic.paperTitle ?? null,
        paperUrl: topic.paperUrl ?? null,
        authorId: topic.authorId,
        primaryDisciplineId: topic.primaryDisciplineId,
        viewCount: topic.viewCount,
        tags: {
          create: topic.tagIds.map((tagId) => ({ tagId }))
        },
        disciplines: {
          create: topic.disciplineIds.map((disciplineId) => ({ disciplineId }))
        }
      }
    });

    if (topic.aiGuide) {
      await prisma.aIGuide.upsert({
        where: { topicId: topic.id },
        update: {
          content: topic.aiGuide,
          model: "mock-seed"
        },
        create: {
          topicId: topic.id,
          content: topic.aiGuide,
          model: "mock-seed"
        }
      });
    }
  }

  for (const reply of replies) {
    await prisma.reply.upsert({
      where: { id: reply.id },
      update: reply,
      create: reply
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
