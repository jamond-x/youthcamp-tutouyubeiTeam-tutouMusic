<template>
  <q-card class="my-card">
    <div class="num"><span>播放量</span>{{ numFormat(item.playCount) }}</div>
    <q-img :src="item.coverImgUrl" class="img">
      <div class="absolute-bottom text-h6">{{ item.name }}</div>
    </q-img>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import { numFormat } from '../../utils/bigNum/bigNum'

export default defineComponent({
  name: 'SmallRankItem',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  setup(props) {
    const getData = async () => {
      console.table(props)
    }
    getData()

    return {
      numFormat,
    }
  },
})
</script>

<style lang="scss" scoped>
.my-card {
  width: 210px;
  border-radius: 15px;
  position: relative;
  justify-self: center;
  align-self: center;
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
