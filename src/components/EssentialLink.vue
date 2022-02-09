<template>
  <q-item clickable :to="link" @click="beforeOpenFM(title)">
    <q-item-section v-if="icon" class="q-ml-md" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="font">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, inject } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },
  setup() {
    const store = useStore()
    const $q = useQuasar()
    const openFM = inject('openFM')
    const beforeOpenFM = type => {
      if (type === '个性FM') {
        if (store.state.loginFlag === 1) {
          openFM()
        } else {
          $q.notify({
            message: '请先登录',
            color: 'warning',
            position: 'top',
            timeout: 2000,
          })
        }
      }
    }
    return {
      beforeOpenFM,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.font {
  @include custom-font(16px, 900, 3px, inherit);
}
</style>
