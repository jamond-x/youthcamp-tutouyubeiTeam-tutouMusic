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
        <router-link
          :class="['singer', $q.dark.isActive ? 'text-white' : 'text-black']"
          @click="$emit('closePop')"
          :to="`/artist/${artist.id}`"
          v-for="(artist, index) in songsList[currentSongIndex].ar"
          :key="index"
          tag="span"
          >{{ index >= 1 ? `/${artist.name}` : artist.name }}
        </router-link>
      </div>
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
          :color="sliderColor"
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
        <q-markup-table separator="horizontal" flat bordered>
          <div class="font-weight-sm q-ml-xl q-mt-lg q-mb-sm">播放列表</div>
          <div v-if="!isUnNull(songsList)" class="column items-center">
            <li
              v-for="(item, index) in songsList"
              :key="index"
              class="cursor__pointer song-list__line font-weight-sm q-mt-sm"
              @click="$emit('priorBSSong', item)"
            >
              <q-icon
                class="song__active"
                :class="{ 'animation-pause': !playStatus }"
                v-if="item.id === songsList[currentSongIndex].id"
                name="fas fa-music"
              ></q-icon>
              <span class="cell">{{ item.name }}</span>
              <span class="cell" style="opacity: 0.7">
                {{ item.ar.length === 1 ? item.ar[0].name : `${item.ar[0].name}...` }}
              </span>
              <span class="cell" style="opacity: 0.7">
                {{ item.al.name }}
              </span>
            </li>
          </div>
          <div v-else>
            <tr v-for="item in 5" :key="item">
              <q-skeleton type="QSlider" />
            </tr>
          </div>
        </q-markup-table>
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
        :color="qKnobColor"
        :track-color="qKnobTrackColor"
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
import { useQuasar } from 'quasar'
import { GetSongUrl, GetSongDetail } from 'src/utils/request/broadcastSong/broadcast'
import { isUnNull } from 'src/utils'

let hello = {
  al: {
    id: 18905,
    name: '享受这一刻',
    picUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a6335c643c5ea801203d2250753c.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645283402&t=cbda9c0a58289845c521f96121138dd6',
    tns: Array(0),
    pic_str: '109951165566379710',
  },
  ar: [{ id: 6452, name: 'TT君', tns: [], alias: [] }],
  id: 186016,
  mv: 504177,
  name: 'HELLO!',
}

let songsList_ = [hello]

export default defineComponent({
  name: 'Bar',
  emits: [
    'toggleBroadcastPage',
    'closePop',
    'switchSong',
    'pause',
    'play',
    'updateCurrentTime',
    'updateDuration',
    'priorBSSong',
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
    const audio = ref()
    let volume = ref(0)
    let songIds = ref('')
    let currentTime = ref(0)
    let songDuration = ref()
    let playStatus = ref(false)
    let currentSongIndex = ref(0)
    let isReady = ref(false)
    const songsList = reactive(songsList_)
    let $q = useQuasar()
    let intervalTimer
    let ajaxBar = ref(null)

    let clearTimer = () => {
      clearInterval(intervalTimer)
      intervalTimer = null
    }

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
            clearTimer(intervalTimer)
          }
        }, 100)
        audio.value.play()
        playStatus.value = true
        context.emit('play', songsList[currentSongIndex.value])
      }
    }

    //TODO: 缓缓暂停、播放
    const togglePlay = throttle(async () => {
      if (audio.value.paused) {
        if (isUnNull(intervalTimer)) {
          if (isUnNull(songsList[currentSongIndex.value].songUrl)) {
            $q.notify({
              message: '资源链接无效(该歌曲没有版权或者需要登录)',
              timeout: 2000,
              position: 'top',
            })
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
      const { data } = await GetSongUrl(id)
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

    // TODO: 播放列表
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
        let res = await GetSongDetail({ ids })
        const { songs } = res
        // if (isUnNull(songs)) return
        for (let obj of songs) {
          songsList.unshift(obj)
        }
        songIds.value = ''
        songIds.value = songsList[0].id.toString()
      }
      if (mode === 1 || mode === 4) {
        for (let id of props.songListToAudio) {
          ids += `,${id}`
        }
        ids = ids.split('').splice(1).join('')
        let res = await GetSongDetail({ ids })
        let { songs } = res
        if (mode === 1) {
          songsList.length = 0
        }
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

      //删去多余id
      for (let i = 0; i < props.songListToAudio.length; i++) {
        if (songsList[i].id != props.songListToAudio[i]) {
          songsList.splice(i, 1)
        }
      }

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
      () => {
        init(props.playMode)
      },
      {
        deep: true,
      }
    )
    // 直接在template中 $q.dark.isActive ? 'white' : 'black' 就好  但是给出一堆warn
    // 所以才有以下笨方法
    let sliderColor = ref($q.dark.isActive ? 'white' : 'black')
    let qKnobColor = ref($q.dark.isActive ? 'teal' : 'white')
    let qKnobTrackColor = ref($q.dark.isActive ? 'grey-3' : 'black')
    watch(
      () => $q.dark.isActive,
      newVal => {
        if (newVal) {
          sliderColor.value = 'white'
          qKnobColor.value = 'teal'
          qKnobTrackColor.value = 'grey-3'
          return
        }
        sliderColor.value = 'black'
        qKnobColor.value = 'white'
        qKnobTrackColor.value = 'black'
      }
    )
    return {
      $q,
      audio,
      togglePlay,
      isUnNull,
      playStatus,
      volume,
      songsListLayerStatus: ref(false),
      songsList,
      currentSongIndex,
      songDuration_,
      songDuration,
      currentTime_,
      currentTime,
      isReady,
      autoplayMode_,
      autoplayModeForBtnSwitch,
      changMode,
      switchSong,
      changeProgressBySlide,
      sliderColor,
      qKnobColor,
      qKnobTrackColor,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
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
      // max-width: 220px;
      user-select: none;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
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
      text-decoration: none;
      display: inline;
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
      height: 350px;
      width: 430px;
      overflow: scroll;
      position: fixed;
      bottom: 90px;
      right: 10px;
      .song-list__line {
        position: relative;
        width: 350px;
        list-style: none;
        font-size: 13px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
      }
      .cell {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
      }
      .song__active {
        position: absolute;
        left: -17px;
        top: 3px;
        animation: pointer 1s infinite;
      }
      @keyframes pointer {
        0% {
          transform: scale(0.8);
        }
        50% {
          transform: scale(1);
        }
        100% {
          transform: scale(0.8);
        }
      }

      .animation-pause {
        animation-play-state: paused;
      }
    }
  }
}
</style>
