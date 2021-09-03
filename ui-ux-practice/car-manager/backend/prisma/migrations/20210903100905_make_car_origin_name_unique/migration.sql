/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CarOrigin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CarOrigin.name_unique" ON "CarOrigin"("name");
