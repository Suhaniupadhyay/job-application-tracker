const StatsCard = ({ label, value, color = 'blue', icon: Icon }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

export default StatsCard