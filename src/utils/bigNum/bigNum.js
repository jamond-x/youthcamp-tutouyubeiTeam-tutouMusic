export const numFormat = num => {
  const params = {}
  const k = 10 ** 4
  const sizes = ['', '万', '亿']
  const res = Math.floor(Math.log(num) / Math.log(k))
  params.num = (num / k ** res).toFixed(2)
  params.unit = sizes[res]

  return Number.parseInt(params.num) + params.unit
}
