import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

const ccookie = localStorage.getItem('cookie') || ''

export const QuerySearch = async (keyword, type = 1, offset = 0) => {
  return await api({
    method: 'GET',
    url:
      '/search?keywords=' +
      keyword +
      '&type=' +
      type +
      '&offset=' +
      offset +
      '&ts=' +
      new Date().getTime(),
    data: {
      cookie: ccookie,
    },
  })
}

export const QuerySong = async id => {
  return await api({
    method: 'POST',
    url: '/song/detail?ids=' + id,
    data: {
      cookie: ccookie,
    },
  })
}

export const QueryArtist = async id => {
  return await api({
    method: 'POST',
    url: '/artist/detail?id=' + id,
    data: {
      cookie: ccookie,
    },
  })
}

export const QueryArtistTopSong = async id => {
  return await api({
    method: 'POST',
    url: '/artist/top/song?id=' + id,
    data: {
      cookie: ccookie,
    },
  })
}

export const QueryArtistAlbum = async (id, offset = 0) => {
  return await api({
    method: 'POST',
    url: '/artist/album?limit=30&id=' + id + '&offset=' + offset,
    data: {
      cookie: ccookie,
    },
  })
}

export const QueryArtistSong = async (id, offset = 0) => {
  return await api({
    method: 'POST',
    url: '/artist/songs?limit=30&id=' + id + '&offset=' + offset,
    data: {
      cookie: ccookie,
    },
  })
}

export const QuerySimiArtist = async id => {
  return await api({
    method: 'POST',
    url: '/simi/artist?id=' + id,
    data: {
      cookie: ccookie,
    },
  })
}
