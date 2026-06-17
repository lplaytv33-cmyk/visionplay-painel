export default function BackupPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">
          Backup do Sistema
        </h1>

        <p className="text-gray-500 mt-2">
          Baixe uma cópia completa do banco SQLite.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-8">
        <a
          href="/api/backup"
          className="bg-red-600 text-white px-6 py-4 rounded-xl font-black inline-block"
        >
          📦 Baixar Backup
        </a>
      </div>
    </div>
  );
}
