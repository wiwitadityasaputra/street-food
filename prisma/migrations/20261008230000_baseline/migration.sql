CREATE EXTENSION IF NOT EXISTS vector;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "cuisine_cart_types" AS ENUM ('checkbox', 'radio');

-- CreateEnum
CREATE TYPE "cuisine_type" AS ENUM ('indonesian', 'western', 'korean', 'chinese');

-- CreateTable
CREATE TABLE "cuisine_cart" (
    "id" SERIAL NOT NULL,
    "cuisine_id" SMALLINT NOT NULL,
    "cuisine_cart_type" "cuisine_cart_types" NOT NULL,
    "group" VARCHAR(25) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" SMALLINT NOT NULL DEFAULT 0,
    "flag" BOOLEAN NOT NULL DEFAULT true,
    "order" SMALLINT NOT NULL,

    CONSTRAINT "cuisine_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuisines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "cuisine" "cuisine_type" NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "price" SMALLINT NOT NULL,
    "rate" REAL NOT NULL,
    "review" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "cuisines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_cart" (
    "user_cart_id" SERIAL NOT NULL,
    "user_id" VARCHAR(40) NOT NULL,
    "price_per_item" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "final_price" INTEGER NOT NULL,
    "options" VARCHAR(200) NOT NULL,
    "flag" TEXT NOT NULL,
    "cuisine_id" SMALLINT NOT NULL,
    "cuisine_name" VARCHAR(50) NOT NULL,
    "user_order_id" INTEGER,

    CONSTRAINT "user_cart_pkey" PRIMARY KEY ("user_cart_id")
);

-- CreateTable
CREATE TABLE "user_chat_main" (
    "user_chat_main_id" SERIAL NOT NULL,
    "user_id" VARCHAR(40) NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "role" VARCHAR(10) NOT NULL,
    "created_date" TIMESTAMP(6),
    "message_type" VARCHAR(200),

    CONSTRAINT "user_chat_main_pkey" PRIMARY KEY ("user_chat_main_id")
);

-- CreateTable
CREATE TABLE "user_order" (
    "user_order_id" SERIAL NOT NULL,
    "flag" VARCHAR(20) NOT NULL,
    "created_date" TIMESTAMP(6),
    "cooked_date" TIMESTAMP(6),
    "shipped_date" TIMESTAMP(6),
    "delivered_date" TIMESTAMP(6),
    "cancelled_date" TIMESTAMP(6),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "street_address" VARCHAR(100),
    "second_address" VARCHAR(100),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "zip_code" VARCHAR(100),
    "phone_number" VARCHAR(100),
    "email_address" VARCHAR(100),
    "additional_info" VARCHAR(400),

    CONSTRAINT "user_order_pkey" PRIMARY KEY ("user_order_id")
);

-- CreateTable
CREATE TABLE "llm_results" (
    "llm_results_id" SERIAL NOT NULL,
    "llm_input" VARCHAR(1000) NOT NULL,
    "llm_output" VARCHAR(1000) NOT NULL,
    "llm_input_embedding" vector(1536) NOT NULL,
    "created_date" TIMESTAMP(6),

    CONSTRAINT "llm_results_pkey" PRIMARY KEY ("llm_results_id")
);

-- CreateIndex
CREATE INDEX "user_cart_index_flag" ON "user_cart"("flag");

-- CreateIndex
CREATE UNIQUE INDEX "llm_results_id_pkey" ON "llm_results"("llm_results_id");

-- AddForeignKey
ALTER TABLE "cuisine_cart" ADD CONSTRAINT "cuisine_cart_fk_cuisine_id" FOREIGN KEY ("cuisine_id") REFERENCES "cuisines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_fk_cuisine_id" FOREIGN KEY ("cuisine_id") REFERENCES "cuisines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_fk_user_order_id" FOREIGN KEY ("user_order_id") REFERENCES "user_order"("user_order_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

