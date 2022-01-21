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
      <ul class="q-mt-xl q-mr-xl" ref="lyricBar" id="lyricBar">
        <!-- <li v-for="item in 10" :key="item">&nbsp;</li> -->
        <li class="q-ma-md" v-for="(item, index) in lyric_" :key="index">{{ item }}</li>
        <!-- <li v-for="item in 10" :key="item">&nbsp;</li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { scroll } from 'quasar'
const { getVerticalScrollPosition, setVerticalScrollPosition } = scroll
// import { isUnNull } from 'src/utils'
import { GetLyric } from 'src/utils/request/broadcastSong/broadcast'
import { isUnNull } from 'src/utils'
export default defineComponent({
  name: 'Broadcasting',
  props: {
    playStatus: {
      type: Boolean,
    },
    songId: {
      type: String,
    },
    songDetail: {
      type: Object,
    },
  },
  components: {},
  setup(props) {
    let lyric_ = ref()
    let lyricBar = ref
    let singers = computed(() => {
      let singers = ''
      for (let artist of props.songDetail.ar) {
        singers += `/${artist.name}`
      }
      let temp = singers.split('')
      temp.shift()
      return temp.join('')
    })

    const GetLyric_ = async id => {
      if (isUnNull(id)) {
        console.log('播放列表为空')
      }
      // window.localStorage.setItem('lyric', JSON.stringify(await GetLyric({ id })))
      const {
        lrc: { lyric },
      } = JSON.parse(window.localStorage.getItem('lyric'))
      lyric_.value = lyric
    }
    GetLyric_(props.songId)
    lyric_.value = lyric_.value.split('\n')
    lyric_.value = lyric_.value.map(el => {
      return el.split('').splice(11).join('')
    })

    onMounted(() => {
      let obj = document.getElementById('lyricBar')
      // let position = 100
      // setInterval(() => {
      //   setVerticalScrollPosition(obj, position, 500)
      //   position += 100
      // }, 1000)

      // setTimeout(() => {
      //   setVerticalScrollPosition(obj, 100, 500)
      // }, 1000)
      // setTimeout(() => {
      //   setVerticalScrollPosition(obj, 200, 500)
      // }, 2000)
      // setTimeout(() => {
      //   setVerticalScrollPosition(obj, 300, 500)
      // }, 3000)

      // let position = 100
      // setInterval(() => {
      //   // 定时清除
      //   setVerticalScrollPosition(obj, (position += 50), 1000)
      // }, 1000)
    })
    let backup = lyric_.value
    lyric_.value = lyric_.value.splice(0, 10)

    setTimeout(() => {
      lyric_.value = backup.splice(1, 11)
    }, 1000)
    setTimeout(() => {
      lyric_.value = backup.splice(2, 12)
    }, 2000)
    // 通过改变值使其变化  变化时僵硬的  看看 vue 的示例  滑动改变！
    // https://v3.cn.vuejs.org/guide/transitions-list.html#%E5%88%97%E8%A1%A8%E7%9A%84%E7%A7%BB%E5%8A%A8%E8%BF%87%E6%B8%A1
    return {
      singers,
      lyric_,
      lyricBar,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
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
        @include custom-font(20px, 900, 3px, inherit);
        & + div {
          @include custom-font(14px, 100, 2px, inherit);
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
