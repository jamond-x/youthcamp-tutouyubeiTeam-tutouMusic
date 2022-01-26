<template>
  <q-tabs no-caps class="text-white shadow-2" align="left">
    <q-route-tab name="personality" label="个性推荐" to="/discover/personality"></q-route-tab>
    <q-route-tab name="playlist" label="歌单" to="/discover/playlist"></q-route-tab>
    <q-route-tab name="rank" label="排行榜" to="/discover/rank"></q-route-tab>
    <q-route-tab name="singer" label="歌手" to="/discover/singer"></q-route-tab>
  </q-tabs>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TopBar',

})
</script>

<style lang="scss" scoped>
</style>
