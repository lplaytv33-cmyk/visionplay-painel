import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [canaisTotal, canaisComEpg, programas] = await Promise.all([
    prisma.canal.count(),
    prisma.canal.count({ where: { epgId: { not: "" } } }),
    prisma.epgPrograma.count(),
  ]);

  return NextResponse.json({
    canaisTotal,
    canaisComEpg,
    canaisSemEpg: canaisTotal - canaisComEpg,
    programas,
  });
}
