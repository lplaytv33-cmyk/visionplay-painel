import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const tipo = data.tipo;
  const categoria = data.categoria || "";
  const status = data.status || "";

  if (!tipo) {
    return NextResponse.json(
      { error: "Tipo obrigatório." },
      { status: 400 }
    );
  }

  const where = {
    ...(categoria ? { categoria } : {}),
    ...(status ? { status } : {}),
  };

  let resultado;

  if (tipo === "canais") {
    resultado = await prisma.canal.deleteMany({ where });
  } else if (tipo === "filmes") {
    resultado = await prisma.filme.deleteMany({ where });
  } else if (tipo === "series") {
    resultado = await prisma.serie.deleteMany({ where });
  } else {
    return NextResponse.json(
      { error: "Tipo inválido." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    sucesso: true,
    tipo,
    removidos: resultado.count,
  });
}
