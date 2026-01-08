-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "genres" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "overview" TEXT,
    "poster_path" TEXT,
    "final_score" REAL NOT NULL DEFAULT 0,
    "popularity" REAL NOT NULL DEFAULT 0,
    "vote_average" REAL NOT NULL DEFAULT 0,
    "release_date" TEXT
);

-- CreateTable
CREATE TABLE "TVShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "genres" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "overview" TEXT,
    "poster_path" TEXT,
    "final_score" REAL NOT NULL DEFAULT 0,
    "popularity" REAL NOT NULL DEFAULT 0,
    "vote_average" REAL NOT NULL DEFAULT 0,
    "first_air_date" TEXT
);

-- CreateTable
CREATE TABLE "UserInteraction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'MOVIE',
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TitleScore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TitleScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Movie_final_score_idx" ON "Movie"("final_score");

-- CreateIndex
CREATE INDEX "TVShow_final_score_idx" ON "TVShow"("final_score");

-- CreateIndex
CREATE UNIQUE INDEX "UserInteraction_userId_tmdbId_mediaType_key" ON "UserInteraction"("userId", "tmdbId", "mediaType");

-- CreateIndex
CREATE INDEX "TitleScore_userId_score_idx" ON "TitleScore"("userId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "TitleScore_userId_tmdbId_mediaType_key" ON "TitleScore"("userId", "tmdbId", "mediaType");
