"use client";

import { useEffect, useState } from "react";

export default function HistoricoClientesRevendaPage() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function carregar() {
      const revendedor = JSON.parse(
        localStorage.getItem("visionplay_revendedor")
      );

      const resposta = await fetch(
        "/api/revendedor/historico-clientes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            revendedorId: revendedor.id,
          }),
        }
      );

      const dados = await resposta.json();

      setHistorico(dados);
    }

    carregar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">
          Histórico dos Clientes
        </h1>

        <p className="text-gray-500 mt-2">
          Movimentações dos seus clientes.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
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
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                    {item.acao}
                  </span>
                </td>

                <td>{item.detalhes}</td>

                <td>
                  {new Date(item.criadoEm).toLocaleString(
                    "pt-BR"
                  )}
                </td>
              </tr>
            ))}

            {historico.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-gray-500"
                >
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