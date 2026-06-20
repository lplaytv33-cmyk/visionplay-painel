"use client";

import { useEffect, useState } from "react";

export default function ConexoesAtivasPage() {
  const [dados, setDados] = useState({
    ativos: 0,
    totalClientes: 0,
    conexoes: [],
  });

  async function carregar() {
    const resp = await fetch("/api/conexoes-ativas");
    const json = await resp.json();
    setDados(json);
  }

  useEffect(() => {
    carregar();
    const timer = setInterval(carregar, 5000);
    return () => clearInterval(timer);
  }, []);

  function tempo(segundos) {
    const s = Number(segundos || 0);
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}m ${sec}s`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">Conexões Ativas</h1>
        <p className="text-gray-500 mt-2">
          Monitore clientes online em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card title="Clientes online" value={dados.totalClientes} />
        <Card title="Canais em cache" value={dados.ativos} />
        <Card title="Engine" value={dados.erro ? "Offline" : "Online"} />
      </div>

      <div className="bg-white rounded-2xl border p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Cliente</th>
              <th>Usuário</th>
              <th>Canal</th>
              <th>IP</th>
              <th>Player</th>
              <th>Tempo</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {dados.conexoes?.map((c) => (
              <tr key={c.id} className="border-b last:border-none">
                <td className="py-4 font-bold">{c.cliente}</td>
                <td>{c.usuario}</td>
                <td className="font-semibold">{c.canal}</td>
                <td>{c.ip}</td>
                <td className="max-w-xs truncate text-gray-500">{c.userAgent}</td>
                <td>{tempo(c.tempo)}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}

            {(!dados.conexoes || dados.conexoes.length === 0) && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  Nenhum cliente assistindo agora.
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
