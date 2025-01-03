/*
  Warnings:

  - The primary key for the `Projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProjectsButton` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `projectID` on the `ProjectsButton` table. All the data in the column will be lost.

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
INSERT INTO "new_Projects" ("descriptions", "id", "images", "links", "title", "urlTitle") SELECT "descriptions", "id", "images", "links", "title", "urlTitle" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
CREATE TABLE "new_ProjectsButton" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL
);
INSERT INTO "new_ProjectsButton" ("date", "id", "link", "title", "type") SELECT "date", "id", "link", "title", "type" FROM "ProjectsButton";
DROP TABLE "ProjectsButton";
ALTER TABLE "new_ProjectsButton" RENAME TO "ProjectsButton";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
