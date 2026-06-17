"use client";

import { useEffect, useState } from "react";

export default function PerfilRevendedorPage() {
  const [perfil, setPerfil] = useState(null);

  async function carregar() {
    const login = JSON.parse(
      localStorage.getItem("visionplay_revendedor")
    );

    const resposta = await fetch("/api/revendedor/perfil", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: login.id,
      }),
    });

    const dados = await resposta.json();
    setPerfil(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();

    const form = e.target;

    await fetch("/api/revendedor/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: perfil.id,
        whatsapp: form.whatsapp.value,
        senha: form.senha.value,
      }),
    });

    alert("Perfil atualizado com sucesso.");
    carregar();
  }

  if (!perfil) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">
          Meu Perfil
        </h1>

        <p className="text-gray-500 mt-2">
          Dados da sua revenda.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Créditos" value={perfil.creditos} />
        <Card title="Status" value={perfil.status} />
        <Card title="Nível" value={perfil.nivel || "Revendedor"} />
        <Card
          title="Cadastro"
          value={new Date(perfil.criadoEm).toLocaleDateString("pt-BR")}
        />
      </div>

      <div className="bg-white rounded-2xl border p-8">
        <form onSubmit={salvar} className="space-y-4">
          <input
            value={perfil.nome}
            disabled
            className="input"
          />

          <input
            value={perfil.usuario}
            disabled
            className="input"
          />

          <input
            name="whatsapp"
            defaultValue={perfil.whatsapp || ""}
            placeholder="WhatsApp"
            className="input"
          />

          <input
            name="senha"
            defaultValue={perfil.senha}
            placeholder="Nova senha"
            className="input"
          />

          <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-black">
            Salvar Alterações
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
        }
      `}</style>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-black text-red-600 mt-2">
        {value}
      </h2>
    </div>
  );
}