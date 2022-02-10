import axios from 'axios'
// import { CodeDictionary } from '../const'
import { Notify } from 'quasar'
import { isUnNull } from '..'

export const createApi = (api = axios) => {
  return async config => {
    try {
      const headers = config.headers
      const res = await api.request({
        ...config,
        headers,
      })
      return res.data
    } catch (error) {
      if (isUnNull(error.response)) {
        return '请求出错'
      }
      let msg
      if (!isUnNull(error.response.data)) {
        msg = error.response.data.msg
      } else {
        return '请求出错！'
      }
      if (!isUnNull(msg)) {
        if (msg.length >= 2) {
          Notify.create({
            message: msg,
            color: 'warning',
            position: 'top',
            timeout: 2000,
          })
        }
      }
      return '请求出错！'
    }
  }
}
