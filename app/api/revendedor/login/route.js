import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const revendedor = await prisma.revendedor.findFirst({
    where: {
      usuario: data.usuario,
      senha: data.senha,
      status: "Ativo",
    },
  });

  if (!revendedor) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    revendedor: {
      id: revendedor.id,
      nome: revendedor.nome,
      usuario: revendedor.usuario,
      creditos: revendedor.creditos,
    },
  });
}
