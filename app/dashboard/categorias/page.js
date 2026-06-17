"use client";

import { useEffect, useState } from "react";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);

  async function carregarCategorias() {
    const resposta = await fetch("/api/categorias");
    const dados = await resposta.json();
    setCategorias(dados);
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-800">Categorias</h1>
        <p className="text-gray-500 mt-2">
          Categorias criadas automaticamente pela importação M3U.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Categorias" value={categorias.length} />
        <Card title="Canais" value={categorias.filter(c => c.tipo === "Canais").length} />
        <Card title="Filmes" value={categorias.filter(c => c.tipo === "Filmes").length} />
        <Card title="Séries" value={categorias.filter(c => c.tipo === "Séries").length} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Nome</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Criado em</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="border-b last:border-none">
                <td className="py-4 font-bold text-gray-800">
                  {categoria.nome}
                </td>
                <td>{categoria.tipo}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {categoria.status}
                  </span>
                </td>
                <td>{new Date(categoria.criadoEm).toLocaleString("pt-BR")}</td>
              </tr>
            ))}

            {categorias.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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