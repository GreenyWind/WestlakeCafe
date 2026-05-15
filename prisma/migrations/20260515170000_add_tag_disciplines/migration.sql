CREATE TABLE "TagDiscipline" (
    "tagId" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,

    CONSTRAINT "TagDiscipline_pkey" PRIMARY KEY ("tagId","disciplineId")
);

INSERT INTO "TagDiscipline" ("tagId", "disciplineId")
SELECT "id", "disciplineId"
FROM "Tag"
WHERE "disciplineId" IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE "TagDiscipline" ADD CONSTRAINT "TagDiscipline_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TagDiscipline" ADD CONSTRAINT "TagDiscipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
