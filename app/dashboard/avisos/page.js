"use client";

import { useEffect, useState } from "react";

export default function AvisosPage() {
  const [avisos, setAvisos] = useState([]);

  async function carregar() {
    const resp = await fetch("/api/avisos");
    const dados = await resp.json();
    setAvisos(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(e) {
    e.preventDefault();

    const form = e.target;

    await fetch("/api/avisos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: form.titulo.value,
        mensagem: form.mensagem.value,
      }),
    });

    form.reset();
    carregar();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">Avisos para Revendas</h1>
        <p className="text-gray-500 mt-2">
          Publique avisos visíveis para todos os revendedores.
        </p>
      </div>

      <form onSubmit={criar} className="bg-white rounded-2xl border p-8 space-y-4">
        <input
          name="titulo"
          placeholder="Título do aviso"
          required
          className="w-full border rounded-xl p-3"
        />

        <textarea
          name="mensagem"
          placeholder="Mensagem"
          required
          className="w-full border rounded-xl p-3 min-h-32"
        />

        <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-black">
          Publicar Aviso
        </button>
      </form>

      <div className="space-y-4">
        {avisos.map((aviso) => (
          <div key={aviso.id} className="bg-white rounded-2xl border p-6">
            <h2 className="text-xl font-black">{aviso.titulo}</h2>
            <p className="text-gray-600 mt-2">{aviso.mensagem}</p>
            <p className="text-xs text-gray-400 mt-4">
              {new Date(aviso.criadoEm).toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
