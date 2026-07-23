import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAnalytics } from '../hooks/useApplications'
import { TrendingUp, Target, Clock, Briefcase } from 'lucide-react'

// ─── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

// ─── Colors for pie chart ──────────────────────────────────────
const PIE_COLORS = {
  Applied: '#3B82F6',
  Shortlisted: '#F97316',
  Interview: '#8B5CF6',
  Offer: '#22C55E',
  Rejected: '#EF4444',
}

const AnalyticsPage = () => {
  const { data, isLoading, isError } = useAnalytics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load analytics. Please refresh.
      </div>
    )
  }

  const analytics = data?.data
  if (!analytics) return null

  const { total, statusCount, monthlyData, responseRate, offerRate } = analytics

  // Format data for pie chart
  const pieData = Object.entries(statusCount)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))

  // Format data for bar chart
  const barData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    applications: count,
  }))

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Your placement season at a glance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total applications"
          value={total}
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          label="Response rate"
          value={`${responseRate}%`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Offer rate"
          value={`${offerRate}%`}
          icon={Target}
          color="purple"
        />
        <StatCard
          label="Shortlisted"
          value={statusCount.Shortlisted}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Bar chart — monthly applications */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-1">Applications by month</h2>
          <p className="text-xs text-gray-400 mb-5">How many you applied each month</p>
          {barData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    border: '0.5px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — status breakdown */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="font-medium text-gray-900 mb-1">Status breakdown</h2>
          <p className="text-xs text-gray-400 mb-5">Distribution across all stages</p>
          {pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[entry.name] || '#9CA3AF'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: '0.5px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status count table */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 mt-5">
        <h2 className="font-medium text-gray-900 mb-4">Detailed breakdown</h2>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(statusCount).map(([status, count]) => {
            const colors = {
              Applied: 'bg-blue-50 text-blue-600 border-blue-100',
              Shortlisted: 'bg-orange-50 text-orange-600 border-orange-100',
              Interview: 'bg-purple-50 text-purple-600 border-purple-100',
              Offer: 'bg-green-50 text-green-600 border-green-100',
              Rejected: 'bg-red-50 text-red-600 border-red-100',
            }
            return (
              <div
                key={status}
                className={`border rounded-xl p-4 text-center ${colors[status]}`}
              >
                <p className="text-2xl font-semibold">{count}</p>
                <p className="text-xs mt-1 opacity-80">{status}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage