"use client";

import { useEffect, useState } from "react";

export default function RevendedoresPage() {
  const [revendedores, setRevendedores] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [creditosModal, setCreditosModal] = useState(null);
  const [clienteModal, setClienteModal] = useState(null);

  async function carregar() {
    const resposta = await fetch("/api/revendedores");
    const dados = await resposta.json();
    setRevendedores(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criarRevendedor(e) {
    e.preventDefault();

    const form = e.target;

    await fetch("/api/revendedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome.value,
        usuario: form.usuario.value,
        senha: form.senha.value,
        whatsapp: form.whatsapp.value,
        nivel: form.nivel.value,
        creditos: form.creditos.value,
      }),
    });

    form.reset();
    setModal(false);
    carregar();
  }

  async function salvarEdicao(e) {
    e.preventDefault();

    const form = e.target;

    await fetch(`/api/revendedores/${editando.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.nome.value,
        usuario: form.usuario.value,
        senha: form.senha.value,
        whatsapp: form.whatsapp.value,
        nivel: form.nivel.value,
        creditos: form.creditos.value,
        status: form.status.value,
      }),
    });

    setEditando(null);
    carregar();
  }

  async function alterarCreditos(e) {
    e.preventDefault();

    const form = e.target;

    const quantidade = Number(form.quantidade.value);
    const tipo = form.tipo.value;

    const novosCreditos =
      tipo === "adicionar"
        ? creditosModal.creditos + quantidade
        : Math.max(0, creditosModal.creditos - quantidade);

    await fetch(`/api/revendedores/${creditosModal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...creditosModal,
        creditos: novosCreditos,
      }),
    });

    await fetch("/api/historico-creditos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        revendedorId: creditosModal.id,
        revendedor: creditosModal.nome,
        tipo: tipo === "adicionar" ? "ADICIONADO" : "REMOVIDO",
        quantidade,
        observacao:
          tipo === "adicionar"
            ? "Créditos adicionados manualmente"
            : "Créditos removidos manualmente",
      }),
    });

    setCreditosModal(null);
    carregar();
  }

  async function criarClienteRevendedor(e) {
    e.preventDefault();

    const form = e.target;

    const resposta = await fetch("/api/revendedores/criar-cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        revendedorId: clienteModal.id,
        nome: form.nome.value,
        usuario: form.usuario.value,
        senha: form.senha.value,
        whatsapp: form.whatsapp.value,
        plano: form.plano.value,
        conexoes: form.conexoes.value,
        vencimento: form.vencimento.value,
      }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.error || "Erro ao criar cliente.");
      return;
    }

    alert(
      `Cliente criado com sucesso!\n\nCréditos restantes: ${resultado.creditosRestantes}`
    );

    setClienteModal(null);
    carregar();
  }

  async function alternarStatus(r) {
    const novoStatus = r.status === "Ativo" ? "Bloqueado" : "Ativo";

    await fetch(`/api/revendedores/${r.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...r,
        status: novoStatus,
      }),
    });

    carregar();
  }

  function abrirWhatsapp(numero) {
    if (!numero) {
      alert("Revendedor sem WhatsApp.");
      return;
    }

    const limpo = numero.replace(/\D/g, "");
    window.open(`https://wa.me/55${limpo}`, "_blank");
  }

  const ativos = revendedores.filter((r) => r.status === "Ativo").length;
  const bloqueados = revendedores.filter((r) => r.status === "Bloqueado").length;
  const creditos = revendedores.reduce((s, r) => s + r.creditos, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-bold">
            CRM · Revenda · Revendedores
          </p>

          <h1 className="text-3xl font-black text-gray-800">Revendedores</h1>

          <p className="text-gray-500 mt-1">
            {revendedores.length} resultado(s)
          </p>
        </div>

        <button
          onClick={() => setModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-black shadow-lg"
        >
          + Adicionar revendedor
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card title="Total" value={revendedores.length} />
        <Card title="Ativos" value={ativos} />
        <Card title="Bloqueados" value={bloqueados} />
        <Card title="Créditos" value={creditos} />
      </div>

      <div className="space-y-5">
        {revendedores.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-gray-100 p-6 border-l-4 border-l-red-600 shadow-sm"
          >
            <div className="flex justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-black">
                  {r.nome?.charAt(0)?.toUpperCase() || "R"}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-gray-800">
                      {r.nome}
                    </h2>

                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                      {r.nivel || "Nível 1"}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm">@ {r.usuario}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    r.status === "Ativo"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  ● {r.status}
                </span>

                <button onClick={() => setClienteModal(r)} className="action-green">
                  + Cliente
                </button>

                <button onClick={() => setCreditosModal(r)} className="action">
                  + Créditos
                </button>

                <button onClick={() => abrirWhatsapp(r.whatsapp)} className="action">
                  WhatsApp
                </button>

                <button onClick={() => setEditando(r)} className="action">
                  Editar
                </button>

                <button onClick={() => alternarStatus(r)} className="action-red">
                  {r.status === "Ativo" ? "Bloquear" : "Ativar"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <InfoBox title="Créditos" value={r.creditos} destaque />
              <InfoBox title="Clientes Ativos" value="0" />
              <InfoBox title="Conexões" value="0" />
              <InfoBox title="Testes" value="0" />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-5 text-sm text-gray-500 border-t pt-4">
              <p>
                <strong>Última recarga:</strong> -
              </p>

              <p>
                <strong>Criado em:</strong>{" "}
                {r.criadoEm
                  ? new Date(r.criadoEm).toLocaleString("pt-BR")
                  : "-"}
              </p>

              <p>
                <strong>Contato:</strong> {r.whatsapp || "Sem dados de contato"}
              </p>
            </div>
          </div>
        ))}

        {revendedores.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed p-10 text-center text-gray-500">
            Nenhum revendedor cadastrado.
          </div>
        )}
      </div>

      {modal && (
        <RevendedorForm
          titulo="Adicionar Revendedor"
          onSubmit={criarRevendedor}
          fechar={() => setModal(false)}
        />
      )}

      {editando && (
        <RevendedorForm
          titulo="Editar Revendedor"
          revendedor={editando}
          onSubmit={salvarEdicao}
          fechar={() => setEditando(null)}
          editar
        />
      )}

      {creditosModal && (
        <CreditosModal
          revendedor={creditosModal}
          onSubmit={alterarCreditos}
          fechar={() => setCreditosModal(null)}
        />
      )}

      {clienteModal && (
        <ClienteRevendedorModal
          revendedor={clienteModal}
          onSubmit={criarClienteRevendedor}
          fechar={() => setClienteModal(null)}
        />
      )}

      <style jsx>{`
        .action {
          padding: 10px 12px;
          border-radius: 12px;
          background: #f3f4f6;
          font-weight: 800;
          color: #374151;
        }

        .action-green {
          padding: 10px 12px;
          border-radius: 12px;
          background: #dcfce7;
          font-weight: 800;
          color: #15803d;
        }

        .action-red {
          padding: 10px 12px;
          border-radius: 12px;
          background: #fee2e2;
          font-weight: 800;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}

function RevendedorForm({ titulo, revendedor, onSubmit, fechar, editar }) {
  return (
    <Modal>
      <h2 className="text-2xl font-black text-gray-800 mb-6">{titulo}</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="nome"
          defaultValue={revendedor?.nome || ""}
          placeholder="Nome"
          required
          className="input"
        />

        <input
          name="usuario"
          defaultValue={revendedor?.usuario || ""}
          placeholder="Usuário"
          required
          className="input"
        />

        <input
          name="senha"
          defaultValue={revendedor?.senha || ""}
          placeholder="Senha"
          required
          className="input"
        />

        <input
          name="whatsapp"
          defaultValue={revendedor?.whatsapp || ""}
          placeholder="WhatsApp"
          className="input"
        />

        <select
          name="nivel"
          defaultValue={revendedor?.nivel || "Nível 1"}
          className="input"
        >
          <option>Nível 1</option>
          <option>Nível 2</option>
          <option>Nível 3</option>
          <option>Master</option>
          <option>Ultra</option>
        </select>

        <input
          name="creditos"
          type="number"
          defaultValue={revendedor?.creditos || 0}
          min="0"
          className="input"
        />

        {editar && (
          <select
            name="status"
            defaultValue={revendedor?.status || "Ativo"}
            className="input"
          >
            <option>Ativo</option>
            <option>Bloqueado</option>
          </select>
        )}

        <BotoesModal fechar={fechar} />
      </form>

      <InputStyle />
    </Modal>
  );
}

function CreditosModal({ revendedor, onSubmit, fechar }) {
  return (
    <Modal max="max-w-md">
      <h2 className="text-2xl font-black text-gray-800 mb-2">
        Créditos de {revendedor.nome}
      </h2>

      <p className="text-gray-500 mb-6">
        Saldo atual: <strong>{revendedor.creditos}</strong>
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <select name="tipo" className="input">
          <option value="adicionar">Adicionar créditos</option>
          <option value="remover">Remover créditos</option>
        </select>

        <input
          name="quantidade"
          type="number"
          min="1"
          placeholder="Quantidade"
          required
          className="input"
        />

        <BotoesModal fechar={fechar} />
      </form>

      <InputStyle />
    </Modal>
  );
}

function ClienteRevendedorModal({ revendedor, onSubmit, fechar }) {
  return (
    <Modal>
      <h2 className="text-2xl font-black text-gray-800 mb-2">
        Criar Cliente
      </h2>

      <p className="text-gray-500 mb-6">
        Revendedor: <strong>{revendedor.nome}</strong> · Créditos:{" "}
        <strong>{revendedor.creditos}</strong>
      </p>

      {revendedor.creditos <= 0 && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 mb-4 font-bold">
          Este revendedor não possui créditos disponíveis.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <input name="nome" placeholder="Nome do cliente" required className="input" />
        <input name="usuario" placeholder="Usuário" required className="input" />
        <input name="senha" placeholder="Senha" required className="input" />
        <input name="whatsapp" placeholder="WhatsApp" className="input" />

        <select name="plano" className="input">
          <option>Mensal</option>
          <option>Trimestral</option>
          <option>Semestral</option>
          <option>Anual</option>
          <option>Teste</option>
        </select>

        <input
          name="conexoes"
          type="number"
          defaultValue="1"
          min="1"
          className="input"
        />

        <input name="vencimento" type="date" required className="input" />

        <BotoesModal fechar={fechar} disabled={revendedor.creditos <= 0} />
      </form>

      <InputStyle />
    </Modal>
  );
}

function Modal({ children, max = "max-w-xl" }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl w-full ${max} p-8`}>
        {children}
      </div>
    </div>
  );
}

function BotoesModal({ fechar, disabled }) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={fechar}
        className="px-5 py-3 rounded-xl bg-gray-100 font-bold"
      >
        Cancelar
      </button>

      <button
        disabled={disabled}
        className={`px-5 py-3 rounded-xl font-bold ${
          disabled ? "bg-gray-200 text-gray-500" : "bg-red-600 text-white"
        }`}
      >
        Salvar
      </button>
    </div>
  );
}

function InfoBox({ title, value, destaque }) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        destaque
          ? "bg-red-50 border-red-100"
          : "bg-gray-50 border-gray-100"
      }`}
    >
      <p className="text-xs text-gray-500 uppercase font-black">{title}</p>

      <h3
        className={`text-3xl font-black mt-2 ${
          destaque ? "text-red-600" : "text-gray-800"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-xs uppercase font-black text-gray-400">{title}</p>
      <h2 className="text-3xl font-black text-red-600 mt-2">{value}</h2>
    </div>
  );
}

function InputStyle() {
  return (
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
  );
}