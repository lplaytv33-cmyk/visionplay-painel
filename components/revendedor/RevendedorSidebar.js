import Link from "next/link";

const menu = [
  ["📊 Dashboard", [["Dashboard", "/revendedor"]]],
  [
    "📺 Conteúdo",
    [
      ["Canais", "/revendedor/canais"],
      ["Filmes", "/revendedor/filmes"],
      ["Séries", "/revendedor/series"],
    ],
  ],
  [
    "👥 Clientes",
    [
      ["Clientes", "/revendedor/clientes"],
      ["Histórico Clientes", "/revendedor/historico-clientes"],
    ],
  ],
  [
    "💰 Revenda",
    [
      ["Revendedores", "/revendedor/revendedores"],
      ["Histórico Créditos", "/revendedor/historico-creditos"],
      ["Meu Perfil", "/revendedor/perfil"]
    ],
  ],
];

export default function RevendedorSidebar() {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-black text-red-600">VisionPlay</h1>
        <p className="text-sm text-gray-500">Painel Revendedor</p>
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
