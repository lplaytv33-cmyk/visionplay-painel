"use client";

import { useEffect, useState } from "react";

const TIPOS = ["Canais", "Filmes", "Séries"];

export default function BouquetsPage() {
  const [bouquets, setBouquets] = useState([]);
  const [editor, setEditor] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  async function carregarBouquets() {
    const resposta = await fetch("/api/bouquets");
    const dados = await resposta.json();
    setBouquets(dados);
  }

  useEffect(() => {
    carregarBouquets();
  }, []);

  async function criarBouquet() {
    const nomeNovo = prompt("Nome do novo bouquet:");
    if (!nomeNovo) return;

    await fetch("/api/bouquets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomeNovo, tipo: "Completo" }),
    });

    carregarBouquets();
  }

  async function excluirBouquet(id) {
    if (!confirm("Excluir este bouquet?")) return;

    await fetch(`/api/bouquets?id=${id}`, {
      method: "DELETE",
    });

    carregarBouquets();
  }

  async function abrirEditor(bouquet) {
    setEditor(bouquet);
    setNome(bouquet.nome);
    setLoading(true);

    const resposta = await fetch(`/api/bouquets/${bouquet.id}/categorias`);
    const dados = await resposta.json();

    setCategorias(dados);
    setLoading(false);
  }

  function toggleCategoria(id) {
    setCategorias((lista) =>
      lista.map((c) =>
        c.id === id ? { ...c, marcada: !c.marcada } : c
      )
    );
  }

  function selecionarTipo(tipo, marcado) {
    setCategorias((lista) =>
      lista.map((c) =>
        c.tipo === tipo ? { ...c, marcada: marcado } : c
      )
    );
  }

  async function salvarBouquet() {
    if (!editor) return;

    await fetch("/api/bouquets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editor.id,
        nome,
        tipo: "Completo",
      }),
    });

    await fetch(`/api/bouquets/${editor.id}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categorias: categorias.filter((c) => c.marcada),
      }),
    });

    setEditor(null);
    carregarBouquets();
  }

  function contarMarcadas(tipo) {
    return categorias.filter((c) => c.tipo === tipo && c.marcada).length;
  }

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">
            Bouquets / Pacotes
          </h1>
          <p className="text-gray-500 mt-2">
            Defina quais pastas entram em cada pacote dos aplicativos.
          </p>
        </div>

        <button
          onClick={criarBouquet}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
        >
          + Criar Novo Bouquet
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Bouquets" value={bouquets.length} />
        <Card title="Ativos" value={bouquets.filter((b) => b.status === "Ativo").length} />
        <Card title="Banco" value="Online" />
        <Card title="Modo" value="Categorias" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Nome do Bouquet</th>
              <th>Tipo</th>
              <th>Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {bouquets.map((bouquet) => (
              <tr key={bouquet.id} className="border-b last:border-none">
                <td className="py-4 font-bold text-gray-800">{bouquet.nome}</td>
                <td>{bouquet.tipo}</td>
                <td>{bouquet.status}</td>
                <td className="text-right space-x-2">
                  <button
                    onClick={() => abrirEditor(bouquet)}
                    className="bg-cyan-500 text-white px-3 py-2 rounded-lg font-bold"
                  >
                    Editar Pastas
                  </button>

                  <button
                    onClick={() => excluirBouquet(bouquet.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {bouquets.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  Nenhum bouquet encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-800">
                Editar Bouquet
              </h2>

              <button
                onClick={() => setEditor(null)}
                className="text-3xl text-gray-500 font-black"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="font-bold text-sm">
                  Nome do Pacote
                </label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="input"
                />
              </div>

              {loading ? (
                <p>Carregando categorias...</p>
              ) : (
                <div className="grid grid-cols-3 gap-5">
                  {TIPOS.map((tipo) => (
                    <div key={tipo} className="border rounded-2xl p-4 max-h-[500px] overflow-y-auto">
                      <h3 className="text-xl font-black text-cyan-600 mb-3">
                        {tipo} ({contarMarcadas(tipo)})
                      </h3>

                      <label className="flex gap-2 items-center border-b pb-3 mb-3 font-bold">
                        <input
                          type="checkbox"
                          onChange={(e) => selecionarTipo(tipo, e.target.checked)}
                        />
                        Selecionar tudo
                      </label>

                      <div className="space-y-2">
                        {categorias
                          .filter((c) => c.tipo === tipo)
                          .map((cat) => (
                            <label key={cat.id} className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                checked={!!cat.marcada}
                                onChange={() => toggleCategoria(cat.id)}
                              />

                              <span className="font-semibold">
                                {cat.nome}
                              </span>

                              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-bold">
                                {cat.status}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setEditor(null)}
                className="px-5 py-3 rounded-xl bg-gray-200 font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={salvarBouquet}
                className="px-5 py-3 rounded-xl bg-green-600 text-white font-bold"
              >
                Salvar Bouquet
              </button>
            </div>

          </div>
        </div>
      )}

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

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-black text-red-600 mt-2">{value}</h2>
    </div>
  );
}
