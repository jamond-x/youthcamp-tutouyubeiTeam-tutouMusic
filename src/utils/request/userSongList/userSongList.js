// 获取个性推荐页面轮播图

import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL, EXAMPLE_URLS } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

export const QueryUserLikeList = async data => {
  return await api({
    methods: 'POST',
    url: `/likelist/?timestamp=${Date.parse(new Date())}`,
    data,
  })
}

export const QuerySongDetail = async data => {
  return await api({
    url: `/song/detail/?timestamp=${Date.parse(new Date())}`,
    params: data,
  })
}

export const QueryUserSongList = async data => {
  return await api({
    url: `/user/playlist?timestamp=${Date.parse(new Date())}`,
    params: data,
  })
}

export const QueryTrack = async data => {
  return await api({
    url: `/playlist/detail?timestamp=${Date.parse(new Date())}`,
    params: data,
  })
}
