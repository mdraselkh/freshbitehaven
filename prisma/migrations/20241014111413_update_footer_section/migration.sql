/*
  Warnings:

  - Added the required column `branchAddress` to the `footer_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchName` to the `footer_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationSrc` to the `footer_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `footer_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "footer_data" ADD COLUMN     "branchAddress" TEXT NOT NULL,
ADD COLUMN     "branchName" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "locationSrc" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;
