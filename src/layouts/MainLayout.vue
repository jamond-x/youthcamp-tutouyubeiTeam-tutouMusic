<template>
  <q-layout view="lHh Lpr fff">
    <q-header class="bg-transparent" bordered>
      <q-toolbar>
        <q-toolbar-title>
          <q-input
            class="q-ml-sm"
            label="Search songs singers ..."
            borderless
            :input-style="{ fontSize: '16px' }"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-search" size="18px" />
            </template>
          </q-input>
        </q-toolbar-title>
        <q-btn icon="fas fa-bell" size="12px" rounded />
        <q-separator vertical inset class="q-mx-md" />
        <div>
          <q-btn class="user" rounded>
            <q-avatar>
              <img
                src="https://cdn.jsdelivr.net/gh/jamond-x/public-resources@latest/Avatar/Avatar-Maker%20(3).png"
              />
            </q-avatar>
            <span class="q-ml-md">秃头预备</span>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer class="bg-black" :breakpoint="600" show-if-above :width="230">
      <q-list>
        <div class="logo font-GEO row justify-center q-my-xl">TT</div>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-separator class="q-mx-lg q-mt-lg" />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="footer q-mb-md q-ml-md" reveal>
      <BroadcastBar
        :songListToAudio="songsList"
        :controlPlayStatus="playStatus"
        :playMode="playMode"
        :forceToChangeProgress="forceToChangeProgressValue"
        @play="handlePlay"
        @pause="handlePause"
        @updateCurrentTime="handleUpdateCurrentTime"
        @switchSong="handleSwitchSong"
        @toggleBroadcastPage="broadcastPageStatus = !broadcastPageStatus"
      />
    </q-footer>
    <q-dialog
      v-model="broadcastPageStatus"
      transition-show="slide-up"
      transition-hide="slide-down"
      transition-duration="700"
      persistent
      full-width
      full-height
      no-shake
      class="broadcast-panel"
    >
      <LyricBoard
        :songId="currentSongId"
        :songDetail="currentSongDetail"
        :songCurrentTime="currentTime"
        @changeProgress="handleChangeProgress"
      />
    </q-dialog>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import BroadcastBar from 'src/pages/BroadcastSongs/BroadcastBar.vue'
import LyricBoard from 'src/pages/BroadcastSongs/LyricBoard.vue'
const linksList = [
  {
    title: '发现音乐',
    icon: 'fas fa-music',
    link: 'discover',
  },
  {
    title: '我的主页',
    icon: 'fas fa-user',
    link: '/user',
  },
  {
    title: '我的歌单',
    icon: 'fas fa-stream',
    link: '/playlist',
  },
  {
    title: '拓展',
    icon: 'fab fa-artstation',
    link: '',
  },
  {
    title: '设置',
    icon: 'fas fa-cog',
    link: '',
  },
  {
    title: 'XXX',
    icon: 'fab fa-atlassian',
    link: '',
  },
]

import { defineComponent, ref, reactive, nextTick } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    BroadcastBar,
    LyricBoard,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    $q.dark.set(true)
    let songsList = ref([])
    let currentSongId = ref('')
    // 测试环境
    // let currentSongDetail = ref(JSON.parse(window.localStorage.getItem('songs'))[0])
    let currentSongDetail = ref()
    let playStatus = ref(false)
    let currentTime = ref()
    let forceToChangeProgressValue = ref('default')
    let playMode = ref(4)
    //****************************************************
    /**
     * @description 调用该方法可以直接开或关播放器（前提是播放列表有歌曲）
     */
    const toggleAudioPlay = () => {
      playStatus.value = !playStatus.value
    }

    /**
     * @description 立即播放某首歌曲
     * @param {} id
     */
    const immediatelyBroadcast = id => {
      playMode.value = 0
      nextTick(() => {
        songsList.value.unshift(id)
      })
    }
    setTimeout(() => {
      immediatelyBroadcast('1293886117')
    }, 2000)
    /**
     * 添加一首歌曲到播放列表
     * id: 歌曲id
     * order： 添加方式   true：添加值播放列表最前方（即下一首播放）  false: 添加至列表最后
     */ // TODO:
    const addSongToPlaylist = (id, order) => {}

    /**
     * 更新整个播放列表  应用场景为播放某歌单所有歌曲
     * list :  string[]
     * ['132111561','165615','4848648']
     */
    const newPlaylist = list => {
      playMode.value = 4
      nextTick(() => {
        songsList.value = list
      })
    }

    setTimeout(() => {
      newPlaylist(['1856265847', '1465114465', '1293886117', '32507038'])
    }, 10000)

    //*  *************************************************

    const handlePlay = songDetail => {
      const { id } = songDetail
      let idStr = id.toString()
      if (currentSongId.value != idStr) {
        currentSongId.value = idStr
      }
      if (currentSongDetail.value != songDetail) {
        currentSongDetail.value = songDetail
      }
      playStatus.value = true
    }

    const handlePause = songDetail => {
      const { id } = songDetail
      let idStr = id.toString()
      if (currentSongId.value != idStr) {
        // 优化
        currentSongId.value = idStr
      }
      if (currentSongDetail.value != songDetail) {
        currentSongDetail.value = songDetail
      }
      playStatus.value = false
      console.log('停止播放！！')
    }

    const handleUpdateCurrentTime = time => {
      time = parseInt(time)
      currentTime.value = time
    }

    const handleChangeProgress = time => {
      forceToChangeProgressValue.value = time
    }

    const handleSwitchSong = songDetail => {
      const { id } = songDetail
      let idStr = id.toString()
      if (currentSongId.value != idStr) {
        // 优化
        currentSongId.value = idStr
      }
      currentSongDetail.value = songDetail
    }

    return {
      essentialLinks: linksList,
      broadcastPageStatus: ref(false),
      songsList,
      handlePlay,
      handlePause,
      handleUpdateCurrentTime,
      handleChangeProgress,
      handleSwitchSong,
      toggleAudioPlay,
      immediatelyBroadcast,
      newPlaylist,
      currentSongId,
      currentSongDetail,
      currentTime,
      playStatus,
      playMode,
      forceToChangeProgressValue,
    }
  },
})
</script>

<style lang="scss">
@import 'src/css/common.scss';

.user {
  @include custom-font(inherit, 600, 1px, inherit);
}
.logo {
  @include custom-font(45px, inherit, 1px, inherit);
}

.footer {
  z-index: 2001;
  height: 80px;
  background-color: #2c1919;
  border-radius: 20px;
  width: 98%;
}
.broadcast-panel {
  z-index: 2000;
  overflow: scroll;
}
</style>
