"use client";

import { useEffect, useState } from "react";

export default function HistoricoClientesPage() {
  const [historico, setHistorico] = useState([]);

  async function carregar() {
    const resposta = await fetch("/api/historico-clientes");
    const dados = await resposta.json();
    setHistorico(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-800">
          Histórico de Clientes
        </h1>

        <p className="text-gray-500 mt-2">
          Renovações, bloqueios, ativações e alterações.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Registros" value={historico.length} />
        <Card title="Hoje" value={historico.filter(h => {
          const hoje = new Date().toDateString();
          return new Date(h.criadoEm).toDateString() === hoje;
        }).length} />
        <Card title="Renovações" value={historico.filter(h => h.acao === "RENOVACAO").length} />
        <Card title="Bloqueios" value={historico.filter(h => h.acao === "BLOQUEIO").length} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Cliente</th>
              <th>Ação</th>
              <th>Detalhes</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            {historico.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4 font-bold">
                  {item.cliente}
                </td>

                <td>
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                    {item.acao}
                  </span>
                </td>

                <td>{item.detalhes}</td>

                <td>
                  {new Date(item.criadoEm).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}

            {historico.length === 0 && (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-500">
                  Nenhum histórico encontrado.
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
