import axios from 'axios'
// import { CodeDictionary } from '../const'
// import { Dialog } from 'quasar'

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
      console.log('请求出错了')
      return '请求出错了！'
    }
  }
}
