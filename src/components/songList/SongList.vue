<template>
  <div class="row wrap justify-start">
    <song-list-item v-for="(item, index) in songLists" :key="index" :list-item="item" :width="width" :height="height" />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

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
    width: {
      type: Number,
      default() {
        return 13
      },
    },
    height: {
      type: Number,
      default() {
        return 13
      },
    },
  },
  setup(props) {


    return {
      // songLists: props.songLists
    }
  },
})
</script>

<style lang="scss" scoped></style>
