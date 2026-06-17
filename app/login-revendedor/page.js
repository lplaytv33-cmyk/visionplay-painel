"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginRevendedorPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setLoading(true);

    const resposta = await fetch("/api/revendedor/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, senha }),
    });

    const resultado = await resposta.json();
    setLoading(false);

    if (!resposta.ok) {
      alert(resultado.error || "Erro ao entrar.");
      return;
    }

    localStorage.setItem(
      "visionplay_revendedor",
      JSON.stringify(resultado.revendedor)
    );

    document.cookie =
      "visionplay_revendedor=logado; path=/; max-age=86400";

    router.push("/revendedor");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={entrar} className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-black text-red-600">VisionPlay</h1>
        <p className="text-gray-500 mt-2 mb-8">Login do Revendedor</p>

        <input
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border rounded-xl p-3 mb-5"
        />

        <button className="w-full bg-red-600 text-white py-3 rounded-xl font-black">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
