
import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL, EXAMPLE_URLS, LOGIN_URLS } from 'src/utils/const'
axios.defaults.withCredentials = true
const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

export const LoginPhone = async data => {
  return await api({
    method: 'POST',
    url: LOGIN_URLS.PHONE_LOGIN,
    data,
  })
}