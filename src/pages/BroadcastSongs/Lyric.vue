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
    <Comment :id="songId" />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import {
  GetLyric,
  GetSongDetail,
  Login,
  Logout,
  LoginStatus,
  UserDetail,
} from 'src/utils/request/broadcastSong/broadcast'
import { isUnNull } from 'src/utils'
import Comment from './Comment.vue'
import { Cookies, scroll } from 'quasar'
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
  components: { Comment },
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
    // TODO: 使用正则 解决解析歌词不全问题
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
        GetLyric_(newVal)
      }
    )

    const login = async (phone, password) => {
      // let data = await Login({ phone, password })
      // console.log(data)
      // setTimeout(() => {
      //   window.localStorage.setItem('user', JSON.stringify(data))
      // }, 5000)
      // let user = JSON.parse(window.localStorage.getItem('user'))
      // console.log(user)
      // const { token } = user
      // window.localStorage.setItem('token', token)
      // Cookies.set('token', token)
    }
    setTimeout(async () => {
      // login()
      // console.log(await LoginStatus())
      // let userDetail = await UserDetail({ uid: 369626548 })
      // window.localStorage.setItem('userDetail', JSON.stringify(userDetail))
      // console.log(userDetail)
    }, 4000)

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
    @extend .scroll;
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
  }

  .comment {
  }
}
</style>
