/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" SET DEFAULT 'user',
ALTER COLUMN "email" SET NOT NULL;
