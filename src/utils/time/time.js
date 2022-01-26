import dayjs from 'dayjs'

export const formatDate = timeStamp => {
  return dayjs(timeStamp).format('YYYY年MM月DD日 HH点')
}
