import fs from "fs";
import path from "path";

export async function GET() {
  const dbPath = path.join(process.cwd(), "dev.db");

  if (!fs.existsSync(dbPath)) {
    return Response.json(
      { error: "Banco não encontrado", path: dbPath },
      { status: 404 }
    );
  }

  const file = fs.readFileSync(dbPath);

  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": "application/x-sqlite3",
      "Content-Disposition": `attachment; filename="visionplay-backup.db"`,
    },
  });
}