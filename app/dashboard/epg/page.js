"use client";

import { useEffect, useState } from "react";

export default function EPGPage() {
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState(null);
  const [resposta, setResposta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [epgUrl, setEpgUrl] = useState("");

  async function carregarConfig() {
    const resp = await fetch("/api/configuracoes");
    const dados = await resp.json();
    setConfig(dados);
    setEpgUrl(dados.epgUrl || "");
  }

  async function carregarStatus() {
    const resp = await fetch("/api/epg/status");
    const dados = await resp.json();
    setStatus(dados);
  }

  useEffect(() => {
    carregarConfig();
    carregarStatus();
  }, []);

  async function salvarUrl() {
    if (!config) return;

    const resp = await fetch("/api/configuracoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...config,
        epgUrl,
      }),
    });

    if (!resp.ok) {
      alert("Erro ao salvar URL EPG.");
      return;
    }

    alert("URL EPG salva com sucesso.");
    carregarConfig();
  }

  async function atualizar() {
    setLoading(true);
    setResposta(null);

    const resp = await fetch("/api/epg/atualizar", {
      method: "POST",
    });

    const dados = await resp.json();

    setResposta(dados);
    await carregarStatus();
    setLoading(false);
  }

  const total = status?.canaisTotal || 0;
  const ok = status?.canaisComEpg || 0;
  const progresso = total ? Math.round((ok / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-black">EPG Profissional</h1>
        <p className="text-gray-500 mt-2">
          Cole a URL XMLTV, salve e atualize a programação dos canais.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-8 space-y-5">
        <div>
          <label className="font-bold text-gray-700">URL EPG XMLTV</label>
          <div className="flex gap-3 mt-2">
            <input
              value={epgUrl}
              onChange={(e) => setEpgUrl(e.target.value)}
              placeholder="https://exemplo.com/epg.xml ou .xml.gz"
              className="input"
            />

            <button
              onClick={salvarUrl}
              className="bg-gray-900 text-white px-5 py-3 rounded-xl font-black"
            >
              Salvar
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between font-bold mb-2">
            <span>Progresso de vínculo EPG</span>
            <span>{progresso}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-red-600 h-4 transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card title="Canais" value={status?.canaisTotal || 0} />
          <Card title="Com EPG" value={status?.canaisComEpg || 0} />
          <Card title="Sem EPG" value={status?.canaisSemEpg || 0} />
          <Card title="Programas" value={status?.programas || 0} />
        </div>

        <button
          onClick={atualizar}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-black"
        >
          {loading ? "Atualizando EPG..." : "Atualizar EPG Agora"}
        </button>

        {resposta && (
          <pre className="bg-gray-100 p-4 rounded-xl overflow-auto text-xs">
            {JSON.stringify(resposta, null, 2)}
          </pre>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
          outline: none;
        }

        .input:focus {
          border-color: #ef4444;
        }
      `}</style>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl border p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-black text-red-600">
        {Number(value || 0).toLocaleString()}
      </h2>
    </div>
  );
}
