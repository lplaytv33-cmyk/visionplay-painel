"use client";

import { useState } from "react";

export default function ExclusaoMassaPage() {
  const [tipo, setTipo] = useState("canais");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  async function excluir() {
    const confirmar = confirm(
      "Atenção: essa ação apaga conteúdos em massa. Deseja continuar?"
    );

    if (!confirmar) return;

    setLoading(true);
    setResultado(null);

    const resposta = await fetch("/api/exclusao-massa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo,
        categoria,
        status,
      }),
    });

    const dados = await resposta.json();

    setResultado(dados);
    setLoading(false);
  }

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-2xl font-black text-gray-800">
          Exclusão em Massa
        </h1>

        <p className="text-gray-500 mt-2">
          Remova canais, filmes ou séries rapidamente por tipo, categoria ou status.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-8 space-y-5 max-w-2xl">

        <div>
          <label className="font-bold text-sm">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="input"
          >
            <option value="canais">Canais</option>
            <option value="filmes">Filmes</option>
            <option value="series">Séries</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-sm">Categoria específica</label>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ex: Canais | Filmes 24 horas"
            className="input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Deixe vazio para excluir todas as categorias desse tipo.
          </p>
        </div>

        <div>
          <label className="font-bold text-sm">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <button
          disabled={loading}
          onClick={excluir}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold w-full"
        >
          {loading ? "Excluindo..." : "Excluir em Massa"}
        </button>

        {resultado && (
          <div className="bg-gray-50 border rounded-xl p-4">
            {resultado.sucesso ? (
              <p className="font-bold text-green-700">
                Removidos: {resultado.removidos}
              </p>
            ) : (
              <p className="font-bold text-red-700">
                {resultado.error || "Erro ao excluir."}
              </p>
            )}
          </div>
        )}

      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
          margin-top: 8px;
          outline: none;
        }

        .input:focus {
          border-color: #ef4444;
        }
      `}</style>
    </div>
  );
}
