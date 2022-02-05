export const CodeDictionary = {
  SUCCESS: 0,
  PARAMS_ERROR: 98, // 参数错误
  COMMON_ERROR: 99, // 默认错误
  // 待补充
}

export const IS_DEV = process.env.DEV

//请求基本地址
//默认网易云API后端运行在本地 3000 端口
export const REQUEST_BASE_URL = IS_DEV
  ? 'localhost:3000'
  : 'https://netease-cloud-music-api-rho-lemon.vercel.app' // 线上地址

// 接口汇总
// 示例
export const EXAMPLE_URLS = {
  QUERY_SONGS: '/song/url',
  ARTIST_LIST: '/artist/list',
  TEST_URL: '/song/url?id=347230',
  // ....

  ALL_RANK: '/toplist',
  DETAIL_RANK: '/playlist/detail?id=',
  SINGER_LIST: '/artist/list',
}

export const BROADCAST = {
  // SEARCH: '/search ',
  SEARCH: '/cloudsearch ',
  GET_URL: '/song/url',
  CHECK_MUSIC: '/check/music',
  GET_LYRIC: '/lyric',
  GET_COMMENT: '/comment/music',
  SONG_DETAIL: '/song/detail',
}

export const LOGIN_URLS = {
  LIKE_MUSIC_LIST: '/likelist/',
  SONG_DETAIL: '/song/detail',

  REFRESH_LOGIN: '/login/refresh',
  // /captcha/sent?phone=13xxx
  SEND_PHONE_CODE: '/captcha/sent',
  // /captcha/verify?phone=13xxx&captcha=1597
  CHECK_PHONE_CODE: '/captcha/verify',
  // /register/cellphone?phone=13xxx&password=xxxxx&captcha=1234&nickname=binary1345
  REGISTER: '/register/cellphone',
  // /cellphone/existence/check?phone=13xxx
  CHECK_PHONE: '/cellphone/existence/check',
  LOGOUT: '/logout',
  // 获取用户歌单
  // /user/playlist?uid=32953014
  GET_LIKE_LIST_ID: '/user/playlist',
  // limit=10&offset=0等价于limit=10，你会得到第1-10首歌曲
  // 你传入limit=10&offset=1，你会得到第11-20首歌曲
  // /playlist/track/all?id=24381616&limit=10&offset=1
  GET_LIKE_LIST_LIST: '/playlist/track/all',
}
