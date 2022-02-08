import axios from 'axios'
// import { CodeDictionary } from '../const'
import { Notify } from 'quasar'

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
      Notify.create({
        message: error.response.data.msg,
        color: 'warning',
        position: 'top',
      })
      return '请求出错了！'
    }
  }
}
