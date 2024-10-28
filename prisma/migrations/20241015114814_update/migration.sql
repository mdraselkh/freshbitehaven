/*
  Warnings:

  - You are about to drop the column `productId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_sizeId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "productId",
DROP COLUMN "sizeId",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "weight" TEXT NOT NULL;
