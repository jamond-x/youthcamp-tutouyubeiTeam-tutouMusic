<template>
  <q-layout view="lHh Lpr fff">
    <q-header bordered :class="[$q.dark.mode ? 'body--dark' : 'body--light']">
      <q-toolbar>
        <q-btn
          icon="keyboard_arrow_left"
          class="q-mx-sm"
          @click="goClick(-1)"
          size="16px"
          flat
          padding="none"
          round
          :ripple="false"
        />
        <q-btn
          icon="keyboard_arrow_right"
          @click="goClick(1)"
          size="16px"
          flat
          padding="none"
          round
          :ripple="false"
        />
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
        <q-btn :icon="mode" @click="modeToggle" size="12px" flat round ripple />
        <q-separator vertical inset class="q-mx-md" />
        <div>
          <q-btn-dropdown flat>
            <template v-slot:label>
              <q-avatar size="27px">
                <img :src="avatarUrl" />
              </q-avatar>
            </template>
            <q-parallax :src="userBackgroundUrl" class="parallax__user" :height="180">
              <q-avatar size="64px" class="q-mb-md">
                <img :src="avatarUrl" />
              </q-avatar>
              <div class="column">
                <div class="q-mb-md">{{ userSignature }}</div>
                <q-btn
                  @click="handleLogout"
                  v-if="loginFlag"
                  color="grey-4"
                  text-color="black"
                  glossy
                  unelevated
                  label="登 出"
                  size="md"
                  v-close-popup
                />
                <q-btn
                  @click="handleLogin"
                  v-else
                  color="grey-4"
                  text-color="black"
                  glossy
                  unelevated
                  label="登 录"
                  size="md"
                  v-close-popup
                />
              </div>
            </q-parallax>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      :breakpoint="600"
      show-if-above
      :width="260"
      bordered
      class="shadow-3"
      :class="[$q.dark.mode ? 'body--dark' : 'body--light']"
    >
      <q-list>
        <div class="logo font-GEO row justify-center q-my-xl">
          <q-tooltip :offset="[10, 10]"> 没错，这是一个会旋转的秃头！ </q-tooltip>
          TT
        </div>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-separator class="q-mx-lg q-my-lg" />
        <keep-alive><UserSongListLink v-if="loginFlag" class="q-mt-xl" /></keep-alive>
      </q-list>
    </q-drawer>
    <q-page-container :class="[$q.dark.mode ? 'body--dark' : 'body--light']">
      <router-view v-slot="{ Component, route }">
        <!-- 因为发现音乐的轮播图存在性能问题所以使用keep-alive缓存 -->
        <keep-alive>
          <component
            :is="Component"
            v-if="route.meta.keepAlive"
            @immediatelyBroadcast="immediatelyBroadcast"
            @newPlaylist="newPlaylist"
            @addSongToPlaylist="addSongToPlaylist"
            @addPlaylist="addPlaylist"
          />
        </keep-alive>
        <component
          :is="Component"
          v-if="!route.meta.keepAlive"
          @immediatelyBroadcast="immediatelyBroadcast"
          @newPlaylist="newPlaylist"
          @addSongToPlaylist="addSongToPlaylist"
          @addPlaylist="addPlaylist"
        />
      </router-view>
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
        @priorBSSong="handelPriorBSSong"
        @toggleBroadcastPage="broadcastPageStatus = !broadcastPageStatus"
        @closePop="broadcastPageStatus = false"
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
      class="broadcast-panel scroll"
    >
      <LyricBoard
        :songId="currentSongId"
        :songDetail="currentSongDetail"
        :songCurrentTime="currentTime"
        @changeSong="immediatelyBroadcast"
        @changePlaylist="newPlaylist"
        @addSongToList="pushToList"
        @changeProgress="handleChangeProgress"
      />
    </q-dialog>
  </q-layout>
  <q-dialog v-model="showLogin" persistent><LoginPanel /></q-dialog>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import BroadcastBar from 'src/pages/BroadcastSongs/BroadcastBar.vue'
import LyricBoard from 'src/pages/BroadcastSongs/LyricBoard.vue'
import LoginPanel from 'src/components/login/Login.vue'
import UserSongListLink from 'src/components/UserSongListLink/UserSongListLink.vue'
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
    title: '个性FM',
    icon: 'fas fa-headphones-alt',
    link: '',
  },
]

import { defineComponent, ref, nextTick, provide, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    BroadcastBar,
    LyricBoard,
    LoginPanel,
    UserSongListLink,
  },

  setup() {
    const store = useStore()
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    $q.dark.set(false)
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
    let avatarUrl = ref(
      'https://cdn.jsdelivr.net/gh/jamond-x/public-resources@latest/Avatar/Avatar-Maker%20(3).png'
    )
    let nickname = ref('秃头预备')
    let userSignature = ref('这个人很懒，什么都留下了')
    let userBackgroundUrl = ref(
      'https://images.unsplash.com/photo-1643944398479-0fd9eaee5cbc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80'
    )
    let loginFlag = ref(0)
    let showLogin = ref(false)
    let refreshing = ref(false)
    let songIdMap = new Map()

    const storeId = (param, mode) => {
      if (typeof param === 'object') {
        songIdMap.clear()
        param.forEach((el, index) => {
          songIdMap.set(el, index)
        })
        return
      }
      if (mode === 0) {
        if (songIdMap.has(param)) {
          let index = songsList.value.indexOf(param)
          if (index === 0) {
            $q.notify({
              message: '不要重复添加至播放列表哦',
              timeout: 2000,
              position: 'top',
            })
            return true
          }
          nextTick(() => {
            let spliced = songsList.value.splice(index, 1)
            songsList.value.unshift(...spliced)
          })
          return true
        } else {
          return false
        }
      }
      if (mode === 2) {
        if (songIdMap.has(param)) {
          let index = songsList.value.indexOf(param)
          if (index === 1) {
            $q.notify({
              message: '下一首就是该歌曲不用重复添加哦',
              timeout: 2000,
              position: 'top',
            })
            return true
          }
          nextTick(() => {
            let spliced = songsList.value.splice(index, 1)
            songsList.value.splice(1, 0, ...spliced)
          })
          return true
        } else {
          return false
        }
      }
      if (mode === 3) {
        if (songIdMap.has(param)) {
          let index = songsList.value.indexOf(param)
          if (index === songsList.value.length - 1) {
            $q.notify({
              message: '已添加至播放列表',
              timeout: 2000,
              position: 'top',
            })
            return true
          }
          nextTick(() => {
            let spliced = songsList.value.splice(index, 1)
            songsList.value.push(...spliced)
          })
          return true
        } else {
          return false
        }
      }
    }
    /**
     * @description 改变LoginFlag(单纯为了统一些)
     */
    const updateLoginFlag = param => {
      loginFlag.value = param
    }
    /**
     * @description 检查登录状态,只针对右上角显示
     */
    const checkLoginState = () => {
      // 首先检查localStorage
      let tmpLoginFlag = Number(window.localStorage.getItem('loginFlag')) || 0
      if (tmpLoginFlag) {
        // 有登录过
        updateLoginFlag(1)
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        nickname.value = userInfo['nickname']
        avatarUrl.value = userInfo['avatarUrl']
        userBackgroundUrl.value = userInfo['backgroundUrl']
        userSignature.value = userInfo['signature']
      } else {
        // 没登陆过
        updateLoginFlag(0)
        nickname.value = '秃头预备'
        avatarUrl.value =
          'https://cdn.jsdelivr.net/gh/jamond-x/public-resources@latest/Avatar/Avatar-Maker%20(3).png'
      }
    }

    /**
     * @description 默认检查登录态 注意 登录后会改变loginFlag为1因此check前已经为1了
     */
    watch(
      loginFlag,
      () => {
        checkLoginState()
      },
      { immediate: true }
    )

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
      const res = storeId(id, playMode.value)
      if (res) return
      nextTick(() => {
        songIdMap.set(id, 0)
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
        const res = storeId(id, playMode.value)
        if (res) return
        nextTick(() => {
          songIdMap.set(id, 1)
          songsList.value.splice(1, 0, id)
        })
        return
      }
      if (!order) {
        playMode.value = 3
        const res = storeId(id, playMode.value)
        if (res) return
        nextTick(() => {
          songIdMap.set(id, songsList.value.length - 1)
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
        list.forEach(el => {
          songIdMap.set(el, 1)
        })
        songsList.value = list
      })
    }

    /**
     * 在现有列表中添加子播放列表
     * list :  string[]
     * ['132111561','165615','4848648']
     */
    const addPlaylist = list => {
      playMode.value = 4
      nextTick(() => {
        list.forEach(el => {
          songIdMap.set(el, 1)
          songsList.value.push(el)
        })
      })
    }

    //*  *************************************************

    const pushToList = param => {
      addSongToPlaylist(param, false)
    }

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

    const handelPriorBSSong = songDetail => {
      // TODO: 播放列表点击播放
    }

    const handleSearch = () => {
      $router.push('/search/' + searchKeyword.value)
    }
    // 日夜间模式切换
    const modeToggle = () => {
      $q.dark.toggle()
      // console.log($q.dark.mode)
      if (mode.value === 'light_mode') {
        mode.value = 'dark_mode'
      } else {
        mode.value = 'light_mode'
      }
    }

    /**
     * 前进后退逻辑
     * index :  Number
     */
    const goClick = index => {
      console.log('object')
      $router.go(index)
    }

    const handleLogin = () => {
      showLogin.value = true
    }
    const handleLogout = async () => {
      let res = await store.dispatch('goLogout')
      if (res.code === 200) {
        window.localStorage.removeItem('userInfo')
        window.localStorage.removeItem('loginFlag')
        window.localStorage.removeItem('uid')
        window.localStorage.removeItem('cookie')
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('userSongList')
        window.localStorage.setItem('loginFlag', 0)
        checkLoginState()
      }
    }

    const toggleLoginShow = () => {
      showLogin.value = !showLogin.value
    }

    const openFM = () => {
      broadcastPageStatus.value = true
      store.commit('setFMStatus', true)
    }

    provide('showLogin', showLogin)
    provide('toggleLoginShow', toggleLoginShow)
    provide('openFM', openFM)
    provide('loginFlag', loginFlag)
    provide('updateLoginFlag', updateLoginFlag)
    provide('immediatelyBroadcast', immediatelyBroadcast)

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
      addPlaylist,
      addSongToPlaylist,
      pushToList,
      handelPriorBSSong,
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
      avatarUrl,
      nickname,
      userSignature,
      userBackgroundUrl,
      loginFlag,
      showLogin,
      refreshing,
      handleLogin,
      handleLogout,
      handlePause,
      broadcastPageStatus,
      updateLoginFlag,
      goClick,
      checkLoginState,
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
  transition: transform 2s;
  &:hover {
    transform: rotate(360deg);
    -ms-transform: rotate(360deg); /* IE 9 */
    -moz-transform: rotate(360deg); /* Firefox */
    -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
    -o-transform: rotate(360deg); /* Opera */
  }
}

.parallax__user {
  width: 300px;
  display: grid;
  grid-template-columns: 2fr 3fr;
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
