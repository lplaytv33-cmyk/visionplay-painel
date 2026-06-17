import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const canais = await prisma.canal.count();
  const filmes = await prisma.filme.count();
  const series = await prisma.serie.count();
  const categorias = await prisma.categoria.count();
  const bouquets = await prisma.bouquet.count();

  return NextResponse.json({
    canais,
    filmes,
    series,
    categorias,
    bouquets,
    total:
      canais +
      filmes +
      series,
  });
}
