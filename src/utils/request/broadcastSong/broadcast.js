import axios from 'axios'
import { createApi } from '..'
import { REQUEST_BASE_URL, BROADCAST } from 'src/utils/const'

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

// 有的需要cookie 有的不需要 带上反而会报错？
let { cookie } = JSON.parse(window.localStorage.getItem('user'))

/**
 *@description 搜索
 * @param { Object } data{keywords: '关键词'}
 * @returns
 */
export const Search = async data => {
  return await api({
    method: 'POST',
    url: BROADCAST.SEARCH,
    // `${BROADCAST.SEARCH}?timestamp=${new Date().getTime()}`
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
 *@description 查询歌曲是否可用
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
 *@description 获取歌曲歌词
 * @param { Object } data{id: '186016'} 歌曲id
 * @returns
 */
export const GetLyric = async data => {
  return await api({
    method: 'POST',
    url: `${BROADCAST.GET_LYRIC}?timestamp=${new Date().getTime()}`,
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
    url: `${BROADCAST.GET_COMMENT}?timestamp=${new Date().getTime()}`,
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
    url: `${BROADCAST.SONG_DETAIL}?timestamp=${new Date().getTime()}`,
    data,
    //id=186016
  })
}

export const Login = async data => {
  return await api({
    method: 'POST',
    url: '/login/cellphone',
    data,
  })
}

export const Logout = async () => {
  return await api({
    method: 'POST',
    url: '/logout',
  })
}

export const LoginStatus = async () => {
  return await api({
    method: 'POST',
    url: `/login/status`,
    data,
  })
}

export const UserDetail = async data => {
  return await api({
    method: 'POST',
    url: '/user/detail',
    data,
  })
}

/**
 *
 * @param {Number} id  资源 id, 如歌曲 id,mv id
 * @param {Number} cid  评论 id
 * @param {Number} t 是否点赞 , 1 为点赞 ,0 为取消点赞
 * @param {Number} type 数字 , 资源类型 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 * @returns
 */
export const LikeComment = async (id, cid, t, type) => {
  return await api({
    method: 'POST',
    url: `/comment/like?timestamp=${new Date().getTime()}`,
    data: {
      id,
      cid,
      t,
      type,
    },
  })
}
