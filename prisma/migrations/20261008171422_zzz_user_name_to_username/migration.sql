/*
  Warnings:

  - You are about to drop the column `user_name` on the `zzz` table. All the data in the column will be lost.
  - Added the required column `username` to the `zzz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "zzz" DROP COLUMN "user_name",
ADD COLUMN     "username" VARCHAR(100) NOT NULL;
