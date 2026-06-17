import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(request, { params }) {
  const { username, password, id } = await params;
  const cleanId = String(id).replace(/\.(ts|m3u8|mp4)$/i, "");

  const cliente = await prisma.cliente.findFirst({
    where: { usuario: username, senha: password, status: "Ativo" },
  });

  if (!cliente) return new Response("Forbidden", { status: 403 });

  const filme = await prisma.filme.findUnique({
    where: { id: Number(cleanId) },
  });

  if (!filme?.url) return new Response("Not found", { status: 404 });

  redirect(filme.url);
}
