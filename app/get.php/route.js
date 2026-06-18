import { prisma } from "@/lib/prisma";

function getBaseUrl(request) {
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host");
  return `${proto}://${host}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const username = searchParams.get("username");
  const password = searchParams.get("password");
  const output = searchParams.get("output") || "ts";

  if (!username || !password) {
    return new Response("Missing username or password", { status: 400 });
  }

  const cliente = await prisma.cliente.findFirst({
    where: { usuario: username, senha: password, status: "Ativo" },
  });

  if (!cliente) {
    return new Response("Cliente inválido, vencido ou bloqueado", { status: 403 });
  }

  const base = getBaseUrl(request);
  const extLive = output === "m3u8" ? "m3u8" : "ts";

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
    where: { status: "Ativo" },
    orderBy: { nome: "asc" },
  });

  const filmes = await prisma.filme.findMany({
    where: { status: "Ativo" },
    orderBy: { nome: "asc" },
  });

  const series = await prisma.serie.findMany({
    where: { status: "Ativo" },
    orderBy: { nome: "asc" },
  });

  let m3u = "#EXTM3U\n";

  for (const canal of canais) {
    m3u += `#EXTINF:-1 tvg-id="${canal.epgId || ""}" tvg-name="${canal.nome}" tvg-logo="${canal.logo || ""}" group-title="${canal.categoria || "Canais"}",${canal.nome}\n`;
    m3u += `${canal.url}\n`;
  }

  for (const filme of filmes) {
    m3u += `#EXTINF:-1 tvg-id="" tvg-name="${filme.nome}" tvg-logo="${filme.capa || ""}" group-title="${filme.categoria || "Filmes"}",${filme.nome}\n`;
    m3u += `${base}/movie/${username}/${password}/${filme.id}.mp4\n`;
  }

  for (const ep of series) {
    m3u += `#EXTINF:-1 tvg-id="" tvg-name="${ep.nome}" tvg-logo="${ep.capa || ""}" group-title="${ep.categoria || "Séries"}",${ep.nome}\n`;
    m3u += `${base}/series/${username}/${password}/${ep.id}.mp4\n`;
  }

  return new Response(m3u, {
    headers: {
      "Content-Type": "audio/x-mpegurl; charset=utf-8",
      "Content-Disposition": `attachment; filename="${username}.m3u"`,
    },
  });
}
