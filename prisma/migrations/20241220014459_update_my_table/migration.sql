/*
  Warnings:

  - Added the required column `urlTitle` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urlTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "links" TEXT NOT NULL
);
INSERT INTO "new_Projects" ("descriptions", "id", "images", "links", "title") SELECT "descriptions", "id", "images", "links", "title" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
