export default function ImportResultModal({ open, onClose, result }: any) {
  if (!open || !result) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          Resultado de importación
        </h2>

        <p className="text-gray-300 mb-2">
          Total de filas: <strong>{result.totalRows}</strong>
        </p>
        <p className="text-green-400 mb-2">
          Insertadas correctamente: <strong>{result.inserted}</strong>
        </p>
        <p className="text-yellow-400 mb-4">
          Inválidas: <strong>{result.invalid}</strong>
        </p>

        {result.invalid > 0 && (
          <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-700 text-gray-300 uppercase">
                <tr>
                  <th className="px-3 py-2">Línea</th>
                  <th className="px-3 py-2">Error</th>
                  <th className="px-3 py-2">Datos</th>
                </tr>
              </thead>
              <tbody>
                {result.invalidDetails.map((r: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="px-3 py-2 text-gray-400">{r.line}</td>
                    <td className="px-3 py-2 text-red-400">{r.error}</td>
                    <td className="px-3 py-2 text-gray-300">
                      {Object.entries(r.row)
                        .map(([k, v]) => `${k}: ${v || '-'}`)
                        .join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}