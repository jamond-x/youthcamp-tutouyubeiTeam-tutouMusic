<template>
  <q-page>
    <q-tabs
      v-model="tab"
      no-caps
      :class="[$q.dark.mode ? 'body--dark' : 'body--light']"
      align="left"
    >
      <q-tab name="personality" label="个性推荐" :ripple="false"></q-tab>
      <q-tab name="playlist" label="歌单" :ripple="false"></q-tab>
      <q-tab name="singer" label="歌手" :ripple="false"></q-tab>
      <q-tab name="mv" label="MV" :ripple="false"></q-tab>
      <q-tab name="rank" label="排行榜" :ripple="false"></q-tab>
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      :class="[$q.dark.mode ? 'body--dark' : 'body--light']"
      keep-alive
      keep-alive-include="personality"
    >
      <q-tab-panel name="personality" class="tab-panel">
        <personality />
      </q-tab-panel>

      <q-tab-panel name="playlist" class="tab-panel">
        <playlist />
      </q-tab-panel>

      <q-tab-panel name="singer" class="tab-panel">
        <singer />
      </q-tab-panel>

      <q-tab-panel name="mv" class="tab-panel">
        <mv />
      </q-tab-panel>

      <q-tab-panel name="rank" class="tab-panel">
        <rank />
      </q-tab-panel>
    </q-tab-panels>

    <!-- <router-view> </router-view> -->
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'

import Personality from './childPages/Personality.vue'
import Playlist from './childPages/Playlist.vue'
import Rank from './childPages/Rank.vue'
import Singer from './childPages/Singer.vue'
import Mv from './childPages/Mv.vue'

export default defineComponent({
  name: 'Discover',
  components: {
    Personality,
    Playlist,
    Rank,
    Singer,
    Mv,
  },
  setup() {
    const tab = ref('personality')
    return {
      tab,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.q-tabs {
  position: sticky;
  top: 57px;
  z-index: 2;
}

.tab-panel {
  padding: 0;
}
</style>
