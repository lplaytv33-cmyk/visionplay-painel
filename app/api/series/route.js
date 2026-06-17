import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const series = await prisma.serie.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(series);
}

export async function POST(request) {
  const data = await request.json();

  const serie = await prisma.serie.create({
    data: {
      nome: data.nome,
      temporada: Number(data.temporada || 1),
      episodio: Number(data.episodio || 1),
      categoria: data.categoria,
      url: data.url,
      capa: data.capa || "",
      status: "Ativo",
    },
  });

  return NextResponse.json(serie);
}
