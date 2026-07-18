import api from './axios'

export const getProfile = async () => {
  const response = await api.get('/user/profile')
  return response.data
}

export const updateProfile = async (data) => {
  const response = await api.put('/user/profile', data)
  return response.data
}

export const updatePassword = async (data) => {
  const response = await api.put('/user/password', data)
  return response.data
}

export const updateReminder = async (data) => {
  const response = await api.put('/user/reminder', data)
  return response.data
}