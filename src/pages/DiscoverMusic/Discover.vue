<template>
  <q-page>
    <top-bar />
    <router-view>
    </router-view>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import TopBar from 'components/topbar/TopBar'
export default defineComponent({
  name: 'Discover',
  components: { TopBar },
  setup() {
    return {
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';

</style>
