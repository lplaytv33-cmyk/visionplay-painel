"use client";

import { useState } from "react";

export default function MonitorCanaisPage() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);

  async function verificar(p = pagina) {
    setLoading(true);

    const resp = await fetch(`/api/monitor-canais?pagina=${p}&limite=50`);
    const json = await resp.json();

    setDados(json);
    setPagina(p);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Monitor de Canais</h1>
          <p className="text-gray-500 mt-2">
            Verifique canais online, offline e tempo de resposta.
          </p>
        </div>

        <button
          onClick={() => verificar(1)}
          disabled={loading}
          className="bg-red-600 text-white px-5 py-3 rounded-xl font-black"
        >
          {loading ? "Verificando..." : "Verificar 50 canais"}
        </button>
      </div>

      {dados && (
        <div className="grid grid-cols-3 gap-5">
          <Card title="Testados" value={dados.totalTestados} />
          <Card title="Online" value={dados.online} />
          <Card title="Offline" value={dados.offline} />
        </div>
      )}

      <div className="bg-white rounded-2xl border p-6 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Canal</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Tempo</th>
              <th>Código</th>
            </tr>
          </thead>

          <tbody>
            {dados?.canais?.map((canal) => (
              <tr key={canal.id} className="border-b last:border-none">
                <td className="py-4 font-bold">{canal.nome}</td>
                <td>{canal.categoria}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    canal.status === "Online"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {canal.status}
                  </span>
                </td>
                <td>{canal.tempo}ms</td>
                <td>{canal.codigo}</td>
              </tr>
            ))}

            {!dados && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Clique em verificar para testar os canais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dados && (
        <div className="flex justify-between">
          <button
            onClick={() => verificar(Math.max(1, pagina - 1))}
            className="bg-gray-200 px-4 py-2 rounded-xl font-bold"
          >
            Anterior
          </button>

          <span className="font-bold">Página {pagina}</span>

          <button
            onClick={() => verificar(pagina + 1)}
            className="bg-gray-200 px-4 py-2 rounded-xl font-bold"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-black text-red-600 mt-2">{value}</h2>
    </div>
  );
}
