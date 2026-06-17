"use client";

import { useEffect, useState } from "react";

export default function FilmesPage() {
  const [filmes, setFilmes] = useState([]);
  const [modal, setModal] = useState(false);

  async function carregarFilmes() {
    const resposta = await fetch("/api/filmes");
    const dados = await resposta.json();
    setFilmes(dados);
  }

  useEffect(() => {
    carregarFilmes();
  }, []);

  async function criarFilme(e) {
    e.preventDefault();

    const form = e.target;

    await fetch("/api/filmes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome.value,
        categoria: form.categoria.value,
        url: form.url.value,
        capa: form.capa.value,
      }),
    });

    form.reset();
    setModal(false);
    carregarFilmes();
  }

  async function excluirFilme(id) {
    const confirmar = confirm("Deseja excluir este filme?");
    if (!confirmar) return;

    await fetch(`/api/filmes/${id}`, {
      method: "DELETE",
    });

    carregarFilmes();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Filmes</h1>
          <p className="text-gray-500 mt-2">
            Filmes salvos no banco de dados.
          </p>
        </div>

        <button
          onClick={() => setModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Novo Filme
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Filmes" value={filmes.length} />
        <Card title="Ativos" value={filmes.filter((f) => f.status === "Ativo").length} />
        <Card title="Inativos" value={filmes.filter((f) => f.status === "Inativo").length} />
        <Card title="Banco" value="Online" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Nome</th>
              <th>Categoria</th>
              <th>URL</th>
              <th>Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filmes.map((filme) => (
              <tr key={filme.id} className="border-b last:border-none">
                <td className="py-4 font-bold text-gray-800">{filme.nome}</td>
                <td>{filme.categoria}</td>
                <td className="max-w-xs truncate text-gray-500">{filme.url}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {filme.status}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => excluirFilme(filme.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {filmes.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Nenhum filme cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-6">
              Novo Filme
            </h2>

            <form onSubmit={criarFilme} className="space-y-4">
              <input name="nome" placeholder="Nome do filme" required className="input" />
              <input name="categoria" placeholder="Categoria" required className="input" />
              <input name="url" placeholder="URL do filme" required className="input" />
              <input name="capa" placeholder="URL da capa" className="input" />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 font-bold"
                >
                  Cancelar
                </button>

                <button className="px-5 py-3 rounded-xl bg-red-600 text-white font-bold">
                  Salvar Filme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
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
      <h2 className="text-3xl font-black text-red-600 mt-2">{value}</h2>
    </div>
  );
}