"use client";

import { useEffect, useState } from "react";

export default function HistoricoCreditosPage() {
  const [historico, setHistorico] = useState([]);

  async function carregar() {
    const resposta = await fetch("/api/historico-creditos");
    const dados = await resposta.json();
    setHistorico(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  const adicionados = historico
    .filter((h) => h.tipo === "ADICIONADO")
    .reduce((s, h) => s + h.quantidade, 0);

  const removidos = historico
    .filter((h) => h.tipo === "REMOVIDO")
    .reduce((s, h) => s + h.quantidade, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 font-bold">
          Financeiro · Créditos
        </p>

        <h1 className="text-3xl font-black text-gray-800">
          Histórico de Créditos
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Movimentações" value={historico.length} />
        <Card title="Créditos Adicionados" value={adicionados} />
        <Card title="Créditos Removidos" value={removidos} />
        <Card title="Saldo Movimentado" value={adicionados - removidos} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Revendedor</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Observação</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            {historico.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4 font-bold">
                  {item.revendedor}
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.tipo === "ADICIONADO"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.tipo}
                  </span>
                </td>

                <td className="font-black">
                  {item.quantidade}
                </td>

                <td>
                  {item.observacao}
                </td>

                <td>
                  {new Date(item.criadoEm).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}

            {historico.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  Nenhuma movimentação encontrada.
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
      <p className="text-xs uppercase font-black text-gray-400">
        {title}
      </p>

      <h2 className="text-3xl font-black text-red-600 mt-2">
        {value}
      </h2>
    </div>
  );
}
