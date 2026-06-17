export default async function DynamicDashboardPage({ params }) {
  const resolvedParams = await params;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <h1 className="text-2xl font-bold">
        {resolvedParams.slug}
      </h1>

      <p className="text-gray-500 mt-2">
        Página em desenvolvimento.
      </p>
    </div>
  );
}