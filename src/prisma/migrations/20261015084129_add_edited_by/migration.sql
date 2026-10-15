-- Track who made the last change to an item / the contact information.
-- Existing rows are backfilled with their creator, then the column becomes required.

-- AlterTable (nullable first, so existing rows are allowed)
ALTER TABLE "item" ADD COLUMN "editedById" TEXT;
ALTER TABLE "contact" ADD COLUMN "editedById" TEXT;

-- Backfill: until now, the creator was the last (and only known) editor
UPDATE "item" SET "editedById" = "postedById" WHERE "editedById" IS NULL;
UPDATE "contact" SET "editedById" = "postedById" WHERE "editedById" IS NULL;

-- Now required
ALTER TABLE "item" ALTER COLUMN "editedById" SET NOT NULL;
ALTER TABLE "contact" ALTER COLUMN "editedById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
