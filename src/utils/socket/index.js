import { io } from 'socket.io-client'

const URL = 'http://localhost:3010'
const socket = io(URL, { autoConnect: false })
// const socket = io(URL)

// socket.onAny((event, ...args) => {
//   console.log(event, args)
// })

socket.on('connection', () => {
  console.log('成功连接！！')
})

export default socket
