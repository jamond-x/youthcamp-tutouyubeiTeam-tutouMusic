<template>
  <div class="bar">
    <div class="song-detail row justify-start items-center">
      <q-img
        class="img q-ml-xl"
        :src="songsList[currentSongIndex].al.picUrl"
        @click="$emit('toggleBroadcastPage')"
      ></q-img>
      <div class="q-ml-md">
        <div class="song-name">{{ songsList[currentSongIndex].name }}</div>
        <div class="singer">{{ singers }}</div>
      </div>
      <div class="album offset-2">{{ songsList[currentSongIndex].al.name }}</div>
    </div>
    <div class="controller column">
      <div class="row justify-around">
        <q-btn @click="switchSong(false)" icon="fas fa-step-backward" size="10px" flat rounded />
        <q-btn
          @click="togglePlay"
          v-if="playStatus"
          icon="fas fa-pause-circle"
          size="19px"
          flat
          rounded
        />
        <q-btn v-else @click="togglePlay" icon="fas fa-play-circle" size="19px" flat rounded />
        <q-btn @click="switchSong(true)" icon="fas fa-step-forward" size="10px" flat rounded />
      </div>
      <q-linear-progress size="sm" :value="progress" color="white" label="Change Model" />
      <audio class="audio" ref="audio" :src="songsList[currentSongIndex].songUrl"></audio>
    </div>
    <div class="tools row reverse items-center">
      <q-btn icon="fas fa-stream" flat rounded class="q-mr-lg" />
      <q-knob
        show-value
        font-size="12px"
        v-model="volume"
        size="30px"
        :thickness="0.3"
        color="teal"
        track-color="grey-3"
        class="q-mr-md"
      >
        <q-icon name="volume_up" />
      </q-knob>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch, computed } from 'vue'
import { throttle } from 'quasar'
// import { useQuasar } from 'quasar'

import {
  GetSongUrl,
  GetSongDetail,
  Check_Music,
  Search,
} from 'src/utils/request/broadcastSong/broadcast'

import { isUnNull } from 'src/utils'

let hello = {
  al: {
    id: 18905,
    name: 'Hey，尽情享受音乐吧',
    picUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a6335c643c5ea801203d2250753c.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645283402&t=cbda9c0a58289845c521f96121138dd6',
    tns: Array(0),
    pic_str: '109951165566379710',
  },
  ar: [{ id: 6452, name: 'TT君', tns: [], alias: [] }],
  id: 186016,

  mv: 504177,
  name: 'HELLO!',
  no: 1,
  publishTime: 1059580800000,
}

let songsList_ = [hello]

export default defineComponent({
  name: 'Bar',
  emits: ['toggleBroadcastPage'],
  props: {},
  components: {},
  setup() {
    // let $q = useQuasar()
    // let togglePlay = () => {
    //   $q.notify({
    //     spinner: true,
    //     message: '歌曲加载中...',
    //     timeout: 2000,
    //   })
    // }
    //TODO: $q is not a function
    const audio = ref()
    let songsList = reactive(songsList_)
    let volume = ref()
    let songIds = ref('')
    let currentTime = ref()
    let progress = ref(0)
    let playStatus = ref(false)
    let currentSongIndex = ref(0)
    // TODO: 手动清除定时器？
    let intervalTimer

    let clearTimer = () => {
      clearInterval(intervalTimer)
      intervalTimer = null
    }

    const listenProgress = url => {
      let audioObj = new Audio(url)
      audioObj.onloadedmetadata = () => {
        audioObj = null
        intervalTimer = setInterval(() => {
          if (!isUnNull(audio.value.currentTime)) {
            currentTime.value = audio.value.currentTime
            progress.value = currentTime.value / audio.value.duration
            playStatus.value = !audio.value.paused
          }
        }, 500)
        audio.value.play()
        playStatus.value = true
      }
    }

    const queryUrls = async id => {
      const { data } = await GetSongUrl({ id })
      for (let obj of data) {
        for (let j of songsList) {
          if (obj.id === j.id) {
            j.songUrl = obj.url
          }
        }
      }
    }

    //TODO: 缓缓暂停、播放
    const togglePlay = throttle(async () => {
      if (audio.value.paused) {
        if (isUnNull(intervalTimer)) {
          // TODO: 多层对象解构
          if (isUnNull(songsList[currentSongIndex.value].songUrl)) {
            alert('歌曲没有版权')
            return
          }
          listenProgress(songsList[currentSongIndex.value].songUrl)
          return
        }
        audio.value.play()
        playStatus.value = true
      } else {
        audio.value.pause()
        playStatus.value = false
      }
    }, 500)

    const switchSong = direction => {
      clearTimer()
      currentTime.value = 0
      progress.value = 0
      playStatus.value = false
      if (direction) {
        if (currentSongIndex.value === songsList.length - 1) {
          currentSongIndex.value = 0
          return
        }
        currentSongIndex.value++
        return
      }
      if (currentSongIndex.value === 0) {
        currentSongIndex.value = songsList.length - 1
        return
      }
      currentSongIndex.value--
    }

    watch(
      () => volume.value,
      newVal => {
        audio.value.volume = (100 - newVal) / 100
      }
    )

    let singers = computed(() => {
      let singers = ''
      for (let artist of songsList[currentSongIndex.value].ar) {
        singers += ` ${artist.name}`
      }
      return singers
    })

    // const getSongDetail = async ids => {
    //   let res = await GetSongDetail({ ids })
    //   console.log(res)
    //   // window.localStorage.setItem('songInfo', JSON.stringify(res.songs))
    //   return res
    // }
    // getSongDetail('186016')

    // const Check_Music_ = async id => {
    //   console.log(await Check_Music({ id }))
    // }

    // Check_Music_('347230')
    const Search_ = async keywords => {
      // const {
      //   result: { songs },
      // } = await Search({ keywords })
      // songsList = songs
      // console.log(songs)
      // window.localStorage.setItem('songs', JSON.stringify(songs))
      // console.log(songsList[currentSongIndex.value].al.picUrl)
      songsList.pop()
      for (let i of JSON.parse(window.localStorage.getItem('songs'))) {
        songsList.push(i)
      }
      songsList.forEach(el => {
        songIds.value += `,${el.id}`
      })
      let arr = songIds.value.split('')
      arr.shift()
      songIds.value = arr.join('')
      queryUrls(songIds.value)
    }
    setTimeout(() => {
      Search_('泰勒')
    }, 2000)

    return {
      audio,
      togglePlay,
      playStatus,
      progress,
      volume,
      songsList,
      currentSongIndex,
      singers,
      switchSong,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.bar {
  background-color: #2c1919;
  position: relative;
  width: 100%;
  height: 70px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  .song-detail {
    .pointer {
      cursor: pointer;
    }
    .img {
      width: 50px;
      height: 50px;
      border: solid 1px white;
      position: relative;
      @extend .pointer;
    }
    .img:hover {
      opacity: 0.4;
    }
    .song-name {
      @include custom-font(16px, 600, 1px, inherit);
      @extend .pointer;
    }
    .singer {
      @include custom-font(15px, 100, 1px, inherit);
      @extend .pointer;
    }
    .album {
      @include custom-font(17px, 900, 1px, inherit);
    }
  }
}
</style>
