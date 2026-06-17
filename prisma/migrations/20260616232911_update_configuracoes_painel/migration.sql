-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configuracao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomePainel" TEXT NOT NULL DEFAULT 'VisionPlay',
    "nomeDono" TEXT NOT NULL DEFAULT 'Administrador',
    "dnsPrincipal" TEXT NOT NULL DEFAULT 'localhost:3000',
    "logoPainel" TEXT,
    "logoLogin" TEXT,
    "usuarioAdmin" TEXT NOT NULL DEFAULT 'admin',
    "senhaAdmin" TEXT NOT NULL DEFAULT 'admin123',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Configuracao" ("criadoEm", "dnsPrincipal", "id", "nomePainel") SELECT "criadoEm", "dnsPrincipal", "id", "nomePainel" FROM "Configuracao";
DROP TABLE "Configuracao";
ALTER TABLE "new_Configuracao" RENAME TO "Configuracao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
