import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import {
  useApplication,
  useCreateApplication,
  useUpdateApplication,
} from '../hooks/useApplications'

// ─── Validation Schema ─────────────────────────────────────────
const applicationSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected']),
  location: z.string().optional(),
  package: z.string().optional(),
  jobLink: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string().optional(),
})

// ─── Reusable Field Components ─────────────────────────────────
const Field = ({ label, error, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

const Input = ({ error, ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors
      ${error
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-200 focus:border-blue-500'
      }`}
    {...props}
  />
)

const Select = ({ error, children, ...props }) => (
  <select
    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors bg-white
      ${error
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-200 focus:border-blue-500'
      }`}
    {...props}
  >
    {children}
  </select>
)

// ─── Main Form Page ────────────────────────────────────────────
const ApplicationFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  // Fetch existing application if in edit mode
  const { data: existingData, isLoading: isFetching } = useApplication(
    isEditMode ? id : null
  )

  const createApplication = useCreateApplication()
  const updateApplication = useUpdateApplication()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'Applied',
    },
  })

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditMode && existingData?.data) {
      const app = existingData.data
      reset({
        company: app.company,
        role: app.role,
        status: app.status,
        location: app.location || '',
        package: app.package || '',
        jobLink: app.jobLink || '',
        deadline: app.deadline
          ? new Date(app.deadline).toISOString().split('T')[0]
          : '',
        notes: app.notes || '',
      })
    }
  }, [existingData, isEditMode, reset])

  const isLoading = createApplication.isPending || updateApplication.isPending

  const onSubmit = (data) => {
    // Remove empty optional fields
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '')
    )

    if (isEditMode) {
      updateApplication.mutate(
        { id, data: cleanData },
        { onSuccess: () => navigate(`/applications/${id}`) }
      )
    } else {
      createApplication.mutate(cleanData, {
        onSuccess: () => navigate('/applications'),
      })
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit application' : 'Add application'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditMode ? 'Update the details below' : 'Fill in the job details below'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* Required fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company name" error={errors.company?.message} required>
              <Input
                placeholder="e.g. Google"
                error={errors.company}
                {...register('company')}
              />
            </Field>

            <Field label="Role" error={errors.role?.message} required>
              <Input
                placeholder="e.g. SDE Intern"
                error={errors.role}
                {...register('role')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Status" error={errors.status?.message}>
              <Select error={errors.status} {...register('status')}>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </Field>

            <Field label="Location" error={errors.location?.message}>
              <Input
                placeholder="e.g. Bangalore"
                error={errors.location}
                {...register('location')}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Package (CTC)" error={errors.package?.message}>
              <Input
                placeholder="e.g. 12 LPA"
                error={errors.package}
                {...register('package')}
              />
            </Field>

            <Field label="Application deadline" error={errors.deadline?.message}>
              <Input
                type="date"
                error={errors.deadline}
                {...register('deadline')}
              />
            </Field>
          </div>

          <Field label="Job link" error={errors.jobLink?.message}>
            <Input
              placeholder="https://careers.google.com/..."
              error={errors.jobLink}
              {...register('jobLink')}
            />
          </Field>

          <Field label="Notes" error={errors.notes?.message}>
            <textarea
              placeholder="Any notes about this application — referral contact, prep tips, etc."
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none
                focus:border-blue-500 transition-colors resize-none"
              {...register('notes')}
            />
          </Field>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg
                text-sm font-medium hover:bg-blue-700 transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {isEditMode ? 'Update application' : 'Save application'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg
                text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationFormPage