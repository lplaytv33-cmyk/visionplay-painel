"use client";

import { useEffect, useState } from "react";

export default function StreamStatusPage() {
  const [dados, setDados] = useState({
    ativos: 0,
    totalClientes: 0,
    canais: [],
  });

  async function carregar() {
    const resposta = await fetch("/api/stream-status");
    const json = await resposta.json();
    setDados(json);
  }

  useEffect(() => {
    carregar();
    const timer = setInterval(carregar, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-2xl font-black text-gray-800">
          Monitor de Streams
        </h1>
        <p className="text-gray-500 mt-2">
          Canais ativos em tempo real no Stream Engine.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card title="Canais ativos" value={dados.ativos} />
        <Card title="Clientes conectados" value={dados.totalClientes} />
        <Card title="Engine" value={dados.erro ? "Offline" : "Online"} />
      </div>

      <div className="bg-white rounded-2xl border p-6 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">ID</th>
              <th>Canal</th>
              <th>Clientes</th>
              <th>Ativo há</th>
              <th>URL origem</th>
            </tr>
          </thead>

          <tbody>
            {dados.canais?.map((canal) => (
              <tr key={canal.id} className="border-b last:border-none">
                <td className="py-4 font-bold">{canal.id}</td>
                <td className="font-bold text-gray-800">{canal.nome}</td>
                <td>{canal.clientes}</td>
                <td>{canal.ativoHaSegundos}s</td>
                <td className="max-w-xs truncate text-gray-500">
                  {canal.url}
                </td>
              </tr>
            ))}

            {(!dados.canais || dados.canais.length === 0) && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Nenhum canal ativo agora.
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
    <div className="bg-white rounded-2xl border p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-black text-red-600 mt-2">{value}</h2>
    </div>
  );
}
