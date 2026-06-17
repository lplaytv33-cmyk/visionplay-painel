import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const filmes = await prisma.filme.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(filmes);
}

export async function POST(request) {
  const data = await request.json();

  const filme = await prisma.filme.create({
    data: {
      nome: data.nome,
      categoria: data.categoria,
      url: data.url,
      capa: data.capa || "",
      status: "Ativo",
    },
  });

  return NextResponse.json(filme);
}
