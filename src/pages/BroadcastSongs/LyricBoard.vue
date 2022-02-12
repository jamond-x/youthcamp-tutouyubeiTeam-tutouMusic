<template>
  <div :class="['broadcast-container scroll', $q.dark.isActive ? 'lyric-dark' : 'lyric-light']">
    <div class="mask">
      <img :src="songDetail.al.picUrl" />
    </div>
    <div class="header">
      <div class="column items-center">
        <div class="q-mt-md">
          {{ isUnNull(songDetail.name) ? '播放器中没有歌曲哦~' : songDetail.name }}
        </div>
        <div>
          <router-link
            :class="['singer', $q.dark.isActive ? 'text-white' : 'text-black']"
            v-close-popup
            :to="`/artist/${artist.id}`"
            v-for="(artist, index) in songDetail.ar"
            :key="index"
            tag="span"
            >{{ index >= 1 ? `/${artist.name}` : artist.name }}
          </router-link>
        </div>
      </div>
      <div class="row reverse items-center">
        <q-btn class="q-mr-xl" icon="fas fa-angle-down" v-close-popup flat round />
      </div>
      <div class="fm">
        <div class="font text-black q-px-sm q-ml-sm">私人FM</div>
        <q-toggle
          v-model="FMMode"
          @update:model-value="beforeOpenFM"
          icon="fas fa-blog"
          size="50px"
          color="red"
        />
      </div>
    </div>
    <div class="left-side">
      <div>
        <q-btn
          @click="getSimilarSongs, (similarSongBar = !similarSongBar)"
          icon="fas fa-align-right"
          flat
          class="font-weight-sm"
          :label="similarSongBar ? '相似歌曲' : ''"
        />
      </div>
      <div v-if="similarSongBar" class="similar-songs q-mt-md q-ml-xl">
        <swiper
          mousewheel
          :speed="500"
          :effect="'cards'"
          :cards-effect="{ slideShadows: false }"
          loop
        >
          <swiper-slide
            style="position: relative; cursor: pointer"
            v-for="(item, index) in similarSongs"
            :key="index"
            @click="$emit('changeSong', `${item.id}`)"
          >
            <q-img class="img" :src="item.album.picUrl">
              <div class="bar absolute-bottom text-subtitle1 text-center">
                {{ item.name }}
              </div>
            </q-img>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="right-side">
      <div class="row reverse">
        <q-btn
          @click="getSimilarPlaylist, (similarPlaylistsBar = !similarPlaylistsBar)"
          icon="fas fa-align-right"
          flat
          class="font-weight-sm"
          :label="similarPlaylistsBar ? '相似歌单' : ''"
        />
      </div>
      <div v-if="similarPlaylistsBar" class="similar-playlists q-mt-md q-mr-xl">
        <swiper
          mousewheel
          free-mode
          :speed="500"
          :effect="'cube'"
          :cube-effect="{ shadow: true, slideShadows: false, shadowScale: 0.8, shadowOffset: 35 }"
          loop
          :update-on-images-ready="true"
          @init="getInstance"
        >
          <swiper-slide
            style="position: relative; cursor: pointer"
            v-for="(item, index) in similarPlaylists"
            :key="index"
            @click="toPlaylist(item.id)"
            v-close-popup
          >
            <q-img class="img" :src="item.coverImgUrl">
              <div class="bar absolute-bottom text-subtitle1 text-center">
                {{ item.name }}
              </div>
            </q-img>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="lyric flex flex-center">
      <ul
        v-if="isUnNull(lyricWithAnchor) || lyricWithAnchor.length === 0"
        class="q-mt-xl q-mr-xl"
        id="lyricBar"
      >
        <li class="piece q-ma-md" v-for="item in 13" :key="item">
          <q-skeleton type="rect" />
        </li>
      </ul>
      <ul v-else class="q-mt-xl q-mr-xl" id="lyricBar">
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
    <Comment :id="songId" :type="0" />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import {
  GetLyric,
  SimilarSongs,
  SimilarPlaylists,
  PersonalFM,
  Login,
  Logout,
} from 'src/utils/request/broadcastSong/broadcast'
import { isUnNull } from 'src/utils'
import Comment from './Comment.vue'
import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Mousewheel, FreeMode, EffectCards, EffectCube } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/effect-cards'
import 'swiper/css/effect-cube'
SwiperCore.use([FreeMode, Mousewheel, EffectCards, EffectCube])

export default defineComponent({
  name: 'Lyric',
  props: {
    songId: {
      type: String,
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
  emits: ['changeProgress', 'changeSong', 'changePlaylist', 'addSongToList'],
  components: { Comment, Swiper, SwiperSlide },
  setup(props, context) {
    let $q = useQuasar()
    let store = useStore()
    let router = useRouter()
    let lyric_ = ref()
    let lyricWithAnchor = ref([])
    let lyricMap = new Map()
    let lyricIndexMap = new Map()
    let activeEl = ref()
    let similarSongs = ref([])
    let similarPlaylists = ref([])
    let swiperInstance = ref()
    let FMMode = ref(false)
    let FMList = ref([])
    let similarSongBar = ref(true)
    let similarPlaylistsBar = ref(true)
    const scrollTo = el => {
      let container = document.getElementById('lyricBar')
      let totalHeight = container.scrollHeight
      let index = lyricIndexMap.get(el)
      index -= 6
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

    const getInstance = instance => {
      swiperInstance.value = instance
      setTimeout(() => {
        swiperInstance.value.setTranslate(-50)
      }, 5000)
      // console.log(props.songDetail.al.picUrl);
    }
    //TODO: 歌词加上翻译
    const initLyric = () => {
      lyricMap = new Map()
      lyricIndexMap = new Map()
      lyric_.value = lyric_.value.split('\n')
      let tempIndex = 0
      lyric_.value = lyric_.value.map(el => {
        let temp
        if (el.charAt(10) === ']') {
          temp = el.split('').splice(11).join('')
        } else {
          temp = el.split('').splice(10).join('')
        }
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

    const getSimilarSongs = async () => {
      let { songs } = await SimilarSongs(props.songId)
      similarSongs.value = songs
    }
    getSimilarSongs()

    const getSimilarPlaylist = async () => {
      if (!props.songId) {
        return
      }
      let { playlists } = await SimilarPlaylists(props.songId)
      similarPlaylists.value = playlists
      if (!playlists || playlists.length === 0) {
        similarPlaylistsBar.value = false
      }
    }

    const FM = async () => {
      let { data } = await PersonalFM()
      let ids = data.map(el => {
        return el.id.toString()
      })
      if (FMList.value.length === 0) {
        FMList.value = ids
        context.emit('changePlaylist', ids)
      } else {
        ids.forEach(el => {
          FMList.value.push(el)
          context.emit('addSongToList', el)
        })
      }
    }

    getSimilarPlaylist()
    const GetLyric_ = async id => {
      if (isUnNull(id)) {
        $q.notify({
          message: '播放列表为空',
          timeout: 2000,
          position: 'top',
        })
      }
      const {
        lrc: { lyric },
      } = await GetLyric({ id })
      if (isUnNull(lyric)) {
        $q.notify({
          message: '获取歌词失败',
          timeout: 2000,
          position: 'top',
          color: 'red',
        })
        return
      }
      lyric_.value = lyric
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

    if (store.state.isFM) {
      if (store.state.firstOpenFM) {
        store.commit('setFirstOpenFM', false)
        FM()
      }
      FMMode.value = true
    }

    const toPlaylist = playlistId => {
      router.push(`/playlist/${playlistId}`)
    }

    const beforeOpenFM = (newVal, evt) => {
      if (newVal === true) {
        if (store.state.loginFlag === 0) {
          $q.notify({
            message: '请先登录',
            color: 'warning',
            position: 'top',
            timeout: 2000,
          })
          FMMode.value = false
        }
      }
    }

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
        lyricWithAnchor.value = []
        GetLyric_(newVal)
        getSimilarSongs()
        getSimilarPlaylist()
        if (newVal === FMList.value[FMList.value.length - 1]) {
          FM()
        }
      }
    )
    watch(
      () => FMMode.value,
      newVal => {
        if (newVal) {
          if (store.state.loginFlag === 1) {
            FM()
          }
          return
        }
        store.commit('setFMStatus', false)
        store.commit('setFirstOpenFM', true)
      }
    )

    return {
      singers,
      lyric_,
      lyricWithAnchor,
      activeEl,
      similarSongs,
      similarPlaylists,
      similarSongBar,
      similarPlaylistsBar,
      swiperInstance,
      FMMode,
      getSimilarPlaylist,
      getSimilarSongs,
      getInstance,
      changeProgress,
      isUnNull,
      toPlaylist,
      beforeOpenFM,
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
  .mask {
    // 遮罩层
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    filter: blur(300px) brightness(1);
    img {
      width: 100%;
      height: 50%;
    }
  }
  .header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    text-transform: capitalize;
    cursor: pointer;
    z-index: 1;
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

    .singer {
      text-decoration: none;
    }
    .fm {
      position: absolute;
      @include custom-font(1.2rem, 900, 1px, inherit);
      left: 3.5rem;
      top: 1.7rem;
      .font {
        background-color: white;
        border-radius: 6px;
      }
    }
  }

  .left-side {
    position: absolute;
    left: 3rem;
    top: 30%;
    z-index: 2;
    .similar-songs {
      width: 200px;
      height: 200px;

      .img {
        border-radius: 20px;
        .bar {
          @include custom-font(17px, 600, 1px, inherit);
        }
      }
    }
  }
  .right-side {
    position: absolute;
    right: 3rem;
    top: 30%;
    z-index: 2;

    .similar-playlists {
      width: 200px;
      height: 200px;

      .img {
        border-radius: 20px;
        .bar {
          @include custom-font(17px, 600, 1px, inherit);
        }
      }
    }
  }
  .lyric {
    @extend .scroll_lyric;
    z-index: 1;
    color: white;
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
}
</style>
