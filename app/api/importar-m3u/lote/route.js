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
    const tipo = data.tipo;
    const itens = data.itens || [];

    if (!tipo || itens.length === 0) {
      return NextResponse.json(
        { error: "Tipo ou itens inválidos" },
        { status: 400 }
      );
    }

    if (tipo === "canais") {
      await garantirBouquet("Bouquet Canais", "Canais");

      for (const item of itens) {
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
    }

    if (tipo === "filmes") {
      await garantirBouquet("Bouquet Filmes", "Filmes");

      for (const item of itens) {
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
    }

    if (tipo === "series") {
      await garantirBouquet("Bouquet Séries", "Séries");

      for (const item of itens) {
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
    }

    return NextResponse.json({
      success: true,
      tipo,
      total: itens.length,
    });
  } catch (error) {
    console.error("ERRO IMPORTAR LOTE:", error);

    return NextResponse.json(
      {
        error: "Erro ao importar lote",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
