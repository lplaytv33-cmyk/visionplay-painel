import { prisma } from "@/lib/prisma";
import { categoriasOrdenadas } from "@/app/api/categorias/ordenadas";

function getBaseUrl(request) {
  const envUrl = process.env.NEXT_PUBLIC_PANEL_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

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
    const cats = await categoriasOrdenadas("Canais");

    return Response.json(cats.map((c) => ({
      category_id: categoriaId(c.nome),
      category_name: c.nome || "Canais",
      parent_id: 0,
    })));
  }

  if (action === "get_vod_categories") {
    const cats = await categoriasOrdenadas("Filmes");

    return Response.json(cats.map((c) => ({
      category_id: categoriaId(c.nome),
      category_name: c.nome || "Filmes",
      parent_id: 0,
    })));
  }

  if (action === "get_series_categories") {
    const cats = await categoriasOrdenadas("Séries");

    return Response.json(cats.map((c) => ({
      category_id: categoriaId(c.nome),
      category_name: c.nome || "Séries",
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
      direct_source: `${base}/live/${username}/${password}/${c.id}.ts`,
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


  if (action === "get_series_info") {
    const seriesId = searchParams.get("series_id");

    const episodios = await prisma.serie.findMany({
      where: {
        status: "Ativo",
      },
      orderBy: [
        { temporada: "asc" },
        { episodio: "asc" },
      ],
    });

    const filtrados = episodios.filter((ep) => {
      const nomeBase = ep.nome
        .replace(/\bS\d{1,2}\s*E\d{1,3}\b/gi, "")
        .replace(/\bS\d{1,2}E\d{1,3}\b/gi, "")
        .trim();

      const idSerie = String(ep.tmdbId || ep.id);
      return idSerie === String(seriesId) || String(categoriaId(nomeBase)) === String(seriesId);
    });

    const info = filtrados[0] || null;
    const episodes = {};

    for (const ep of filtrados) {
      const temporada = String(ep.temporada || 1);

      if (!episodes[temporada]) {
        episodes[temporada] = [];
      }

      episodes[temporada].push({
        id: ep.id,
        episode_num: ep.episodio || 1,
        title: ep.nome,
        container_extension: "mp4",
        info: {
          movie_image: ep.capa || "",
          plot: ep.sinopse || "",
          duration_secs: 0,
          duration: "00:00:00",
        },
        custom_sid: "",
        added: "",
        season: ep.temporada || 1,
        direct_source: `${base}/series/${username}/${password}/${ep.id}.mp4`,
      });
    }

    return Response.json({
      seasons: Object.keys(episodes).map((season) => ({
        air_date: "",
        episode_count: episodes[season].length,
        id: Number(season),
        name: `Temporada ${season}`,
        overview: "",
        season_number: Number(season),
        cover: info?.capa || "",
        cover_big: info?.capa || "",
      })),
      info: {
        name: info?.nome || "",
        cover: info?.capa || "",
        plot: info?.sinopse || "",
        cast: "",
        director: "",
        genre: info?.categoria || "",
        releaseDate: info?.ano || "",
        rating: String(info?.nota || ""),
      },
      episodes,
    });
  }


  return Response.json([]);
}
