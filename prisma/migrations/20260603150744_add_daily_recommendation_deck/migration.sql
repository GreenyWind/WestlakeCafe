-- CreateEnum
CREATE TYPE "RecommendationSlotType" AS ENUM ('FAMILIAR', 'ADJACENT', 'CROSS_FIELD');

-- AlterTable
ALTER TABLE "AIGuide" ADD COLUMN     "oneLineSummary" TEXT;

-- CreateTable
CREATE TABLE "TopicView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "firstViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TopicView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationBatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateKey" TEXT NOT NULL,
    "algorithmVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationItem" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "slotType" "RecommendationSlotType" NOT NULL,
    "position" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TopicView_topicId_idx" ON "TopicView"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicView_userId_topicId_key" ON "TopicView"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationBatch_userId_key" ON "RecommendationBatch"("userId");

-- CreateIndex
CREATE INDEX "RecommendationItem_topicId_idx" ON "RecommendationItem"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationItem_batchId_position_key" ON "RecommendationItem"("batchId", "position");

-- AddForeignKey
ALTER TABLE "TopicView" ADD CONSTRAINT "TopicView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicView" ADD CONSTRAINT "TopicView_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationBatch" ADD CONSTRAINT "RecommendationBatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationItem" ADD CONSTRAINT "RecommendationItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "RecommendationBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationItem" ADD CONSTRAINT "RecommendationItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
