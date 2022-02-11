<template>
  <q-page class="room_main">
    <div class="song">
      <div class="song__info">
        <div>{{ room.name }}</div>
        <div>{{ room.info }}</div>
        <q-toggle v-model="randomMode" icon="alarm" />
        <q-btn @click="changeSong">换歌曲</q-btn>
      </div>
      <div class="song__control row justify-center">
        <div class="box row">
          <q-btn
            @click="play, emitPlay"
            v-if="audioStatus"
            icon="fas fa-pause-circle"
            size="19px"
            color="white"
            flat
            rounded
          />
          <q-btn
            v-else
            color="white"
            @click="play, emitPlay"
            icon="fas fa-play-circle"
            size="19px"
            flat
            rounded
          />
          <audio class="audio" id="audio" ref="audio" :src="songUrl"></audio>
        </div>
      </div>
    </div>
    <div class="chat column">
      <div class="header q-mt-lg">实时聊天</div>
      <div class="msg-box">
        <q-chat-message label="Sunday, 19th" />
        <q-chat-message
          :name="msg.name"
          :avatar="msg.avatar"
          :text="msg.text"
          :sent="msg.sent"
          :stamp="msg.stamp"
          v-for="(msg, index) in groupMsg"
          :key="index"
        />
      </div>
      <div class="input__msg row justify-start">
        <q-input
          class="col-6"
          v-model="msgBeEdited"
          filled
          clearable
          autogrow
          color="green-8"
          label="编辑文本内容"
          hint="编辑你想说的话发送至聊天框"
        />
        <div class="col-2 row justify-center items-start">
          <q-btn class="" size="12px" @click="sendMsgToRoom">发送</q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { PersonalFM, GetSongUrl } from 'src/utils/request/broadcastSong/broadcast'
import socket from 'src/utils/socket'
import { debounce } from 'quasar'
export default defineComponent({
  name: 'Rooms',
  components: {},
  props: {
    id: {
      type: String,
    },
  },
  setup() {
    let store = useStore()
    let $q = useQuasar()
    let room = ref()
    let randomMode = ref(true)
    let songList = ref([])
    let index = ref(0)
    let audio = ref()
    let audioStatus = ref(false)
    let songUrl = ref(
      'http://m802.music.126.net/20220211111525/f08a2fd1000f50c70436c03871fa07bd/jd-musicrep-ts/2b0b/7518/b00b/c12262b95a19dc3019fe28774c154194.mp3'
    ) // id  	128012
    room.value = store.state.currentRoom

    socket.on('change song', newRoom => {
      console.log('触发change song事件')
      room.value = newRoom
      songUrl.value = newRoom.song.url
      playOnReady(newRoom.song.url)
      $q.notify({
        message: '歌曲加载中',
        color: 'warning',
        position: 'top',
      })
    })

    socket.on('play', () => {
      play()
    })

    socket.on('update song progress', msg => {
      console.log(msg)
    })

    const playOnReady = url => {
      let au = new Audio(url)
      au.onload = () => {
        audio.value.play()
      }
    }

    const randomSong = async () => {
      const { data } = await PersonalFM()
      songList.value = data
      let id = ''
      songList.value.forEach((el, index) => {
        if (index === 0) {
          id += el.id
        } else {
          id += `,${el.id}`
        }
      })

      const res = await GetSongUrl(id)
      for (let i = 0; i < res.data.length; i++) {
        for (let k = 0; k < songList.value.length; k++) {
          if (res.data[i].id === songList.value[k].id) {
            songList.value[k].url = res.data[i].url
          }
        }
      }
      songUrl.value = songList.value[index.value].url
    }

    const togglePlay = async () => {
      if (audioStatus.value) {
        audio.value.pause()
        audioStatus.value = false
      } else {
        audio.value.play()
        audioStatus.value = true
      }
    }

    const play = () => {
      console.log(songUrl.value)
      let temp = document.getElementById('audio')
      temp.play()
      console.log(temp)
      console.log(temp.pause)
      // audio.value.play()
      if (!audio.value.pause) {
        audioStatus.value = true
      }
    }

    const emitPlay = () => {
      socket.emit('play', { roomId: room.value.id })
    }

    const pause = () => {
      audio.value.pause()
      if (audio.value.pause) {
        audioStatus.value = false
      }
    }

    const emitPause = () => {
      socket.emit('pause', { roomId: room.value.id })
    }

    const emitChangeSong = (url, songId) => {
      socket.emit('change song', { room: room.value, url, songId })
    }

    const changeSong = () => {
      songUrl.value =
        'http://m802.music.126.net/20220211111731/bf33382abe1304376868453349c12b3e/jd-musicrep-ts/7c1c/9218/d72d/70f9c13bee0233692c6d914f67b1adc4.mp3'
      emitChangeSong(songUrl.value, '1830419924')
    }

    // -----------------------------------------------------
    let temp = [
      {
        name: '我',
        avatar:
          'https://cdn.jsdelivr.net/gh/jamond-x/public-resources/Avatar/Avatar-Maker%20(1).png',
        text: ['嘿嘿，你好啊'],
        sent: true,
        stamp: '刚刚',
      },
      {
        name: '我',
        avatar:
          'https://cdn.jsdelivr.net/gh/jamond-x/public-resources/Avatar/Avatar-Maker%20(1).png',
        text: ['哈哈哈很幽默啊你今天'],
        sent: false,
        stamp: '刚刚',
      },
      {
        name: '我',
        avatar:
          'https://cdn.jsdelivr.net/gh/jamond-x/public-resources/Avatar/Avatar-Maker%20(1).png',
        text: ['嘿嘿'],
        sent: true,
        stamp: '刚刚',
      },
    ]
    let groupMsg = ref([])
    let msgBeEdited = ref('')

    onUnmounted(() => {
      socket.emit('leave room', room.value.id)
    })

    socket.on('joined', msg => {
      console.log(msg)
    })

    socket.on('group msg', msg => {
      if (msg.id === socket.id) {
        // msg.name = '我'
        msg.sent = true
      } else {
        // msg.name += `用户${msg.name}`
        msg.sent = false
      }
      groupMsg.value.push(msg)
    })

    const sendMsgToRoomCallback = () => {
      socket.emit('to room', {
        roomId: room.value.id,
        eventType: 'group msg',
        msg: {
          id: socket.id,
          name: socket.id,
          avatar:
            'https://cdn.jsdelivr.net/gh/jamond-x/public-resources/Avatar/Avatar-Maker%20(1).png',
          text: [msgBeEdited.value],
          sent: false,
          stamp: '刚刚',
        },
      })
      msgBeEdited.value = ''
    }

    const sendMsgToRoom = debounce(sendMsgToRoomCallback, 1000)

    return {
      audio,
      room,
      randomMode,
      songUrl,
      audioStatus,
      groupMsg,
      msgBeEdited,
      togglePlay,
      changeSong,
      emitPlay,
      play,
      pause,
      emitPause,
      sendMsgToRoom,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';

.room_main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  .song {
    display: grid;
    grid-template-rows: 6fr 1fr;
    .song__control {
      max-width: 350px;
      .box {
        height: 75px;
        width: 90%;
        background-color: #1e3264;
        border-radius: 20px;
        .audio {
          width: 250px;
          height: 80px;
        }
      }
    }
  }
  .chat {
    position: relative;
    .header {
      @include custom-font(28px, 900, inherit, inherit);
    }
    .msg-box {
      max-width: 450px;
      max-height: 470px;
      overflow-y: scroll;
    }
    .input__msg {
      width: 130%;
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
  }
}
</style>
