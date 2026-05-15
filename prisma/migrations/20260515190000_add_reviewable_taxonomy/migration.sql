-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Discipline" ADD COLUMN "reviewStatus" "ApprovalStatus" NOT NULL DEFAULT 'APPROVED';
ALTER TABLE "Discipline" ADD COLUMN "createdById" TEXT;
ALTER TABLE "Discipline" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Discipline" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN "reviewStatus" "ApprovalStatus" NOT NULL DEFAULT 'APPROVED';
ALTER TABLE "Tag" ADD COLUMN "reviewReason" TEXT;
ALTER TABLE "Tag" ADD COLUMN "createdById" TEXT;
ALTER TABLE "Tag" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Tag" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TopicDiscipline" (
  "topicId" TEXT NOT NULL,
  "disciplineId" TEXT NOT NULL,

  CONSTRAINT "TopicDiscipline_pkey" PRIMARY KEY ("topicId","disciplineId")
);

-- Backfill existing topics into the new actual-display discipline relation.
INSERT INTO "TopicDiscipline" ("topicId", "disciplineId")
SELECT "id", "primaryDisciplineId"
FROM "Topic"
ON CONFLICT DO NOTHING;

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicDiscipline" ADD CONSTRAINT "TopicDiscipline_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicDiscipline" ADD CONSTRAINT "TopicDiscipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
