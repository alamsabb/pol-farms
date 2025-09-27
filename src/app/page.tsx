export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)'}}>
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-lg">
        <div className="text-center p-6 pb-4">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            🐔 Poultry Farm Management
          </h1>
          <p className="text-gray-600">
            Enterprise-level farm operations management
          </p>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <a href="/dashboard" className="block">
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Enter Dashboard
            </button>
          </a>
          <div className="text-center text-sm text-gray-500">
            Track farms, batches, sales & KPIs
          </div>
        </div>
      </div>
    </div>
  )
}