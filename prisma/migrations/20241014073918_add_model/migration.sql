-- CreateTable
CREATE TABLE "home_data" (
    "id" SERIAL NOT NULL,
    "hotline" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "home_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_data" (
    "id" SERIAL NOT NULL,
    "hotline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,

    CONSTRAINT "footer_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "home_data_hotline_key" ON "home_data"("hotline");

-- CreateIndex
CREATE UNIQUE INDEX "home_data_email_key" ON "home_data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "footer_data_hotline_key" ON "footer_data"("hotline");

-- CreateIndex
CREATE UNIQUE INDEX "footer_data_whatsapp_key" ON "footer_data"("whatsapp");
