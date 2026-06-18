import { prisma } from "@/lib/prisma";
import { spawn } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;
  const canalId = Number(String(id).replace(/\.(ts|m3u8|mp4)$/i, ""));

  const canal = await prisma.canal.findUnique({
    where: { id: canalId },
  });

  if (!canal?.url) {
    return new Response("Canal não encontrado", { status: 404 });
  }

  const ffmpeg = spawn("ffmpeg", [
    "-hide_banner",
    "-loglevel", "error",
    "-user_agent", "VLC/3.0",
    "-i", canal.url,
    "-c:v", "copy",
    "-c:a", "copy",
    "-f", "mpegts",
    "pipe:1",
  ]);

  request.signal.addEventListener("abort", () => {
    ffmpeg.kill("SIGKILL");
  });

  return new Response(ffmpeg.stdout, {
    headers: {
      "Content-Type": "video/mp2t",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
