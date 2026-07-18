import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  getAnalytics,
} from '../api/application.api'
import toast from 'react-hot-toast'

// Fetch all applications
export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
  })
}

// Fetch single application
export const useApplication = (id) => {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => getApplication(id),
    enabled: !!id,
  })
}

// Create application
export const useCreateApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application added successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong')
    },
  })
}

// Update application
export const useUpdateApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong')
    },
  })
}

// Delete application
export const useDeleteApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application deleted')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong')
    },
  })
}

// Update status (for Kanban drag and drop)
export const useUpdateStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong')
    },
  })
}

// Get analytics
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })
}