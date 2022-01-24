// 示例

import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

const ccookie = localStorage.getItem('cookie') || ''

// 直接使用 QuerySongs() 函数即可
export const QueryUser = async uid => {
  return await api({
    method: 'GET',
    url: '/user/detail?uid=' + uid,
    data: {
      cookie: ccookie,
    },
  })
}

export const QueryPlayList = async uid => {
  return await api({
    method: 'post',
    url: '/user/playlist?uid=' + uid,
    data: {
      cookie: ccookie,
    },
  })
}

export const QueryPlayListDetail = async id => {
  return await api({
    method: 'post',
    url: '/playlist/detail?id=' + id,
    data: {
      cookie: ccookie,
    },
  })
}

export const QuerySubArtist = async () => {
  return await api({
    method: 'post',
    url: '/artist/sublist',
    data: {
      cookie: ccookie,
    },
  })
}

export const QuerySubAlbum = async () => {
  return await api({
    method: 'post',
    url: '/album/sublist',
    data: {
      cookie: ccookie,
    },
  })
}

export const QueryFollowList = async uid => {
  return await api({
    method: 'post',
    url: '/user/follows?uid=' + uid,
    data: {
      cookie: ccookie,
    },
  })
}
