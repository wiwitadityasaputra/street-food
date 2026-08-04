CREATE TABLE "cuisines" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cuisines_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"cuisine" cuisine_type NOT NULL,
	"description" varchar(300) NOT NULL,
	"price" smallint NOT NULL,
	"rate" real NOT NULL,
	"review" smallint DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX "cuisines_pkey" ON "cuisines" ("id");