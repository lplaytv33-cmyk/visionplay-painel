/*
  Warnings:

  - You are about to drop the column `nivel` on the `Revendedor` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Revendedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "whatsapp" TEXT,
    "creditos" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Revendedor" ("creditos", "criadoEm", "id", "nome", "senha", "status", "usuario") SELECT "creditos", "criadoEm", "id", "nome", "senha", "status", "usuario" FROM "Revendedor";
DROP TABLE "Revendedor";
ALTER TABLE "new_Revendedor" RENAME TO "Revendedor";
CREATE UNIQUE INDEX "Revendedor_usuario_key" ON "Revendedor"("usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
