import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const revendedor = await prisma.revendedor.findUnique({
    where: {
      id: Number(data.id),
    },
  });

  return NextResponse.json(revendedor);
}

export async function PUT(request) {
  const data = await request.json();

  const revendedor = await prisma.revendedor.update({
    where: {
      id: Number(data.id),
    },
    data: {
      whatsapp: data.whatsapp,
      senha: data.senha,
    },
  });

  return NextResponse.json(revendedor);
}