import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resposta = await fetch("http://127.0.0.1:8000/status", {
      cache: "no-store",
    });

    const dados = await resposta.json();

    return NextResponse.json(dados);
  } catch (error) {
    return NextResponse.json({
      ativos: 0,
      totalClientes: 0,
      canais: [],
      erro: "Stream engine offline",
    });
  }
}
