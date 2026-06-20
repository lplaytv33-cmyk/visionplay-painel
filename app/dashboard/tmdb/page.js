"use client";

import { useEffect, useState } from "react";

export default function TMDBPage() {
  const [status, setStatus] = useState(null);
  const [resposta, setResposta] = useState(null);
  const [loading, setLoading] = useState(false);

  async function carregarStatus() {
    const resp = await fetch("/api/tmdb/status");
    const dados = await resp.json();
    setStatus(dados);
  }

  useEffect(() => {
    carregarStatus();
  }, []);

  async function atualizar() {
    setLoading(true);
    setResposta(null);

    const resp = await fetch("/api/tmdb/atualizar", { method: "POST" });
    const dados = await resp.json();

    setResposta(dados);
    await carregarStatus();
    setLoading(false);
  }

  const total = (status?.filmesTotal || 0) + (status?.seriesTotal || 0);
  const atualizados = (status?.filmesAtualizados || 0) + (status?.seriesAtualizadas || 0);
  const progresso = total ? Math.round((atualizados / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">Atualizar TMDB</h1>
        <p className="text-gray-500 mt-2">
          Atualize capas, sinopses, ano e notas de filmes e séries.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-8 space-y-5">
        <div>
          <div className="flex justify-between font-bold mb-2">
            <span>Progresso TMDB</span>
            <span>{progresso}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-red-600 h-4 transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Atualizados: {atualizados.toLocaleString()} / {total.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card title="Filmes pendentes" value={status?.filmesPendentes || 0} />
          <Card title="Filmes OK" value={status?.filmesAtualizados || 0} />
          <Card title="Séries pendentes" value={status?.seriesPendentes || 0} />
          <Card title="Séries OK" value={status?.seriesAtualizadas || 0} />
        </div>

        <button
          onClick={atualizar}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-black"
        >
          {loading ? "Atualizando lote..." : "Atualizar próximo lote TMDB"}
        </button>

        {resposta && (
          <pre className="bg-gray-100 p-4 rounded-xl overflow-auto text-xs">
            {JSON.stringify(resposta, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl border p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-black text-red-600">{Number(value).toLocaleString()}</h2>
    </div>
  );
}
