"use client";

import { useState } from "react";

const TAMANHO_LOTE = 100;

export default function ImportarM3UPage() {
  const [url, setUrl] = useState("");
  const [aba, setAba] = useState("canais");
  const [importando, setImportando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [textoProgresso, setTextoProgresso] = useState("");

  const [dados, setDados] = useState({
    canais: [],
    filmes: [],
    series: [],
  });

  function classificarItem(item) {
    const texto = `${item.nome} ${item.categoria} ${item.link}`.toLowerCase();

    if (
      texto.includes("/series/") ||
      texto.includes("/serie/") ||
      texto.includes("s01") ||
      texto.includes("e01") ||
      texto.includes("temporada") ||
      texto.includes("episodio") ||
      texto.includes("episode")
    ) {
      return "series";
    }

    if (
      texto.includes("/movie/") ||
      texto.includes("/filme/") ||
      texto.includes(".mp4") ||
      texto.includes(".mkv") ||
      texto.includes(".avi")
    ) {
      return "filmes";
    }

    return "canais";
  }

  function extrairTemporadaEpisodio(nome) {
    const match = nome.match(/s(\d{1,2})e(\d{1,3})/i);

    if (match) {
      return {
        temporada: Number(match[1]),
        episodio: Number(match[2]),
      };
    }

    return {
      temporada: 1,
      episodio: 1,
    };
  }

  function analisarTextoM3U(texto) {
    const linhas = texto.split(/\r?\n/);

    const separados = {
      canais: [],
      filmes: [],
      series: [],
    };

    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i];

      if (!linha.startsWith("#EXTINF")) continue;

      const nome = linha.split(",").pop()?.trim() || "Sem nome";
      const logo = linha.match(/tvg-logo="([^"]+)"/)?.[1] || "";
      const categoria =
        linha.match(/group-title="([^"]+)"/)?.[1] || "Sem categoria";

      const link = linhas[i + 1]?.trim() || "";

      if (!link || link.startsWith("#")) continue;

      const item = {
        id: Date.now() + i,
        nome,
        categoria,
        logo,
        link,
        selecionado: true,
      };

      const tipo = classificarItem(item);

      if (tipo === "series") {
        const ep = extrairTemporadaEpisodio(nome);
        item.temporada = ep.temporada;
        item.episodio = ep.episodio;
      }

      separados[tipo].push(item);
    }

    setDados(separados);

    alert(
      `Lista analisada!\n\nCanais: ${separados.canais.length}\nFilmes: ${separados.filmes.length}\nSéries: ${separados.series.length}`
    );
  }

  function analisarArquivo(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = (e) => {
      analisarTextoM3U(e.target.result);
    };

    leitor.readAsText(arquivo);
  }

  async function analisarUrl() {
    if (!url) {
      alert("Digite uma URL M3U.");
      return;
    }

    try {
      const resposta = await fetch(url);
      const texto = await resposta.text();

      analisarTextoM3U(texto);
    } catch {
      alert("Não foi possível ler essa URL. Use upload de arquivo M3U.");
    }
  }

  function alternarSelecionado(tipo, id) {
    setDados({
      ...dados,
      [tipo]: dados[tipo].map((item) =>
        item.id === id ? { ...item, selecionado: !item.selecionado } : item
      ),
    });
  }

  function criarLotes(lista, tamanho) {
    const lotes = [];

    for (let i = 0; i < lista.length; i += tamanho) {
      lotes.push(lista.slice(i, i + tamanho));
    }

    return lotes;
  }

  async function importarTipoEmLotes(tipo, itens, totalGeral, importadosAntes) {
    const lotes = criarLotes(itens, TAMANHO_LOTE);
    let importados = importadosAntes;

    for (let i = 0; i < lotes.length; i++) {
      const lote = lotes[i];

      setTextoProgresso(
        `Importando ${tipo}: lote ${i + 1}/${lotes.length} (${importados}/${totalGeral})`
      );

      const resposta = await fetch("/api/importar-m3u/lote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo,
          itens: lote,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.detail || resultado.error || "Erro no lote");
      }

      importados += lote.length;

      const porcentagem = Math.round((importados / totalGeral) * 100);
      setProgresso(porcentagem);
      setTextoProgresso(`Importando... ${importados}/${totalGeral} itens`);
    }

    return importados;
  }

  async function importarSelecionados() {
    const canais = dados.canais.filter((item) => item.selecionado);
    const filmes = dados.filmes.filter((item) => item.selecionado);
    const series = dados.series.filter((item) => item.selecionado);

    const total = canais.length + filmes.length + series.length;

    if (total === 0) {
      alert("Nenhum item selecionado.");
      return;
    }

    setImportando(true);
    setProgresso(0);
    setTextoProgresso(`Iniciando importação de ${total} itens...`);

    try {
      let importados = 0;

      if (canais.length > 0) {
        importados = await importarTipoEmLotes(
          "canais",
          canais,
          total,
          importados
        );
      }

      if (filmes.length > 0) {
        importados = await importarTipoEmLotes(
          "filmes",
          filmes,
          total,
          importados
        );
      }

      if (series.length > 0) {
        importados = await importarTipoEmLotes(
          "series",
          series,
          total,
          importados
        );
      }

      setProgresso(100);
      setTextoProgresso(`Importação concluída: ${importados}/${total} itens`);

      alert(
        `Importação concluída!\n\nCanais: ${canais.length}\nFilmes: ${filmes.length}\nSéries: ${series.length}`
      );

      setDados({
        canais: [],
        filmes: [],
        series: [],
      });
    } catch (error) {
      console.error("ERRO IMPORTAÇÃO EM LOTES:", error);
      alert("Erro ao importar: " + error.message);
    } finally {
      setTimeout(() => {
        setImportando(false);
        setProgresso(0);
        setTextoProgresso("");
      }, 1500);
    }
  }

  const listaAtual = dados[aba];
  const total =
    dados.canais.length + dados.filmes.length + dados.series.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-800">Importar M3U</h1>
        <p className="text-gray-500 mt-2">
          Importe uma lista M3U em lotes, com progresso real e separação
          automática.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">🌐 Importar por URL</h3>

          <input
            type="text"
            placeholder="https://exemplo.com/lista.m3u"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-red-500"
          />

          <button
            onClick={analisarUrl}
            disabled={importando}
            className="mt-4 bg-red-600 text-white px-5 py-3 rounded-xl font-bold disabled:bg-gray-300"
          >
            Analisar URL
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">📁 Importar Arquivo</h3>

          <input
            type="file"
            accept=".m3u,.m3u8,.txt"
            onChange={analisarArquivo}
            disabled={importando}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
          />

          <p className="text-xs text-gray-500 mt-3">
            Recomendado para listas grandes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Resumo title="Canais" value={dados.canais.length} />
        <Resumo title="Filmes" value={dados.filmes.length} />
        <Resumo title="Séries" value={dados.series.length} />
        <Resumo title="Total" value={total} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex gap-3 mb-6">
          <BotaoAba
            nome="canais"
            atual={aba}
            total={dados.canais.length}
            onClick={() => setAba("canais")}
          />

          <BotaoAba
            nome="filmes"
            atual={aba}
            total={dados.filmes.length}
            onClick={() => setAba("filmes")}
          />

          <BotaoAba
            nome="series"
            atual={aba}
            total={dados.series.length}
            onClick={() => setAba("series")}
          />
        </div>

        {importando && (
          <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700">
                {textoProgresso || "Importando..."}
              </span>

              <span className="font-bold text-red-600">{progresso}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-red-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        )}

        {listaAtual.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
            Nenhum item encontrado nesta aba.
          </div>
        ) : (
          <>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="p-3">Selecionar</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Link</th>
                  </tr>
                </thead>

                <tbody>
                  {listaAtual.slice(0, 100).map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={item.selecionado}
                          disabled={importando}
                          onChange={() => alternarSelecionado(aba, item.id)}
                        />
                      </td>

                      <td className="font-bold text-gray-800">{item.nome}</td>
                      <td>{item.categoria}</td>
                      <td className="max-w-xs truncate text-gray-500">
                        {item.link}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {listaAtual.length > 100 && (
              <p className="text-sm text-gray-500 mt-3">
                Mostrando os primeiros 100 de {listaAtual.length}.
              </p>
            )}
          </>
        )}

        <button
          onClick={importarSelecionados}
          disabled={total === 0 || importando}
          className={`mt-6 font-bold px-6 py-3 rounded-xl ${
            total === 0 || importando
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white"
          }`}
        >
          {importando
            ? "Importando..."
            : "Importar Selecionados para o Banco"}
        </button>
      </div>
    </div>
  );
}

function BotaoAba({ nome, atual, total, onClick }) {
  const labels = {
    canais: "Canais",
    filmes: "Filmes",
    series: "Séries",
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-xl font-bold ${
        atual === nome ? "bg-red-600 text-white" : "bg-gray-100"
      }`}
    >
      {labels[nome]} ({total})
    </button>
  );
}

function Resumo({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-500">{title}</p>
      <h3 className="text-xl font-black text-red-600 mt-1">{value}</h3>
    </div>
  );
}