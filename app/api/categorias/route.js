import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function contarItens(nome, tipo) {
  if (tipo === "Canais") {
    return prisma.canal.count({ where: { categoria: nome } });
  }

  if (tipo === "Filmes") {
    return prisma.filme.count({ where: { categoria: nome } });
  }

  if (tipo === "Séries") {
    return prisma.serie.count({ where: { categoria: nome } });
  }

  return 0;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo") || "";

  const categorias = await prisma.categoria.findMany({
    where: {
      ...(tipo ? { tipo } : {}),
    },
    orderBy: [
      { tipo: "asc" },
      { nome: "asc" },
    ],
  });

  const comContagem = await Promise.all(
    categorias.map(async (cat) => ({
      ...cat,
      totalItens: await contarItens(cat.nome, cat.tipo),
    }))
  );

  return NextResponse.json(comContagem);
}

export async function PATCH(request) {
  const data = await request.json();

  const id = Number(data.id);
  const novoNome = String(data.nome || "").trim();

  if (!id || !novoNome) {
    return NextResponse.json(
      { error: "ID e nome são obrigatórios." },
      { status: 400 }
    );
  }

  const categoria = await prisma.categoria.findUnique({
    where: { id },
  });

  if (!categoria) {
    return NextResponse.json(
      { error: "Categoria não encontrada." },
      { status: 404 }
    );
  }

  if (categoria.tipo === "Canais") {
    await prisma.canal.updateMany({
      where: { categoria: categoria.nome },
      data: { categoria: novoNome },
    });
  }

  if (categoria.tipo === "Filmes") {
    await prisma.filme.updateMany({
      where: { categoria: categoria.nome },
      data: { categoria: novoNome },
    });
  }

  if (categoria.tipo === "Séries") {
    await prisma.serie.updateMany({
      where: { categoria: categoria.nome },
      data: { categoria: novoNome },
    });
  }

  const atualizada = await prisma.categoria.update({
    where: { id },
    data: { nome: novoNome },
  });

  return NextResponse.json(atualizada);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json(
      { error: "ID obrigatório." },
      { status: 400 }
    );
  }

  const categoria = await prisma.categoria.findUnique({
    where: { id },
  });

  if (!categoria) {
    return NextResponse.json(
      { error: "Categoria não encontrada." },
      { status: 404 }
    );
  }

  const total = await contarItens(categoria.nome, categoria.tipo);

  if (total > 0) {
    return NextResponse.json(
      {
        error: `Categoria possui ${total} itens. Exclua ou mova os conteúdos antes.`,
      },
      { status: 400 }
    );
  }

  await prisma.categoria.delete({
    where: { id },
  });

  return NextResponse.json({ sucesso: true });
}
