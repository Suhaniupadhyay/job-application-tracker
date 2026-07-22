import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
  Building2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { useApplications, useDeleteApplication } from '../hooks/useApplications'

// ─── Status Badge ──────────────────────────────────────────────
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

// ─── Confirm Delete Modal ──────────────────────────────────────
const DeleteModal = ({ company, onConfirm, onCancel, isLoading }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
      <h3 className="font-semibold text-gray-900 mb-2">Delete application</h3>
      <p className="text-sm text-gray-500 mb-5">
        Are you sure you want to delete the application for <strong>{company}</strong>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)

// ─── Main Page ─────────────────────────────────────────────────
const ApplicationsPage = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useApplications()
  const deleteApplication = useDeleteApplication()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const applications = data?.data || []

  // Filter by search and status
  const filtered = applications
    .filter((app) => {
      const matchSearch =
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'All' || app.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]
      if (sortField === 'createdAt' || sortField === 'deadline') {
        valA = new Date(valA || 0)
        valB = new Date(valB || 0)
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const handleDelete = () => {
    deleteApplication.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={14} className="text-gray-300" />
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-blue-600" />
      : <ChevronDown size={14} className="text-blue-600" />
  }

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
        Failed to load applications. Please refresh.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          company={deleteTarget.company}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteApplication.isPending}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} of {applications.length} applications
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors bg-white appearance-none cursor-pointer"
          >
            <option value="All">All status</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <Building2 size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {search || statusFilter !== 'All'
              ? 'No applications match your filters'
              : 'No applications yet'}
          </p>
          {!search && statusFilter === 'All' && (
            <button
              onClick={() => navigate('/applications/new')}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Add your first application
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th
                  className="text-left p-4 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center gap-1">
                    Company <SortIcon field="company" />
                  </div>
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500">Role</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500">Status</th>
                <th
                  className="text-left p-4 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('deadline')}
                >
                  <div className="flex items-center gap-1">
                    Deadline <SortIcon field="deadline" />
                  </div>
                </th>
                <th
                  className="text-left p-4 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Applied on <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/applications/${app._id}`)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-600">
                          {app.company[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{app.company}</p>
                        {app.location && (
                          <p className="text-xs text-gray-400">{app.location}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{app.role}</td>
                  <td className="p-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {app.deadline
                      ? new Date(app.deadline).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="p-4">
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {app.jobLink && (
  <a href={app.jobLink} target="_blank" rel="noreferrer" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
    <ExternalLink size={14} />
  </a>
)}
                      <button
                        onClick={() => navigate(`/applications/${app._id}/edit`)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(app)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ApplicationsPage