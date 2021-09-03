-- DropForeignKey
ALTER TABLE "CarPicture" DROP CONSTRAINT "CarPicture_carId_fkey";

-- AddForeignKey
ALTER TABLE "CarPicture" ADD FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
