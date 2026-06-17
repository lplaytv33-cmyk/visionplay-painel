import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bouquets = await prisma.bouquet.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(bouquets);
}
