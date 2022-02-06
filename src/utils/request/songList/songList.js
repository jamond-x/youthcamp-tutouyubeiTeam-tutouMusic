// 获取个性推荐页面轮播图

import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL, EXAMPLE_URLS } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

// 获取推荐歌单（发现页个性推荐中使用）
export const QueryRecommendSongList = async (url = 'personalized') => {
  return await api({
    // url: 'recommend/resource'
    url,
    params: {
      limit: 10
    }
  })
}

// 获取精品歌单（发现页歌单中使用）
export const QueryQualitySongList = async data => {
  return await api({
    url: 'top/playlist/highquality',
    params: {
      limit: 1
    }
  })
}

// 获取歌单标签（发现页歌单中使用）
export const QuerySongListTags = async data => {
  return await api({
    url: 'playlist/highquality/tags'
  })
}

// 根据标签获取歌单（发现页歌单中使用）
export const QuerySongListByTag = async (data, offset) => {
  return await api({
    // top/playlist/highquality?cat="华语"
    url: 'top/playlist/hot',
    // url: 'top/playlist/highquality',
    params: {
      // tag: data
      cat: data,
      offset,
      limit: 20
    }
  })
}