"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RevendedorHeader() {
  const router = useRouter();
  const [revendedor, setRevendedor] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("visionplay_revendedor");

    if (dados) {
      setRevendedor(JSON.parse(dados));
    }
  }, []);

  function sair() {
    localStorage.removeItem("visionplay_revendedor");
    router.push("/login-revendedor");
  }

  if (!revendedor) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-black text-gray-800">
          Área do Revendedor
        </h2>

        <p className="text-sm text-gray-500">
          Bem-vindo, {revendedor.nome}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-xl">
          <p className="text-xs text-gray-500">Créditos</p>
          <p className="font-black text-red-600">
            {revendedor.creditos}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-100 px-4 py-2 rounded-xl">
          <p className="text-xs text-gray-500">Nível</p>
          <p className="font-black text-purple-600">
            Revendedor
          </p>
        </div>

        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">
          {revendedor.nome?.charAt(0)?.toUpperCase()}
        </div>

        <button
          onClick={sair}
          className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
        >
          Sair
        </button>
      </div>
    </header>
  );
}