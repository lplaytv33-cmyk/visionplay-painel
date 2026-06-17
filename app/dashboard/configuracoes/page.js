"use client";

import { useEffect, useState } from "react";

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState(null);

  async function carregar() {
    const resposta = await fetch("/api/configuracoes");
    const dados = await resposta.json();
    setConfig(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();

    const form = e.target;

    const resposta = await fetch("/api/configuracoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomePainel: form.nomePainel.value,
        nomeDono: form.nomeDono.value,
        dnsPrincipal: form.dnsPrincipal.value,
        logoPainel: form.logoPainel.value,
        logoLogin: form.logoLogin.value,
        usuarioAdmin: form.usuarioAdmin.value,
        senhaAdmin: form.senhaAdmin.value,
        tmdbToken: form.tmdbToken.value,
        epgUrl: form.epgUrl.value,
      }),
    });

    if (!resposta.ok) {
      alert("Erro ao salvar configurações.");
      return;
    }

    alert("Configurações salvas com sucesso.");
    carregar();
  }

  if (!config) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-3xl font-black text-gray-800">
          Configurações do Painel
        </h1>
        <p className="text-gray-500 mt-2">
          Configure painel, DNS, login, TMDB e EPG.
        </p>
      </div>

      <form
        onSubmit={salvar}
        className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Campo label="Nome do Painel">
            <input name="nomePainel" defaultValue={config.nomePainel} className="input" />
          </Campo>

          <Campo label="Nome do Dono">
            <input name="nomeDono" defaultValue={config.nomeDono} className="input" />
          </Campo>

          <Campo label="DNS Principal">
            <input name="dnsPrincipal" defaultValue={config.dnsPrincipal} className="input" />
          </Campo>

          <Campo label="URL Logo do Painel">
            <input name="logoPainel" defaultValue={config.logoPainel || ""} className="input" />
          </Campo>

          <Campo label="URL Logo do Login">
            <input name="logoLogin" defaultValue={config.logoLogin || ""} className="input" />
          </Campo>

          <Campo label="Usuário Admin">
            <input name="usuarioAdmin" defaultValue={config.usuarioAdmin} className="input" />
          </Campo>

          <Campo label="Senha Admin">
            <input name="senhaAdmin" defaultValue={config.senhaAdmin} className="input" />
          </Campo>

          <Campo label="TMDB Token">
            <input
              name="tmdbToken"
              defaultValue={config.tmdbToken || ""}
              placeholder="Cole aqui o token ou API key do TMDB"
              className="input"
            />
          </Campo>

          <Campo label="URL EPG XMLTV">
            <input
              name="epgUrl"
              defaultValue={config.epgUrl || ""}
              placeholder="https://exemplo.com/epg.xml"
              className="input"
            />
          </Campo>
        </div>

        <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-black">
          Salvar Configurações
        </button>
      </form>

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

function Campo({ label, children }) {
  return (
    <label className="block">
      <p className="text-sm font-bold text-gray-600 mb-2">{label}</p>
      {children}
    </label>
  );
}
