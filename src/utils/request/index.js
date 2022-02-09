import axios from 'axios'
// import { CodeDictionary } from '../const'
import { Notify } from 'quasar'
import { isUnNull } from '..'

export const createApi = (api = axios) => {
  return async config => {
    try {
      const headers = config.headers
      // 这里配置一些header
      const res = await api.request({
        ...config,
        headers,
      })

      // if (res.data.code !== CodeDictionary.SUCCESS) {
      // }

      return res.data
    } catch (error) {
      //if (error.response.status === 401) {
      //}
      // if()...
      const msg = error.response.data.msg
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
      return '请求出错了！'
    }
  }
}
