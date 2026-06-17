export const ROLES = {
  DONO: "DONO",
  SUPERADMIN: "SUPERADMIN",
  REVENDA_ADM: "REVENDA_ADM",
  REVENDA_ULTRA: "REVENDA_ULTRA",
  MASTER: "MASTER",
};

export const permissions = {
  DONO: ["*"],

  SUPERADMIN: [
    "dashboard",
    "clientes",
    "revenda",
    "financeiro",
    "aplicacoes",
    "conteudos",
  ],

  REVENDA_ADM: [
    "dashboard",
    "clientes",
    "revenda",
    "financeiro",
  ],

  REVENDA_ULTRA: [
    "dashboard",
    "clientes",
    "financeiro",
  ],

  MASTER: [
    "dashboard",
    "clientes",
  ],
};

export function canAccess(role, module) {
  if (!role) return false;
  if (permissions[role]?.includes("*")) return true;
  return permissions[role]?.includes(module);
}