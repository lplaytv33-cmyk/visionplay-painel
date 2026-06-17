-- CreateTable
CREATE TABLE "ConexaoAtiva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER,
    "cliente" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Online',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
