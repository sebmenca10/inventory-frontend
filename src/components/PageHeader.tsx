type Props = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
}

export default function PageHeader({ title, subtitle, icon }: Props) {
  return (
    <div className="w-full mb-8">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-white">
        <div className="flex items-center gap-3">
          {icon && <div className="text-3xl">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-blue-100 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="mt-4 sm:mt-0 text-sm text-blue-100 font-medium">
          {new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  )
}