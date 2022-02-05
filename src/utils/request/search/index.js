import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

const ccookie = localStorage.getItem('cookie') || ''

export const QuerySearch = async (keyword, type = 1) => {
  return await api({
    method: 'GET',
    url: '/search?keywords=' + keyword + '&type=' + type,
    data: {
      cookie: ccookie,
    },
  })
}

export const QuerySong = async id => {
  return await api({
    method: 'GET',
    url: '/song/detail?ids=' + id,
    data: {
      cookie: ccookie,
    },
  })
}
