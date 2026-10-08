-- CreateTable
CREATE TABLE "zzz" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "zzz_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zzz_email_key" ON "zzz"("email");
