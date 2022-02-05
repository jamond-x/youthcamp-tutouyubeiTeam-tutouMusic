<template>
  <div class="container">
    <keep-alive>
      <component :is="type" v-model:type="type"></component>
    </keep-alive>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Login from 'src/components/login/Login.vue'

export default defineComponent({
  name: 'AuthPanel',
  components: {
    Login,
  },
  props: {},
  data() {
    return {
      type: 'Login',
    }
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
</style>
