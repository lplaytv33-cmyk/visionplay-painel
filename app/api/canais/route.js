import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const canais = await prisma.canal.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(canais);
}

export async function POST(request) {
  const data = await request.json();

  const canal = await prisma.canal.create({
    data: {
      nome: data.nome,
      categoria: data.categoria,
      url: data.url,
      logo: data.logo || "",
      status: "Ativo",
    },
  });

  return NextResponse.json(canal);
}
