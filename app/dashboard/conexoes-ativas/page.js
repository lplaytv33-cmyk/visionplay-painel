"use client";

import { useEffect, useState } from "react";

export default function ConexoesAtivasPage() {
  const [conexoes, setConexoes] = useState([]);

  async function carregar() {
    const resp = await fetch("/api/conexoes-ativas");
    const dados = await resp.json();
    setConexoes(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">Conexões Ativas</h1>
        <p className="text-gray-500 mt-2">
          Monitore clientes online no painel.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Cliente</th>
              <th>Usuário</th>
              <th>IP</th>
              <th>Canal</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {conexoes.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-4 font-bold">{c.cliente}</td>
                <td>{c.usuario}</td>
                <td>{c.ip}</td>
                <td>{c.canal}</td>
                <td>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
