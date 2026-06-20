import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resp = await fetch("http://127.0.0.1:8000/top-canais", {
      cache: "no-store",
    });

    const dados = await resp.json();
    return NextResponse.json(dados);
  } catch {
    return NextResponse.json({
      total: 0,
      canais: [],
      erro: "Stream Engine offline",
    });
  }
}
