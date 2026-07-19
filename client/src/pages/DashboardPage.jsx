import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  MessageSquare,
  Trophy,
  XCircle,
  Clock,
  Plus,
  Building2,
} from 'lucide-react'
import { useApplications } from '../hooks/useApplications'
import StatsCard from '../components/dashboard/StatsCard'
import useAuthStore from '../store/authStore'

// Badge component for status
const StatusBadge = ({ status }) => {
  const styles = {
    Applied: 'bg-blue-50 text-blue-600',
    Shortlisted: 'bg-orange-50 text-orange-600',
    Interview: 'bg-purple-50 text-purple-600',
    Offer: 'bg-green-50 text-green-600',
    Rejected: 'bg-red-50 text-red-600',
  }

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  )
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data, isLoading, isError } = useApplications()

  const applications = data?.data || []

  // Calculate stats from applications array
  const stats = {
    total: applications.length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offers: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
  }

  // Get 5 most recent applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load data. Please refresh.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's your placement tracker overview
          </p>
        </div>
        <button
          onClick={() => navigate('/applications/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total applications"
          value={stats.total}
          color="blue"
          icon={Briefcase}
        />
        <StatsCard
          label="In interviews"
          value={stats.interview}
          color="purple"
          icon={MessageSquare}
        />
        <StatsCard
          label="Offers received"
          value={stats.offers}
          color="green"
          icon={Trophy}
        />
        <StatsCard
          label="Rejected"
          value={stats.rejected}
          color="red"
          icon={XCircle}
        />
      </div>

      {/* Recent Applications */}
      <div className="bg-white border border-gray-100 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">Recent applications</h2>
          <button
            onClick={() => navigate('/applications')}
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </button>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No applications yet</p>
            <button
              onClick={() => navigate('/applications/new')}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Add your first application
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentApplications.map((app) => (
              <div
                key={app._id}
                onClick={() => navigate(`/applications/${app._id}`)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {app.company[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.company}</p>
                    <p className="text-xs text-gray-500">{app.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(app.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage