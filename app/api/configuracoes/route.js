import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PADRAO = {
  nomePainel: "VisionPlay",
  nomeDono: "Administrador",
  dnsPrincipal: "localhost:3000",
  logoPainel: "",
  logoLogin: "",
  usuarioAdmin: "admin",
  senhaAdmin: "admin123",
};

export async function GET() {
  let config = await prisma.configuracao.findFirst();

  if (!config) {
    config = await prisma.configuracao.create({
      data: PADRAO,
    });
  }

  return NextResponse.json(config);
}

export async function POST(request) {
  const data = await request.json();

  let config = await prisma.configuracao.findFirst();

  const payload = {
    nomePainel: data.nomePainel || "VisionPlay",
    nomeDono: data.nomeDono || "Administrador",
    dnsPrincipal: data.dnsPrincipal || "localhost:3000",
    logoPainel: data.logoPainel || "",
    logoLogin: data.logoLogin || "",
    usuarioAdmin: data.usuarioAdmin || "admin",
    senhaAdmin: data.senhaAdmin || "admin123",
    tmdbToken: data.tmdbToken || "",
    epgUrl: data.epgUrl || "",
  };

  if (!config) {
    config = await prisma.configuracao.create({
      data: payload,
    });
  } else {
    config = await prisma.configuracao.update({
      where: { id: config.id },
      data: payload,
    });
  }

  return NextResponse.json(config);
}
