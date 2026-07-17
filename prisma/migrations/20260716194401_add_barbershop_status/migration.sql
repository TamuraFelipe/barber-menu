-- CreateEnum
CREATE TYPE "BarbershopStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "status" "BarbershopStatus" NOT NULL DEFAULT 'PENDING';
