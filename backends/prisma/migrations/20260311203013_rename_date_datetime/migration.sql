/*
  Warnings:

  - You are about to drop the column `date` on the `Match` table. All the data in the column will be lost.
  - Added the required column `datetime` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "date",
ADD COLUMN     "datetime" TIMESTAMP(3) NOT NULL;
