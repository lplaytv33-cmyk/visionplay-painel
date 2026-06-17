import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const avisos = await prisma.aviso.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(avisos);
}

export async function POST(request) {
  const data = await request.json();

  const aviso = await prisma.aviso.create({
    data: {
      titulo: data.titulo,
      mensagem: data.mensagem,
      status: "Ativo",
    },
  });

  return NextResponse.json(aviso);
}
