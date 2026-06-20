"use client";

import { useEffect, useState } from "react";

export default function TopCanaisPage() {
  const [dados, setDados] = useState({ total: 0, canais: [] });

  async function carregar() {
    const resp = await fetch("/api/top-canais");
    const json = await resp.json();
    setDados(json);
  }

  async function autoWarm() {
    const resp = await fetch("http://187.77.61.76:8000/auto-warm");
    const json = await resp.json();
    alert(`Canais aquecidos: ${json.total}`);
    carregar();
  }

  useEffect(() => {
    carregar();
    const timer = setInterval(carregar, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Top Canais Assistidos</h1>
          <p className="text-gray-500 mt-2">
            Ranking em tempo real dos canais mais acessados.
          </p>
        </div>

        <button
          onClick={autoWarm}
          className="bg-red-600 text-white px-5 py-3 rounded-xl font-black"
        >
          Aquecer Top 20
        </button>
      </div>

      <div className="bg-white rounded-2xl border p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">#</th>
              <th>Canal</th>
              <th>Acessos</th>
              <th>Último acesso</th>
            </tr>
          </thead>

          <tbody>
            {dados.canais?.map((canal, index) => (
              <tr key={canal.id} className="border-b last:border-none">
                <td className="py-4 font-black text-red-600">{index + 1}</td>
                <td className="font-bold">{canal.nome}</td>
                <td>{canal.acessos}</td>
                <td>{canal.ultimoAcesso || "-"}</td>
              </tr>
            ))}

            {(!dados.canais || dados.canais.length === 0) && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  Nenhum acesso registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
