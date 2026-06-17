"use client";

import { useState } from "react";

export default function TMDBPage() {
  const [resposta, setResposta] = useState(null);
  const [loading, setLoading] = useState(false);

  async function atualizar() {
    setLoading(true);

    const resp = await fetch("/api/tmdb/atualizar", {
      method: "POST",
    });

    const dados = await resp.json();

    setResposta(dados);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">Atualizar TMDB</h1>
        <p className="text-gray-500 mt-2">
          Atualize capas, descrições e informações de filmes e séries.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-8">
        <button
          onClick={atualizar}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-black"
        >
          {loading ? "Atualizando..." : "Iniciar Atualização TMDB"}
        </button>

        {resposta && (
          <pre className="mt-6 bg-gray-100 p-4 rounded-xl overflow-auto">
            {JSON.stringify(resposta, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
