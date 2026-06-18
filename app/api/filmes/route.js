import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 50);
  const busca = searchParams.get("busca") || "";
  const categoria = searchParams.get("categoria") || "";

  const where = {
    ...(busca ? { nome: { contains: busca } } : {}),
    ...(categoria ? { categoria } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.filme.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "desc" },
    }),
    prisma.filme.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
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
