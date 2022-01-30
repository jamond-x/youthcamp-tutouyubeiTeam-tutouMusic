<template>
  <div class="bar">
    <div v-if="isReady" class="song-detail row justify-start items-center">
      <q-img
        class="img q-ml-xl"
        :src="songsList[currentSongIndex].al.picUrl ? songsList[currentSongIndex].al.picUrl : ''"
        @click="$emit('toggleBroadcastPage')"
      ></q-img>
      <div class="q-ml-md">
        <div class="song-name">{{ songsList[currentSongIndex].name }}</div>
        <div class="singer">{{ singers }}</div>
      </div>
      <div class="album offset-2">{{ songsList[currentSongIndex].al.name }}</div>
    </div>
    <div v-else class="flex flex-center">
      <div>列表暂无播放歌曲~</div>
    </div>
    <div class="controller column">
      <div class="row justify-around q-mt-xs">
        <q-btn
          @click="switchSong(autoplayModeForBtnSwitch + 1)"
          icon="fas fa-step-backward"
          size="10px"
          flat
          rounded
        />
        <q-btn
          @click="togglePlay"
          v-if="playStatus"
          icon="fas fa-pause-circle"
          size="19px"
          flat
          rounded
        />
        <q-btn v-else @click="togglePlay" icon="fas fa-play-circle" size="19px" flat rounded />
        <q-btn
          @click="switchSong(autoplayModeForBtnSwitch)"
          icon="fas fa-step-forward"
          size="10px"
          flat
          rounded
        />
      </div>
      <div class="row">
        <div class="col-1 q-mt-xs">
          {{ currentTime_ === 'NaN:NaN' ? '' : currentTime_ }}
        </div>
        <q-slider
          @update:modelValue="changeProgressBySlide"
          @mouseenter="slidePointThumb = false"
          @mouseleave="slidePointThumb = true"
          thumb-size="15px"
          class="slider-progress col-10 q-px-sm"
          color="white"
          v-model="currentTime"
          :min="0"
          :max="songDuration"
        />
        <div class="col-1 q-mt-xs">
          {{ songDuration_ === 'NaN:NaN' ? '' : songDuration_ }}
        </div>
      </div>
      <audio
        class="audio"
        ref="audio"
        :src="isReady ? songsList[currentSongIndex].songUrl : ''"
      ></audio>
    </div>
    <div class="tools row reverse items-center">
      <q-card class="list-card" v-show="songsListLayerStatus">
        <q-table
          title="播放列表"
          :columns="columns"
          :rows="songListLayer"
          row-key="name"
          dark
          color="amber"
        />
      </q-card>
      <q-btn
        @click="songsListLayerStatus = !songsListLayerStatus"
        icon="fas fa-stream"
        flat
        rounded
        class="q-mr-lg"
      />
      <q-btn :label="autoplayMode_" @click="changMode" flat rounded />
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
import { throttle, Cookies } from 'quasar'
// import { useQuasar } from 'quasar'

import {
  GetSongUrl,
  GetSongDetail,
  Check_Music,
  Search,
  Login,
} from 'src/utils/request/broadcastSong/broadcast'
// TODO: class 的思想抽出方法！
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

const columns = [
  {
    name: 'name',
    required: true,
    label: '歌曲名称',
    align: 'left',
    sortable: true,
  },
  { name: 'singer', align: 'center', label: '歌手', sortable: true },
  { name: 'album', label: '专辑', sortable: true },
]

const songListLayer_ = [
  {
    name: '安静',
    singer: '周杰伦',
    album: 'jay',
  },
  {
    name: '安静',
    singer: '周杰伦',
    album: 'jay',
  },
  {
    name: '安静',
    singer: '周杰伦',
    album: 'jay',
  },
]

export default defineComponent({
  name: 'Bar',
  emits: [
    'toggleBroadcastPage',
    'switchSong',
    'pause',
    'play',
    'updateCurrentTime',
    'updateDuration',
  ],
  props: {
    songListToAudio: {
      type: Array,
    },
    controlPlayStatus: {
      type: Boolean,
    },
    forceToChangeProgress: {
      type: String,
    },
    playMode: {
      //  其他组件指定的播放模式   立即播放、下一首播放
      type: Number,
    },
  },
  components: {},
  setup(props, context) {
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
    let volume = ref(1)
    let songIds = ref('')
    let currentTime = ref()
    let songDuration = ref()
    let playStatus = ref(false)
    let currentSongIndex = ref(0)
    let isReady = ref(false)
    const songsList = reactive(songsList_)
    const songListLayer = ref(songListLayer_)
    let modeListObj = [
      {
        val: 'random',
        next: null,
      },
    ]
    modeListObj.unshift({
      val: 'selfLoop',
      next: modeListObj[0],
    })
    modeListObj.unshift({
      val: 'listLoop',
      next: modeListObj[0],
    })
    modeListObj[2].next = modeListObj[0]
    let autoplayMode = ref(modeListObj[0])

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
          try {
            if (!isUnNull(audio.value.currentTime)) {
              currentTime.value = audio.value.currentTime
              songDuration.value = audio.value.duration
              context.emit('updateCurrentTime', currentTime.value)
              playStatus.value = !audio.value.paused
              if (currentTime.value === songDuration.value) {
                autoSwitchSong(autoplayMode.value.val)
              }
            }
          } catch (err) {
            console.log(err)
            clearTimer()
          }
        }, 100)
        audio.value.play()
        playStatus.value = true
        context.emit('play', songsList[currentSongIndex.value])
      }
    }

    //TODO: 缓缓暂停、播放
    //TODO: 添加键盘控制播放功能
    const togglePlay = throttle(async () => {
      if (audio.value.paused) {
        if (isUnNull(intervalTimer)) {
          if (isUnNull(songsList[currentSongIndex.value].songUrl)) {
            alert('该歌曲没有版权')
            autoSwitchSong(autoplayMode.value.val)
            return
          }
          listenProgress(songsList[currentSongIndex.value].songUrl)
          return
        }
        audio.value.play()
        playStatus.value = true
        context.emit('play', songsList[currentSongIndex.value])
      } else {
        clearTimer()
        audio.value.pause()
        playStatus.value = false
        context.emit('pause', songsList[currentSongIndex.value])
      }
    }, 500)
    /**
     *
     * @param {number} direction   0: 下一首  1: 上一首  2或 3: 随机切换
     */
    const switchSong = direction => {
      clearTimer()
      currentTime.value = 0
      playStatus.value = false
      if (direction === 0) {
        if (currentSongIndex.value === songsList.length - 1) {
          currentSongIndex.value = 0
        } else {
          currentSongIndex.value++
        }
        context.emit('switchSong', songsList[currentSongIndex.value])
        return
      }
      if (direction === 1) {
        if (currentSongIndex.value === 0) {
          currentSongIndex.value = songsList.length - 1
        } else {
          currentSongIndex.value--
        }
        context.emit('switchSong', songsList[currentSongIndex.value])
        return
      }
      if (direction === 2 || direction === 3) {
        let len = songsList.length
        currentSongIndex.value = Math.floor(Math.random() * (len - 1))
        context.emit('switchSong', songsList[currentSongIndex.value])
      }
    }

    const autoSwitchSong = mode => {
      if (mode === 'selfLoop') {
        togglePlay()
        return
      }
      if (mode === 'listLoop') {
        switchSong(0)
        togglePlay()
        return
      }
      if (mode === 'random') {
        switchSong(2)
        togglePlay()
      }
    }

    const changMode = () => {
      autoplayMode.value = autoplayMode.value.next
    }

    const changeProgressBySlide = time => {
      audio.value.currentTime = time
    }

    watch(
      () => volume.value,
      newVal => {
        audio.value.volume = (100 - newVal) / 100
      }
    )

    watch(
      () => props.forceToChangeProgress,
      time => {
        audio.value.currentTime = time
      }
    )

    watch(
      () => props.controlPlayStatus,
      () => {
        togglePlay()
      }
    )

    let singers = computed(() => {
      let singers = ''
      for (let artist of songsList[currentSongIndex.value].ar) {
        singers += `/${artist.name}`
      }
      let temp = singers.split('')
      temp.shift()
      return temp.join('')
    })

    let autoplayMode_ = computed(() => {
      if (autoplayMode.value.val === 'listLoop') {
        return '列表循环'
      }
      if (autoplayMode.value.val === 'selfLoop') {
        return '单曲循环'
      }
      return '随机播放'
    })
    let autoplayModeForBtnSwitch = computed(() => {
      if (autoplayMode.value.val === 'listLoop' || autoplayMode.value.val === 'selfLoop') {
        return 0
      }
      return 2
    })

    let songDuration_ = computed(() => {
      let temp = parseInt(songDuration.value)
      let m = Math.floor(temp / 60)
      let s = temp % 60
      if (m < 10) m = `0${m}`
      if (s < 10) s = `0${s}`
      return `${m}:${s}`
    })

    let currentTime_ = computed(() => {
      let temp = parseInt(currentTime.value)
      let m = Math.floor(temp / 60)
      let s = temp % 60
      if (m < 10) m = `0${m}`
      if (s < 10) s = `0${s}`

      return `${m}:${s}`
    })

    const queryUrls = async id => {
      const { data } = await GetSongUrl({ id })
      if (isUnNull(data)) return
      for (let obj of data) {
        for (let j of songsList) {
          if (obj.id === j.id) {
            j.songUrl = obj.url
          }
        }
      }
      isReady.value = true
    }

    const Search_ = async keywords => {
      /**
       * 从关键词获取歌曲数据
       * 按理说这个歌曲数据应该是直接从其他组件传入
       */
      // songsList.pop()
      // const {
      //   result: { songs },
      // } = await Search({ keywords })
      // console.log(songs)
      // for (let i of songs) {
      //   songsList.push(i)
      // }

      /**
       * 这里暂时将获取的歌曲数据存入localStorage 后续开发时直接从本地读取
       */
      // window.localStorage.setItem('songs2', JSON.stringify(songs))
      // console.log(songsList[currentSongIndex.value].al.picUrl)

      /**
       * 从本地读取
       */
      // songsList.pop()
      // for (let i of JSON.parse(window.localStorage.getItem('songs2'))) {
      //   songsList.push(i)
      // }

      /**
       * 统一获取歌曲的URL
       */
      songsList.forEach(el => {
        songIds.value += `,${el.id}`
      })
      let arr = songIds.value.split('')
      arr.shift()
      songIds.value = arr.join('')
      queryUrls(songIds.value)
    }
    // Search_('李荣浩')
    // TODO: 播放列表

    const handleNextSong = () => {}

    //songsList.pop() // 删除第一个占位元素
    /**
     *
     * @param {string} mode   0: 立即播放列表新歌  2: 下一首播放  3: 添加至播放列表末尾   4:  列表
     */
    const init = async mode => {
      if (isUnNull(props.songListToAudio)) return
      let ids = ''
      if (mode === 0) {
        ids = props.songListToAudio[0]
        // 直接解构会报错！？？
        let res = await GetSongDetail({ ids })
        const { songs } = res
        // if (isUnNull(songs)) return
        for (let obj of songs) {
          songsList.unshift(obj)
        }
        songIds.value = ''
        songIds.value = songsList[0].id.toString()
      }
      if (mode === 1) {
        for (let id of props.songListToAudio) {
          ids += `,${id}`
        }
        ids = ids.split('').splice(1).join('')
        let res = await GetSongDetail({ ids })
        let { songs } = res
        songsList.length = 0
        for (let obj of songs) {
          songsList.push(obj)
        }
        songIds.value = ''
        songsList.forEach((el, index) => {
          if (index === 0) {
            songIds.value += `${el.id}`
          } else {
            songIds.value += `,${el.id}`
          }
        })
      }
      if (mode === 2) {
        ids = props.songListToAudio[1]
        let res = await GetSongDetail({ ids })
        const { songs } = res
        // if (isUnNull(songs)) return
        for (let obj of songs) {
          songsList.splice(1, 0, obj)
        }
        songIds.value = ''
        songIds.value = songsList[1].id.toString()
      }
      if (mode === 3) {
        ids = props.songListToAudio[props.songListToAudio.length - 1]
        let res = await GetSongDetail({ ids })
        const { songs } = res
        // if (isUnNull(songs)) return
        for (let obj of songs) {
          songsList.push(obj)
        }
        songIds.value = ''
        songIds.value = songsList[songsList.length - 1].id.toString()
      }

      isReady.value = true
      currentSongIndex.value = 0
      // songsList.pop()

      /**
       * 统一获取歌曲的URL
       */
      await queryUrls(songIds.value)
      if (mode === 2 || mode === 3) {
        return
      }
      if (audio.value.paused) {
        togglePlay()
      } else {
        togglePlay()
        togglePlay()
      }
    }
    // init()
    watch(
      () => props.songListToAudio,
      newVal => {
        init(props.playMode)
      },
      {
        deep: true,
      }
    )
    return {
      audio,
      togglePlay,
      playStatus,
      volume,
      songsListLayerStatus: ref(false),
      songsList,
      currentSongIndex,
      songDuration_,
      songDuration,
      currentTime_,
      currentTime,
      singers,
      isReady,
      autoplayMode_,
      autoplayModeForBtnSwitch,
      changMode,
      switchSong,
      changeProgressBySlide,
      columns,
      songListLayer,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.bar {
  // background-color: #2c1919;

  position: relative;
  width: 100%;
  height: 70px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  .song-detail {
    .pointer {
      cursor: pointer;
      max-width: 170px;
      user-select: none;
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
      @extend .pointer;
    }
  }

  .tools {
    .list-card {
      width: 400px;
      height: 350px;
      position: fixed;
      bottom: 50px;
      right: 10px;
    }
  }
}
</style>
