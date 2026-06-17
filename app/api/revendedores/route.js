import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const revendedores = await prisma.revendedor.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(revendedores);
}

export async function POST(request) {
  const data = await request.json();

  const revendedor = await prisma.revendedor.create({
    data: {
      nome: data.nome,
      usuario: data.usuario,
      senha: data.senha,
      whatsapp: data.whatsapp || "",
      nivel: data.nivel || "Nível 1",
      creditos: Number(data.creditos || 0),
      status: "Ativo",
    },
  });

  return NextResponse.json(revendedor);
}
