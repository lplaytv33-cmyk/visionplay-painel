"use client";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md border border-red-100 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-red-600">
          VisionPlay
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Acesso restrito ao painel
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          <button
            type="button"
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}