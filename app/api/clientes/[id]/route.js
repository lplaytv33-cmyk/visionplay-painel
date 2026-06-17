import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const cliente = await prisma.cliente.create({
    data: {
      nome: data.nome,
      usuario: data.usuario,
      senha: data.senha,
      whatsapp: data.whatsapp || "",
      plano: data.plano,
      conexoes: Number(data.conexoes || 1),
      vencimento: data.vencimento,
      status: "Ativo",
    },
  });

  return NextResponse.json(cliente);
}

export async function DELETE(_, { params }) {
  const { id } = await params;

  await prisma.cliente.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
