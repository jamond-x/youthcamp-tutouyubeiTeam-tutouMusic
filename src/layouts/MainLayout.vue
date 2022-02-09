<template>
  <q-layout view="lHh Lpr fff">
    <q-header bordered :class="[$q.dark.mode ? 'body--dark' : 'body--light']">
      <q-toolbar>
        <q-toolbar-title>
          <q-input
            class="q-ml-sm"
            label="Search songs singers ..."
            borderless
            :input-style="{ fontSize: '16px' }"
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-search" size="18px" />
            </template>
          </q-input>
        </q-toolbar-title>
        <q-btn :icon="mode" @click="modeToggle" size="12px" round ripple />
        <q-separator vertical inset class="q-mx-md" />
        <div>
          <q-btn-dropdown>
            <template v-slot:label>
              <q-avatar>
                <img :src="avatarUrl" />
              </q-avatar>
              <span class="q-ml-md">{{ username }}</span>
            </template>
            <div class="row no-wrap q-pa-lg z-top">
              <div class="column">
                <div class="text-h6 q-mb-md">设置</div>
                <q-toggle v-model="option1" label="没想好" />
                <q-btn
                  v-if="loginFlag"
                  :loading="refreshing"
                  @click="handleRefreshLogin"
                  label="刷新登录状态"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>
              <q-separator vertical inset class="q-mx-lg" />
              <div class="column items-center">
                <q-avatar size="64px">
                  <img :src="avatarUrl" />
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ username }}</div>
                <q-btn
                  @click="handleLogout"
                  v-if="loginFlag"
                  color="purple"
                  label="登出"
                  push
                  size="md"
                  v-close-popup
                />
                <q-btn
                  @click="handleLogin"
                  v-else
                  color="purple"
                  label="登录"
                  push
                  size="md"
                  v-close-popup
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      :breakpoint="600"
      show-if-above
      :width="230"
      bordered
      class="shadow-3"
      :class="[$q.dark.mode ? 'body--dark' : 'body--light']"
    >
      <q-list>
        <div class="logo font-GEO row justify-center q-my-xl">Music</div>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-separator class="q-mx-lg q-mt-lg" />
        <UserSongListLink />
      </q-list>
    </q-drawer>
    <q-page-container :class="[$q.dark.mode ? 'body--dark' : 'body--light']">
      <router-view />
    </q-page-container>
    <q-footer class="footer shadow-7" :class="[$q.dark.mode ? 'body--dark' : 'body--light']" reveal>
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
  <q-dialog v-model="showLogin" persistent><AuthPanel /></q-dialog>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import BroadcastBar from 'src/pages/BroadcastSongs/BroadcastBar.vue'
import LyricBoard from 'src/pages/BroadcastSongs/LyricBoard.vue'
import AuthPanel from 'src/pages/AuthPanel/AuthPanel.vue'
import UserSongListLink from 'src/components/UserSongListLink/UserSongListLink.vue'
import { RefreshLogin } from 'src/utils/request/login/login'
const linksList = [
  {
    title: '发现音乐',
    icon: 'fas fa-music',
    link: '/discover',
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

import { defineComponent, ref, reactive, nextTick, provide, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    BroadcastBar,
    LyricBoard,
    AuthPanel,
    UserSongListLink,
  },

  setup() {
    const store = useStore()
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    // $q.dark.set(true)
    let songsList = ref([])
    let currentSongId = ref('')
    // 测试环境
    // let currentSongDetail = ref(JSON.parse(window.localStorage.getItem('songs'))[0])
    let currentSongDetail = ref()
    let playStatus = ref(false)
    let currentTime = ref()
    let forceToChangeProgressValue = ref('default')
    let playMode = ref(1)
    let searchKeyword = ref()
    let $router = useRouter()
    let mode = ref('light_mode')
    let broadcastPageStatus = ref(false)

    let option1 = ref(true)
    let avatarUrl = computed(() => {
      return store.state.userInfo.avatarUrl
    })
    let username = computed(() => {
      return store.state.userInfo.nickname
    })
    let loginFlag = computed(() => {
      return store.state.loginFlag
    })
    let showLogin = ref(false)
    let refreshing = ref(false)
    watch([loginFlag, username], () => {
      console.log('登录状态变化')
    })
    //****************************************************
    /**
     * @description 调用该方法可以直接开或关播放器（前提是播放列表有歌曲）
     */
    const toggleAudioPlay = () => {
      playStatus.value = !playStatus.value
    }

    /**
     * @description 立即播放某首歌曲
     * @param {String} id: 播放歌曲的id
     */
    const immediatelyBroadcast = id => {
      playMode.value = 0
      nextTick(() => {
        songsList.value.unshift(id)
      })
    }
    /**
     * 添加一首歌曲到播放列表
     * id: 歌曲id
     * order： 添加方式   true：即下一首播放  false: 添加至播放列表最后
     */
    const addSongToPlaylist = (id, order) => {
      if (order) {
        playMode.value = 2
        nextTick(() => {
          songsList.value.splice(1, 0, id)
        })
        return
      }
      if (!order) {
        playMode.value = 3
        nextTick(() => {
          songsList.value.push(id)
        })
      }
    }

    /**
     * 更新整个播放列表  应用场景为播放某歌单所有歌曲
     * list :  string[]
     * ['132111561','165615','4848648']
     */
    const newPlaylist = list => {
      playMode.value = 1
      nextTick(() => {
        songsList.value = list
      })
    }

    // 调用示例
    setTimeout(() => {
      immediatelyBroadcast('1293886117')
    }, 2000)
    setTimeout(() => {
      newPlaylist(['1856265847', '1465114465', '1293886117', '32507038'])
    }, 10000)
    setTimeout(() => {
      addSongToPlaylist('25787222', true)
    }, 15000)
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

    const handleSearch = () => {
      $router.push('/search/' + searchKeyword.value)
    }
    // 日夜间模式切换
    function modeToggle() {
      $q.dark.toggle()
      // console.log($q.dark.mode)
      if (mode.value === 'light_mode') {
        mode.value = 'dark_mode'
      } else {
        mode.value = 'light_mode'
      }
    }

    const handleLogin = () => {
      console.log('点击登录', showLogin.value)
      showLogin.value = true
    }
    const handleLogout = async () => {
      let res = await store.dispatch('goLogout')
      console.log('点击登出', res)
      window.sessionStorage.removeItem('userInfo')
      window.sessionStorage.removeItem('loginFlag')
      window.sessionStorage.removeItem('uid')
    }

    const handleRefreshLogin = () => {
      refreshing.value = true
      RefreshLogin().then(res => {
        console.log('刷新登录状态', res)
        setTimeout(() => {
          refreshing.value = false
        }, 1000)
      })
    }

    const toggleLoginShow = () => {
      showLogin.value = !showLogin.value
    }

    provide('showLogin', showLogin)
    provide('toggleLoginShow', toggleLoginShow)

    return {
      essentialLinks: linksList,
      songsList,
      handlePlay,
      handleUpdateCurrentTime,
      handleChangeProgress,
      handleSwitchSong,
      toggleAudioPlay,
      immediatelyBroadcast,
      newPlaylist,
      addSongToPlaylist,
      currentSongId,
      currentSongDetail,
      currentTime,
      playStatus,
      playMode,
      forceToChangeProgressValue,
      searchKeyword,
      handleSearch,
      modeToggle,
      mode,
      option1,
      avatarUrl,
      username,
      loginFlag,
      showLogin,
      refreshing,
      handleLogin,
      handleLogout,
      handleRefreshLogin,
      handlePause,
      broadcastPageStatus,
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
.font {
  @include custom-font(16px, 900, 3px, inherit);
}

.footer {
  z-index: 2001;
  height: 80px;
  // background-color: #2c1919;
  // border-radius: 20px;
  // width: 98%;
}
.broadcast-panel {
  z-index: 2000;
  overflow: scroll;
}
</style>
