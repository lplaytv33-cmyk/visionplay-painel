"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    canais: 0,
    filmes: 0,
    series: 0,
    categorias: 0,
    bouquets: 0,
    total: 0,
  });

  useEffect(() => {
    async function carregar() {
      const resposta = await fetch("/api/dashboard");
      const dados = await resposta.json();

      setStats(dados);
    }

    carregar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-3xl font-black text-gray-800">
          VisionPlay Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Estatísticas reais do sistema.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card title="Canais" value={stats.canais} />
        <Card title="Filmes" value={stats.filmes} />
        <Card title="Séries" value={stats.series} />
        <Card title="Categorias" value={stats.categorias} />
        <Card title="Bouquets" value={stats.bouquets} />
        <Card title="Total Conteúdos" value={stats.total} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-black text-red-600 mt-2">
        {value}
      </h2>
    </div>
  );
}