-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "comments" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTester" BOOLEAN NOT NULL DEFAULT false;
