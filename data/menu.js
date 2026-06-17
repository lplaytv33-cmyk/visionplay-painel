export const menuGroups = [
  {
    title: "Principal",
    module: "dashboard",
    items: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Perfil", href: "/dashboard/perfil" },
      { name: "Histórico de Créditos", href: "/dashboard/historico-creditos" },
      { name: "Dicas Rápidas", href: "/dashboard/dicas-rapidas" },
      { name: "Novos Conteúdos", href: "/dashboard/novos-conteudos" },
    ],
  },
  {
    title: "Clientes",
    module: "clientes",
    items: [
      { name: "Clientes", href: "/dashboard/clientes" },
      { name: "Clientes Excluídos", href: "/dashboard/clientes-excluidos" },
      { name: "Exclusão em Massa", href: "/dashboard/exclusao-massa-clientes" },
    ],
  },
  {
    title: "Revenda",
    module: "revenda",
    items: [
      { name: "Revendedores", href: "/dashboard/revendedores" },
      { name: "Mensalistas", href: "/dashboard/mensalistas" },
      { name: "Revendedores Excluídos", href: "/dashboard/revendedores-excluidos" },
      { name: "Meu Link de Indicação", href: "/dashboard/link-indicacao" },
    ],
  },
  {
    title: "Financeiro",
    module: "financeiro",
    items: [
      { name: "Gestor Master", href: "/dashboard/gestor-master" },
      { name: "Pacote de Planos", href: "/dashboard/pacote-planos" },
      { name: "Pacote de Créditos", href: "/dashboard/pacote-creditos" },
      { name: "Pagamentos", href: "/dashboard/pagamentos" },
    ],
  },
  {
    title: "Aplicações",
    module: "aplicacoes",
    items: [
      { name: "Gerenciar Loja", href: "/dashboard/gerenciar-loja" },
      { name: "Pedido de VODs", href: "/dashboard/pedido-vods" },
      { name: "Chatbot", href: "/dashboard/chatbot" },
      { name: "Parceiros", href: "/dashboard/parceiros" },
      { name: "Ativação de Apps", href: "/dashboard/ativacao-apps" },
    ],
  },
  {
    title: "Conteúdos",
    module: "conteudos",
    items: [
      { name: "Categorias", href: "/dashboard/categorias" },
      { name: "Bouquets", href: "/dashboard/bouquets" },
      { name: "Canais", href: "/dashboard/canais" },
      { name: "Filmes", href: "/dashboard/filmes" },
      { name: "Séries", href: "/dashboard/series" },
      { name: "Importar M3U", href: "/dashboard/importar-m3u" },
    ],
  },
  {
    title: "Configurações",
    module: "configuracoes",
    items: [
      { name: "IPs Bloqueados", href: "/dashboard/ips-bloqueados" },
      { name: "DNS Personalizado", href: "/dashboard/dns-personalizado" },
      { name: "Backup do Sistema", href: "/dashboard/backup-sistema" },
      { name: "Layout", href: "/dashboard/layout" },
    ],
  },
];