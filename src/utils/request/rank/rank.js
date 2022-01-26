// 示例

import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL, EXAMPLE_URLS } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

// 直接使用 QuerySongs() 函数即可
export const AllRank = async () => {
  return await api({
    method: 'GET',
    url: EXAMPLE_URLS.ALL_RANK,
  })
}

export const DetailRank = async id => {
  return await api({
    method: 'GET',
    url: EXAMPLE_URLS.DETAIL_RANK + id,
  })
}
