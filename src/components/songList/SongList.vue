<template>
  <div class="row wrap justify-start">
    <song-list-item v-for="(item, index) in songLists" :key="index" :list-item="item" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import SongListItem from './SongListItem.vue'

export default defineComponent({
  name: 'SongList',
  components: {
    SongListItem,
  },
  props: {
    songLists: {
      type: Array,
      default() {
        return []
      },
    },
  },
  setup() {
    return {
      // songLists: props.songLists
    }
  },
})
</script>

<style lang='scss' scoped>
</style>
