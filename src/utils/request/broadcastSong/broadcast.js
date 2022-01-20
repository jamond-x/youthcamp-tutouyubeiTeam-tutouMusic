import axios from 'axios'
import { createApi } from '..'
import { REQUEST_BASE_URL, BROADCAST } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

/**
 *@description 获取歌曲URL
 * @param { Object } data{keywords: '关键词'}
 * @returns
 */
export const Search = async data => {
  return await api({
    method: 'POST',
    url: `${BROADCAST.SEARCH}&timestamp=${new Date().getTime()}`,
    data,
  })
}

/**
 *@description 获取歌曲URL
 * @param { Object } data{id: '33894312'} 歌曲id
 * @returns
 */
export const GetSongUrl = async data => {
  return await api({
    method: 'POST',
    url: BROADCAST.GET_URL,
    data,
  })
}

/**
 *@description 获取歌曲URL
 * @param { Object } data{id: '33894312'} 歌曲id
 * @returns
 */
export const Check_Music = async data => {
  return await api({
    method: 'POST',
    url: BROADCAST.CHECK_MUSIC,
    data,
  })
}

/**
 *@description 获取歌曲评论
 * @param { Object } data{id: '186016'} 歌曲id
 * @returns
 */
export const GetLyric = async data => {
  return await api({
    method: 'POST',
    url: BROADCAST.GET_LYRIC,
    data,
  })
}

/**
 *@description 获取歌曲评论
 * @param { Object } data{id: '186016'} 歌曲id
 * @returns
 */
export const GetComment = async data => {
  return await api({
    method: 'POST',
    url: BROADCAST.GET_COMMENT,
    data,
    //id=186016
  })
}

/**
 *@description 获取歌曲详情
 * @param { Object } data{ids: '186016'} 歌曲id
 * @returns
 */
export const GetSongDetail = async data => {
  return await api({
    method: 'POST',
    url: BROADCAST.SONG_DETAIL,
    data,
    //id=186016
  })
}
