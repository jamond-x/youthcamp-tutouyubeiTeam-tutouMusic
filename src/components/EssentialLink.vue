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
    const openFM = inject('openFM')
    const beforeOpenFM = type => {
      if (type === '个性FM') {
        openFM()
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
