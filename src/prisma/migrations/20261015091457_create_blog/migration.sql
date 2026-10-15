
-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'ACTIVE',
    "deactivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL,
    "postedById" TEXT NOT NULL,
    "editedById" TEXT NOT NULL,

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blog_status_idx" ON "blog"("status");

-- CreateIndex
CREATE INDEX "blog_createdAt_idx" ON "blog"("createdAt");

-- AddForeignKey
ALTER TABLE "blog" ADD CONSTRAINT "blog_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog" ADD CONSTRAINT "blog_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

