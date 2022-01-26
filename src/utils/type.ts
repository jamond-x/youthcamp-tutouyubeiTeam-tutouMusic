interface album{
  id: number
  name: string
  pic: number
  picUrl: string
  pic_str: string
  tns: []   // 待补充
}

interface artist{
  alia: string[]
  alias: string[]
  id: number
  name: string
  tns: []
}


interface song {
  a: string;  // ?
  al: album;
  alia: [] // 待补充
  ar: artist[]
  cd: string
  cf: string
  copyright: number
  cp: number
  crbt: null
  djId: number
  dt: number
  fee: number
  ftype: number
  h: {br: number, fid: number, size: number, vd: number}
  id: number
  l: {br: number, fid: number, size: number, vd: number}
  m: {br: number, fid: number, size: number, vd: number}
  mark: number
  mst: number
  mv: number
  name: string
  no: number
  noCopyrightRcmd: null
  originCoverType: number
  originSongSimpleData: null
  pop: number
  privilege: {id: 27731176, fee: 8, payed: 0, st: 0, pl: 128000, dl: 0, sp: 7, cp: 1, subp: 1, cs: false,…}
  pst: number
  publishTime: number
  resourceState: true
  rt: string
  rtUrl: null
  rtUrls: []
  rtype: number
  rurl: null
  s_id: number
  single: number
  st: number
  t: number
  v: number
  version: number
}


interface songDetail {
  id: number,

}
