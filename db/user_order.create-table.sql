CREATE TABLE "user_order" (
	"user_order_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"flag" varchar(20) NOT NULL,
	"created_date" timestamp,
	"cooked_date" timestamp,
	"shipped_date" timestamp,
	"delivered_date" timestamp,
	"cancelled_date" timestamp,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"street_address" varchar(100),
	"second_address" varchar(100),
	"city" varchar(100),
	"state" varchar(100),
	"zip_code" varchar(100),
	"phone_number" varchar(100),
	"email_address" varchar(100),
	"additional_info" varchar(400)
);
CREATE UNIQUE INDEX "user_order_pkey" ON "user_order" ("user_order_id");