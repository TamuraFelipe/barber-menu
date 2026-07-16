/*
  Warnings:

  - Made the column `userId` on table `Barbershop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Barbershop" ALTER COLUMN "userId" SET NOT NULL;
