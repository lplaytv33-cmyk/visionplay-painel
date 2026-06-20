import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [filmesTotal, filmesPendentes, seriesTotal, seriesPendentes] = await Promise.all([
    prisma.filme.count(),
    prisma.filme.count({ where: { tmdbId: null } }),
    prisma.serie.count(),
    prisma.serie.count({ where: { tmdbId: null } }),
  ]);

  return NextResponse.json({
    filmesTotal,
    filmesPendentes,
    filmesAtualizados: filmesTotal - filmesPendentes,
    seriesTotal,
    seriesPendentes,
    seriesAtualizadas: seriesTotal - seriesPendentes,
  });
}
