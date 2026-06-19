import { prisma } from "@/lib/prisma";

export async function categoriasOrdenadas(tipo) {
  return prisma.categoria.findMany({
    where: {
      tipo,
      status: "Ativa",
    },
    orderBy: [
      { ordem: "asc" },
      { nome: "asc" },
    ],
  });
}
