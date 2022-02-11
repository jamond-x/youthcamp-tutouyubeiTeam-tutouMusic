<template>
  <div class="q-page container">
    <div class="flex column no-wrap">
      <template v-if="!finishLoading">
        <PlaylistSkeleton />
      </template>
      <template v-else>
        <div class="Wrapper flex row no-wrap q-pa-md">
          <div class="topBanner">
            <img :src="playlist.coverImgUrl" />
          </div>
          <q-separator vertical inset spaced="2vw" />
          <div class="flex column justify-between">
            <div class="text-h3 text-weight-bold row">{{ playlist.name }}</div>
            <div class="row q-mt-sm">
              <q-btn-group class="q-mr-md" rounded>
                <q-btn @click="playList(trackIds)">
                  <q-icon name="fas fa-play" size="16px" />
                  <span class="q-ml-md">播放全部</span>
                </q-btn>
                <q-btn @click="playMoreList(trackIds)">
                  <q-icon name="fas fa-heart" size="16px" />
                </q-btn>
              </q-btn-group>
              <q-btn label="收藏" rounded>({{ playlist.subscribedCount }})</q-btn>
            </div>
            <div class="row">
              <div class="row flex items-center">
                <q-avatar size="25px" class="cursor__pointer q-mr-sm">
                  <img class="listHeadImg" :src="creator.avatarUrl" />
                </q-avatar>
                <div class="text-subtitle2">
                  {{ creator.nickname }} {{ formatDate(playlist.createTime) }}创建
                </div>
                <div class="row q-mt-md q-ml-lg">
                  <p class="text-subtitle2 q-mr-md">歌曲: {{ playlist.trackCount }}</p>
                  <p class="text-subtitle2">播放: {{ playlist.playCount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="songList q-mt-md" v-if="finishLoading">
        <q-infinite-scroll @load="onLoad" :offset="250" debounce="1000">
          <template v-for="(item, index) in finalTrack" :key="index">
            <div class="song-list-item row q-mb-xs" @click="play(item['id'])">
              <div class="col">
                <div class="song-item">
                  <div class="song-item-content">
                    <h5 class="text-h6 text-weight-bold">{{ item['name'] }}</h5>
                    <div class="text-subtitle2">{{ item['authorStr'] }}</div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="row">
                  <div class="col">
                    <div class="text-subtitle1 album">
                      <p>
                        {{ item['al']['name'] }}
                      </p>
                    </div>
                  </div>
                  <div class="col">
                    <div class="text-subtitle1 duration q-pr-md">
                      <p>{{ item['min'] }}分{{ item['sec'] }}秒</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
        <!-- 返回顶部按钮 -->
        <back-to-top bottom="100px" right="50px" visibleoffset="600">
          <q-btn round color="primary" icon="navigation" size="lg" />
        </back-to-top>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, inject, toRefs } from 'vue'
import PlaylistSkeleton from './PlaylistSkeleton.vue'
import { QuerySongDetail, QueryTrack } from 'src/utils/request/userSongList/userSongList'
import { formatDate } from 'src/utils/time/time'
import BackToTop from 'vue-backtotop'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LikeMusic',
  props: ['id'],
  components: { PlaylistSkeleton, BackToTop },
  methods: {
    play(songId) {
      this.$emit('immediatelyBroadcast', songId + '')
    },
    playList(list) {
      let newList = list.map(item => item + '')
      this.$emit('newPlaylist', newList)
    },
    playMoreList(list) {
      let newList = list.map(item => item + '')
      this.$emit('addPlaylist', newList)
    },
  },
  mounted() {
    this.loadTrack(this.$route.params.id)
  },
  watch: {
    id(n, o) {
      this.finishLoading = false
      this.loadTrack(n)
    },
  },
  setup(props, { emit }) {
    const $q = useQuasar()
    const finishLoading = ref(false)
    const songTotalList = ref([])
    const loginFlag = inject('loginFlag')
    const updateLoginFlag = inject('updateLoginFlag')
    const trackState = reactive({
      playlist: {},
      creator: {},
      finalTrack: [],
    })
    const trackIds = ref([])

    const tracksDecorate = tracks => {
      tracks.map(item => {
        let song = {}
        song['name'] = item['name'].trim()
        song['id'] = item['id']
        song['authorList'] = item['ar']
        song['authorStr'] = item['ar']
          .map(ele => {
            return ele.name
          })
          .join('/')
        song['al'] = item['al']
        song['dt'] = Number(item['dt'] / 1000)
        song['min'] = Math.floor(song['dt'] / 60)
        song['sec'] = Math.floor(song['dt'] % 60)
        trackState.finalTrack.push(song)
      })
    }

    function onLoad(index, done) {
      // *坏了 现在登录也只能请求到20首*...
      if (0) {
        // 已登录则分批加入
        // console.log((index - 1) * 100, (index - 1) * 100 + 99)
        // console.log('final', trackState.finalTrack)
        // let batch = trackState.finalTrack.slice((index - 1) * 100, (index - 1) * 100 + 99)
        // console.log(batch)
        // if (batch.length != 0) {
        //   songTotalList.value.push(...batch)
        //   console.log(songTotalList.value)
        // }
        // done()
      } else {
        // 未登录则分批请求
        let trackIdsStr = trackIds.value.slice((index - 1) * 30, (index - 1) * 30 + 30).join(',')
        let data = { ids: trackIdsStr }
        QuerySongDetail(data).then(res => {
          let tracks = res.songs
          tracksDecorate(tracks)
          if ((index - 1) * 30 + 30 > trackIds.value.length) {
            done(true)
          } else {
            done(false)
          }
        })
      }
    }
    const showNotify = msg => {
      $q.notify({
        message: msg,
        color: 'primary',
        position: 'top',
      })
    }

    function loadTrack(id) {
      trackState.playlist = {}
      trackState.creator = {}
      trackState.finalTrack = []
      QueryTrack({ id }).then(res => {
        console.log(res)
        if (res.code != 200) {
          return
        }
        trackState.playlist = res.playlist
        trackState.creator = res.playlist.creator
        // 针对登录状态请求不同接口 已登录能获取所有 未登录只能获取全部id 交给onLoad分批请求
        // *现在都只能请求到20首了*
        let tracks
        if (0) {
          tracks = res.playlist.tracks
          tracksDecorate(tracks)
        } else {
          trackIds.value = res.playlist.trackIds
          trackIds.value = trackIds.value.map(item => item.id)
        }
        finishLoading.value = true
      })
    }
    return {
      onLoad,
      loadTrack,
      loginFlag,
      formatDate,
      finishLoading,
      ...toRefs(trackState),
      trackIds,
      showNotify,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  padding: 2rem;
}
.topBanner {
  position: relative;
  height: 14vw;
  overflow: hidden;
  img {
    height: 100%;
    border-radius: 8px;
  }
}

.Wrapper {
  width: 100%;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
.song-list-item {
  height: 5rem;
  width: 100%;
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem;

  .album p,
  .duration p {
    margin: 0;
    line-height: 4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .duration {
    text-align: right;
  }
}
.song-item {
  display: flex;
  width: 100%;

  border-radius: 15px;
  box-sizing: border-box;
  transition: background 0.2s;
  position: relative;
  .text-h6 {
    position: relative;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.song-item-content {
  position: relative;
  width: calc(100% - 4.75rem);
}

.song-list-item:hover {
  background-color: $grey-9;
}

.body--light .song-list-item:hover {
  background-color: $grey-3;
}
</style>
