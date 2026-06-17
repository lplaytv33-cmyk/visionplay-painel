import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const canais = await prisma.canal.findMany();
  const filmes = await prisma.filme.findMany();
  const series = await prisma.serie.findMany();

  const conteudos = [
    ...canais.map((item) => ({ ...item, tipo: "Canal" })),
    ...filmes.map((item) => ({ ...item, tipo: "Filme" })),
    ...series.map((item) => ({ ...item, tipo: "Série" })),
  ];

  return NextResponse.json(conteudos);
}

export async function DELETE(request) {
  const data = await request.json();
  const itens = data.itens || [];

  const canais = itens.filter((i) => i.tipo === "Canal").map((i) => i.id);
  const filmes = itens.filter((i) => i.tipo === "Filme").map((i) => i.id);
  const series = itens.filter((i) => i.tipo === "Série").map((i) => i.id);

  if (canais.length > 0) {
    await prisma.canal.deleteMany({
      where: {
        id: { in: canais },
      },
    });
  }

  if (filmes.length > 0) {
    await prisma.filme.deleteMany({
      where: {
        id: { in: filmes },
      },
    });
  }

  if (series.length > 0) {
    await prisma.serie.deleteMany({
      where: {
        id: { in: series },
      },
    });
  }

  return NextResponse.json({
    success: true,
    total: itens.length,
  });
}
