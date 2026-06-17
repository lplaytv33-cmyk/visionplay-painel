import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_, { params }) {
  const { id } = await params;

  await prisma.serie.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
