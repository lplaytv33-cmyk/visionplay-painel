import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function contarItens(nome, tipo) {
  if (tipo === "Canais") return prisma.canal.count({ where: { categoria: nome } });
  if (tipo === "Filmes") return prisma.filme.count({ where: { categoria: nome } });
  if (tipo === "Séries") return prisma.serie.count({ where: { categoria: nome } });
  return 0;
}

async function excluirConteudosDaCategoria(nome, tipo) {
  if (tipo === "Canais") return prisma.canal.deleteMany({ where: { categoria: nome } });
  if (tipo === "Filmes") return prisma.filme.deleteMany({ where: { categoria: nome } });
  if (tipo === "Séries") return prisma.serie.deleteMany({ where: { categoria: nome } });
  return { count: 0 };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo") || "";

  const categorias = await prisma.categoria.findMany({
    where: {
      ...(tipo ? { tipo } : {}),
    },
    orderBy: [
      { ordem: "asc" },
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
  const acao = data.acao || "renomear";

  const categoria = await prisma.categoria.findUnique({ where: { id } });

  if (!categoria) {
    return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
  }

  if (acao === "renomear") {
    const novoNome = String(data.nome || "").trim();

    if (!novoNome) {
      return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });
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

  if (acao === "status") {
    const novoStatus = categoria.status === "Ativa" ? "Oculta" : "Ativa";

    const atualizada = await prisma.categoria.update({
      where: { id },
      data: { status: novoStatus },
    });

    return NextResponse.json(atualizada);
  }

  if (acao === "mover") {
    const direcao = data.direcao;

    const delta = direcao === "subir" ? -1 : 1;

    const atualizada = await prisma.categoria.update({
      where: { id },
      data: {
        ordem: (categoria.ordem || 0) + delta,
      },
    });

    return NextResponse.json(atualizada);
  }

  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);

  const id = Number(searchParams.get("id"));
  const tipo = searchParams.get("tipo") || "";
  const modo = searchParams.get("modo") || "categoria";

  if (modo === "tipo") {
    if (!tipo) {
      return NextResponse.json({ error: "Tipo obrigatório." }, { status: 400 });
    }

    let removidos = 0;

    if (tipo === "Canais") {
      const r = await prisma.canal.deleteMany({});
      removidos = r.count;
    }

    if (tipo === "Filmes") {
      const r = await prisma.filme.deleteMany({});
      removidos = r.count;
    }

    if (tipo === "Séries") {
      const r = await prisma.serie.deleteMany({});
      removidos = r.count;
    }

    await prisma.categoria.deleteMany({ where: { tipo } });

    return NextResponse.json({ sucesso: true, removidos });
  }

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  const categoria = await prisma.categoria.findUnique({ where: { id } });

  if (!categoria) {
    return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
  }

  const apagarConteudo = searchParams.get("apagarConteudo") === "1";

  if (apagarConteudo) {
    await excluirConteudosDaCategoria(categoria.nome, categoria.tipo);
  } else {
    const total = await contarItens(categoria.nome, categoria.tipo);

    if (total > 0) {
      return NextResponse.json(
        { error: `Categoria possui ${total} itens. Use excluir com conteúdo.` },
        { status: 400 }
      );
    }
  }

  await prisma.categoria.delete({ where: { id } });

  return NextResponse.json({ sucesso: true });
}
