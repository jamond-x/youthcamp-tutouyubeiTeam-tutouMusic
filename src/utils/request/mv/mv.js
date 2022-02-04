import axios from 'axios'
import { createApi } from '../index'
import { REQUEST_BASE_URL, DISCOVER } from 'src/utils/const'
axios.defaults.withCredentials = true
const api = createApi(
  axios.create({
    baseURL: REQUEST_BASE_URL,
  })
)

export const QueryMv = async (area, type, order, offset, limit = 20) => {
  return await api({
    url: DISCOVER.MV,
    params: {
      area,
      type,
      order,
      offset,
      limit
    }
  })
}