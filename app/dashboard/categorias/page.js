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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: categoria.id, acao: "renomear", nome: novoNome }),
    });

    const dados = await resposta.json();
    if (!resposta.ok) return alert(dados.error || "Erro ao renomear.");

    carregarCategorias(tipo);
  }

  async function ocultar(categoria) {
    await fetch("/api/categorias", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: categoria.id, acao: "status" }),
    });

    carregarCategorias(tipo);
  }

  async function mover(categoria, direcao) {
    await fetch("/api/categorias", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: categoria.id, acao: "mover", direcao }),
    });

    carregarCategorias(tipo);
  }

  async function excluirCategoria(categoria, apagarConteudo = false) {
    const texto = apagarConteudo
      ? `Excluir a categoria "${categoria.nome}" e TODOS os ${categoria.totalItens} itens dela?`
      : `Excluir somente a categoria "${categoria.nome}"?`;

    if (!confirm(texto)) return;

    const resposta = await fetch(
      `/api/categorias?id=${categoria.id}&apagarConteudo=${apagarConteudo ? "1" : "0"}`,
      { method: "DELETE" }
    );

    const dados = await resposta.json();
    if (!resposta.ok) return alert(dados.error || "Erro ao excluir.");

    carregarCategorias(tipo);
  }

  async function excluirTudoTipo() {
    if (!confirm(`ATENÇÃO: excluir TODOS os conteúdos e categorias do tipo ${tipo}?`)) return;
    if (!confirm("Confirme novamente. Essa ação não tem volta.")) return;

    const resposta = await fetch(`/api/categorias?modo=tipo&tipo=${encodeURIComponent(tipo)}`, {
      method: "DELETE",
    });

    const dados = await resposta.json();
    if (!resposta.ok) return alert(dados.error || "Erro ao excluir tudo.");

    alert(`Removidos: ${dados.removidos}`);
    carregarCategorias(tipo);
  }

  const totalItens = categorias.reduce((acc, c) => acc + Number(c.totalItens || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Categorias e Pastas</h1>
          <p className="text-gray-500 mt-2">
            Organize as pastas que aparecem nos aplicativos reprodutores.
          </p>
        </div>

        <button
          onClick={excluirTudoTipo}
          className="bg-red-700 text-white px-5 py-3 rounded-xl font-bold"
        >
          Excluir tudo de {tipo}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {TIPOS.map((t) => (
          <button
            key={t}
            onClick={() => trocarTipo(t)}
            className={`rounded-2xl border p-6 text-left ${
              tipo === t ? "bg-red-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            <p className="text-sm opacity-80">Tipo</p>
            <h2 className="text-2xl font-black">{t}</h2>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card title="Tipo" value={tipo} />
        <Card title="Pastas" value={categorias.length} />
        <Card title="Itens" value={totalItens.toLocaleString()} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 overflow-auto">
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3">Ordem</th>
                <th>Pasta</th>
                <th>Tipo</th>
                <th>Itens</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((categoria, index) => (
                <tr key={categoria.id} className="border-b last:border-none">
                  <td className="py-4 font-bold">{index + 1}</td>
                  <td className="font-bold text-gray-800">{categoria.nome}</td>
                  <td>{categoria.tipo}</td>
                  <td className="font-bold">{categoria.totalItens || 0}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      categoria.status === "Ativa"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {categoria.status}
                    </span>
                  </td>

                  <td className="text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => mover(categoria, "subir")} className="btn">
                      ↑
                    </button>
                    <button onClick={() => mover(categoria, "descer")} className="btn">
                      ↓
                    </button>
                    <button onClick={() => renomear(categoria)} className="btn-blue">
                      Renomear
                    </button>
                    <button onClick={() => ocultar(categoria)} className="btn-yellow">
                      {categoria.status === "Ativa" ? "Ocultar" : "Ativar"}
                    </button>
                    <button onClick={() => excluirCategoria(categoria, false)} className="btn-red">
                      Excluir
                    </button>
                    <button onClick={() => excluirCategoria(categoria, true)} className="btn-dark">
                      Excluir c/ conteúdo
                    </button>
                  </td>
                </tr>
              ))}

              {categorias.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .btn {
          background: #f3f4f6;
          padding: 8px 10px;
          border-radius: 10px;
          font-weight: 800;
        }
        .btn-blue {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 8px 10px;
          border-radius: 10px;
          font-weight: 800;
        }
        .btn-yellow {
          background: #fef3c7;
          color: #92400e;
          padding: 8px 10px;
          border-radius: 10px;
          font-weight: 800;
        }
        .btn-red {
          background: #fee2e2;
          color: #dc2626;
          padding: 8px 10px;
          border-radius: 10px;
          font-weight: 800;
        }
        .btn-dark {
          background: #111827;
          color: white;
          padding: 8px 10px;
          border-radius: 10px;
          font-weight: 800;
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
