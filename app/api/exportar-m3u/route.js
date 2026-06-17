import { prisma } from "@/lib/prisma";

export async function GET() {
  const canais = await prisma.canal.findMany({
    where: { status: "Ativo" },
    orderBy: { nome: "asc" },
  });

  let m3u = "#EXTM3U\n";

  for (const canal of canais) {
    m3u += `#EXTINF:-1 tvg-logo="${canal.logo || ""}" group-title="${canal.categoria}",${canal.nome}\n`;
    m3u += `${canal.url}\n`;
  }

  return new Response(m3u, {
    headers: {
      "Content-Type": "audio/x-mpegurl",
      "Content-Disposition": "attachment; filename=visionplay.m3u",
    },
  });
}
