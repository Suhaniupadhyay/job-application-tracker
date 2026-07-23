import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Loader2, User, Lock, Bell } from 'lucide-react'
import { getProfile, updateProfile, updatePassword, updateReminder } from '../api/user.api'
import useAuthStore from '../store/authStore'

// ─── Validation Schemas ────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ─── Reusable Field ────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

const Input = ({ error, ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors
      ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
    {...props}
  />
)

// ─── Profile Section ───────────────────────────────────────────
const ProfileSection = ({ profile }) => {
  const queryClient = useQueryClient()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, email: profile.email })
    }
  }, [profile, reset])

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setAuth(data.data, localStorage.getItem('token'))
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Update failed')
    },
  })

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <User size={16} className="text-blue-600" />
        </div>
        <h2 className="font-medium text-gray-900">Personal info</h2>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-xl font-semibold text-white">
            {profile?.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{profile?.name}</p>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
        <Field label="Full name" error={errors.name?.message}>
          <Input error={errors.name} {...register('name')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" error={errors.email} {...register('email')} />
        </Field>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 w-fit"
        >
          {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
          Save changes
        </button>
      </form>
    </div>
  )
}

// ─── Password Section ──────────────────────────────────────────
const PasswordSection = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully')
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Update failed')
    },
  })

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
          <Lock size={16} className="text-purple-600" />
        </div>
        <h2 className="font-medium text-gray-900">Change password</h2>
      </div>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
        <Field label="Current password" error={errors.currentPassword?.message}>
          <Input type="password" placeholder="••••••••" error={errors.currentPassword} {...register('currentPassword')} />
        </Field>
        <Field label="New password" error={errors.newPassword?.message}>
          <Input type="password" placeholder="••••••••" error={errors.newPassword} {...register('newPassword')} />
        </Field>
        <Field label="Confirm new password" error={errors.confirmPassword?.message}>
          <Input type="password" placeholder="••••••••" error={errors.confirmPassword} {...register('confirmPassword')} />
        </Field>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 w-fit"
        >
          {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
          Update password
        </button>
      </form>
    </div>
  )
}

// ─── Reminder Section ──────────────────────────────────────────
const ReminderSection = ({ profile }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Update failed')
    },
  })

  const toggle = () => {
    mutation.mutate({ reminderEnabled: !profile?.reminderEnabled })
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
          <Bell size={16} className="text-orange-600" />
        </div>
        <h2 className="font-medium text-gray-900">Email reminders</h2>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Deadline reminders</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Get an email the day before any application deadline
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={mutation.isPending}
          className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-60
            ${profile?.reminderEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
              ${profile?.reminderEnabled ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────
const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const profile = data?.data

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Profile and settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account details</p>
      </div>
      <div className="flex flex-col gap-5">
        <ProfileSection profile={profile} />
        <PasswordSection />
        <ReminderSection profile={profile} />
      </div>
    </div>
  )
}

export default ProfilePage