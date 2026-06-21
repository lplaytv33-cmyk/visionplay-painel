import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();
  const ids = Array.isArray(data.ids) ? data.ids.map(Number).filter(Boolean) : [];

  if (ids.length === 0) {
    return NextResponse.json(
      { error: "Nenhum canal offline selecionado." },
      { status: 400 }
    );
  }

  const resultado = await prisma.canal.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      status: "Inativo",
    },
  });

  return NextResponse.json({
    sucesso: true,
    alterados: resultado.count,
  });
}
