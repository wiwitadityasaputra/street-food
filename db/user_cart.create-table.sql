CREATE TABLE "user_cart" (
	"user_cart_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_cart_user_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(40) NOT NULL,
	"price_per_item" smallint NOT NULL,
	"quantity" smallint NOT NULL,
	"final_price" smallint NOT NULL,
	"options" varchar(200) NOT NULL,
	"flag" text NOT NULL,
	"cuisine_id" smallint NOT NULL,
	"cuisine_name" varchar(50) NOT NULL,
	"user_order_id" integer
);
CREATE INDEX "user_cart_index_flag" ON "user_cart" ("flag");
CREATE UNIQUE INDEX "user_cart_pkey" ON "user_cart" ("user_cart_id");
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_fk_cuisine_id" FOREIGN KEY ("cuisine_id") REFERENCES "cuisines"("id");
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_fk_user_order_id" FOREIGN KEY ("user_order_id") REFERENCES "user_order"("user_order_id");