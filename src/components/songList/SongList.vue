<template>
  <div class="row wrap justify-start">
    <song-list-item v-for="(item, index) in songLists" :key="index" :list-item="item" :width="imgWidth" :height="imgHeight" />
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
    const imgWidth = computed(() => {
      return props.width + 'vw'
    })
    const imgHeight = computed(() => {
      return props.height + 'vw'
    })

    return {
      // songLists: props.songLists
      imgWidth,
      imgHeight
    }
  },
})
</script>

<style lang="scss" scoped></style>
