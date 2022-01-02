-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "roomPublicId" INTEGER,
ALTER COLUMN "roomId" DROP NOT NULL;
