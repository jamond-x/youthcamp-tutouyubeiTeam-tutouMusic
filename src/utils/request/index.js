import axios from 'axios'
// import { CodeDictionary } from '../const'
import { useQuasar } from 'quasar'
let $q = useQuasar()

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
      $q.notify({
        message: '请求出错了！',
        color: purple,
      })
      return '请求出错了！'
    }
  }
}
