-- Rename "Contact" to "contact" to match the other tables (@@map("contact")).
-- A plain rename keeps any existing rows; Prisma's own diff would drop and recreate the table.

-- RenameTable
ALTER TABLE "Contact" RENAME TO "contact";

-- RenameConstraint
ALTER TABLE "contact" RENAME CONSTRAINT "Contact_pkey" TO "contact_pkey";
ALTER TABLE "contact" RENAME CONSTRAINT "Contact_postedById_fkey" TO "contact_postedById_fkey";
