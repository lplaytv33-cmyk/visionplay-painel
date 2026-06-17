import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const historico = await prisma.historicoCliente.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(historico);
}
