"use client";

import { useEffect, useState } from "react";

export default function BouquetsPage() {
  const [bouquets, setBouquets] = useState([]);

  async function carregarBouquets() {
    const resposta = await fetch("/api/bouquets");
    const dados = await resposta.json();
    setBouquets(dados);
  }

  useEffect(() => {
    carregarBouquets();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-800">Bouquets</h1>
        <p className="text-gray-500 mt-2">
          Bouquets criados automaticamente pela importação M3U.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Bouquets" value={bouquets.length} />
        <Card title="Canais" value={bouquets.filter((b) => b.tipo === "Canais").length} />
        <Card title="Filmes" value={bouquets.filter((b) => b.tipo === "Filmes").length} />
        <Card title="Séries" value={bouquets.filter((b) => b.tipo === "Séries").length} />
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
            {bouquets.map((bouquet) => (
              <tr key={bouquet.id} className="border-b last:border-none">
                <td className="py-4 font-bold text-gray-800">
                  {bouquet.nome}
                </td>
                <td>{bouquet.tipo}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {bouquet.status}
                  </span>
                </td>
                <td>{new Date(bouquet.criadoEm).toLocaleString("pt-BR")}</td>
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