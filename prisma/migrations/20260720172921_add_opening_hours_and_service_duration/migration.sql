-- AlterTable
ALTER TABLE "BarbershopService" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 60;

-- CreateTable
CREATE TABLE "BarbershopOpeningHour" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "openTime" TEXT,
    "closeTime" TEXT,
    "lunchStart" TEXT,
    "lunchEnd" TEXT,
    "barbershopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarbershopOpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarbershopOpeningHour_barbershopId_dayOfWeek_key" ON "BarbershopOpeningHour"("barbershopId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "BarbershopOpeningHour" ADD CONSTRAINT "BarbershopOpeningHour_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
