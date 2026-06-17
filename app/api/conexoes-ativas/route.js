import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conexoes = await prisma.conexaoAtiva.findMany({
    take: 200,
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(conexoes);
}
