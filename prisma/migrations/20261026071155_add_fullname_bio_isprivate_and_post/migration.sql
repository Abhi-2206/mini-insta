-- AlterTable: add columns; fullname is temporarily nullable so existing rows don't block
ALTER TABLE "User" ADD COLUMN "bio" TEXT,
ADD COLUMN "fullname" TEXT,
ADD COLUMN "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- Backfill any existing rows so NOT NULL constraint can be applied
UPDATE "User" SET "fullname" = username WHERE "fullname" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "User" ALTER COLUMN "fullname" SET NOT NULL;

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

