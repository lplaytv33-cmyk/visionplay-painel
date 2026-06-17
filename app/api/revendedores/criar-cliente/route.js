import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  const revendedor = await prisma.revendedor.findUnique({
    where: {
      id: Number(data.revendedorId),
    },
  });

  if (!revendedor) {
    return NextResponse.json(
      { error: "Revendedor não encontrado." },
      { status: 404 }
    );
  }

  if (revendedor.creditos <= 0) {
    return NextResponse.json(
      { error: "Revendedor sem créditos disponíveis." },
      { status: 400 }
    );
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome: data.nome,
      usuario: data.usuario,
      senha: data.senha,
      whatsapp: data.whatsapp || "",
      plano: data.plano,
      conexoes: Number(data.conexoes || 1),
      vencimento: data.vencimento,
      status: "Ativo",
      revendedorId: revendedor.id,
      revendedor: revendedor.nome,
    },
  });

  await prisma.revendedor.update({
    where: {
      id: revendedor.id,
    },
    data: {
      creditos: revendedor.creditos - 1,
    },
  });

  await prisma.historicoCredito.create({
    data: {
      revendedorId: revendedor.id,
      revendedor: revendedor.nome,
      tipo: "CLIENTE_CRIADO",
      quantidade: 1,
      observacao: `Cliente criado: ${cliente.nome}`,
    },
  });

  await prisma.historicoCliente.create({
    data: {
      cliente: cliente.nome,
      acao: "CRIACAO",
      detalhes: `Cliente criado pelo revendedor ${revendedor.nome}`,
    },
  });

  return NextResponse.json({
    success: true,
    cliente,
    creditosRestantes: revendedor.creditos - 1,
  });
}
