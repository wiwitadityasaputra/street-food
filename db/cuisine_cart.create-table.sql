CREATE TABLE "cuisine_cart" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cuisine_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cuisine_id" smallint NOT NULL,
	"cuisine_cart_type" cuisine_cart_types NOT NULL,
	"group" varchar(25) NOT NULL,
	"name" varchar(50) NOT NULL,
	"price" smallint DEFAULT 0 NOT NULL,
	"flag" boolean DEFAULT true NOT NULL,
	"order" smallint NOT NULL
);
CREATE UNIQUE INDEX "cuisine_cart_pkey" ON "cuisine_cart" ("id");
ALTER TABLE "cuisine_cart" ADD CONSTRAINT "cuisine_cart_fk_cuisine_id" FOREIGN KEY ("cuisine_id") REFERENCES "cuisines"("id");