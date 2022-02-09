import axios from 'axios'
import { createApi } from '..'
import { REQUEST_BASE_URL, BROADCAST } from 'src/utils/const'
import { isUnNull } from 'src/utils'

let cookie = window.localStorage.getItem('cookie')
if (isUnNull(cookie)) {
  cookie = ''
}

const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

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
export const GetSongUrl = async id => {
  return await api({
    method: 'POST',
    url: `${BROADCAST.GET_URL}?timestamp=${new Date().getTime()}`,
    data: {
      id,
      cookie,
    },
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
 * @param { String } id: '186016' 歌曲id
 * @param { String } limit: 评论数量
 * @returns
 */
export const GetComment = async (id, limit) => {
  return await api({
    method: 'POST',
    url: `${BROADCAST.GET_COMMENT}?timestamp=${new Date().getTime()}`,
    data: {
      id,
      cookie,
      limit,
    },
  })
}

/**
 *@description 获取歌曲热门评论
 * @param { String } id: '186016' 歌曲id
 * @param { Number } type: 0: 歌曲
    1: mv
    2: 歌单
    3: 专辑
    4: 电台
    5: 视频
 * @param { String } limit: 评论数量
 * @returns
 */
export const GetHotComment = async (id, type, limit) => {
  return await api({
    method: 'POST',
    url: `/comment/hot?timestamp=${new Date().getTime()}`,
    data: {
      id,
      type,
      limit,
      cookie,
    },
  })
}

/**
 *
 * @param {String} t  1 发送, 2 回复
 * @param {String} type 0: 歌曲  1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频
 * @param {String} id 对应资源 id
 * @param {String} content  要发送的内容
 * @param {String} commentId  回复的评论 id (回复评论时必填)
 * @returns
 */
export const SendComment = async (t, type, id, content, commentId, replyCommentId) => {
  return await api({
    method: 'POST',
    url: `/comment?timestamp=${new Date().getTime()}`,
    data: {
      t,
      type,
      id,
      content,
      commentId,
      replyCommentId,
      cookie,
    },
  })
}
/**
 *@description 获取歌曲详情
 * @param { String } {ids: '186016'} 歌曲id  支持多个 id, 用 , 隔开
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
      cookie,
    },
  })
}

/**
 * 获取相似歌曲
 * @param {String} id
 * @returns
 */
export const SimilarSongs = async id => {
  return api({
    method: 'POST',
    url: `/simi/song?timestamp=${new Date().getTime()}`,
    data: {
      id,
    },
  })
}

/**
 * 获取相似歌单
 * @param {String} id
 * @returns
 */
export const SimilarPlaylists = async id => {
  return api({
    method: 'POST',
    url: `/simi/playlist?timestamp=${new Date().getTime()}`,
    data: {
      id,
    },
  })
}

/**
 * FM
 * @returns
 */
export const PersonalFM = () => {
  return api({
    method: 'POST',
    url: `/personal_fm?timestamp=${new Date().getTime()}`,
    data: {
      cookie,
    },
  })
}
