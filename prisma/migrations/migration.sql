ALTER TABLE "user_chat_main" RENAME COLUMN "user_input" TO "message";
ALTER TABLE "user_chat_main" ADD COLUMN "ai_input" VARCHAR(200);
ALTER TABLE "user_chat_main" ADD COLUMN "ai_input_embedding" vector(1536);

CREATE TABLE "llm_results" (
	"llm_results_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "llm_results_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "llm_input" varchar(200) NOT NULL,
	"llm_output" varchar(500) NOT NULL,
	"llm_input_embedding" vector(1536) NOT NULL,
    "created_date" timestamp
);
CREATE UNIQUE INDEX "llm_results_id_pkey" ON "llm_results" ("llm_results_id");

ALTER TABLE "user_chat_main" DROP COLUMN "ai_output";
ALTER TABLE "user_chat_main" DROP COLUMN "ai_input";
ALTER TABLE "user_chat_main" DROP COLUMN "ai_input_embedding";
ALTER TABLE "user_chat_main" ADD COLUMN "message_type" VARCHAR(200);
ALTER TABLE "llm_results" ALTER COLUMN "llm_input" SET DATA TYPE varchar(1000) USING "llm_input"::varchar(1000);
ALTER TABLE "llm_results" ALTER COLUMN "llm_output" SET DATA TYPE varchar(1000) USING "llm_output"::varchar(1000);