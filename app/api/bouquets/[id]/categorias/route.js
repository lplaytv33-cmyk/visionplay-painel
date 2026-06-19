import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;
  const bouquetId = Number(id);

  const categorias = await prisma.categoria.findMany({
    orderBy: [
      { tipo: "asc" },
      { ordem: "asc" },
      { nome: "asc" },
    ],
  });

  const vinculadas = await prisma.bouquetCategoria.findMany({
    where: { bouquetId },
  });

  const ids = new Set(vinculadas.map((v) => v.categoriaId));

  return NextResponse.json(
    categorias.map((c) => ({
      ...c,
      marcada: ids.has(c.id),
    }))
  );
}

export async function POST(request, { params }) {
  const { id } = await params;
  const bouquetId = Number(id);
  const data = await request.json();

  const categorias = data.categorias || [];

  await prisma.bouquetCategoria.deleteMany({
    where: { bouquetId },
  });

  for (const categoria of categorias) {
    await prisma.bouquetCategoria.create({
      data: {
        bouquetId,
        categoriaId: Number(categoria.id),
        tipo: categoria.tipo,
      },
    });
  }

  return NextResponse.json({ sucesso: true });
}
