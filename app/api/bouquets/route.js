import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bouquets = await prisma.bouquet.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(bouquets);
}

export async function POST(request) {
  const data = await request.json();

  const bouquet = await prisma.bouquet.create({
    data: {
      nome: data.nome,
      tipo: data.tipo || "Completo",
      status: "Ativo",
    },
  });

  return NextResponse.json(bouquet);
}

export async function PATCH(request) {
  const data = await request.json();

  const bouquet = await prisma.bouquet.update({
    where: { id: Number(data.id) },
    data: {
      nome: data.nome,
      tipo: data.tipo || "Completo",
    },
  });

  return NextResponse.json(bouquet);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  await prisma.bouquetCategoria.deleteMany({
    where: { bouquetId: id },
  });

  await prisma.bouquet.delete({
    where: { id },
  });

  return NextResponse.json({ sucesso: true });
}
