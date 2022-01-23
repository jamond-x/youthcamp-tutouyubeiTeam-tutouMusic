<template>
  <q-layout view="lHh Lpr fff">
    <q-header class="bg-black" bordered>
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
    <q-footer class="bg-transparent" style="position: fixed; button: 0">
      <BroadcastBar />
    </q-footer>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import BroadcastBar from 'src/pages/BroadcastSongs/BroadcastBar.vue'
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

import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    BroadcastBar,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    $q.dark.set(true)
    return {
      essentialLinks: linksList,
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
</style>
