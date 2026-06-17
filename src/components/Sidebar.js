import { menuGroups } from "@/data/menu";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen overflow-y-auto">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-black text-red-600">VisionPlay</h1>
        <p className="text-sm text-gray-500">Painel Administrativo</p>

        <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-xs text-gray-500">Nível atual</p>
          <p className="text-sm font-bold text-red-600">DONO</p>
        </div>
      </div>

      <nav className="p-4 text-sm">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-bold text-red-600 uppercase mt-5 mb-2">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={`${group.title}-${item}`}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}