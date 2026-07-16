/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_userId_key" ON "Barbershop"("userId");

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
