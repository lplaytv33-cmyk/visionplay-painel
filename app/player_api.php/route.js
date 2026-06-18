import { prisma } from "@/lib/prisma";

function getBaseUrl(request) {
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host");
  return `${proto}://${host}`;
}

async function autenticar(username, password) {
  if (!username || !password) return null;

  return prisma.cliente.findFirst({
    where: {
      usuario: username,
      senha: password,
      status: "Ativo",
    },
  });
}

function categoriaId(nome) {
  let hash = 0;
  const texto = String(nome || "Sem Categoria");

  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }

  return String(Math.abs(hash));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const username = searchParams.get("username");
  const password = searchParams.get("password");
  const action = searchParams.get("action");

  const cliente = await autenticar(username, password);
  const base = getBaseUrl(request);

  if (!cliente) {
    return Response.json({
      user_info: { auth: 0, status: "Disabled" },
      server_info: { url: base },
    });
  }

  if (!action) {
    return Response.json({
      user_info: {
        username,
        password,
        message: "VisionPlay",
        auth: 1,
        status: "Active",
        exp_date: Math.floor(new Date(cliente.vencimento).getTime() / 1000).toString(),
        is_trial: "0",
        active_cons: "0",
        created_at: Math.floor(new Date(cliente.criadoEm).getTime() / 1000).toString(),
        max_connections: String(cliente.conexoes || 1),
        allowed_output_formats: ["m3u8", "ts", "mp4"],
      },
      server_info: {
        url: request.headers.get("host"),
        port: request.headers.get("host")?.split(":")[1] || "80",
        https_port: "443",
        server_protocol: base.startsWith("https") ? "https" : "http",
        rtmp_port: "0",
        timezone: "America/Sao_Paulo",
        timestamp_now: Math.floor(Date.now() / 1000),
        time_now: new Date().toISOString(),
      },
    });
  }

  if (action === "get_live_categories") {
    const cats = await prisma.canal.groupBy({
      by: ["categoria"],
      where: { status: "Ativo" },
      orderBy: { categoria: "asc" },
    });

    return Response.json(cats.map((c) => ({
      category_id: categoriaId(c.categoria),
      category_name: c.categoria || "Canais",
      parent_id: 0,
    })));
  }

  if (action === "get_vod_categories") {
    const cats = await prisma.filme.groupBy({
      by: ["categoria"],
      where: { status: "Ativo" },
      orderBy: { categoria: "asc" },
    });

    return Response.json(cats.map((c) => ({
      category_id: categoriaId(c.categoria),
      category_name: c.categoria || "Filmes",
      parent_id: 0,
    })));
  }

  if (action === "get_series_categories") {
    const cats = await prisma.serie.groupBy({
      by: ["categoria"],
      where: { status: "Ativo" },
      orderBy: { categoria: "asc" },
    });

    return Response.json(cats.map((c) => ({
      category_id: categoriaId(c.categoria),
      category_name: c.categoria || "Séries",
      parent_id: 0,
    })));
  }

  if (action === "get_live_streams") {
    const canais = await prisma.canal.findMany({
      where: { status: "Ativo" },
      take: 10000,
      orderBy: { nome: "asc" },
    });

    return Response.json(canais.map((c, index) => ({
      num: index + 1,
      name: c.nome,
      stream_type: "live",
      stream_id: c.id,
      stream_icon: c.logo || "",
      epg_channel_id: c.epgId || "",
      added: "",
      category_id: categoriaId(c.categoria),
      custom_sid: "",
      tv_archive: 0,
      direct_source: c.url || "",
      tv_archive_duration: 0,
    })));
  }

  if (action === "get_vod_streams") {
    const filmes = await prisma.filme.findMany({
      where: { status: "Ativo" },
      take: 10000,
      orderBy: { nome: "asc" },
    });

    return Response.json(filmes.map((f, index) => ({
      num: index + 1,
      name: f.nome,
      stream_type: "movie",
      stream_id: f.id,
      stream_icon: f.capa || "",
      rating: String(f.nota || ""),
      rating_5based: f.nota ? Number(f.nota) / 2 : 0,
      added: "",
      category_id: categoriaId(f.categoria),
      container_extension: "mp4",
      custom_sid: "",
      direct_source: `${base}/movie/${username}/${password}/${f.id}.mp4`,
    })));
  }

  if (action === "get_series") {
    const series = await prisma.serie.findMany({
      where: { status: "Ativo" },
      take: 10000,
      orderBy: { nome: "asc" },
    });

    const mapa = new Map();

    for (const s of series) {
      const nomeBase = s.nome
        .replace(/\bS\d{1,2}\s*E\d{1,3}\b/gi, "")
        .replace(/\bS\d{1,2}E\d{1,3}\b/gi, "")
        .trim();

      const idSerie = s.tmdbId || s.id;

      if (!mapa.has(nomeBase)) {
        mapa.set(nomeBase, {
          num: mapa.size + 1,
          name: nomeBase,
          series_id: idSerie,
          cover: s.capa || "",
          plot: s.sinopse || "",
          cast: "",
          director: "",
          genre: s.categoria || "",
          releaseDate: s.ano || "",
          last_modified: "",
          rating: String(s.nota || ""),
          rating_5based: s.nota ? Number(s.nota) / 2 : 0,
          backdrop_path: [],
          youtube_trailer: "",
          episode_run_time: "0",
          category_id: categoriaId(s.categoria),
        });
      }
    }

    return Response.json([...mapa.values()]);
  }

  return Response.json([]);
}
