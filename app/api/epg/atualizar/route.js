import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { XMLParser } from "fast-xml-parser";

function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export async function POST() {
  const config = await prisma.configuracao.findFirst();

  if (!config?.epgUrl) {
    return NextResponse.json(
      { error: "Cadastre a URL EPG XMLTV nas configurações." },
      { status: 400 }
    );
  }

  const resposta = await fetch(config.epgUrl);

  if (!resposta.ok) {
    return NextResponse.json(
      { error: "Não foi possível baixar o EPG." },
      { status: 400 }
    );
  }

  const xml = await resposta.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const json = parser.parse(xml);

  const canaisXml = Array.isArray(json.tv.channel)
    ? json.tv.channel
    : [json.tv.channel];

  const programasXml = Array.isArray(json.tv.programme)
    ? json.tv.programme
    : [json.tv.programme];

  const canaisBanco = await prisma.canal.findMany();

  let canaisVinculados = 0;

  for (const canalXml of canaisXml) {
    const epgId = canalXml.id;
    const display = Array.isArray(canalXml["display-name"])
      ? canalXml["display-name"][0]
      : canalXml["display-name"];

    const nomeXml = normalizar(display);

    const canalEncontrado = canaisBanco.find((c) => {
      const nomeBanco = normalizar(c.nome);
      return nomeBanco.includes(nomeXml) || nomeXml.includes(nomeBanco);
    });

    if (canalEncontrado && epgId) {
      await prisma.canal.update({
        where: { id: canalEncontrado.id },
        data: { epgId },
      });

      canaisVinculados++;
    }
  }

  await prisma.epgPrograma.deleteMany();

  const programas = programasXml.slice(0, 5000).map((p) => ({
    epgId: p.channel || "",
    canalNome: p.channel || "",
    titulo:
      typeof p.title === "object"
        ? p.title["#text"] || "Sem título"
        : p.title || "Sem título",
    descricao:
      typeof p.desc === "object"
        ? p.desc["#text"] || ""
        : p.desc || "",
    inicio: p.start || "",
    fim: p.stop || "",
  }));

  if (programas.length > 0) {
    await prisma.epgPrograma.createMany({
      data: programas,
    });
  }

  await prisma.logSistema.create({
    data: {
      tipo: "EPG",
      mensagem: `EPG atualizado. Canais vinculados: ${canaisVinculados}, Programas: ${programas.length}`,
    },
  });

  return NextResponse.json({
    success: true,
    canaisVinculados,
    programas: programas.length,
  });
}
