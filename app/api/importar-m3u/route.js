import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function garantirCategoria(nome, tipo) {
  const nomeFinal = nome || "Sem categoria";

  return prisma.categoria.upsert({
    where: {
      nome_tipo: {
        nome: nomeFinal,
        tipo,
      },
    },
    update: {},
    create: {
      nome: nomeFinal,
      tipo,
      status: "Ativa",
    },
  });
}

async function garantirBouquet(nome, tipo) {
  return prisma.bouquet.upsert({
    where: {
      nome,
    },
    update: {},
    create: {
      nome,
      tipo,
      status: "Ativo",
    },
  });
}

export async function POST(request) {
  try {
    const data = await request.json();

    const canais = data.canais || [];
    const filmes = data.filmes || [];
    const series = data.series || [];

    await garantirBouquet("Bouquet Canais", "Canais");
    await garantirBouquet("Bouquet Filmes", "Filmes");
    await garantirBouquet("Bouquet Séries", "Séries");

    for (const item of canais) {
      await garantirCategoria(item.categoria, "Canais");

      await prisma.canal.create({
        data: {
          nome: item.nome || "Sem nome",
          categoria: item.categoria || "Sem categoria",
          url: item.link,
          logo: item.logo || "",
          status: "Ativo",
        },
      });
    }

    for (const item of filmes) {
      await garantirCategoria(item.categoria, "Filmes");

      await prisma.filme.create({
        data: {
          nome: item.nome || "Sem nome",
          categoria: item.categoria || "Sem categoria",
          url: item.link,
          capa: item.logo || "",
          status: "Ativo",
        },
      });
    }

    for (const item of series) {
      await garantirCategoria(item.categoria, "Séries");

      await prisma.serie.create({
        data: {
          nome: item.nome || "Sem nome",
          temporada: Number(item.temporada || 1),
          episodio: Number(item.episodio || 1),
          categoria: item.categoria || "Sem categoria",
          url: item.link,
          capa: item.logo || "",
          status: "Ativo",
        },
      });
    }

    return NextResponse.json({
      success: true,
      canais: canais.length,
      filmes: filmes.length,
      series: series.length,
      total: canais.length + filmes.length + series.length,
    });
  } catch (error) {
    console.error("ERRO API IMPORTAR M3U:", error);

    return NextResponse.json(
      {
        error: "Erro ao importar M3U",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
