/*
  Warnings:

  - You are about to drop the `ProjectsButton` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProjectsButton";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "urlTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "links" TEXT NOT NULL,
    "technologies" TEXT NOT NULL DEFAULT '[]',
    "type" TEXT NOT NULL DEFAULT 'website',
    "date" TEXT NOT NULL DEFAULT 'undefined'
);
INSERT INTO "new_Projects" ("descriptions", "id", "images", "links", "title", "urlTitle") SELECT "descriptions", "id", "images", "links", "title", "urlTitle" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
