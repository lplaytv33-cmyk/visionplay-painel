"use client";

import { useEffect, useState } from "react";

export default function CanaisPage() {
  const [canais, setCanais] = useState([]);
  const [modal, setModal] = useState(false);

  async function carregarCanais() {
    const resposta = await fetch("/api/canais");
    const dados = await resposta.json();
    setCanais(dados);
  }

  useEffect(() => {
    carregarCanais();
  }, []);

  async function criarCanal(e) {
    e.preventDefault();

    const form = e.target;

    await fetch("/api/canais", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome.value,
        categoria: form.categoria.value,
        url: form.url.value,
        logo: form.logo.value,
      }),
    });

    form.reset();
    setModal(false);
    carregarCanais();
  }

  async function excluirCanal(id) {
    const confirmar = confirm("Deseja excluir este canal?");
    if (!confirmar) return;

    await fetch(`/api/canais/${id}`, {
      method: "DELETE",
    });

    carregarCanais();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Canais</h1>
          <p className="text-gray-500 mt-2">
            Canais salvos no banco de dados.
          </p>
        </div>

        <button
          onClick={() => setModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Novo Canal
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Canais" value={canais.length} />
        <Card title="Ativos" value={canais.filter((c) => c.status === "Ativo").length} />
        <Card title="Inativos" value={canais.filter((c) => c.status === "Inativo").length} />
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
            {canais.map((canal) => (
              <tr key={canal.id} className="border-b last:border-none">
                <td className="py-4 font-bold text-gray-800">{canal.nome}</td>
                <td>{canal.categoria}</td>
                <td className="max-w-xs truncate text-gray-500">{canal.url}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {canal.status}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => excluirCanal(canal.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {canais.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Nenhum canal cadastrado.
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
              Novo Canal
            </h2>

            <form onSubmit={criarCanal} className="space-y-4">
              <input name="nome" placeholder="Nome do canal" required className="input" />
              <input name="categoria" placeholder="Categoria" required className="input" />
              <input name="url" placeholder="URL do canal" required className="input" />
              <input name="logo" placeholder="URL da logo" className="input" />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 font-bold"
                >
                  Cancelar
                </button>

                <button className="px-5 py-3 rounded-xl bg-red-600 text-white font-bold">
                  Salvar Canal
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