"use client";

import { useEffect, useState } from "react";

const TIPOS = ["Canais", "Filmes", "Séries"];

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [tipo, setTipo] = useState("Canais");
  const [loading, setLoading] = useState(false);

  async function carregarCategorias(t = tipo) {
    setLoading(true);

    const resposta = await fetch(`/api/categorias?tipo=${encodeURIComponent(t)}`);
    const dados = await resposta.json();

    setCategorias(dados);
    setLoading(false);
  }

  useEffect(() => {
    carregarCategorias("Canais");
  }, []);

  async function trocarTipo(novoTipo) {
    setTipo(novoTipo);
    await carregarCategorias(novoTipo);
  }

  async function renomear(categoria) {
    const novoNome = prompt("Novo nome da categoria:", categoria.nome);

    if (!novoNome || novoNome === categoria.nome) return;

    const resposta = await fetch("/api/categorias", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: categoria.id,
        nome: novoNome,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.error || "Erro ao renomear.");
      return;
    }

    carregarCategorias(tipo);
  }

  async function excluir(categoria) {
    if (!confirm(`Excluir categoria "${categoria.nome}"?`)) return;

    const resposta = await fetch(`/api/categorias?id=${categoria.id}`, {
      method: "DELETE",
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.error || "Erro ao excluir.");
      return;
    }

    carregarCategorias(tipo);
  }

  const totalItens = categorias.reduce(
    (acc, c) => acc + Number(c.totalItens || 0),
    0
  );

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-800">
          Categorias
        </h1>

        <p className="text-gray-500 mt-2">
          Organize categorias separadas por canais, filmes e séries.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {TIPOS.map((t) => (
          <button
            key={t}
            onClick={() => trocarTipo(t)}
            className={`rounded-2xl border p-6 text-left ${
              tipo === t
                ? "bg-red-600 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            <p className="text-sm opacity-80">Tipo</p>
            <h2 className="text-2xl font-black">{t}</h2>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card title="Tipo selecionado" value={tipo} />
        <Card title="Categorias" value={categorias.length} />
        <Card title="Itens vinculados" value={totalItens.toLocaleString()} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3">Nome da Pasta</th>
                <th>Tipo</th>
                <th>Itens</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b last:border-none">
                  <td className="py-4 font-bold text-gray-800">
                    {categoria.nome}
                  </td>

                  <td>{categoria.tipo}</td>

                  <td className="font-bold">
                    {categoria.totalItens || 0}
                  </td>

                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {categoria.status}
                    </span>
                  </td>

                  <td className="text-right space-x-2">
                    <button
                      onClick={() => renomear(categoria)}
                      className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold"
                    >
                      Renomear
                    </button>

                    <button
                      onClick={() => excluir(categoria)}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-600 font-bold"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {categorias.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

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
