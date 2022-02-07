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
          <q-separator vertical inset class="q-mx-lg" />
          <div class="flex column justify-between">
            <div class="text-h6 text-weight-bold row">{{ playlist.name }}</div>
            <div class="row flex items-center">
              <q-btn round class="q-mr-lg">
                <q-avatar size="40px">
                  <img class="listHeadImg" :src="creator.avatarUrl" />
                </q-avatar>
              </q-btn>
              <div class="text-subtitle1">
                {{ creator.nickname }} {{ formatDate(playlist.createTime) }}创建
              </div>
            </div>
            <div class="row">
              <q-btn-group class="q-mr-md">
                <q-btn @click="handleAddAllSong">
                  <q-icon name="fas fa-chevron-right" size="16px" />
                  播放全部
                </q-btn>
                <q-btn>
                  <q-icon name="fas fa-plus" size="16px" />
                </q-btn>
              </q-btn-group>
              <q-btn label="收藏">({{ playlist.subscribedCount }})</q-btn>
            </div>

            <div class="row">
              <p class="text-subtitle2 q-mr-md">歌曲: {{ playlist.trackCount }}</p>
              <p class="text-subtitle2">播放: {{ playlist.playCount }}</p>
            </div>
          </div>
        </div>
      </template>
      <div class="songList q-mt-md" v-if="finishLoading">
        <q-infinite-scroll v-if="loginFlag" @load="onLoad" :offset="250" debounce="1000">
          <template v-for="(item, index) in finalTrack" :key="index">
            <div class="song-list-item row q-mb-xs">
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
                      <div>
                        {{ item['al']['name'] }}
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="text-subtitle1 duration q-pr-md">
                      <p>
                        {{ '1分钟' }}
                      </p>
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
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, inject, toRefs } from 'vue'
import PlaylistSkeleton from './PlaylistSkeleton.vue'
import { QueryTrack } from 'src/utils/request/userSongList/userSongList'
import { formatDate } from 'src/utils/time/time'

export default defineComponent({
  name: 'LikeMusic',
  props: ['id'],
  components: { PlaylistSkeleton },
  mounted() {
    this.loadTrack(this.$route.params.id)
  },
  watch: {
    id(n, o) {
      this.finishLoading = false
      this.loadTrack(n)
    },
  },
  setup(props) {
    const finishLoading = ref(false)
    const songTotalList = ref([])
    const loginFlag = inject('loginFlag')
    const updateLoginFlag = inject('updateLoginFlag')
    const trackState = reactive({
      playlist: {},
      creator: {},
      finalTrack: [],
    })
    function onLoad(index, done) {
      songTotalList.value.push(...trackState.finalTrack.slice(index - 1, index + 99))
      console.log('加载')
      done()
    }
    const handleAddAllSong = () => {
      console.log('加歌')
      addSongToPlaylist('95558515', true)
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
        finishLoading.value = true
        res.playlist.tracks.map(item => {
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
          song['dt'] = item['dt']
          trackState.finalTrack.push(song)
        })
      })
    }
    return {
      onLoad,
      loadTrack,
      loginFlag,
      formatDate,
      finishLoading,
      handleAddAllSong,
      ...toRefs(trackState),
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
  height: 13vw;
  overflow: hidden;
  img {
    height: 180px;
    width: 180px;
    /* filter: blur(5px) brightness(0.4); */
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

  img {
    border-radius: 15px;
    margin-right: 1.5rem;
    height: 4rem;
    width: 4rem;
  }
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
