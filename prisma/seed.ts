import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@university.edu" },
    update: {},
    create: {
      name: "Demo Student",
      email: "demo@university.edu",
      passwordHash: "replace-with-real-hash",
      school: "示例大学",
      department: "计算机学院",
      researchField: "人机交互"
    }
  });

  const engineering = await prisma.discipline.upsert({
    where: { slug: "engineering" },
    update: {},
    create: { name: "工学院", slug: "engineering", sortOrder: 1 }
  });

  const computerScience = await prisma.discipline.upsert({
    where: { slug: "computer-science" },
    update: {},
    create: {
      name: "计算机",
      slug: "computer-science",
      parentId: engineering.id,
      sortOrder: 1
    }
  });

  const tag = await prisma.tag.upsert({
    where: { slug: "human-ai-interaction" },
    update: {},
    create: {
      name: "Human-AI Interaction",
      slug: "human-ai-interaction",
      disciplineId: computerScience.id
    }
  });

  const topic = await prisma.topic.create({
    data: {
      title: "如何评价 AI 辅助科研讨论对跨领域交流的帮助？",
      type: "QUESTION",
      body: "想讨论一下 AI 导读、问答和观点整理是否真的能降低博士生参与陌生领域讨论的门槛。",
      authorId: user.id,
      primaryDisciplineId: computerScience.id,
      tags: {
        create: [{ tagId: tag.id }]
      }
    }
  });

  await prisma.aIGuide.create({
    data: {
      topicId: topic.id,
      content: "这个 topic 关注 AI 是否能作为跨领域学术讨论的脚手架，帮助外领域读者快速理解背景、形成问题，并更清楚地表达自己的想法。",
      model: "mock-seed"
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
