import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <section className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500 mt-1">Resumo geral do sistema</p>
          </div>

          <button className="bg-red-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-red-700">
            Novo Cliente
          </button>
        </div>

        <div className="grid grid-cols-4 gap-5 mt-8">
          <Card title="Clientes Ativos" value="0" />
          <Card title="Revendedores" value="0" />
          <Card title="Créditos" value="0" />
          <Card title="Conteúdos" value="0" />
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-red-600 mt-2">{value}</h3>
    </div>
  );
}