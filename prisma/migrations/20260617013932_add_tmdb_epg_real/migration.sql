-- AlterTable
ALTER TABLE "Canal" ADD COLUMN "epgId" TEXT;

-- AlterTable
ALTER TABLE "Filme" ADD COLUMN "ano" TEXT;
ALTER TABLE "Filme" ADD COLUMN "nota" REAL;
ALTER TABLE "Filme" ADD COLUMN "sinopse" TEXT;
ALTER TABLE "Filme" ADD COLUMN "tmdbId" INTEGER;

-- AlterTable
ALTER TABLE "Serie" ADD COLUMN "ano" TEXT;
ALTER TABLE "Serie" ADD COLUMN "nota" REAL;
ALTER TABLE "Serie" ADD COLUMN "sinopse" TEXT;
ALTER TABLE "Serie" ADD COLUMN "tmdbId" INTEGER;

-- CreateTable
CREATE TABLE "EpgPrograma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "epgId" TEXT NOT NULL,
    "canalNome" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "inicio" TEXT NOT NULL,
    "fim" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HistoricoCliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER,
    "cliente" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "detalhes" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_HistoricoCliente" ("acao", "cliente", "clienteId", "criadoEm", "detalhes", "id") SELECT "acao", "cliente", "clienteId", "criadoEm", "detalhes", "id" FROM "HistoricoCliente";
DROP TABLE "HistoricoCliente";
ALTER TABLE "new_HistoricoCliente" RENAME TO "HistoricoCliente";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
