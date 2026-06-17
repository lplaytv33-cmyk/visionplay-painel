import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(clientes);
}

export async function POST(request) {
  const data = await request.json();

  const cliente = await prisma.cliente.create({
    data: {
      nome: data.nome,
      usuario: data.usuario,
      senha: data.senha,
      plano: data.plano,
      conexoes: Number(data.conexoes || 1),
      vencimento: data.vencimento,
      status: "Ativo",
    },
  });

  return NextResponse.json(cliente);
}
