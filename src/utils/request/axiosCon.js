import axios from 'axios'

class Request {
  instance
  interceptors
  constructor(config) {
    this.instance = axios.create(config)
    this.instance.interceptors = config.interceptors
    this.instance.interceptors.request.use(
      req => {
        // 全局请求拦截
        return req
      },
      err => err
    )

    this.instance.interceptors.request.use(this.interceptors.requestInterceptor, err => err)
    this.instance.interceptors.response.use(this.interceptors.responseInterceptor, err => err)

    this.instance.interceptors.response.use(res => {
      if (res.data) {
        return res.data
      }
      return res
    })
  }
  request(config) {
    return this.instance.request(config)
  }
}

export default Request
