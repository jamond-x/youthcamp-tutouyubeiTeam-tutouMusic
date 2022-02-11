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
  ? 'http://localhost:3000'
  : 'https://netease-cloud-music-api-rho-lemon.vercel.app' // 线上地址

// export const REQUEST_BASE_URL = 'https://netease-cloud-music-api-rho-lemon.vercel.app' // 线上地址

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

export const DISCOVER = {
  MV: '/mv/all',
  MV_PLAY: '/mv/url',
  MV_DERAIl: '/mv/detail',
  SONGER_DERAIl: '/artist/detail',
  MV_INFO: '/mv/detail/info',
  MV_LIKES: '/simi/mv',
}
