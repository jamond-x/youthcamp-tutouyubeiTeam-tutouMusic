<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <q-btn @click="run">点击请求，控制台查看</q-btn>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { QueryArtists } from 'src/utils/request/song/song'
export default defineComponent({
  name: 'PageIndex',
  setup() {
    const run = async () => {
      let res = await QueryArtists({})
      console.log(res)
    }
    return {
      run,
    }
  },
})
</script>
