import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const historico = await prisma.historicoCliente.create({
    data: {
      cliente: data.cliente,
      acao: data.acao,
      detalhes: data.detalhes,
    },
  });

  return NextResponse.json(historico);
}
