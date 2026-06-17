import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const historico = await prisma.historicoCredito.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(historico);
}

export async function POST(request) {
  const data = await request.json();

  const historico = await prisma.historicoCredito.create({
    data: {
      revendedorId: data.revendedorId || null,
      revendedor: data.revendedor,
      tipo: data.tipo,
      quantidade: Number(data.quantidade),
      observacao: data.observacao || "",
    },
  });

  return NextResponse.json(historico);
}
