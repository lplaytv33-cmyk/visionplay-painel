import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const clientes = await prisma.cliente.findMany({
    where: {
      revendedorId: Number(data.revendedorId),
    },
  });

  const nomesClientes = clientes.map((c) => c.nome);

  const historico = await prisma.historicoCliente.findMany({
    where: {
      cliente: {
        in: nomesClientes,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(historico);
}