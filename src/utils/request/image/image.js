// 获取个性推荐页面轮播图

import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL, EXAMPLE_URLS } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

// 个性推荐

// 轮播图
export const QueryBanner = async data => {
  return await api({
    url: '/banner'
  })
}
