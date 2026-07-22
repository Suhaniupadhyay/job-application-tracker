import api from './axios'

export const getInterviews = async (applicationId) => {
  const response = await api.get(`/interviews/${applicationId}`)
  return response.data
}

export const createInterview = async (applicationId, data) => {
  const response = await api.post(`/interviews/${applicationId}`, data)
  return response.data
}

export const updateInterview = async (id, data) => {
  const response = await api.put(`/interviews/${id}`, data)
  return response.data
}

export const deleteInterview = async (id) => {
  const response = await api.delete(`/interviews/${id}`)
  return response.data
}