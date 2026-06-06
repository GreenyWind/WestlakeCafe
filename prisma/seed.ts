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
    name: "张一凡",
    email: "demo@university.edu",
    department: "计算机学院",
    researchField: "人机交互与科研工具"
  },
  {
    id: "user-bio",
    name: "李佳宁",
    email: "bio@university.edu",
    department: "生命科学学院",
    researchField: "神经科学"
  },
  {
    id: "user-med",
    name: "王思雨",
    email: "med@university.edu",
    department: "医学院",
    researchField: "医学影像"
  },
  {
    id: "user-ai-eng",
    name: "陈浩",
    email: "ai-eng@university.edu",
    department: "工学院",
    researchField: "AI for Science 与自主智能系统"
  },
  {
    id: "user-materials",
    name: "刘子涵",
    email: "materials@university.edu",
    department: "工学院",
    researchField: "材料设计与表征"
  },
  {
    id: "user-electronic",
    name: "赵明轩",
    email: "electronic@university.edu",
    department: "工学院",
    researchField: "微纳光电与智能传感"
  },
  {
    id: "user-math",
    name: "周雨桐",
    email: "math@university.edu",
    department: "理学院",
    researchField: "分析、几何与数学建模"
  },
  {
    id: "user-physics",
    name: "吴晨",
    email: "physics@university.edu",
    department: "理学院",
    researchField: "凝聚态物理与量子材料"
  },
  {
    id: "user-energy-chem",
    name: "黄俊杰",
    email: "energy-chem@university.edu",
    department: "理学院",
    researchField: "人工光合作用与电催化"
  },
  {
    id: "user-structural-bio",
    name: "孙佳怡",
    email: "structural-bio@university.edu",
    department: "生命科学学院",
    researchField: "结构生物学与生物大分子机制"
  },
  {
    id: "user-neuro",
    name: "胡宇航",
    email: "neuro@university.edu",
    department: "生命科学学院",
    researchField: "神经环路与行为"
  },
  {
    id: "user-synbio",
    name: "何思远",
    email: "synbio@university.edu",
    department: "生命科学学院",
    researchField: "系统与合成生物学"
  },
  {
    id: "user-trans-med",
    name: "郑晓彤",
    email: "trans-med@university.edu",
    department: "医学院",
    researchField: "转化医学与临床试验"
  },
  {
    id: "user-immunology",
    name: "高雅雯",
    email: "immunology@university.edu",
    department: "医学院",
    researchField: "免疫学与炎症"
  },
  {
    id: "user-oncology",
    name: "许文博",
    email: "oncology@university.edu",
    department: "医学院",
    researchField: "肿瘤生物学与治疗"
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
    authorId: "user-materials",
    primaryDisciplineId: "materials",
    disciplineIds: ["materials"],
    tagIds: ["tag-materials-screening", "tag-computational-materials", "tag-ml"],
    viewCount: 76,
    aiGuide:
      "术语解释：主动学习是让模型根据不确定性或信息增益挑选下一批实验样本；材料筛选指在大量候选材料中寻找性能最优或最稳健的组合。一句话摘要：这个 topic 想讨论机器学习能否真正减少材料实验中的试错成本。展开解释：关键问题不只是算法是否先进，而是已有数据是否覆盖足够多的失败样本、模型不确定性是否可信、实验噪声是否被纳入设计，以及下一批样本是否真的能改变研究判断。",
    oneLineSummary:
      "材料筛选实验成本很高，主动学习到底是在节省试错，还是把不确定性包装得更漂亮？"
  },
  {
    id: "topic-ai-physical-simulation",
    title: "物理仿真里的生成模型，能不能替代一部分数值求解？",
    type: "QUESTION" as const,
    body:
      "看到 AI for Science 方向里很多工作在用 diffusion、flow matching 或 surrogate model 加速复杂物理系统仿真。想讨论一个边界问题：如果生成模型能很快给出看似合理的流场或等离子体状态，它到底是在替代求解器，还是只适合做候选筛选和初值生成？",
    authorId: "user-ai-eng",
    primaryDisciplineId: "ai-data-science",
    disciplineIds: ["ai-data-science"],
    tagIds: ["tag-ai-science", "tag-generative-models", "tag-scientific-computing"],
    viewCount: 142,
    aiGuide:
      "术语解释：生成模型用于学习数据分布并生成新样本；数值求解器依据物理方程和边界条件求解系统状态。一句话摘要：这个 topic 讨论 AI 生成模型在物理仿真中能替代多少传统数值计算。展开解释：跨领域读者可以重点区分三件事：生成结果是否满足守恒律，模型在外推场景是否可靠，以及它在研究流程中承担的是快速近似、实验设计，还是最终证据。",
    oneLineSummary:
      "AI 生成的物理状态看起来越来越像真仿真，但它什么时候能成为证据，什么时候只是候选？"
  },
  {
    id: "topic-embodied-data-loop",
    title: "具身智能的数据闭环该怎么评估：仿真成功算不算成功？",
    type: "QUESTION" as const,
    body:
      "具身智能和自动驾驶都很依赖场景构建、数据闭环和世界模型。可是很多系统在仿真里表现不错，一到真实环境就掉得很厉害。想问做机器人、控制、计算机视觉的同学：我们该怎么设计一个不只看 benchmark 分数的评估方式？",
    authorId: "user-ai-eng",
    primaryDisciplineId: "ai-data-science",
    disciplineIds: ["ai-data-science"],
    tagIds: ["tag-embodied-intelligence", "tag-autonomous-systems", "tag-robot-learning", "tag-multimodal-models"],
    viewCount: 118,
    aiGuide:
      "术语解释：具身智能强调智能体通过身体与环境交互学习；数据闭环指系统根据真实或仿真反馈持续采集、训练和验证数据。一句话摘要：这个 topic 讨论具身智能系统如何从仿真表现走向真实可用。展开解释：重点可以放在 sim-to-real gap、任务分布变化、失败案例采集、长期稳定性和安全边界上，而不只是单次任务成功率。",
    oneLineSummary:
      "机器人在仿真里成功不等于真实环境可靠，关键是怎样设计能暴露失败的数据闭环。"
  },
  {
    id: "topic-protein-language-models",
    title: "蛋白质语言模型到底学到了结构规律，还是数据库偏差？",
    type: "QUESTION" as const,
    body:
      "现在蛋白质语言模型可以做结构预测、突变效应估计和序列生成。直觉上它像是学到了生物分子的语法，但训练数据又高度依赖已知序列库。想请教做 AI、生物信息和蛋白工程的同学：怎么判断模型学到的是可迁移规律，而不是数据库里的家族偏差？",
    authorId: "user-ai-eng",
    primaryDisciplineId: "ai-data-science",
    disciplineIds: ["ai-data-science"],
    tagIds: ["tag-protein-language-models", "tag-computational-biology", "tag-protein-engineering", "tag-ai-science"],
    viewCount: 165,
    aiGuide:
      "术语解释：蛋白质语言模型把氨基酸序列当作类似语言的对象学习表示；数据库偏差指训练集中某些蛋白家族、功能或物种被过度代表。一句话摘要：这个 topic 讨论蛋白质语言模型的泛化能力该如何验证。展开解释：可以从远缘同源蛋白、低相似度序列、实验突变数据和全新功能设计几个角度看模型是不是真的学到了结构和功能规律。",
    oneLineSummary:
      "蛋白质语言模型很会补全序列，但它学到的是生物规律，还是公共数据库里的偏好？"
  },
  {
    id: "topic-medical-ai-validation",
    title: "医学影像大模型做跨院泛化，最应该先卡哪一道验证？",
    type: "PAPER" as const,
    body:
      "智能生物医学电子和医学 AI 都在推动影像模型进入临床流程，但跨医院验证经常是最大阻力。除了 AUC、Dice 这类指标，我更想知道：不同设备、扫描协议、标注习惯和病例结构变化时，模型应该先通过哪种验证，才值得继续往临床协作推进？",
    authorId: "user-ai-eng",
    primaryDisciplineId: "ai-data-science",
    disciplineIds: ["ai-data-science"],
    tagIds: ["tag-medical-ai", "tag-medical-imaging", "tag-bio-statistics"],
    viewCount: 151,
    aiGuide:
      "术语解释：跨院泛化指模型从一个医院迁移到另一个医院仍保持性能；外部验证是在训练数据来源之外检验模型。一句话摘要：这个 topic 讨论医学影像大模型进入临床前最关键的验证环节。展开解释：外领域读者可以把问题拆成数据分布、设备差异、标注一致性、临床流程和失败后果五层，再判断单一指标是否足够。",
    oneLineSummary:
      "医学影像模型不是在一个数据集上赢就够了，真正难的是跨医院仍然可信。"
  },
  {
    id: "topic-solid-state-interfaces",
    title: "固态离子材料做能源器件，界面问题是不是比体相更关键？",
    type: "QUESTION" as const,
    body:
      "固态离子材料常被放在电池、能源和信息器件语境里讨论。很多性能瓶颈看起来不像来自材料体相本身，而是在电极/电解质界面、缺陷和局域化学环境。想问材料、电化学和表征方向的同学：什么证据能说明界面才是主要限制？",
    authorId: "user-materials",
    primaryDisciplineId: "materials",
    disciplineIds: ["materials"],
    tagIds: ["tag-energy-materials", "tag-materials-characterization", "tag-materials-chemistry"],
    viewCount: 104,
    aiGuide:
      "术语解释：固态离子材料依靠离子在固体中迁移实现储能或信息功能；界面问题指不同材料接触处的反应、缺陷和电荷传输障碍。一句话摘要：这个 topic 讨论能源器件性能瓶颈到底来自材料本体还是界面。展开解释：参与讨论时可以比较体相电导率、界面阻抗、原位表征和循环后失效形貌，避免只凭最终器件性能推断机制。",
    oneLineSummary:
      "固态能源器件的瓶颈常常藏在界面里，而不是材料体相的漂亮参数里。"
  },
  {
    id: "topic-nanophotonic-materials",
    title: "纳米光子材料从漂亮谱图到器件应用，中间最难跨哪一步？",
    type: "IDEA" as const,
    body:
      "纳米光子材料可以在 AR/VR、量子信息和健康传感里讲出很多应用前景，但论文里的光谱、显微表征和真实器件之间常有很长距离。想讨论：限制转化的主要是材料稳定性、加工一致性、集成工艺，还是应用场景本身不够明确？",
    authorId: "user-materials",
    primaryDisciplineId: "materials",
    disciplineIds: ["materials"],
    tagIds: ["tag-nanomaterials", "tag-materials-characterization", "tag-micro-nano-optoelectronics", "tag-optics"],
    viewCount: 96,
    aiGuide:
      "术语解释：纳米光子材料通过纳米尺度结构调控光与物质相互作用；器件应用要求材料性能能在可制造系统中稳定复现。一句话摘要：这个 topic 讨论纳米光子材料从基础表征到真实应用的转化障碍。展开解释：关键问题包括材料寿命、批次一致性、微纳加工兼容性、封装环境和应用指标是否与材料优势匹配。",
    oneLineSummary:
      "纳米光子材料的谱图可以很漂亮，但真正难的是把优势稳定地做进器件里。"
  },
  {
    id: "topic-biomaterials-immunity",
    title: "可降解医用材料的免疫反应，应该怎样和力学性能一起讨论？",
    type: "QUESTION" as const,
    body:
      "医用材料经常需要同时满足力学支撑、可降解性、生物相容性和免疫调控。可是材料论文里这些指标常被分开评价。想问做材料、免疫和组织工程的同学：如果一个材料力学性能很好，但诱导了不理想的局部免疫反应，应该怎么权衡？",
    authorId: "user-materials",
    primaryDisciplineId: "materials",
    disciplineIds: ["materials"],
    tagIds: ["tag-biomaterials", "tag-medical-materials", "tag-tissue-immunity", "tag-materials-characterization"],
    viewCount: 87,
    aiGuide:
      "术语解释：可降解医用材料会在体内逐步分解；免疫反应决定材料周围组织是修复、炎症还是纤维化。一句话摘要：这个 topic 讨论医用材料评价时如何同时看力学和免疫结果。展开解释：跨领域读者可以把它理解为材料不是静态支架，而是会与细胞和组织长期互动的系统。",
    oneLineSummary:
      "医用材料不能只看强度和降解速度，局部免疫反应可能决定它最终能不能用。"
  },
  {
    id: "topic-optoelectronic-fabrication",
    title: "微纳光电芯片里，器件性能和可制造性哪个应该先被优化？",
    type: "QUESTION" as const,
    body:
      "微纳光电系统集成听起来同时依赖材料、器件设计、加工和封装。很多概念验证器件性能很高，但工艺窗口窄、良率低。想讨论：做早期研究时应该先追求极限性能，还是更早把可制造性和系统集成放进评价标准？",
    authorId: "user-electronic",
    primaryDisciplineId: "electronic-info",
    disciplineIds: ["electronic-info"],
    tagIds: ["tag-micro-nano-optoelectronics", "tag-integrated-circuits", "tag-semiconductor-devices"],
    viewCount: 111,
    aiGuide:
      "术语解释：微纳光电芯片把光学、电学和纳米加工结合到小尺度器件中；可制造性关注工艺是否稳定、可重复和可放大。一句话摘要：这个 topic 讨论早期光电子器件研究该如何平衡性能和工艺。展开解释：可从单器件指标、批量良率、封装兼容性、测试标准和系统级收益几个角度展开。",
    oneLineSummary:
      "微纳光电芯片不只要单个器件跑得好，还要能被稳定地做出来。"
  },
  {
    id: "topic-bci-chip-bottleneck",
    title: "脑机接口芯片的信号处理瓶颈是在电极、算法还是系统封装？",
    type: "QUESTION" as const,
    body:
      "脑机接口智能芯片系统涉及神经信号采集、低噪声电路、片上处理、无线通信和长期植入安全性。想请教电子、神经和医学方向的同学：如果一个系统解码效果不好，我们怎么判断问题主要来自电极质量、算法建模，还是封装和生物环境？",
    authorId: "user-electronic",
    primaryDisciplineId: "electronic-info",
    disciplineIds: ["electronic-info"],
    tagIds: ["tag-brain-computer-chips", "tag-bioelectronics", "tag-intelligent-sensing", "tag-neural-coding"],
    viewCount: 133,
    aiGuide:
      "术语解释：脑机接口芯片把神经信号采集和处理集成到硬件系统里；信号处理瓶颈可能来自生物界面、电子噪声或算法泛化。一句话摘要：这个 topic 讨论脑机接口系统失效时如何定位主要限制。展开解释：讨论可以沿着信号链展开：神经信号源、电极接触、模拟前端、数字处理、模型解码和长期稳定性。",
    oneLineSummary:
      "脑机接口解码不好时，问题可能不在算法，而在整条神经信号链的任意一环。"
  },
  {
    id: "topic-terahertz-photonic-sensing",
    title: "太赫兹/光子器件做传感，怎么判断它比传统方案真的有优势？",
    type: "IDEA" as const,
    body:
      "太赫兹光子学、计算成像和智能传感都能提供新的检测方式，但很多应用场景已经有成熟的电学、光学或化学传感方案。想讨论：在什么指标上赢，才算这种新器件路线真的值得推进？灵敏度、选择性、速度、成本还是可部署性？",
    authorId: "user-electronic",
    primaryDisciplineId: "electronic-info",
    disciplineIds: ["electronic-info"],
    tagIds: ["tag-intelligent-sensing", "tag-micro-nano-optoelectronics", "tag-optics"],
    viewCount: 73,
    aiGuide:
      "术语解释：太赫兹和光子器件利用特定频段电磁波与材料或生物样品相互作用；传感优势需要和已有技术比较。一句话摘要：这个 topic 讨论新型光电子传感路线的评价标准。展开解释：不要只看实验室灵敏度，还要看样品制备、环境鲁棒性、设备复杂度、校准成本和目标应用是否真的需要这种频段。",
    oneLineSummary:
      "新型光子传感器要证明自己，不是参数漂亮就够了，而是要在真实场景里赢过成熟方案。"
  },
  {
    id: "topic-flexible-electronics-health",
    title: "柔性电子用于健康监测，实验室 demo 到长期佩戴差在哪？",
    type: "QUESTION" as const,
    body:
      "柔性电子和生物电子很适合做可穿戴健康监测，但 demo 里的短时信号往往不能代表长期使用。皮肤贴附、汗液、运动伪影、功耗和数据解释都会影响实际效果。想问做电子、材料和医学的同学：长期佩戴最容易被低估的问题是什么？",
    authorId: "user-electronic",
    primaryDisciplineId: "electronic-info",
    disciplineIds: ["electronic-info"],
    tagIds: ["tag-bioelectronics", "tag-smart-healthcare-systems", "tag-intelligent-sensing", "tag-semiconductor-devices"],
    viewCount: 91,
    aiGuide:
      "术语解释：柔性电子强调器件可弯折、贴附或随人体运动；健康监测要求长期、稳定、可解释的数据。一句话摘要：这个 topic 讨论可穿戴健康电子从实验室演示到真实使用的落差。展开解释：关键变量包括机械舒适性、传感漂移、运动干扰、供电方式、数据隐私和医学解释责任。",
    oneLineSummary:
      "柔性健康电子最难的不是贴上去能测到信号，而是长期佩戴还稳定、舒适、可解释。"
  },
  {
    id: "topic-pde-neural-operator",
    title: "神经算子求解 PDE，什么时候比传统数值方法更值得用？",
    type: "QUESTION" as const,
    body:
      "最近看到不少 neural operator、physics-informed learning 用来近似 PDE 解算子。它们在很多 benchmark 上很快，但传统有限元、谱方法也有成熟误差分析。想讨论：如果问题几何、边界条件或参数分布变化，神经算子的优势还在吗？",
    authorId: "user-math",
    primaryDisciplineId: "mathematics",
    disciplineIds: ["mathematics", "ai-data-science"],
    tagIds: ["tag-pde", "tag-scientific-computing", "tag-ml"],
    viewCount: 122,
    aiGuide:
      "术语解释：PDE 是描述连续系统变化的偏微分方程；神经算子试图学习从方程参数到解函数的映射。一句话摘要：这个 topic 讨论机器学习求解 PDE 的适用边界。展开解释：跨领域读者可以从误差可控性、分布外泛化、几何变化、计算成本和物理约束五个角度比较神经方法与传统数值方法。",
    oneLineSummary:
      "神经算子可以很快给出 PDE 近似解，但它什么时候比成熟数值方法更可靠？"
  },
  {
    id: "topic-optimal-transport-biology",
    title: "最优传输用于单细胞轨迹推断，数学假设会不会太强？",
    type: "QUESTION" as const,
    body:
      "单细胞数据分析里常用 optimal transport 推断细胞群体从一个状态到另一个状态的迁移。这个框架很优雅，但我不确定它对细胞数量守恒、代价函数和时间采样的假设是否符合真实发育过程。想听数学和生物方向的看法。",
    authorId: "user-math",
    primaryDisciplineId: "mathematics",
    disciplineIds: ["mathematics", "cell-biology", "genetics-development"],
    tagIds: ["tag-analysis", "tag-probability-statistics", "tag-cell-cycle", "tag-gene-regulation"],
    viewCount: 98,
    aiGuide:
      "术语解释：最优传输研究如何以最小代价把一个分布搬运到另一个分布；单细胞轨迹推断试图从不同时间点细胞状态估计发育路径。一句话摘要：这个 topic 讨论优雅数学框架在生物数据中的假设是否过强。展开解释：关键问题包括细胞是否守恒、代价函数是否有生物意义、采样时间是否足够密，以及推断轨迹能否被实验验证。",
    oneLineSummary:
      "最优传输让单细胞轨迹看起来很清楚，但它背后的守恒和代价假设是否真的成立？"
  },
  {
    id: "topic-random-matrix-deep-learning",
    title: "随机矩阵理论能解释深度网络的泛化吗，还是只是事后语言？",
    type: "IDEA" as const,
    body:
      "很多深度学习论文会用谱分布、Hessian、随机矩阵来解释训练稳定性和泛化。数学上这些工具很有力量，但真实网络结构、优化过程和数据分布都很复杂。想讨论哪些结论是真的可检验，哪些只是给经验现象换了一套语言。",
    authorId: "user-math",
    primaryDisciplineId: "mathematics",
    disciplineIds: ["mathematics", "ai-data-science"],
    tagIds: ["tag-probability-statistics", "tag-ml", "tag-analysis"],
    viewCount: 135,
    aiGuide:
      "术语解释：随机矩阵理论研究大规模随机矩阵的谱性质；深度网络泛化指模型在未见数据上的表现。一句话摘要：这个 topic 讨论数学理论能否真正解释深度学习的经验现象。展开解释：可以区分理论模型、真实网络、可观测指标和可干预实验，避免把漂亮的谱图直接等同于机制解释。",
    oneLineSummary:
      "随机矩阵给深度网络提供了漂亮解释，但这些解释能不能被真正检验？"
  },
  {
    id: "topic-dynamical-systems-neurons",
    title: "神经元群体活动的低维动力学，是机制还是可视化工具？",
    type: "QUESTION" as const,
    body:
      "神经科学里常用低维流形、吸引子和动力系统描述群体神经活动。它们能把复杂数据画得很清楚，但我想知道：这些低维结构什么时候可以被当作机制，什么时候只是降维后的可视化结果？",
    authorId: "user-math",
    primaryDisciplineId: "mathematics",
    disciplineIds: ["mathematics", "neuroscience"],
    tagIds: ["tag-dynamical-systems", "tag-neural-coding", "tag-neural-circuits"],
    viewCount: 117,
    aiGuide:
      "术语解释：低维动力学把高维神经活动表示成少数关键变量随时间演化；机制解释需要能产生可验证预测。一句话摘要：这个 topic 讨论神经数据中的低维结构到底代表什么。展开解释：重点在于区分数据压缩、统计描述和因果机制，尤其要看模型能否预测扰动、行为变化或跨任务泛化。",
    oneLineSummary:
      "神经活动降到低维后很漂亮，但漂亮轨迹不一定就是神经系统的机制。"
  },
  {
    id: "topic-quantum-materials-defects",
    title: "量子材料里的缺陷，是噪声来源还是可利用的自由度？",
    type: "QUESTION" as const,
    body:
      "在凝聚态和量子材料研究里，缺陷常常被当作样品不完美的来源。但在某些体系中，缺陷态也可能带来局域磁性、发光中心或新的输运行为。想讨论：什么时候应该把缺陷消掉，什么时候应该把它当作可设计对象？",
    authorId: "user-physics",
    primaryDisciplineId: "physics",
    disciplineIds: ["physics", "materials"],
    tagIds: ["tag-condensed-matter", "tag-quantum-physics", "tag-materials-characterization"],
    viewCount: 128,
    aiGuide:
      "术语解释：量子材料的电子、磁性或拓扑性质依赖量子效应；缺陷是晶体结构中的局域不完美。一句话摘要：这个 topic 讨论材料缺陷到底是问题还是机会。展开解释：可以从缺陷浓度、空间分布、能级结构、可控制备和器件需求几个维度判断缺陷是噪声还是功能来源。",
    oneLineSummary:
      "量子材料里的缺陷不一定只是坏事，有时它本身就是可以设计的功能单元。"
  },
  {
    id: "topic-ultrafast-spectroscopy",
    title: "超快光谱看到的相变过程，如何和静态结构表征对上？",
    type: "PAPER" as const,
    body:
      "超快光谱能看到飞秒到皮秒尺度的电子和晶格响应，但材料结构表征往往是静态或较慢时间尺度。想讨论：当超快信号显示某种瞬态相变时，我们该如何确认它不是热效应、载流子动力学或仪器响应造成的假象？",
    authorId: "user-physics",
    primaryDisciplineId: "physics",
    disciplineIds: ["physics", "materials", "chemistry"],
    tagIds: ["tag-optics", "tag-condensed-matter", "tag-materials-characterization", "tag-analytical-methods"],
    viewCount: 101,
    aiGuide:
      "术语解释：超快光谱用极短激光脉冲观察物质的快速响应；相变指材料电子、结构或磁性状态发生改变。一句话摘要：这个 topic 讨论动态光谱信号如何与材料结构证据互相验证。展开解释：关键是把时间尺度、泵浦强度、热效应、对照实验和其他表征手段结合起来判断。",
    oneLineSummary:
      "超快光谱能拍到很快的材料响应，但要证明那真是相变，需要和结构证据对上。"
  },
  {
    id: "topic-quantum-sensing-biology",
    title: "量子传感用于生物测量，优势究竟来自量子效应还是工程优化？",
    type: "IDEA" as const,
    body:
      "量子传感常被用于高灵敏磁场、温度或微弱信号检测，也有人讨论它在生物体系中的应用。想问物理、生物和电子方向的同学：如果一个传感系统表现很好，我们怎么判断优势来自量子态本身，而不是样品制备、光学系统或信号处理优化？",
    authorId: "user-physics",
    primaryDisciplineId: "physics",
    disciplineIds: ["physics", "electronic-info", "biology"],
    tagIds: ["tag-quantum-physics", "tag-intelligent-sensing", "tag-bioanalysis"],
    viewCount: 89,
    aiGuide:
      "术语解释：量子传感利用量子态对外界扰动的敏感性测量微弱信号；生物测量需要在复杂、噪声多的环境中工作。一句话摘要：这个 topic 讨论量子传感在生物场景中的真实优势来源。展开解释：评估时要区分量子极限、工程优化、样品处理和数据分析带来的改进。",
    oneLineSummary:
      "量子传感听起来很强，但在生物测量里真正赢的可能是整套工程系统。"
  },
  {
    id: "topic-moire-correlations",
    title: "莫尔超晶格中的强关联现象，外领域读者该从哪儿进入？",
    type: "QUESTION" as const,
    body:
      "莫尔材料里常出现超导、关联绝缘态和拓扑能带等现象。对非凝聚态方向的人来说，概念密度非常高。想请做物理的同学帮忙拆一下：如果只想理解这类论文的核心逻辑，最少需要先掌握哪些背景？",
    authorId: "user-physics",
    primaryDisciplineId: "physics",
    disciplineIds: ["physics", "materials"],
    tagIds: ["tag-condensed-matter", "tag-quantum-physics", "tag-nanomaterials"],
    viewCount: 147,
    aiGuide:
      "术语解释：莫尔超晶格由两层材料错角叠加形成长周期结构；强关联指电子之间相互作用主导材料性质。一句话摘要：这个 topic 旨在为外领域读者拆解莫尔材料论文的入门路径。展开解释：可以从能带、填充数、相互作用、低温输运和实验可调参数几个概念开始，不必一开始就追完整理论细节。",
    oneLineSummary:
      "莫尔材料论文概念密度很高，但可以从能带、填充数和电子相互作用三件事进入。"
  },
  {
    id: "topic-artificial-photosynthesis-selectivity",
    title: "人工光合作用里，选择性和效率哪个更应该先优化？",
    type: "QUESTION" as const,
    body:
      "人工光合作用和太阳能燃料研究常同时追求高效率、高选择性和长期稳定性。但在 CO2 还原、水分解等体系里，这几个指标经常互相牵制。想讨论：早期催化剂设计到底应该先看选择性，还是先把总效率做上去？",
    authorId: "user-energy-chem",
    primaryDisciplineId: "molecular-energy-chemistry",
    disciplineIds: ["molecular-energy-chemistry", "chemistry"],
    tagIds: ["tag-artificial-photosynthesis", "tag-solar-fuels", "tag-co2-reduction", "tag-electrocatalysis"],
    viewCount: 138,
    aiGuide:
      "术语解释：人工光合作用试图模拟自然光合作用，把太阳能转化为化学燃料；选择性指反应主要生成目标产物。一句话摘要：这个 topic 讨论能源催化中效率、选择性和稳定性的取舍。展开解释：跨领域读者可以把它理解为不仅要反应快，还要产物对、寿命长，并且能在实际系统中运行。",
    oneLineSummary:
      "人工光合作用不只是效率竞赛，产物选择性和稳定性常常决定路线是否有意义。"
  },
  {
    id: "topic-co2-reduction-operando",
    title: "CO2 还原催化剂的真实活性位点，原位表征能证明到什么程度？",
    type: "PAPER" as const,
    body:
      "CO2 电还原论文里经常讨论催化剂在反应中重构，真正活性位点可能不是反应前看到的结构。原位/准原位表征能提供很多证据，但我想知道：什么组合证据足以支持一个活性位点判断，而不是只是相关性？",
    authorId: "user-energy-chem",
    primaryDisciplineId: "molecular-energy-chemistry",
    disciplineIds: ["molecular-energy-chemistry", "materials"],
    tagIds: ["tag-co2-reduction", "tag-electrocatalysis", "tag-materials-characterization", "tag-catalysis-synthesis"],
    viewCount: 119,
    aiGuide:
      "术语解释：CO2 还原把二氧化碳转化为一氧化碳、甲酸或多碳产物；原位表征是在反应过程中观察催化剂状态。一句话摘要：这个 topic 讨论如何证明催化剂的真实活性位点。展开解释：需要结合反应前后结构、原位谱学、同位素实验、动力学关系和理论计算，避免把伴随变化误认为因果机制。",
    oneLineSummary:
      "CO2 还原催化剂会在反应中变化，真正难的是证明哪个结构才是活性位点。"
  },
  {
    id: "topic-water-splitting-stability",
    title: "水分解催化剂的稳定性测试，多少小时才算有说服力？",
    type: "QUESTION" as const,
    body:
      "水分解和电催化论文里经常给出几十小时或上百小时稳定性测试。但如果未来要进入实际器件，这个时间尺度可能仍然很短。想请教做催化、材料和工程的同学：实验室论文中的稳定性证据应该怎样解读？",
    authorId: "user-energy-chem",
    primaryDisciplineId: "molecular-energy-chemistry",
    disciplineIds: ["molecular-energy-chemistry", "materials"],
    tagIds: ["tag-water-splitting", "tag-electrocatalysis", "tag-energy-materials"],
    viewCount: 106,
    aiGuide:
      "术语解释：水分解催化剂帮助把水转化为氢气和氧气；稳定性测试评估催化剂长时间工作后性能是否衰减。一句话摘要：这个 topic 讨论实验室稳定性数据能否支撑实际应用判断。展开解释：需要看测试电流密度、电解质条件、器件结构、失活机制和是否有加速老化证据。",
    oneLineSummary:
      "水分解催化剂跑几十小时不坏很重要，但离真实器件寿命还有很长距离。"
  },
  {
    id: "topic-solar-fuels-systems",
    title: "太阳能燃料体系的瓶颈，是催化剂本身还是系统耦合？",
    type: "IDEA" as const,
    body:
      "很多太阳能燃料工作会分别优化吸光材料、催化剂和反应器，但完整系统中光吸收、电荷分离、传质和产物分离会相互影响。想讨论：如果单个组件指标已经不错，下一步最应该补的是哪类系统级评价？",
    authorId: "user-energy-chem",
    primaryDisciplineId: "molecular-energy-chemistry",
    disciplineIds: ["molecular-energy-chemistry", "sustainable-environment-engineering"],
    tagIds: ["tag-solar-fuels", "tag-artificial-photosynthesis", "tag-green-chemical-engineering", "tag-co2-conversion"],
    viewCount: 94,
    aiGuide:
      "术语解释：太阳能燃料体系把光能转成可储存化学能；系统耦合指吸光、电荷转移、催化和分离过程必须协同。一句话摘要：这个 topic 讨论能源化学从单组件性能走向完整系统的挑战。展开解释：参与者可以关注组件匹配、能量损失、质量传输、产物分离和可放大性。",
    oneLineSummary:
      "太阳能燃料不只是催化剂问题，完整系统里的耦合损失可能才是瓶颈。"
  },
  {
    id: "topic-cryoem-conformational-heterogeneity",
    title: "冷冻电镜里的构象异质性，是噪声还是生物机制？",
    type: "QUESTION" as const,
    body:
      "很多膜蛋白和蛋白复合物的冷冻电镜数据里会看到多个构象状态。结构生物学上这很诱人，但也可能来自样品制备、分类算法或颗粒质量差异。想讨论：什么证据能支持这些构象状态真的对应功能循环，而不是数据处理出来的分类？",
    authorId: "user-structural-bio",
    primaryDisciplineId: "biophysics-biochemistry",
    disciplineIds: ["biophysics-biochemistry", "ai-data-science"],
    tagIds: ["tag-cryo-em", "tag-protein-complexes", "tag-molecular-mechanisms", "tag-ml"],
    viewCount: 131,
    aiGuide:
      "术语解释：冷冻电镜用于解析生物大分子结构；构象异质性指同一种分子在样品中存在多个形态。一句话摘要：这个 topic 讨论冷冻电镜中的多个结构状态如何被解释为生物机制。展开解释：关键在于结合样品制备、三维分类、功能实验、突变验证和动力学证据，避免把算法分群直接当作机制。",
    oneLineSummary:
      "冷冻电镜看到多个构象很兴奋，但要证明它们是功能状态，还需要结构之外的证据。"
  },
  {
    id: "topic-membrane-protein-lipid-context",
    title: "膜蛋白结构如果脱离脂质环境，还能解释真实功能吗？",
    type: "QUESTION" as const,
    body:
      "很多膜蛋白结构是在去垢剂、纳米盘或人工体系中解析的，但真实细胞膜里的脂质组成、曲率和局部拥挤可能影响功能。想问做结构、生物物理和细胞方向的同学：什么时候体外结构足够解释机制，什么时候必须回到细胞环境？",
    authorId: "user-structural-bio",
    primaryDisciplineId: "biophysics-biochemistry",
    disciplineIds: ["biophysics-biochemistry", "cell-biology"],
    tagIds: ["tag-structural-biology", "tag-protein-complexes", "tag-organelles", "tag-molecular-mechanisms"],
    viewCount: 109,
    aiGuide:
      "术语解释：膜蛋白嵌在细胞膜中执行转运、信号和感知功能；脂质环境会影响膜蛋白构象和活性。一句话摘要：这个 topic 讨论体外结构能否充分解释细胞内功能。展开解释：可以比较纯化体系、纳米盘、细胞内定位、功能读数和突变实验，判断结构解释是否脱离真实环境。",
    oneLineSummary:
      "膜蛋白结构很精细，但离开真实脂质环境后，机制解释可能会少一块。"
  },
  {
    id: "topic-protein-modification-structure",
    title: "蛋白质修饰改变结构，还是只是改变相互作用网络？",
    type: "IDEA" as const,
    body:
      "磷酸化、乙酰化、泛素化等蛋白质修饰经常被说成调控蛋白功能。有些修饰可能直接改变构象，也有些只是改变蛋白之间的结合。想讨论：在解释一个修饰位点时，结构证据和细胞功能证据应该怎么配合？",
    authorId: "user-structural-bio",
    primaryDisciplineId: "biophysics-biochemistry",
    disciplineIds: ["biophysics-biochemistry", "cell-biology"],
    tagIds: ["tag-protein-modification", "tag-signal-transduction", "tag-molecular-mechanisms"],
    viewCount: 92,
    aiGuide:
      "术语解释：蛋白质修饰是在蛋白特定位点添加化学基团；相互作用网络指蛋白与其他分子之间的结合关系。一句话摘要：这个 topic 讨论蛋白修饰的机制解释到底该落在结构变化还是网络变化上。展开解释：可以从修饰位点位置、构象变化、结合实验、细胞表型和可逆性几个层次来判断。",
    oneLineSummary:
      "一个修饰位点不一定直接改结构，也可能是在重排蛋白之间的关系。"
  },
  {
    id: "topic-ai-protein-complex-design",
    title: "AI 设计蛋白复合物，怎么证明它不是只会生成漂亮模型？",
    type: "QUESTION" as const,
    body:
      "蛋白设计模型现在能生成很像真的复合物结构，也能给出很高的预测置信度。但真正有用的复合物要能表达、折叠、结合、稳定，还要有功能。想问做结构、生物化学和 AI 的同学：实验验证应该从哪几步开始？",
    authorId: "user-structural-bio",
    primaryDisciplineId: "biophysics-biochemistry",
    disciplineIds: ["biophysics-biochemistry", "ai-data-science", "systems-synthetic-biology"],
    tagIds: ["tag-protein-complexes", "tag-protein-engineering", "tag-protein-language-models", "tag-ai-science"],
    viewCount: 158,
    aiGuide:
      "术语解释：蛋白复合物由多个蛋白组装执行功能；AI 蛋白设计用模型生成候选序列或结构。一句话摘要：这个 topic 讨论 AI 设计蛋白从计算模型走向实验功能的验证路径。展开解释：关键步骤包括表达、纯化、结合测定、结构验证、稳定性测试和功能实验，而不是只看预测结构是否好看。",
    oneLineSummary:
      "AI 设计的蛋白复合物看起来像真的，下一步要证明它能表达、结合并产生功能。"
  },
  {
    id: "topic-neural-circuit-causality",
    title: "神经环路研究里，相关活动什么时候能算因果机制？",
    type: "QUESTION" as const,
    body:
      "钙成像、电生理和行为实验可以记录大量神经元活动，但从相关活动到因果机制之间隔着很远。想讨论：如果某群神经元在行为前被激活，什么干预和对照能支持它们真的参与决策，而不是只是伴随变化？",
    authorId: "user-neuro",
    primaryDisciplineId: "neuroscience",
    disciplineIds: ["neuroscience", "mathematics"],
    tagIds: ["tag-neural-circuits", "tag-behavioral-decision-making", "tag-neural-coding", "tag-dynamical-systems"],
    viewCount: 144,
    aiGuide:
      "术语解释：神经环路是相互连接的神经元网络；因果机制要求干预神经活动会改变行为或生理结果。一句话摘要：这个 topic 讨论神经记录中的相关性如何走向因果解释。展开解释：需要结合时间顺序、光遗传或药理干预、行为对照、细胞类型特异性和模型预测。",
    oneLineSummary:
      "神经元活动和行为相关很常见，真正难的是证明它们在因果链上。"
  },
  {
    id: "topic-neuroimmune-brain-disease",
    title: "神经免疫在脑疾病里是原因、结果，还是修复反应？",
    type: "QUESTION" as const,
    body:
      "很多 CNS 疾病研究都会看到小胶质细胞、炎症因子和免疫通路变化。但这些变化可能是病因，也可能是神经损伤后的反应。想请教神经、免疫和医学方向的同学：怎么设计实验区分这几种解释？",
    authorId: "user-neuro",
    primaryDisciplineId: "neuroscience",
    disciplineIds: ["neuroscience", "immunology-microbiology", "translational-medicine"],
    tagIds: ["tag-neuroimmunology", "tag-brain-diseases", "tag-tissue-immunity", "tag-cns-diseases"],
    viewCount: 126,
    aiGuide:
      "术语解释：神经免疫研究免疫系统与神经系统的相互作用；CNS 疾病包括中枢神经系统退行、炎症或损伤相关疾病。一句话摘要：这个 topic 讨论脑疾病中的免疫变化如何被解释为原因或结果。展开解释：关键在时间序列、细胞类型、干预实验、疾病模型和人类样本证据之间建立联系。",
    oneLineSummary:
      "脑疾病里看到免疫变化不等于找到病因，它也可能是损伤后的修复或副作用。"
  },
  {
    id: "topic-behavioral-decision-models",
    title: "动物行为决策模型，能不能跨物种比较？",
    type: "IDEA" as const,
    body:
      "行为决策研究常用小鼠、果蝇或灵长类动物建立任务模型。模型越抽象越容易比较，但也越可能丢掉物种特异的生态背景。想讨论：跨物种比较时，应该保留哪些行为变量，哪些神经机制不应该强行类比？",
    authorId: "user-neuro",
    primaryDisciplineId: "neuroscience",
    disciplineIds: ["neuroscience", "biology"],
    tagIds: ["tag-behavioral-decision-making", "tag-model-organisms", "tag-neural-circuits"],
    viewCount: 83,
    aiGuide:
      "术语解释：行为决策模型用实验任务描述动物如何根据感知和奖励做选择；跨物种比较试图寻找不同动物共有或不同的机制。一句话摘要：这个 topic 讨论神经行为模型跨物种迁移的边界。展开解释：需要同时考虑任务结构、感知通道、生态行为、神经解剖和可测量变量。",
    oneLineSummary:
      "动物决策模型跨物种比较很诱人，但抽象过头可能会抹掉真实生态差异。"
  },
  {
    id: "topic-neurovascular-coupling",
    title: "神经血管耦合信号能代表神经活动本身吗？",
    type: "PAPER" as const,
    body:
      "fMRI、光学成像和一些脑疾病研究都依赖神经血管耦合信号。但血流、代谢和神经放电之间不是一一对应关系。想讨论：在解释脑功能或病理变化时，哪些情况下可以信任血管信号，哪些情况下需要额外神经记录？",
    authorId: "user-neuro",
    primaryDisciplineId: "neuroscience",
    disciplineIds: ["neuroscience", "clinical-medicine"],
    tagIds: ["tag-neurovascular", "tag-neural-coding", "tag-medical-imaging"],
    viewCount: 97,
    aiGuide:
      "术语解释：神经血管耦合指神经活动引发局部血流和代谢变化；许多脑成像信号间接依赖这一关系。一句话摘要：这个 topic 讨论脑成像中的血管信号是否能代表神经活动。展开解释：要考虑疾病状态、血管反应性、时间分辨率、空间分辨率和是否有电生理或钙成像验证。",
    oneLineSummary:
      "脑成像里的血流信号很有用，但它不是神经放电的直接替身。"
  },
  {
    id: "topic-synthetic-biology-kill-switch",
    title: "合成生物学里的安全开关，实验室有效就够了吗？",
    type: "QUESTION" as const,
    body:
      "工程化微生物或细胞治疗系统常会设计 kill switch、营养依赖或环境响应开关。实验室环境下这些开关可能很好用，但真实环境有突变、选择压力和复杂生态位。想讨论：安全开关需要怎样验证，才足以进入更复杂场景？",
    authorId: "user-synbio",
    primaryDisciplineId: "systems-synthetic-biology",
    disciplineIds: ["systems-synthetic-biology", "immunology-microbiology"],
    tagIds: ["tag-synthetic-biology", "tag-gene-circuits", "tag-pathogen-host-interaction", "tag-biomanufacturing"],
    viewCount: 129,
    aiGuide:
      "术语解释：安全开关是让工程化生物系统在特定条件下停止生长或失活的设计；选择压力可能让系统逃逸设计约束。一句话摘要：这个 topic 讨论合成生物安全机制从实验室走向复杂环境的验证问题。展开解释：关键在突变率、长期稳定性、生态竞争、检测方式和失败后果。",
    oneLineSummary:
      "合成生物安全开关在培养皿里有效，不代表它在复杂环境里不会被进化绕过。"
  },
  {
    id: "topic-gene-circuits-noise",
    title: "基因线路里的噪声，是设计缺陷还是可利用资源？",
    type: "IDEA" as const,
    body:
      "合成基因线路常希望输出稳定、可控，但细胞内噪声不可避免。有些系统甚至利用噪声产生分化、记忆或群体层面的多样性。想问做系统生物学、数学和工程的同学：什么时候应该压低噪声，什么时候应该把噪声纳入设计？",
    authorId: "user-synbio",
    primaryDisciplineId: "systems-synthetic-biology",
    disciplineIds: ["systems-synthetic-biology", "mathematics"],
    tagIds: ["tag-gene-circuits", "tag-synthetic-biology", "tag-dynamical-systems", "tag-gene-regulation"],
    viewCount: 114,
    aiGuide:
      "术语解释：基因线路是用调控元件构建的可编程生物系统；噪声指细胞间或时间上的随机波动。一句话摘要：这个 topic 讨论合成生物系统是否应该利用噪声。展开解释：可从任务目标、反馈结构、群体效应、鲁棒性和可测量性几个方面判断噪声是风险还是功能来源。",
    oneLineSummary:
      "基因线路的噪声不一定只是坏事，有时它能提供分化、记忆和群体多样性。"
  },
  {
    id: "topic-biomanufacturing-scaleup",
    title: "生物制造从摇瓶到反应器，最容易失真的变量是什么？",
    type: "QUESTION" as const,
    body:
      "很多生物制造路线在小规模培养里产量不错，但放大到反应器后会遇到氧传递、剪切力、代谢负担和污染控制等问题。想讨论：早期论文里的产量数据应该怎样解读，哪些变量最需要在放大前就被测出来？",
    authorId: "user-synbio",
    primaryDisciplineId: "systems-synthetic-biology",
    disciplineIds: ["systems-synthetic-biology", "chemical-biological-engineering"],
    tagIds: ["tag-biomanufacturing", "tag-low-carbon-biosynthesis", "tag-synthetic-biology", "tag-green-chemical-engineering"],
    viewCount: 103,
    aiGuide:
      "术语解释：生物制造用微生物或细胞生产化学品、材料或药物；放大过程会改变传质、混合和细胞压力。一句话摘要：这个 topic 讨论生物制造从实验室到工程规模的失真问题。展开解释：关键变量包括氧传递、底物梯度、剪切力、代谢负担、污染风险和过程控制。",
    oneLineSummary:
      "生物制造小规模产量好不等于能放大，反应器里的传质和代谢压力会改写结果。"
  },
  {
    id: "topic-computational-biology-perturbation",
    title: "单细胞扰动预测模型，怎么证明它能指导真实实验？",
    type: "QUESTION" as const,
    body:
      "计算生物学里越来越多模型想预测基因扰动、药物处理或组合干预后的细胞状态。问题是训练数据通常只覆盖少量扰动。想讨论：模型预测一个未测组合时，需要什么实验设计来判断它真的有指导价值？",
    authorId: "user-synbio",
    primaryDisciplineId: "systems-synthetic-biology",
    disciplineIds: ["systems-synthetic-biology", "ai-data-science", "cell-biology"],
    tagIds: ["tag-computational-biology", "tag-bioinformatics-ai", "tag-gene-regulation", "tag-cell-cycle"],
    viewCount: 146,
    aiGuide:
      "术语解释：单细胞扰动预测模型试图预测基因或药物干预后的细胞状态变化；组合扰动指多个基因或药物同时改变。一句话摘要：这个 topic 讨论计算模型能否真正指导生物实验设计。展开解释：需要看训练覆盖、外推能力、实验验证批次、失败案例和预测是否改变实验决策。",
    oneLineSummary:
      "单细胞扰动模型最有价值的地方，不是拟合已知数据，而是能否帮实验少走弯路。"
  },
  {
    id: "topic-glp1-cns-translation",
    title: "GLP-1 类药物用于 CNS 疾病，证据链应该从哪里开始看？",
    type: "QUESTION" as const,
    body:
      "GLP-1 类药物在代谢疾病之外被讨论到神经保护、炎症调控和认知相关疾病。可是从动物模型、机制假说到临床终点之间距离很大。想请教转化医学、神经和代谢方向的同学：判断这条路线是否值得推进时，最关键的证据是什么？",
    authorId: "user-trans-med",
    primaryDisciplineId: "translational-medicine",
    disciplineIds: ["translational-medicine", "physiology-metabolism", "neuroscience"],
    tagIds: ["tag-glp-1", "tag-cns-diseases", "tag-biomarkers", "tag-clinical-trials"],
    viewCount: 164,
    aiGuide:
      "术语解释：GLP-1 类药物最初主要用于代谢疾病；CNS 疾病指中枢神经系统相关疾病；转化医学关注从机制到临床应用的证据链。一句话摘要：这个 topic 讨论 GLP-1 类药物进入神经疾病场景时该如何评估证据。展开解释：可从动物模型相关性、药物能否进入目标组织、机制是否可测、临床终点是否合理和安全性边界几方面判断。",
    oneLineSummary:
      "GLP-1 进入 CNS 疾病讨论很热，但真正关键的是机制、biomarker 和临床终点能否连起来。"
  },
  {
    id: "topic-biomarkers-patient-stratification",
    title: "转化医学里的 biomarker，什么时候能真正用于患者分层？",
    type: "QUESTION" as const,
    body:
      "很多疾病机制研究都会提出 biomarker，但从发现一个指标到用它做患者分层，中间需要可靠检测、机制相关性、预测价值和临床可解释性。想讨论：一个 biomarker 要进入临床试验设计，至少需要哪些证据？",
    authorId: "user-trans-med",
    primaryDisciplineId: "translational-medicine",
    disciplineIds: ["translational-medicine", "clinical-medicine", "public-health"],
    tagIds: ["tag-biomarkers", "tag-patient-stratification", "tag-clinical-trials", "tag-real-world-evidence"],
    viewCount: 137,
    aiGuide:
      "术语解释：biomarker 是可测量的生物指标；患者分层是根据指标把患者分成更可能受益或风险不同的人群。一句话摘要：这个 topic 讨论 biomarker 从研究发现走向临床试验分层的门槛。展开解释：关键在检测稳定性、独立队列验证、机制关联、预测能力、阈值选择和临床决策价值。",
    oneLineSummary:
      "biomarker 不只是能测出来，还要能稳定地区分谁会受益、谁风险更高。"
  },
  {
    id: "topic-real-world-evidence-trials",
    title: "真实世界研究能补临床试验的哪些盲区？",
    type: "IDEA" as const,
    body:
      "随机对照试验能提供高质量证据，但入组标准严格，真实患者常常更复杂。真实世界数据可以观察长期疗效和安全性，但混杂因素很多。想讨论：在药物或医疗 AI 转化中，真实世界研究最适合回答哪些问题？",
    authorId: "user-trans-med",
    primaryDisciplineId: "translational-medicine",
    disciplineIds: ["translational-medicine", "public-health"],
    tagIds: ["tag-real-world-evidence", "tag-clinical-trials", "tag-bio-statistics", "tag-public-health"],
    viewCount: 121,
    aiGuide:
      "术语解释：真实世界研究使用临床实践中的数据；随机对照试验通过严格设计估计干预效果。一句话摘要：这个 topic 讨论真实世界证据和临床试验如何互补。展开解释：真实世界研究更适合看长期安全性、复杂人群、依从性和推广效果，但需要处理选择偏倚和混杂因素。",
    oneLineSummary:
      "真实世界研究不能简单替代临床试验，但很适合补上复杂人群和长期使用的盲区。"
  },
  {
    id: "topic-drug-target-validation",
    title: "一个药物靶点从机制上成立，到值得做药还差几步？",
    type: "QUESTION" as const,
    body:
      "基础研究里经常发现某个通路或蛋白和疾病相关，但药物研发需要考虑靶点可成药性、疾病相关性、动物模型、毒性和患者选择。想讨论：看到一个新靶点时，怎么判断它只是机制有趣，还是有转化价值？",
    authorId: "user-trans-med",
    primaryDisciplineId: "translational-medicine",
    disciplineIds: ["translational-medicine", "drug-discovery-public-health", "chemical-biology"],
    tagIds: ["tag-drug-targets", "tag-drug-design", "tag-drug-toxicology", "tag-biomarkers"],
    viewCount: 149,
    aiGuide:
      "术语解释：药物靶点是药物作用的分子对象；可成药性指靶点是否能被安全、有效地调控。一句话摘要：这个 topic 讨论疾病机制发现如何走向药物研发。展开解释：可从遗传证据、疾病模型、靶点位置、调控方式、毒性风险和患者分层几个维度评估。",
    oneLineSummary:
      "一个靶点和疾病有关还不够，真正难的是证明它能被安全有效地做成药。"
  },
  {
    id: "topic-tcell-inflammation-memory",
    title: "T 细胞分化里的记忆状态，能否解释慢性炎症反复发作？",
    type: "QUESTION" as const,
    body:
      "慢性炎症疾病常常反复发作，T 细胞亚群和组织驻留免疫被认为可能参与维持病灶。想讨论：如果要证明某类 T 细胞记忆状态是疾病复发的关键，而不是炎症后的残留，需要哪些时间序列和干预证据？",
    authorId: "user-immunology",
    primaryDisciplineId: "immunology-inflammation",
    disciplineIds: ["immunology-inflammation", "immunology-microbiology"],
    tagIds: ["tag-t-cell-differentiation", "tag-tissue-resident-immunity", "tag-autoimmunity", "tag-tissue-immunity"],
    viewCount: 132,
    aiGuide:
      "术语解释：T 细胞分化指 T 细胞形成不同功能状态；组织驻留免疫细胞长期停留在局部组织。一句话摘要：这个 topic 讨论慢性炎症反复发作是否与免疫记忆状态有关。展开解释：关键证据包括复发前后细胞状态变化、空间定位、克隆追踪、干预清除和疾病表型改变。",
    oneLineSummary:
      "慢性炎症反复发作可能和局部免疫记忆有关，但要证明它是原因需要时间和干预证据。"
  },
  {
    id: "topic-macrophage-plasticity",
    title: "巨噬细胞极化这个说法，会不会把真实状态过度简化？",
    type: "IDEA" as const,
    body:
      "很多文章用 M1/M2 或促炎/抗炎来描述巨噬细胞状态，但单细胞和空间组学显示状态远比二分法复杂。想问免疫、肿瘤和组织修复方向的同学：在讨论疾病机制时，巨噬细胞状态应该怎样命名和验证？",
    authorId: "user-immunology",
    primaryDisciplineId: "immunology-inflammation",
    disciplineIds: ["immunology-inflammation", "oncology-therapy"],
    tagIds: ["tag-macrophages", "tag-tissue-immunity", "tag-tumor-microenvironment", "tag-biomarkers"],
    viewCount: 118,
    aiGuide:
      "术语解释：巨噬细胞是重要的先天免疫细胞；极化常用来描述它们向不同功能状态转变。一句话摘要：这个 topic 讨论免疫细胞状态分类是否过度简化。展开解释：可以从单细胞转录组、空间位置、功能实验、时间变化和疾病场景来重新理解巨噬细胞状态。",
    oneLineSummary:
      "M1/M2 这类标签很方便，但真实巨噬细胞状态可能远比二分法复杂。"
  },
  {
    id: "topic-immune-checkpoint-autoimmunity",
    title: "免疫检查点调控为什么会在抗肿瘤和自身免疫之间摇摆？",
    type: "QUESTION" as const,
    body:
      "免疫检查点抑制剂能增强抗肿瘤免疫，但也可能带来自身免疫样副作用。想讨论：同一个免疫通路为什么既能帮助清除肿瘤，又可能破坏组织稳态？有没有办法用患者分层或 biomarker 预测这种风险？",
    authorId: "user-immunology",
    primaryDisciplineId: "immunology-inflammation",
    disciplineIds: ["immunology-inflammation", "oncology-therapy", "translational-medicine"],
    tagIds: ["tag-immune-checkpoints", "tag-autoimmunity", "tag-tumor-immunotherapy", "tag-patient-stratification"],
    viewCount: 156,
    aiGuide:
      "术语解释：免疫检查点是限制免疫反应过度激活的调控机制；检查点抑制剂通过解除限制增强抗肿瘤免疫。一句话摘要：这个 topic 讨论抗肿瘤免疫和自身免疫副作用之间的平衡。展开解释：核心在于免疫激活的组织特异性、抗原谱、患者基础免疫状态和风险预测指标。",
    oneLineSummary:
      "免疫检查点治疗的难点在于同一套免疫激活既能打肿瘤，也可能伤正常组织。"
  },
  {
    id: "topic-tissue-resident-immunity",
    title: "组织驻留免疫细胞，是局部防线还是慢病风险？",
    type: "QUESTION" as const,
    body:
      "组织驻留免疫细胞能快速应对感染和损伤，但长期存在的局部免疫记忆也可能参与慢性炎症。想讨论：在皮肤、肠道、肺或脑等组织中，如何判断驻留免疫细胞是在保护组织，还是在维持病理状态？",
    authorId: "user-immunology",
    primaryDisciplineId: "immunology-inflammation",
    disciplineIds: ["immunology-inflammation", "immunology-microbiology"],
    tagIds: ["tag-tissue-resident-immunity", "tag-tissue-immunity", "tag-autoimmunity", "tag-infection-immunity"],
    viewCount: 104,
    aiGuide:
      "术语解释：组织驻留免疫细胞长期生活在特定组织中；它们既能保护局部环境，也可能维持慢性炎症。一句话摘要：这个 topic 讨论局部免疫记忆的双重作用。展开解释：需要看细胞来源、驻留时间、空间位置、刺激反应、组织损伤和干预后的功能变化。",
    oneLineSummary:
      "组织驻留免疫细胞既可能是第一道防线，也可能成为慢性炎症的长期火种。"
  },
  {
    id: "topic-tumor-microenvironment-resistance",
    title: "肿瘤微环境导致耐药，怎么区分是机制还是结果？",
    type: "QUESTION" as const,
    body:
      "肿瘤耐药常被归因于肿瘤微环境，包括免疫抑制、缺氧、基质屏障和代谢重编程。但治疗后微环境变化也可能只是耐药细胞扩增后的结果。想讨论：什么实验能区分微环境是耐药原因，还是耐药后的伴随变化？",
    authorId: "user-oncology",
    primaryDisciplineId: "oncology-therapy",
    disciplineIds: ["oncology-therapy", "immunology-inflammation"],
    tagIds: ["tag-tumor-microenvironment", "tag-tumor-drug-resistance", "tag-macrophages", "tag-biomarkers"],
    viewCount: 143,
    aiGuide:
      "术语解释：肿瘤微环境包括肿瘤周围的免疫细胞、血管、基质和代谢状态；耐药指治疗后肿瘤仍能生长。一句话摘要：这个 topic 讨论肿瘤微环境在耐药中的因果角色。展开解释：关键在治疗前预测、时间序列采样、空间证据、微环境干预和耐药逆转实验。",
    oneLineSummary:
      "肿瘤微环境常被说成耐药原因，但要证明因果，需要治疗前后和干预证据。"
  },
  {
    id: "topic-radiotherapy-immunity-abscopal",
    title: "放疗诱导免疫反应，什么时候可能产生远隔效应？",
    type: "PAPER" as const,
    body:
      "放疗除了杀伤局部肿瘤细胞，也可能释放抗原、改变免疫微环境，甚至与免疫治疗联用产生远隔效应。但这种现象并不稳定。想讨论：剂量、分割方式、肿瘤类型和免疫状态中，哪些因素最可能决定是否出现系统性免疫反应？",
    authorId: "user-oncology",
    primaryDisciplineId: "oncology-therapy",
    disciplineIds: ["oncology-therapy", "immunology-inflammation", "clinical-medicine"],
    tagIds: ["tag-radiotherapy-immunity", "tag-tumor-immunotherapy", "tag-immune-checkpoints", "tag-clinical-trials"],
    viewCount: 111,
    aiGuide:
      "术语解释：远隔效应是局部放疗后非照射部位肿瘤也发生反应；放疗免疫研究放疗如何影响抗肿瘤免疫。一句话摘要：这个 topic 讨论放疗和免疫治疗联用中的系统性反应。展开解释：需要考虑抗原释放、免疫细胞浸润、剂量分割、检查点通路和患者免疫状态。",
    oneLineSummary:
      "放疗有时能点燃系统性抗肿瘤免疫，但这种远隔效应需要合适剂量和免疫背景。"
  },
  {
    id: "topic-cell-therapy-solid-tumor",
    title: "细胞治疗进入实体瘤，最大的障碍是靶点还是微环境？",
    type: "QUESTION" as const,
    body:
      "CAR-T 等细胞治疗在血液肿瘤中效果显著，但实体瘤里常遇到靶点异质性、浸润困难、免疫抑制和毒性风险。想讨论：如果要优先解决一个瓶颈，应该是寻找更好的靶点，还是改造细胞让它适应肿瘤微环境？",
    authorId: "user-oncology",
    primaryDisciplineId: "oncology-therapy",
    disciplineIds: ["oncology-therapy", "translational-medicine"],
    tagIds: ["tag-cell-therapy", "tag-tumor-microenvironment", "tag-tumor-immunotherapy", "tag-patient-stratification"],
    viewCount: 152,
    aiGuide:
      "术语解释：细胞治疗用改造或扩增的免疫细胞攻击疾病；实体瘤有复杂微环境和空间屏障。一句话摘要：这个 topic 讨论细胞治疗在实体瘤中的主要瓶颈。展开解释：靶点异质性、肿瘤浸润、免疫抑制、细胞耗竭和安全性都可能决定疗效。",
    oneLineSummary:
      "细胞治疗进实体瘤不只缺靶点，还要面对难以进入和难以存活的肿瘤微环境。"
  },
  {
    id: "topic-tumor-organoids-drug-response",
    title: "肿瘤类器官预测药物反应，离个体化治疗还有多远？",
    type: "IDEA" as const,
    body:
      "肿瘤类器官可以保留部分患者肿瘤特征，并用于药物敏感性测试。但培养时间、样本代表性、微环境缺失和临床决策窗口都会限制应用。想讨论：它最适合用于机制研究、药物筛选，还是已经能进入个体化治疗决策？",
    authorId: "user-oncology",
    primaryDisciplineId: "oncology-therapy",
    disciplineIds: ["oncology-therapy", "clinical-medicine"],
    tagIds: ["tag-tumor-cells", "tag-tumor-drug-resistance", "tag-drug-design", "tag-real-world-evidence"],
    viewCount: 96,
    aiGuide:
      "术语解释：肿瘤类器官是在体外培养、保留部分肿瘤特征的三维模型；药物反应预测试图用模型指导治疗选择。一句话摘要：这个 topic 讨论类器官距离个体化肿瘤治疗还有多远。展开解释：需要评估样本代表性、培养速度、微环境缺失、药物暴露条件和临床结果相关性。",
    oneLineSummary:
      "肿瘤类器官能帮助筛药，但要直接指导个体化治疗，还要跨过时间和代表性门槛。"
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
  },
  {
    id: "reply-single-cell-1",
    topicId: "topic-computational-biology-perturbation",
    authorId: "user-structural-bio",
    body:
      "我觉得“指导真实实验”不能只看 held-out perturbation 的表达相关性。真正有用应该是：模型给出一组实验优先级，实验后发现它比随机选、按 differential expression 选、按已知通路选更省实验量。"
  },
  {
    id: "reply-single-cell-2",
    topicId: "topic-computational-biology-perturbation",
    authorId: "user-ai-eng",
    parentReplyId: "reply-single-cell-1",
    body:
      "同意 1 楼。现在很多模型在 benchmark 上比较的是预测表达谱，但实验设计更关心 ranking：哪些 perturbation 最值得做。也许评价指标应该从 Pearson correlation 换成 top-k hit rate、enrichment，或者更直接地看能不能更快找到有效组合。"
  },
  {
    id: "reply-single-cell-3",
    topicId: "topic-computational-biology-perturbation",
    authorId: "user-synbio",
    parentReplyId: "reply-single-cell-2",
    body:
      "从实验角度我会谨慎一点。单细胞数据本身噪声很大，而且不同批次、细胞状态、MOI、guide efficiency 都会影响结果。模型如果没把这些不确定性输出出来，实验室很难根据它直接省钱。"
  },
  {
    id: "reply-single-cell-4",
    topicId: "topic-computational-biology-perturbation",
    authorId: "user-math",
    parentReplyId: "reply-single-cell-2",
    body:
      "top-k 也要小心。如果 ground truth 只测了很小一部分组合，top-k hit rate 会依赖你怎么定义“hit”。我更希望模型给出 uncertainty，然后设计一个主动学习循环：预测、实验、更新模型，再预测。"
  },
  {
    id: "reply-single-cell-5",
    topicId: "topic-computational-biology-perturbation",
    authorId: "user-bio",
    parentReplyId: "reply-single-cell-1",
    body:
      "我关心的是模型有没有提出“反直觉但可验证”的组合。比如两个单独扰动都没明显 phenotype，但组合后出现状态转换。如果只是复现已知通路，那对实验设计帮助有限。"
  },
  {
    id: "reply-single-cell-6",
    topicId: "topic-computational-biology-perturbation",
    authorId: "user-ai-eng",
    parentReplyId: "reply-single-cell-3",
    body:
      "这可能需要分两层验证：第一层是表达谱预测，第二层是生物决策预测。表达谱预测不一定要完美，但如果能稳定排除一批低价值实验，或者优先找到 genetic interaction，就已经有价值。"
  },
  {
    id: "reply-single-cell-7",
    topicId: "topic-computational-biology-perturbation",
    authorId: "user-synbio",
    parentReplyId: "reply-single-cell-4",
    body:
      "所以这个 topic 的核心可能不是“模型准不准”，而是“准到什么程度才足以改变实验设计”。我觉得可以把验证标准写成：比基线节省多少实验量、能否发现新组合、失败时能否解释失败来源。"
  },
  {
    id: "reply-quantum-bio-1",
    topicId: "topic-quantum-sensing-biology",
    authorId: "user-physics",
    body:
      "我觉得这个题要先拆开。NV center 的“量子”部分确实提供了室温下可读出的自旋态，对磁场、温度等量很敏感。但真正进入生物样品后，光路、样品制备、定位、数据反演可能同样决定效果。"
  },
  {
    id: "reply-quantum-bio-2",
    topicId: "topic-quantum-sensing-biology",
    authorId: "user-bio",
    body:
      "外行问题：如果最后测到的是温度或磁场，那和传统荧光探针、电生理、MRI 类方法相比，量子传感到底赢在哪里？空间分辨率？非侵入？还是能测传统方法测不到的物理量？"
  },
  {
    id: "reply-quantum-bio-3",
    topicId: "topic-quantum-sensing-biology",
    authorId: "user-electronic",
    parentReplyId: "reply-quantum-bio-1",
    body:
      "很多时候优势可能来自整套工程，而不是单个 quantum sensor。比如 diamond 表面处理、光收集效率、微流控、噪声隔离、锁相读出，任何一环不好，量子态再漂亮也没用。"
  },
  {
    id: "reply-quantum-bio-4",
    topicId: "topic-quantum-sensing-biology",
    authorId: "user-physics",
    parentReplyId: "reply-quantum-bio-2",
    body:
      "可能最合理的优势不是“全面替代传统方法”，而是在特定窗口：室温、纳米尺度、局域磁场或温度、对活体相对友好。比如测单细胞附近的磁结构或局部热变化，这类问题传统方法不一定舒服。"
  },
  {
    id: "reply-quantum-bio-5",
    topicId: "topic-quantum-sensing-biology",
    authorId: "user-neuro",
    parentReplyId: "reply-quantum-bio-4",
    body:
      "神经动作电位磁检测这个应用很吸引我，因为磁场不太受组织电导率影响。但我会问：信噪比能否支持真实神经网络记录？如果只能在很受控的单神经元样品里做，离神经科学常规工具还远。"
  },
  {
    id: "reply-quantum-bio-6",
    topicId: "topic-quantum-sensing-biology",
    authorId: "user-structural-bio",
    parentReplyId: "reply-quantum-bio-3",
    body:
      "还有一个现实问题：生物样品本身差异很大。量子传感如果需要复杂校准，那最后可能是物理实验很漂亮，但生物重复性不够。对生物人来说，可重复、低扰动、样品兼容性比极限灵敏度更重要。"
  },
  {
    id: "reply-quantum-bio-7",
    topicId: "topic-quantum-sensing-biology",
    authorId: "user-physics",
    parentReplyId: "reply-quantum-bio-5",
    body:
      "所以这个问题可以改写成：量子传感的“不可替代性”要在具体任务里证明。不是问它量子不量子，而是问在某个生物测量任务中，它是否同时赢下空间分辨率、扰动程度、信噪比和可重复性。"
  }
];

const legacyTopicIds = [
  { oldId: "topic-moir\u00e9-correlations", newId: "topic-moire-correlations" }
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

  for (const legacy of legacyTopicIds) {
    const [oldTopic, newTopic] = await Promise.all([
      prisma.topic.findUnique({ where: { id: legacy.oldId }, select: { id: true } }),
      prisma.topic.findUnique({ where: { id: legacy.newId }, select: { id: true } })
    ]);

    if (oldTopic && !newTopic) {
      await prisma.topic.update({
        where: { id: legacy.oldId },
        data: { id: legacy.newId }
      });
    } else if (oldTopic && newTopic) {
      await prisma.topic.delete({ where: { id: legacy.oldId } });
    }
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
          oneLineSummary: topic.oneLineSummary ?? null,
          model: "mock-seed"
        },
        create: {
          topicId: topic.id,
          content: topic.aiGuide,
          oneLineSummary: topic.oneLineSummary ?? null,
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
