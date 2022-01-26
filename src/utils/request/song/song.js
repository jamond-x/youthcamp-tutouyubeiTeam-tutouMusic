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
    method: 'POST',
    url: EXAMPLE_URLS.ARTIST_LIST,
    data,
    //id: '347230'
  })
}

export const LikeMusicList = async data => {
  return await api({
    method: 'POST',
    url: LOGIN_URLS.LIKE_MUSIC_LIST,
    data,
  })
}

export const SongDetail = async data => {
  return await api({
    method: 'POST',
    data,
    url: LOGIN_URLS.SONG_DETAIL,
  })
}
