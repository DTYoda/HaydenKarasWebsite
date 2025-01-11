-- CreateTable
CREATE TABLE "Skills" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "linkText" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "urlTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "links" TEXT NOT NULL,
    "technologies" TEXT NOT NULL DEFAULT '[]',
    "type" TEXT NOT NULL DEFAULT 'website',
    "date" TEXT NOT NULL DEFAULT 'undefined',

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);
