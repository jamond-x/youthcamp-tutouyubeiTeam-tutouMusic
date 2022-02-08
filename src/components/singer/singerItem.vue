<template>
  <q-card class="my-card">
    <q-img :src="picUrl" class="img">
      <div class="absolute-bottom text-h6 name">{{ item.name ? item.name : item.trans }}</div>
    </q-img>
  </q-card>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SingerItem',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  setup(props) {
    const picUrl = computed(() => {
      return props.item.picUrl + '?param=200y200'
    })
    return {
      picUrl
    }
  },
})
</script>

<style lang="scss" scoped>
.my-card {
  width: 180px;
  border-radius: 15px;
  position: relative;
  justify-self: center;
  align-self: center;
  .name {
    text-align: center;
  }
  .img {
    border-radius: 15px;
  }
  .num {
    position: absolute;
    top: 10px;
    right: 5px;
    z-index: 10;
    background-color: rgba($color: #ffffff, $alpha: 0.2);
    span {
      font-size: 12px;
      margin-right: 2px;
    }
  }
}
</style>
