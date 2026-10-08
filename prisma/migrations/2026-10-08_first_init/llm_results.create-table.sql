CREATE TABLE "llm_results" (
	"llm_results_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "llm_results_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"llm_input" varchar(1000) NOT NULL,
	"llm_output" varchar(1000) NOT NULL,
	"llm_input_embedding" vector(1536) NOT NULL,
	"created_date" timestamp
);
CREATE UNIQUE INDEX "llm_results_id_pkey" ON "llm_results" ("llm_results_id");
CREATE UNIQUE INDEX "llm_results_pkey" ON "llm_results" ("llm_results_id");