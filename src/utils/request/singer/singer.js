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
    url: EXAMPLE_URLS.ALL_RANK,
  })
}

export const SingerList = async (offset = 0, type = -1, area = -1, limit = 24, initail = -1) => {
  return await api({
    url: EXAMPLE_URLS.SINGER_LIST,
    params: {
      type,
      offset,
      area,
      limit,
      initail
    }
  })
}
