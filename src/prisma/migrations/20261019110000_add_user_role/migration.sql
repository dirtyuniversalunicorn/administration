-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'USER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Everyone who exists today could already do everything, so they become admins.
UPDATE "user" SET "role" = 'ADMIN';
