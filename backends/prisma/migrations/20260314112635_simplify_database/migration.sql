/*
  Warnings:

  - You are about to drop the column `player1Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `player1` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_player2Id_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "player1Id",
DROP COLUMN "player2Id",
ADD COLUMN     "player1" TEXT NOT NULL,
ADD COLUMN     "player2" TEXT NOT NULL;

-- DropTable
DROP TABLE "Player";
