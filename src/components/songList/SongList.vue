<template>
  <div class="row wrap justify-between">
    <song-list-item
      v-for="(item, index) in songLists"
      :key="index"
      :list-item="item"
    />
    <!-- {{ songLists }} -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import SongListItem from './SongListItem.vue'

export default defineComponent({
  name: 'SongList',
  components: {
    SongListItem
  },
  props: {
    songLists: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup() {
    return {
      // songLists: props.songLists
    }
  }
})
</script>

<style lang='scss' scoped>
.songList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* padding: 2px; */
}
</style>
