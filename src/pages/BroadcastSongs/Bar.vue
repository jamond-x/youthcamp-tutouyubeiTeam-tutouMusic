<template>
  <div class="bar">
    <div class="song-detail row justify-start items-center">
      <q-img
        class="img q-ml-xl"
        src="https://pic1.zhimg.com/80/v2-83ca68baff4c5c4236f0c0da143b5d00_720w.jpg?source=1940ef5c"
        @click="$emit('toggleBroadcastPage')"
      ></q-img>
      <div class="q-ml-md">
        <div class="song-name">龙卷风</div>
        <div class="singer">周杰伦</div>
      </div>
      <div class="offset-2">爱像一阵风 吹完她就走~</div>
    </div>
    <div class="controller column">
      <div class="row justify-around">
        <q-btn icon="fas fa-step-backward" size="10px" flat rounded />
        <q-btn
          @click="togglePlay"
          v-if="playStatus"
          icon="fas fa-pause-circle"
          size="19px"
          flat
          rounded
        />
        <q-btn v-else @click="togglePlay" icon="fas fa-play-circle" size="19px" flat rounded />
        <q-btn icon="fas fa-step-forward" size="10px" flat rounded />
      </div>
      <q-linear-progress size="sm" :value="progress" color="white" label="Change Model" />
      <audio class="audio" ref="audio" :src="audioUrl"></audio>
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
import { defineComponent, ref, onMounted, watch } from 'vue'
import { throttle } from 'quasar'
// import { useQuasar } from 'quasar'

const playList = [
  'https://cdn.jsdelivr.net/gh/jamond-x/public-resources/mp3/一只小童 - summertime（铃声版）.mp3',
  'https://cdn.jsdelivr.net/gh/jamond-x/public-resources/mp3/小海盗口琴,蓝馍馍 - 个性口琴短信铃声(二).mp3',
  'https://cdn.jsdelivr.net/gh/jamond-x/public-resources/mp3/Various Artists - 海绵宝宝片尾曲.mp3',
]

export default defineComponent({
  name: 'Playlist',
  emits: ['toggleBroadcastPage'],
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
    let songDuration
    let volume = ref()
    let audioUrl = ref()
    let currentTime = ref()
    let progress = ref(0)
    let playStatus = ref(false)
    // TODO: unManned 后手动清楚定时器？
    audioUrl.value = playList[0]
    onMounted(() => {
      let audioObj = new Audio(audio.value.src)
      audioObj.onloadedmetadata = () => {
        // togglePlay = togglePlay_
        songDuration = audio.value.duration
        setInterval(() => {
          if (audio.value.currentTime) {
            currentTime.value = audio.value.currentTime
            progress.value = currentTime.value / songDuration
            playStatus.value = !audio.value.paused
          }
        }, 500)
      }
    })
    //TODO: 缓缓暂停、播放
    const togglePlay = throttle(() => {
      if (audio.value.paused) {
        setTimeout(() => {
          audio.value.play()
        }, 300)
        playStatus.value = true
      } else {
        setTimeout(() => {
          audio.value.pause()
        }, 300)
        playStatus.value = false
      }
    }, 1000)

    watch(
      () => volume.value,
      newVal => {
        audio.value.volume = (100 - newVal) / 100
      }
    )

    return {
      audio,
      togglePlay,
      playStatus,
      progress,
      volume,
      audioUrl,
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
  }
}
</style>
