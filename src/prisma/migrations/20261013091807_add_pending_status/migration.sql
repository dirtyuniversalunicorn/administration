/*
  Warnings:

  - A unique constraint covering the columns `[confirmToken]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[unsubscribeToken]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unsubscribeToken` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "confirmSentAt" TIMESTAMP(3),
ADD COLUMN     "confirmToken" TEXT,
ADD COLUMN     "confirmTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "unsubscribeToken" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "subscribedAt" DROP NOT NULL,
ALTER COLUMN "subscribedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_confirmToken_key" ON "subscription"("confirmToken");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_unsubscribeToken_key" ON "subscription"("unsubscribeToken");
