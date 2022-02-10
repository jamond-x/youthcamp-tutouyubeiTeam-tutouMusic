import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL, DISCOVER } from 'src/utils/const'
axios.defaults.withCredentials = true
const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

export const QueryMvPlay = async (id, r) => {
  return await api({
    url: DISCOVER.MV_PLAY,
    params: {
      id,
      r: r ? r : null,
    },
  })
}

export const QueryMvDetail = async mvid => {
  return await api({
    url: DISCOVER.MV_DERAIl,
    params: {
      mvid,
    },
  })
}

export const QuerySongerCover = async id => {
  return await api({
    url: DISCOVER.SONGER_DERAIl,
    params: {
      id,
    },
  })
}

export const QueryMVInfo = async mvid => {
  return await api({
    url: DISCOVER.MV_INFO,
    params: {
      mvid,
    },
  })
}

export const QueryMVLikes = async mvid => {
  return await api({
    url: DISCOVER.MV_LIKES,
    params: {
      mvid,
    },
  })
}
