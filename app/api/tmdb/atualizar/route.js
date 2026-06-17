import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function limparNome(nome) {
  return String(nome || "")
    .replace(/\bS\d{1,2}\s*E\d{1,3}\b/gi, "")
    .replace(/\bS\d{1,2}E\d{1,3}\b/gi, "")
    .replace(/\bTemporada\s*\d+\b/gi, "")
    .replace(/\bEpis[oó]dio\s*\d+\b/gi, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\b(1080p|720p|2160p|4k|hd|full hd|bluray|webrip|web-dl|dual audio|dublado|legendado)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extrairAno(nome) {
  const match = String(nome || "").match(/\((\d{4})\)|\b(19\d{2}|20\d{2})\b/);
  return match ? match[1] || match[2] : "";
}

async function buscarTMDB(token, tipo, nomeOriginal) {
  const nomeLimpo = limparNome(nomeOriginal);
  const ano = extrairAno(nomeOriginal);
  const endpoint = tipo === "filme" ? "movie" : "tv";

  const params = new URLSearchParams({
    language: "pt-BR",
    query: nomeLimpo,
  });

  if (tipo === "filme" && ano) {
    params.set("year", ano);
  }

  const url = `https://api.themoviedb.org/3/search/${endpoint}?${params.toString()}`;

  const headers = token.startsWith("ey")
    ? { Authorization: `Bearer ${token}` }
    : {};

  if (!token.startsWith("ey")) {
    params.set("api_key", token);
  }

  const finalUrl = token.startsWith("ey")
    ? url
    : `https://api.themoviedb.org/3/search/${endpoint}?${params.toString()}`;

  const resposta = await fetch(finalUrl, { headers });

  if (!resposta.ok) {
    return null;
  }

  const dados = await resposta.json();

  return dados.results?.[0] || null;
}

export async function POST() {
  const config = await prisma.configuracao.findFirst();

  if (!config?.tmdbToken) {
    return NextResponse.json(
      { error: "Cadastre o TMDB Token nas configurações." },
      { status: 400 }
    );
  }

  const filmes = await prisma.filme.findMany({
    where: {
      tmdbId: null,
    },
    take: 100,
    orderBy: { id: "asc" },
  });

  const series = await prisma.serie.findMany({
    where: {
      tmdbId: null,
    },
    take: 100,
    orderBy: { id: "asc" },
  });

  let filmesAtualizados = 0;
  let seriesAtualizadas = 0;
  const erros = [];

  for (const filme of filmes) {
    const tmdb = await buscarTMDB(config.tmdbToken, "filme", filme.nome);

    if (tmdb) {
      await prisma.filme.update({
        where: { id: filme.id },
        data: {
          tmdbId: tmdb.id,
          capa: tmdb.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
            : filme.capa,
          sinopse: tmdb.overview || filme.sinopse,
          ano: tmdb.release_date?.slice(0, 4) || filme.ano,
          nota: tmdb.vote_average || filme.nota,
        },
      });

      filmesAtualizados++;
    } else {
      erros.push(`Filme não encontrado: ${filme.nome}`);
    }
  }

  const seriesUnicas = [];
  const nomesSeries = new Set();

  for (const serie of series) {
    const nomeBase = limparNome(serie.nome);

    if (!nomesSeries.has(nomeBase)) {
      nomesSeries.add(nomeBase);
      seriesUnicas.push({
        nomeBase,
        original: serie.nome,
      });
    }
  }

  for (const item of seriesUnicas) {
    const tmdb = await buscarTMDB(config.tmdbToken, "serie", item.original);

    if (tmdb) {
      await prisma.serie.updateMany({
        where: {
          nome: {
            startsWith: item.nomeBase,
          },
        },
        data: {
          tmdbId: tmdb.id,
          capa: tmdb.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
            : undefined,
          sinopse: tmdb.overview || undefined,
          ano: tmdb.first_air_date?.slice(0, 4) || undefined,
          nota: tmdb.vote_average || undefined,
        },
      });

      seriesAtualizadas++;
    } else {
      erros.push(`Série não encontrada: ${item.original}`);
    }
  }

  await prisma.logSistema.create({
    data: {
      tipo: "TMDB",
      mensagem: `TMDB atualizado. Filmes: ${filmesAtualizados}, Séries: ${seriesAtualizadas}`,
    },
  });

  return NextResponse.json({
    success: true,
    filmesProcessados: filmes.length,
    seriesProcessadas: seriesUnicas.length,
    filmesAtualizados,
    seriesAtualizadas,
    erros: erros.slice(0, 20),
  });
}
