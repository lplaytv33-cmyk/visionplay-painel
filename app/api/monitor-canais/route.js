import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function testarCanal(canal) {
  const inicio = Date.now();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);

    const resposta = await fetch(canal.url, {
      method: "GET",
      headers: {
        "User-Agent": "VLC/3.0",
        "Accept": "*/*",
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    const tempo = Date.now() - inicio;

    return {
      id: canal.id,
      nome: canal.nome,
      categoria: canal.categoria,
      url: canal.url,
      tempo,
      status: resposta.ok ? "Online" : "Offline",
      codigo: resposta.status,
    };
  } catch {
    return {
      id: canal.id,
      nome: canal.nome,
      categoria: canal.categoria,
      url: canal.url,
      tempo: Date.now() - inicio,
      status: "Offline",
      codigo: 0,
    };
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const limite = Number(searchParams.get("limite") || 50);
  const pagina = Number(searchParams.get("pagina") || 1);
  const skip = (pagina - 1) * limite;

  const canais = await prisma.canal.findMany({
    where: { status: "Ativo" },
    skip,
    take: limite,
    orderBy: { id: "asc" },
  });

  const resultados = await Promise.all(canais.map(testarCanal));

  return NextResponse.json({
    pagina,
    limite,
    totalTestados: resultados.length,
    online: resultados.filter(c => c.status === "Online").length,
    offline: resultados.filter(c => c.status === "Offline").length,
    canais: resultados,
  });
}
