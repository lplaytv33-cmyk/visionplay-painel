"use client";

import { useEffect, useState } from "react";

export default function FilmesPage() {
  const [filmes, setFilmes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [busca, setBusca] = useState("");

  async function carregarFilmes(page = pagina) {
    const res = await fetch(
      `/api/filmes?page=${page}&limit=50&busca=${encodeURIComponent(busca)}`
    );

    const dados = await res.json();

    setFilmes(dados.items || []);
    setTotalPages(dados.totalPages || 1);
    setTotal(dados.total || 0);
  }

  useEffect(() => {
    carregarFilmes(1);
  }, []);

  async function pesquisar() {
    setPagina(1);
    await carregarFilmes(1);
  }

  async function excluirFilme(id) {
    if (!confirm("Deseja excluir este filme?")) return;

    await fetch(`/api/filmes/${id}`, {
      method: "DELETE",
    });

    carregarFilmes(pagina);
  }

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl border p-6">
        <h1 className="text-2xl font-black">
          Filmes
        </h1>

        <p className="text-gray-500 mt-2">
          Total: {total.toLocaleString()}
        </p>

        <div className="flex gap-3 mt-4">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar filme..."
            className="border rounded-xl px-4 py-2 flex-1"
          />

          <button
            onClick={pesquisar}
            className="bg-red-600 text-white px-5 rounded-xl"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 overflow-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Nome</th>
              <th className="text-left">Categoria</th>
              <th className="text-left">Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filmes.map((filme) => (
              <tr key={filme.id} className="border-b">

                <td className="py-3 font-bold">
                  {filme.nome}
                </td>

                <td>
                  {filme.categoria}
                </td>

                <td>
                  {filme.status}
                </td>

                <td className="text-right">
                  <button
                    onClick={() => excluirFilme(filme.id)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-lg"
                  >
                    Excluir
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="flex justify-between items-center">

        <button
          disabled={pagina <= 1}
          onClick={() => {
            const p = pagina - 1;
            setPagina(p);
            carregarFilmes(p);
          }}
          className="bg-gray-200 px-4 py-2 rounded-xl"
        >
          Anterior
        </button>

        <span>
          Página {pagina} de {totalPages}
        </span>

        <button
          disabled={pagina >= totalPages}
          onClick={() => {
            const p = pagina + 1;
            setPagina(p);
            carregarFilmes(p);
          }}
          className="bg-gray-200 px-4 py-2 rounded-xl"
        >
          Próxima
        </button>

      </div>

    </div>
  );
}
