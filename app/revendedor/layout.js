import RevendedorSidebar from "@/components/revendedor/RevendedorSidebar";
import RevendedorHeader from "@/components/revendedor/RevendedorHeader";

export default function RevendedorLayout({ children }) {
  return (
    <main className="min-h-screen bg-gray-100">
      <RevendedorSidebar />

      <section className="ml-72 min-h-screen">
        <RevendedorHeader />
        <div className="p-8">{children}</div>
      </section>
    </main>
  );
}
