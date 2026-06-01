-- AlterTable
ALTER TABLE "Discipline" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "identity" TEXT,
ADD COLUMN     "schools" TEXT[] DEFAULT ARRAY[]::TEXT[];
