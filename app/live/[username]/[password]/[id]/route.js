import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { username, password, id } = await params;
  const cleanId = Number(String(id).replace(/\.(ts|m3u8|mp4)$/i, ""));

  const cliente = await prisma.cliente.findFirst({
    where: { usuario: username, senha: password, status: "Ativo" },
  });

  if (!cliente) return new Response("Forbidden", { status: 403 });

  const canal = await prisma.canal.findUnique({
    where: { id: cleanId },
  });

  if (!canal?.url) return new Response("Not found", { status: 404 });

  return Response.redirect(canal.url, 302);
}
