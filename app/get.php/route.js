import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const username = searchParams.get("username");
  const password = searchParams.get("password");

  if (!username || !password) {
    return new Response("Missing username or password", {
      status: 400,
    });
  }

  const cliente = await prisma.cliente.findFirst({
    where: {
      usuario: username,
      senha: password,
      status: "Ativo",
    },
  });

  if (!cliente) {
    return new Response("Cliente inválido, vencido ou bloqueado", {
      status: 403,
    });
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "local";

  const userAgent = request.headers.get("user-agent") || "Desconhecido";

  await prisma.conexaoAtiva.create({
    data: {
      clienteId: cliente.id,
      cliente: cliente.nome,
      usuario: cliente.usuario,
      ip,
      userAgent,
      status: "Online",
    },
  });

  const canais = await prisma.canal.findMany({
    where: {
      status: "Ativo",
    },
    orderBy: {
      nome: "asc",
    },
  });

  let m3u = "#EXTM3U\n";

  for (const canal of canais) {
    m3u += `#EXTINF:-1 tvg-id="${canal.epgId || ""}" tvg-name="${canal.nome}" tvg-logo="${canal.logo || ""}" group-title="${canal.categoria || "Canais"}",${canal.nome}\n`;
    m3u += `${canal.url}\n`;
  }

  return new Response(m3u, {
    headers: {
      "Content-Type": "audio/x-mpegurl; charset=utf-8",
      "Content-Disposition": `attachment; filename="${username}.m3u"`,
    },
  });
}
