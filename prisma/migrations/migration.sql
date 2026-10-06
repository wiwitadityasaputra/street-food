ALTER TABLE "user_chat_main" RENAME COLUMN "user_input" TO "message";
ALTER TABLE "user_chat_main" ADD COLUMN "ai_input" VARCHAR(200);