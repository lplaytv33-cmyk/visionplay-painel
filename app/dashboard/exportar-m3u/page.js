export default function ExportarM3UPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-800">Exportar M3U</h1>
        <p className="text-gray-500 mt-2">
          Gere uma lista M3U com os canais ativos do VisionPlay.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <a
          href="/api/exportar-m3u"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Baixar Lista M3U
        </a>
      </div>
    </div>
  );
}
