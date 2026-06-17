import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function garantirCategoria(nome, tipo) {
  if (!nome) nome = "Sem categoria";

  return prisma.categoria.upsert({
    where: {
      nome_tipo: {
        nome,
        tipo,
      },
    },
    update: {},
    create: {
      nome,
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

    for (const item of canais) {
      await garantirCategoria(item.categoria, "Canais");
      await garantirBouquet("Bouquet Canais", "Canais");

      await prisma.canal.create({
        data: {
          nome: item.nome,
          categoria: item.categoria || "Sem categoria",
          url: item.link,
          logo: item.logo || "",
          status: "Ativo",
        },
      });
    }

    for (const item of filmes) {
      await garantirCategoria(item.categoria, "Filmes");
      await garantirBouquet("Bouquet Filmes", "Filmes");

      await prisma.filme.create({
        data: {
          nome: item.nome,
          categoria: item.categoria || "Sem categoria",
          url: item.link,
          capa: item.logo || "",
          status: "Ativo",
        },
      });
    }

    for (const item of series) {
      await garantirCategoria(item.categoria, "Séries");
      await garantirBouquet("Bouquet Séries", "Séries");

      await prisma.serie.create({
        data: {
          nome: item.nome,
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
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao importar M3U",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}