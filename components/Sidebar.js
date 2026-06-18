"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const menu = [
  ["📊 Dashboard", [["Dashboard", "/dashboard"]]],
  [
    "📺 Conteúdo",
    [
      ["Canais", "/dashboard/canais"],
      ["Filmes", "/dashboard/filmes"],
      ["Séries", "/dashboard/series"],
      ["Categorias", "/dashboard/categorias"],
      ["Bouquets", "/dashboard/bouquets"],
      ["Importar M3U", "/dashboard/importar-m3u"],
      ["Exclusão em Massa", "/dashboard/exclusao-massa"],
      ["Exportar M3U", "/dashboard/exportar-m3u"],
      ["Atualizar TMDB", "/dashboard/tmdb"],
      ["Atualizar EPG", "/dashboard/epg"],
      ["Conexões Ativas", "/dashboard/conexoes-ativas"],
    ],
  ],
  [
    "👥 Clientes",
    [
      ["Clientes", "/dashboard/clientes"],
      ["Histórico Clientes", "/dashboard/historico-clientes"],
    ],
  ],
  [
    "💰 Revenda",
    [
      ["Revendedores", "/dashboard/revendedores"],
      ["Histórico Créditos", "/dashboard/historico-creditos"],
      ["Avisos", "/dashboard/avisos"],
    ],
  ],
  [
    "⚙ Sistema",
    [
      ["Configurações", "/dashboard/configuracoes"],
      ["Backup", "/dashboard/backup"],
    ],
  ],
];

export default function Sidebar() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    async function carregar() {
      const resposta = await fetch("/api/configuracoes");
      const dados = await resposta.json();
      setConfig(dados);
    }

    carregar();
  }, []);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6 border-b">
        {config?.logoPainel ? (
          <img
            src={config.logoPainel}
            alt={config.nomePainel}
            className="max-h-20 object-contain mb-3"
          />
        ) : (
          <h1 className="text-2xl font-black text-red-600">
            {config?.nomePainel || "VisionPlay"}
          </h1>
        )}

        <p className="text-sm text-gray-500">
          {config?.nomeDono || "Administrador"}
        </p>
      </div>

      <nav className="p-4 text-sm pb-10">
        {menu.map(([grupo, itens]) => (
          <div key={grupo}>
            <p className="text-xs font-black text-red-600 uppercase mt-6 mb-3">
              {grupo}
            </p>

            <div className="space-y-1">
              {itens.map(([nome, link]) => (
                <Link
                  key={link}
                  href={link}
                  className="block px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-red-50 hover:text-red-600"
                >
                  {nome}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
