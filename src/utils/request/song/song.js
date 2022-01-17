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
export const QueryArtists = async data => {
  return await api({
    methods: 'POST',
    url: EXAMPLE_URLS.TEST_URL,
    data,
    //id: '347230'
  })
}
