import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
  MapPin,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import {
  useApplication,
  useDeleteApplication,
} from '../hooks/useApplications'
import {
  useInterviews,
  useCreateInterview,
  useDeleteInterview,
  useUpdateInterview,
} from '../hooks/useApplications'

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

// ─── Outcome Badge ─────────────────────────────────────────────
const OutcomeBadge = ({ outcome }) => {
  const config = {
    Pass: { icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
    Fail: { icon: XCircle, className: 'text-red-600 bg-red-50' },
    Waiting: { icon: Clock, className: 'text-orange-600 bg-orange-50' },
    NA: { icon: AlertCircle, className: 'text-gray-400 bg-gray-50' },
  }
  const { icon: Icon, className } = config[outcome] || config.NA
  return (
    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${className}`}>
      <Icon size={12} />
      {outcome}
    </span>
  )
}

// ─── Add Interview Form ────────────────────────────────────────
const AddInterviewForm = ({ applicationId, onClose }) => {
  const createInterview = useCreateInterview(applicationId)
  const [form, setForm] = useState({
    round: '',
    type: 'Online Assessment',
    date: '',
    status: 'Scheduled',
    outcome: 'NA',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createInterview.mutate(form, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Add interview round</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Round number</label>
          <input
            type="number"
            min="1"
            required
            value={form.round}
            onChange={(e) => setForm({ ...form, round: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
            placeholder="1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
          >
            <option>Resume Shortlisting</option>
            <option>Online Assessment</option>
            <option>Technical</option>
            <option>HR</option>
            <option>Managerial</option>
            <option>Group Discussion</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Outcome</label>
          <select
            value={form.outcome}
            onChange={(e) => setForm({ ...form, outcome: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
          >
            <option value="NA">NA</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
            <option value="Waiting">Waiting</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs text-gray-500">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white resize-none"
            rows={2}
            placeholder="Questions asked, topics covered..."
          />
        </div>
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={createInterview.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {createInterview.isPending ? 'Adding...' : 'Add round'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────
const ApplicationDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showAddInterview, setShowAddInterview] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: appData, isLoading: appLoading } = useApplication(id)
  const { data: interviewData } = useInterviews(id)
  const deleteApplication = useDeleteApplication()
  const deleteInterview = useDeleteInterview(id)

  const app = appData?.data
  const interviews = interviewData?.data || []

  const handleDeleteApp = () => {
    deleteApplication.mutate(id, {
      onSuccess: () => navigate('/applications'),
    })
  }

  const handleDeleteInterview = (interviewId) => {
    deleteInterview.mutate(interviewId)
    setDeleteTarget(null)
  }

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="p-8 text-center text-gray-500">
        Application not found.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate('/applications')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to applications
      </button>

      {/* Header Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-gray-600">
                {app.company[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{app.company}</h1>
              <p className="text-gray-500 mt-0.5">{app.role}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <StatusBadge status={app.status} />
                {app.location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} /> {app.location}
                  </span>
                )}
                {app.package && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Package size={12} /> {app.package}
                  </span>
                )}
                {app.deadline && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} /> Deadline: {new Date(app.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {app.jobLink && (
              
              <a  href={app.jobLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <ExternalLink size={14} />
                Job link
              </a>
            )}
            <button
              onClick={() => navigate(`/applications/${id}/edit`)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
            <button
              onClick={handleDeleteApp}
              disabled={deleteApplication.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        {/* Notes */}
        {app.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-600 leading-relaxed">{app.notes}</p>
          </div>
        )}
      </div>

      {/* Interview Rounds */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900">
            Interview rounds
            <span className="ml-2 text-xs text-gray-400 font-normal">
              {interviews.length} round{interviews.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <button
            onClick={() => setShowAddInterview(!showAddInterview)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
            Add round
          </button>
        </div>

        {/* Add Interview Form */}
        {showAddInterview && (
          <AddInterviewForm
            applicationId={id}
            onClose={() => setShowAddInterview(false)}
          />
        )}

        {/* Interview List */}
        {interviews.length === 0 && !showAddInterview ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No interview rounds yet</p>
            <button
              onClick={() => setShowAddInterview(true)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Add your first round
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      Round {interview.round} — {interview.type}
                    </span>
                    <OutcomeBadge outcome={interview.outcome} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(interview.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })} · {interview.status}
                  </p>
                  {interview.notes && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {interview.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteInterview(interview._id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationDetailPage