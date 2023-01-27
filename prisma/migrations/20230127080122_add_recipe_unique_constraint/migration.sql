/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `recipes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `recipes_id_userId_key` ON `recipes`(`id`, `userId`);
