import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { username, password, id } = await params;
  const cleanId = String(id).replace(/\.(ts|m3u8|mp4)$/i, "");

  const cliente = await prisma.cliente.findFirst({
    where: { usuario: username, senha: password, status: "Ativo" },
  });

  if (!cliente) return new Response("Forbidden", { status: 403 });

  const canal = await prisma.canal.findUnique({
    where: { id: Number(cleanId) },
  });

  if (!canal?.url) return new Response("Not found", { status: 404 });

  const upstream = await fetch(canal.url, {
    headers: {
      "User-Agent": request.headers.get("user-agent") || "VLC/3.0",
      "Range": request.headers.get("range") || "",
    },
  });

  if (!upstream.ok) {
    return new Response("Canal offline ou bloqueado", { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "video/mp2t",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
