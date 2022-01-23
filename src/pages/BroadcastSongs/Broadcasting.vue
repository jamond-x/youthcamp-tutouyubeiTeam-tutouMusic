<template>
  <div class="broadcast-container">
    <div class="header">
      <div class="column items-center">
        <div class="q-mt-md">{{ songDetail.name }}</div>
        <div>{{ singers }}</div>
      </div>
      <div class="row reverse items-center">
        <q-btn class="q-mr-xl" icon="fas fa-angle-down" v-close-popup flat round />
      </div>
    </div>
    <div class="lyric flex flex-center">
      <ul class="q-mt-xl q-mr-xl" id="lyricBar">
        <li
          class="piece q-ma-md"
          v-for="(item, index) in lyricWithAnchor"
          :key="index"
          :class="[item.anchor, item.anchor === activeEl ? 'active' : '']"
          @mouseenter="item.switchBtn = true"
          @mouseleave="item.switchBtn = false"
        >
          {{ item.val }}
          <span v-show="item.switchBtn" class="play-icon" @click="changeProgress(item.anchor)"
            >&#9658;</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { GetLyric, GetSongDetail } from 'src/utils/request/broadcastSong/broadcast'
import { isUnNull } from 'src/utils'
import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll

export default defineComponent({
  name: 'Broadcasting',
  props: {
    playStatus: {
      type: Boolean,
      required: true,
    },
    songId: {
      type: Number,
      required: true,
    },
    songDetail: {
      type: Object,
      required: true,
    },
    songCurrentTime: {
      type: Number,
      required: true,
    },
  },
  emits: ['changeProgress'],
  components: {},
  setup(props, context) {
    let lyric_ = ref()
    let lyricWithAnchor = ref([])
    let lyricMap = new Map()
    let lyricIndexMap = new Map()
    let activeEl = ref()

    const scrollTo = el => {
      let container = document.getElementById('lyricBar')
      let totalHeight = container.scrollHeight
      let index = lyricIndexMap.get(el)
      index -= 5
      let position = (index / lyricWithAnchor.value.length) * totalHeight
      setVerticalScrollPosition(container, position, 1000)
    }

    const changeProgress = anchor => {
      activeEl.value = anchor
      scrollTo(anchor)
      context.emit('changeProgress', anchor.split('').splice(1).join(''))
    }

    let singers = computed(() => {
      if (isUnNull(props.songDetail)) {
        return ''
      }
      let singers = ''
      for (let artist of props.songDetail.ar) {
        singers += `/${artist.name}`
      }
      let temp = singers.split('')
      temp.shift()
      return temp.join('')
    })

    const initLyric = () => {
      lyricMap = new Map()
      lyricIndexMap = new Map()
      lyricWithAnchor.value = []
      lyric_.value = lyric_.value.split('\n')
      let tempIndex = 0
      lyric_.value = lyric_.value.map(el => {
        let temp = el.split('').splice(11).join('')
        let min = el.split('').splice(2, 1).join('')
        let s = el.split('').splice(4, 2).join('')
        s = parseInt(min) * 60 + parseInt(s)
        lyricMap.set(`t${s}`, temp)
        lyricIndexMap.set(`t${s}`, tempIndex)
        lyricWithAnchor.value.push({
          anchor: `t${s}`,
          val: temp,
          index: tempIndex++,
          switchBtn: false,
        })
        return temp
      })
    }

    // const getSongDetail = id => {
    //   GetSongDetail({ids})
    // }

    const GetLyric_ = async id => {
      if (isUnNull(id)) {
        console.log('播放列表为空')
      }
      // window.localStorage.setItem('lyric', JSON.stringify(await GetLyric({ id })))
      if (isUnNull(JSON.parse(window.localStorage.getItem(id)))) {
        const {
          lrc: { lyric },
        } = await GetLyric({ id })
        if (isUnNull(lyric)) {
          console.log('获取歌词失败')
          return
        }
        lyric_.value = lyric
        window.localStorage.setItem(id, JSON.stringify(lyric_.value))
      } else {
        lyric_.value = JSON.parse(window.localStorage.getItem(id))
      }
      initLyric()
    }

    const beforeGetLyric = () => {
      if (!isUnNull(props.songId)) {
        GetLyric_(props.songId)
      }
      GetLyric_(props.songDetail.id)
    }

    onMounted(() => {
      beforeGetLyric()
    })

    watch(
      () => props.songCurrentTime,
      time => {
        if (lyricMap.has(`t${time}`)) {
          activeEl.value = `t${time}`
          scrollTo(`t${time}`)
        }
      }
    )
    watch(
      () => props.songId,
      newVal => {
        console.log('检测到songId 改变')
        console.log('新值：' + newVal)
        GetLyric_(newVal)
      }
    )

    return {
      singers,
      lyric_,
      lyricWithAnchor,
      activeEl,
      changeProgress,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.flip-list-move {
  transition: transform 0.8s ease;
}
.broadcast-container {
  position: fixed;
  display: grid;
  grid-template-rows: 1fr 6fr 2fr;
  margin: 0;
  padding: 0;
  background-color: #2c1919;
  .header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    & > div {
      grid-area: 1/2/2/3;
      & > div {
        @include custom-font(20px, 900, inherit, inherit);
        & + div {
          @include custom-font(14px, 100, inherit, inherit);
        }
      }
    }
    & > div + div {
      grid-area: 1/3/2/4;
    }
  }
  .lyric {
    user-select: none;

    & ul {
      list-style: none;
    }
    ul {
      width: 400px;
      height: 500px;
      overflow-y: scroll;
      li {
        text-align: center;
        opacity: 0.4;
        .play-icon {
          cursor: pointer;
          transition: all 0.8s ease;
        }
      }
      .active {
        font-size: 19px;
        font-weight: 900;
        word-spacing: 2px;
        opacity: 1;
        transition: all 0.1s ease;
      }
    }

    ul::-webkit-scrollbar {
      width: 4px;
      scrollbar-arrow-color: darkgreen;
    }
    ul::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
      scrollbar-arrow-color: red;
    }
    ul::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
      scrollbar-arrow-color: red;
    }
    ul::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
