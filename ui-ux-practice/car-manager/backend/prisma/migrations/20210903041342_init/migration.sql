-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "milesPerGallon" DOUBLE PRECISION,
    "cylinders" INTEGER,
    "displacement" DOUBLE PRECISION,
    "horsepower" INTEGER,
    "weight" DOUBLE PRECISION,
    "acceleration" DOUBLE PRECISION,
    "year" INTEGER,
    "model" VARCHAR,
    "originCountryId" UUID,
    "name" VARCHAR NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarOrigin" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarPicture" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "carId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Car" ADD FOREIGN KEY ("originCountryId") REFERENCES "CarOrigin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarPicture" ADD FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;
