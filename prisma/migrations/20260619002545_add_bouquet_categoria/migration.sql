-- CreateTable
CREATE TABLE "BouquetCategoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bouquetId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "BouquetCategoria_bouquetId_categoriaId_key" ON "BouquetCategoria"("bouquetId", "categoriaId");
