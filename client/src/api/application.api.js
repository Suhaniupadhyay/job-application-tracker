import api from './axios'

export const getApplications = async () => {
  const response = await api.get('/applications')
  return response.data
}

export const getApplication = async (id) => {
  const response = await api.get(`/applications/${id}`)
  return response.data
}

export const createApplication = async (data) => {
  const response = await api.post('/applications', data)
  return response.data
}

export const updateApplication = async (id, data) => {
  const response = await api.put(`/applications/${id}`, data)
  return response.data
}

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`)
  return response.data
}

export const updateStatus = async (id, status) => {
  const response = await api.put(`/applications/${id}/status`, { status })
  return response.data
}

export const getAnalytics = async () => {
  const response = await api.get('/applications/analytics')
  return response.data
}