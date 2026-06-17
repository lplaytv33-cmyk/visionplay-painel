"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100">
      <button
        onClick={() => setMenuAberto(true)}
        className="fixed top-4 left-4 z-50 bg-red-600 text-white w-12 h-12 rounded-xl font-black lg:hidden shadow-lg"
      >
        ☰
      </button>

      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 lg:translate-x-0 ${
          menuAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />

        <button
          onClick={() => setMenuAberto(false)}
          className="absolute top-4 right-4 bg-red-600 text-white w-10 h-10 rounded-xl font-black lg:hidden"
        >
          ×
        </button>
      </div>

      <section className="lg:ml-72 min-h-screen p-4 pt-20 lg:p-8">
        {children}
      </section>
    </main>
  );
}
