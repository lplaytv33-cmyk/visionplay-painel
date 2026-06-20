import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resp = await fetch("http://127.0.0.1:8000/status", {
      cache: "no-store",
    });

    const dados = await resp.json();

    const conexoes = [];

    for (const canal of dados.canais || []) {
      for (const c of canal.conexoes || []) {
        conexoes.push({
          id: `${canal.id}-${c.usuario}-${c.ip}`,
          cliente: c.cliente,
          usuario: c.usuario,
          ip: c.ip,
          canal: canal.nome,
          userAgent: c.userAgent,
          tempo: c.conectadoHaSegundos,
          status: "Online",
        });
      }
    }

    return NextResponse.json({
      ativos: dados.ativos || 0,
      totalClientes: dados.totalClientes || 0,
      usuarios: dados.usuarios || [],
      conexoes,
    });
  } catch (error) {
    return NextResponse.json({
      ativos: 0,
      totalClientes: 0,
      usuarios: [],
      conexoes: [],
      erro: "Stream Engine offline",
    });
  }
}
