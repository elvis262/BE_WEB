/*
  Warnings:

  - A unique constraint covering the columns `[schoolId]` on the table `Inspector` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cycleId` to the `Sector` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Consultation_doctorId_fkey` ON `consultation`;

-- DropIndex
DROP INDEX `Consultation_studentId_fkey` ON `consultation`;

-- DropIndex
DROP INDEX `Inspector_schoolId_fkey` ON `inspector`;

-- DropIndex
DROP INDEX `Sector_schoolId_fkey` ON `sector`;

-- DropIndex
DROP INDEX `Student_sectorId_fkey` ON `student`;

-- AlterTable
ALTER TABLE `sector` ADD COLUMN `cycleId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Cycle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Inspector_schoolId_key` ON `Inspector`(`schoolId`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `Sector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sector` ADD CONSTRAINT `Sector_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sector` ADD CONSTRAINT `Sector_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `Inspector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sector` ADD CONSTRAINT `Sector_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `Cycle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspector` ADD CONSTRAINT `Inspector_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
