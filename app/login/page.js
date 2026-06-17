"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [config, setConfig] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    async function carregar() {
      const resposta = await fetch("/api/configuracoes");
      const dados = await resposta.json();
      setConfig(dados);
    }

    carregar();
  }, []);

  async function entrar(e) {
    e.preventDefault();

    if (usuario === config.usuarioAdmin && senha === config.senhaAdmin) {
      document.cookie = "visionplay_admin=logado; path=/; max-age=86400";
      router.push("/dashboard");
      return;
    }

    alert("Usuário ou senha inválidos.");
  }

  if (!config) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={entrar}
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          {config.logoLogin ? (
            <img
              src={config.logoLogin}
              alt={config.nomePainel}
              className="max-h-24 mx-auto object-contain mb-4"
            />
          ) : (
            <h1 className="text-4xl font-black text-red-600">
              {config.nomePainel}
            </h1>
          )}

          <p className="text-gray-500 mt-2">Acesso do Administrador</p>
        </div>

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
          Entrar
        </button>
      </form>
    </div>
  );
}
