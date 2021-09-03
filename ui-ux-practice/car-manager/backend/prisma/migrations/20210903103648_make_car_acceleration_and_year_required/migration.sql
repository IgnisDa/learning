/*
  Warnings:

  - Made the column `acceleration` on table `Car` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "acceleration" SET NOT NULL,
ALTER COLUMN "year" SET NOT NULL;
