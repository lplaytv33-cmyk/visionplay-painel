import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { tipo, id } = await params;
  const data = await request.json();

  const updateData = {
    nome: data.nome,
    categoria: data.categoria,
    url: data.url,
    status: data.status || "Ativo",
  };

  if (tipo === "Canal") {
    const canal = await prisma.canal.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(canal);
  }

  if (tipo === "Filme") {
    const filme = await prisma.filme.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(filme);
  }

  if (tipo === "Série") {
    const serie = await prisma.serie.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(serie);
  }

  return NextResponse.json(
    { error: "Tipo inválido" },
    { status: 400 }
  );
}
