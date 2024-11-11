/*
  Warnings:

  - A unique constraint covering the columns `[userId,platform]` on the table `Social` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Social" ALTER COLUMN "platform" DROP NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Social_userId_platform_key" ON "Social"("userId", "platform");
