"use client";

import { useEffect, useState } from "react";

const DNS =
  process.env.NEXT_PUBLIC_PANEL_URL ||
  "localhost:3000";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [playlist, setPlaylist] = useState(null);

  async function carregarClientes() {
    const resposta = await fetch("/api/clientes");
    const dados = await resposta.json();
    setClientes(dados);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function registrarHistorico(cliente, acao, detalhes) {
    await fetch("/api/historico-clientes/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente,
        acao,
        detalhes,
      }),
    });
  }

  async function criarCliente(e) {
    e.preventDefault();
    const form = e.target;

    await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome.value,
        usuario: form.usuario.value,
        senha: form.senha.value,
        whatsapp: form.whatsapp.value,
        plano: form.plano.value,
        conexoes: form.conexoes.value,
        vencimento: form.vencimento.value,
      }),
    });

    await registrarHistorico(
      form.nome.value,
      "CRIACAO",
      "Cliente criado no sistema"
    );

    form.reset();
    setModal(false);
    carregarClientes();
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    const form = e.target;

    await fetch(`/api/clientes/${editando.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome.value,
        usuario: form.usuario.value,
        senha: form.senha.value,
        whatsapp: form.whatsapp.value,
        plano: form.plano.value,
        conexoes: form.conexoes.value,
        vencimento: form.vencimento.value,
        status: form.status.value,
      }),
    });

    await registrarHistorico(
      form.nome.value,
      "EDICAO",
      "Cliente editado"
    );

    setEditando(null);
    carregarClientes();
  }

  async function renovarCliente(cliente) {
    const dias = prompt("Renovar por quantos dias?", "30");
    if (!dias) return;

    const hoje = new Date();
    const novaData = new Date(hoje.setDate(hoje.getDate() + Number(dias)));
    const vencimento = novaData.toISOString().split("T")[0];

    await fetch(`/api/clientes/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cliente,
        vencimento,
        status: "Ativo",
      }),
    });

    await registrarHistorico(
      cliente.nome,
      "RENOVACAO",
      `Cliente renovado por ${dias} dias`
    );

    carregarClientes();
  }

  async function alternarBloqueio(cliente) {
    const novoStatus = cliente.status === "Bloqueado" ? "Ativo" : "Bloqueado";

    await fetch(`/api/clientes/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cliente,
        status: novoStatus,
      }),
    });

    await registrarHistorico(
      cliente.nome,
      novoStatus === "Bloqueado" ? "BLOQUEIO" : "ATIVACAO",
      novoStatus === "Bloqueado" ? "Cliente bloqueado" : "Cliente ativado"
    );

    carregarClientes();
  }

  async function excluirCliente(cliente) {
    if (!confirm("Deseja excluir este cliente?")) return;

    await fetch(`/api/clientes/${cliente.id}`, {
      method: "DELETE",
    });

    await registrarHistorico(
      cliente.nome,
      "EXCLUSAO",
      "Cliente excluído do sistema"
    );

    carregarClientes();
  }

  function abrirWhatsapp(cliente) {
    if (!cliente.whatsapp) {
      alert("Cliente sem WhatsApp cadastrado.");
      return;
    }

    const numero = cliente.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
  }

  function copiar(texto) {
    const area = document.createElement("textarea");
    area.value = texto;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    area.style.top = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();

    try {
      document.execCommand("copy");
      alert("Link copiado com sucesso!");
    } catch (err) {
      alert("Não foi possível copiar. Selecione e copie manualmente.");
    }

    document.body.removeChild(area);
  }

  function gerarLinks(cliente) {
    const base = DNS.startsWith("http")
      ? DNS
      : `https://${DNS}`;

    return {
      m3uTs: `${base}/get.php?username=${cliente.usuario}&password=${cliente.senha}&type=m3u_plus&output=ts`,
      m3uHls: `${base}/get.php?username=${cliente.usuario}&password=${cliente.senha}&type=m3u_plus&output=m3u8`,
      m3uTsCurto: `${base}/m3u-ts/${cliente.usuario}/${cliente.senha}`,
      m3uHlsCurto: `${base}/m3u-m3u8/${cliente.usuario}/${cliente.senha}`,
      ssiptv: `${base}/ss-ts/${cliente.usuario}/${cliente.senha}`,
    };
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Clientes</h1>
          <p className="text-gray-500 mt-2">
            Clientes com playlist, renovação, edição, WhatsApp, bloqueio e histórico.
          </p>
        </div>

        <button
          onClick={() => setModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Clientes" value={clientes.length} />
        <Card title="Ativos" value={clientes.filter((c) => c.status === "Ativo").length} />
        <Card title="Bloqueados" value={clientes.filter((c) => c.status === "Bloqueado").length} />
        <Card title="DNS" value="Online" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-3">Nome</th>
              <th>Usuário</th>
              <th>WhatsApp</th>
              <th>Plano</th>
              <th>Conexões</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b last:border-none">
                <td className="py-4 font-bold text-gray-800">{cliente.nome}</td>
                <td>{cliente.usuario}</td>
                <td>{cliente.whatsapp || "-"}</td>
                <td>{cliente.plano}</td>
                <td>{cliente.conexoes}</td>
                <td>{cliente.vencimento}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cliente.status === "Bloqueado"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {cliente.status}
                  </span>
                </td>

                <td className="text-right">
                  <div className="flex justify-end gap-2 flex-wrap">
                    <button onClick={() => setEditando(cliente)} className="btn">
                      Editar
                    </button>

                    <button onClick={() => renovarCliente(cliente)} className="btn">
                      Renovar
                    </button>

                    <button onClick={() => setPlaylist(cliente)} className="btn-yellow">
                      Playlist
                    </button>

                    <button onClick={() => abrirWhatsapp(cliente)} className="btn-green">
                      WhatsApp
                    </button>

                    <button onClick={() => alternarBloqueio(cliente)} className="btn-red">
                      {cliente.status === "Bloqueado" ? "Ativar" : "Bloquear"}
                    </button>

                    <button onClick={() => excluirCliente(cliente)} className="btn-red">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {clientes.length === 0 && (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ClienteForm
          titulo="Novo Cliente"
          onSubmit={criarCliente}
          fechar={() => setModal(false)}
        />
      )}

      {editando && (
        <ClienteForm
          titulo="Editar Cliente"
          cliente={editando}
          onSubmit={salvarEdicao}
          fechar={() => setEditando(null)}
          editar
        />
      )}

      {playlist && (
        <PlaylistModal
          cliente={playlist}
          links={gerarLinks(playlist)}
          copiar={copiar}
          fechar={() => setPlaylist(null)}
        />
      )}

      <style jsx>{`
        .btn {
          padding: 8px 10px;
          border-radius: 10px;
          background: #f3f4f6;
          font-weight: 700;
        }

        .btn-yellow {
          padding: 8px 10px;
          border-radius: 10px;
          background: #fef3c7;
          color: #a16207;
          font-weight: 700;
        }

        .btn-green {
          padding: 8px 10px;
          border-radius: 10px;
          background: #dcfce7;
          color: #15803d;
          font-weight: 700;
        }

        .btn-red {
          padding: 8px 10px;
          border-radius: 10px;
          background: #fee2e2;
          color: #dc2626;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function ClienteForm({ titulo, cliente, onSubmit, fechar, editar }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8">
        <h2 className="text-2xl font-black text-gray-800 mb-6">{titulo}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input name="nome" defaultValue={cliente?.nome || ""} placeholder="Nome" required className="input" />
          <input name="usuario" defaultValue={cliente?.usuario || ""} placeholder="Usuário" required className="input" />
          <input name="senha" defaultValue={cliente?.senha || ""} type="text" placeholder="Senha" required className="input" />
          <input name="whatsapp" defaultValue={cliente?.whatsapp || ""} placeholder="WhatsApp" className="input" />

          <select name="plano" defaultValue={cliente?.plano || "Mensal"} className="input">
            <option>Mensal</option>
            <option>Trimestral</option>
            <option>Semestral</option>
            <option>Anual</option>
            <option>Teste</option>
          </select>

          <input
            name="conexoes"
            type="number"
            defaultValue={cliente?.conexoes || 1}
            min="1"
            className="input"
          />

          <input
            name="vencimento"
            type="date"
            defaultValue={cliente?.vencimento || ""}
            required
            className="input"
          />

          {editar && (
            <select name="status" defaultValue={cliente?.status || "Ativo"} className="input">
              <option>Ativo</option>
              <option>Bloqueado</option>
              <option>Vencido</option>
            </select>
          )}

          {!editar && <input type="hidden" name="status" value="Ativo" />}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={fechar} className="px-5 py-3 rounded-xl bg-gray-100 font-bold">
              Cancelar
            </button>

            <button className="px-5 py-3 rounded-xl bg-red-600 text-white font-bold">
              Salvar
            </button>
          </div>
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
    </div>
  );
}

function PlaylistModal({ cliente, links, copiar, fechar }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">
            Playlist de {cliente.usuario}
          </h2>

          <button onClick={fechar} className="text-gray-500 font-black text-xl">
            ×
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-black text-red-600">{cliente.nome}</h3>
          <p className="text-gray-500">ID {cliente.id} · {cliente.usuario}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Info label="Usuário" value={cliente.usuario} />
          <Info label="Senha" value={cliente.senha} />
          <Info label="Vencimento" value={cliente.vencimento} />
          <Info label="DNS" value={DNS} />
        </div>

        <div className="space-y-3">
          <LinkBox titulo="M3U TS" link={links.m3uTs} copiar={copiar} />
          <LinkBox titulo="M3U HLS" link={links.m3uHls} copiar={copiar} />
          <LinkBox titulo="M3U TS Encurtado" link={links.m3uTsCurto} copiar={copiar} />
          <LinkBox titulo="M3U HLS Encurtado" link={links.m3uHlsCurto} copiar={copiar} />
          <LinkBox titulo="SSIPTV" link={links.ssiptv} copiar={copiar} />
        </div>

        <div className="flex justify-end mt-8">
          <button onClick={fechar} className="px-5 py-3 rounded-xl bg-gray-100 font-bold">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <p className="text-xs uppercase text-gray-500 font-bold">{label}</p>
      <p className="font-black text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function LinkBox({ titulo, link, copiar }) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs uppercase text-gray-500 font-bold">{titulo}</p>
        <p className="text-sm text-gray-700 truncate">{link}</p>
      </div>

      <button onClick={() => copiar(link)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
        Copiar
      </button>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-black text-red-600 mt-2">{value}</h2>
    </div>
  );
}