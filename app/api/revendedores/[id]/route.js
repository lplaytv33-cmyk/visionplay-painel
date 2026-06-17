import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  const data = await request.json();

  const revendedor = await prisma.revendedor.update({
    where: { id: Number(id) },
    data: {
      nome: data.nome,
      usuario: data.usuario,
      senha: data.senha,
      whatsapp: data.whatsapp || "",
      nivel: data.nivel || "Nível 1",
      creditos: Number(data.creditos || 0),
      status: data.status || "Ativo",
    },
  });

  return NextResponse.json(revendedor);
}

export async function DELETE(_, { params }) {
  const { id } = await params;

  await prisma.revendedor.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
