"use client";

import { useEffect, useState } from "react";

export default function ClientesRevendedorPage() {
  const [clientes, setClientes] = useState([]);

  async function carregar() {
    const dadosLogin = JSON.parse(
      localStorage.getItem("visionplay_revendedor")
    );

    const resposta = await fetch("/api/revendedor/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        revendedorId: dadosLogin.id,
      }),
    });

    const dados = await resposta.json();
    setClientes(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">
          Meus Clientes
        </h1>

        <p className="text-gray-500 mt-2">
          Clientes vinculados ao seu usuário.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Nome</th>
              <th>Usuário</th>
              <th>Plano</th>
              <th>Vencimento</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b">
                <td className="py-4">{cliente.nome}</td>
                <td>{cliente.usuario}</td>
                <td>{cliente.plano}</td>
                <td>{cliente.vencimento}</td>
                <td>{cliente.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}