"use client";

import { useEffect, useState } from "react";

export default function SeriesPage() {
  const [series, setSeries] = useState([]);
  const [modal, setModal] = useState(false);

  async function carregarSeries() {
    const resposta = await fetch("/api/series");
    const dados = await resposta.json();
    setSeries(dados);
  }

  useEffect(() => {
    carregarSeries();
  }, []);

  async function criarSerie(e) {
    e.preventDefault();

    const form = e.target;

    await fetch("/api/series", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome.value,
        temporada: form.temporada.value,
        episodio: form.episodio.value,
        categoria: form.categoria.value,
        url: form.url.value,
        capa: form.capa.value,
      }),
    });

    form.reset();
    setModal(false);
    carregarSeries();
  }

  async function excluirSerie(id) {
    const confirmar = confirm("Deseja excluir esta série/episódio?");
    if (!confirmar) return;

    await fetch(`/api/series/${id}`, {
      method: "DELETE",
    });

    carregarSeries();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Séries</h1>
          <p className="text-gray-500 mt-2">
            Séries e episódios salvos no banco de dados.
          </p>
        </div>

        <button
          onClick={() => setModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Nova Série
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Séries/Episódios" value={series.length} />
        <Card title="Ativos" value={series.filter((s) => s.status === "Ativo").length} />
        <Card title="Inativos" value={series.filter((s) => s.status === "Inativo").length} />
        <Card title="Banco" value="Online" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Nome</th>
              <th>Temporada</th>
              <th>Episódio</th>
              <th>Categoria</th>
              <th>URL</th>
              <th>Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {series.map((serie) => (
              <tr key={serie.id} className="border-b last:border-none">
                <td className="py-4 font-bold text-gray-800">{serie.nome}</td>
                <td>{serie.temporada}</td>
                <td>{serie.episodio}</td>
                <td>{serie.categoria}</td>
                <td className="max-w-xs truncate text-gray-500">{serie.url}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {serie.status}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => excluirSerie(serie.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {series.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  Nenhuma série cadastrada.
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
              Nova Série/Episódio
            </h2>

            <form onSubmit={criarSerie} className="space-y-4">
              <input name="nome" placeholder="Nome da série" required className="input" />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="temporada"
                  type="number"
                  defaultValue="1"
                  min="1"
                  placeholder="Temporada"
                  required
                  className="input"
                />

                <input
                  name="episodio"
                  type="number"
                  defaultValue="1"
                  min="1"
                  placeholder="Episódio"
                  required
                  className="input"
                />
              </div>

              <input name="categoria" placeholder="Categoria" required className="input" />
              <input name="url" placeholder="URL do episódio" required className="input" />
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
                  Salvar Série
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