-- CreateTable
CREATE TABLE "popup_img" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "popup_img_pkey" PRIMARY KEY ("id")
);
