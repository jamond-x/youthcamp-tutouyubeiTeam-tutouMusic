<template>
  <div class="row wrap justify-start">
    <mv-list-item v-for="(item, index) in mvLists" :key="index" :list-item="item" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import MvListItem from './MvListItem.vue'

export default defineComponent({
  name: 'MvList',
  components: {
    MvListItem,
  },
  props: {
    mvLists: {
      type: Array,
      default() {
        return []
      },
    },
  },
})
</script>

<style lang='scss' scoped>
</style>
