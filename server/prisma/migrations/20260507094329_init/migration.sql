-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetPlatform" TEXT NOT NULL,
    "difficultyLevel" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "preferredTechnologies" TEXT,
    "roadmapDurationWeeks" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "projectSummary" TEXT NOT NULL,
    "problemDefinition" TEXT NOT NULL,
    "complexityScore" INTEGER NOT NULL,
    "estimatedDurationWeeks" INTEGER NOT NULL,
    "requiredSkillLevel" TEXT NOT NULL,
    "targetUsersJson" TEXT NOT NULL,
    "mvpScopeJson" TEXT NOT NULL,
    "coreFeaturesJson" TEXT NOT NULL,
    "recommendedStackJson" TEXT NOT NULL,
    "alternativeStacksJson" TEXT NOT NULL,
    "modulesJson" TEXT NOT NULL,
    "databaseSchemaJson" TEXT NOT NULL,
    "apiEndpointsJson" TEXT NOT NULL,
    "developmentRoadmapJson" TEXT NOT NULL,
    "risksJson" TEXT NOT NULL,
    "futureImprovementsJson" TEXT NOT NULL,
    "rawAiResponseJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Analysis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_projectId_key" ON "Analysis"("projectId");
