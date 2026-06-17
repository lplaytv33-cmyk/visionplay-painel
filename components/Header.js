export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">VisionPlay</h2>
        <p className="text-sm text-gray-500">Painel administrativo</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-600">DONO</span>
        <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">
          V
        </div>
      </div>
    </header>
  );
}
