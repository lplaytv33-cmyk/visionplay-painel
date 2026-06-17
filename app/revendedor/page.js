"use client";

import { useEffect, useState } from "react";

export default function RevendedorDashboardPage() {
  const [revendedor, setRevendedor] = useState(null);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function carregar() {
      const dadosLogin = JSON.parse(
        localStorage.getItem("visionplay_revendedor")
      );

      if (!dadosLogin) return;

      setRevendedor(dadosLogin);

      const resposta = await fetch("/api/revendedor/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          revendedorId: dadosLogin.id,
        }),
      });

      const dadosClientes = await resposta.json();
      setClientes(dadosClientes);
    }

    carregar();
  }, []);

  if (!revendedor) {
    return null;
  }

  const ativos = clientes.filter(
    (c) => c.status === "Ativo"
  ).length;

  const bloqueados = clientes.filter(
    (c) => c.status === "Bloqueado"
  ).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-3xl font-black text-gray-800">
          Bem-vindo, {revendedor.nome}
        </h1>

        <p className="text-gray-500 mt-2">
          Painel exclusivo do revendedor.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card
          title="Créditos Disponíveis"
          value={revendedor.creditos}
        />

        <Card
          title="Clientes"
          value={clientes.length}
        />

        <Card
          title="Ativos"
          value={ativos}
        />

        <Card
          title="Bloqueados"
          value={bloqueados}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xl font-black mb-4">
          Últimos Clientes
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Nome</th>
              <th>Usuário</th>
              <th>Plano</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {clientes.slice(0, 5).map((cliente) => (
              <tr key={cliente.id} className="border-b">
                <td className="py-4">{cliente.nome}</td>
                <td>{cliente.usuario}</td>
                <td>{cliente.plano}</td>
                <td>{cliente.status}</td>
              </tr>
            ))}

            {clientes.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-gray-500"
                >
                  Nenhum cliente encontrado.
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

      <h2 className="text-3xl font-black text-red-600 mt-2">
        {value}
      </h2>
    </div>
  );
}