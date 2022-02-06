import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL } from 'src/utils/const'
axios.defaults.withCredentials = true
const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

export const LoginByPhone = async data => {
  return await api({
    method: 'POST',
    url: `/login/cellphone?timestamp=${Date.parse(new Date())}`,
    data,
  })
}

export const RefreshLogin = async () => {
  return await api({
    method: 'POST',
    url: '/login/refresh',
  })
}

export const Logout = async () => {
  return await api({
    method: 'POST',
    url: `/logout?timestamp=${Date.parse(new Date())}`,
  })
}

export const SendCaptcha = async data => {
  return await api({
    method: 'POST',
    url: '/captcha/sent',
    data,
  })
}

export const checkCaptcha = async data => {
  return await api({
    method: 'POST',
    url: '/captcha/verify',
    data,
  })
}

export const RegisterByPhone = async data => {
  return await api({
    method: 'POST',
    url: '/register/cellphone',
    data,
  })
}
