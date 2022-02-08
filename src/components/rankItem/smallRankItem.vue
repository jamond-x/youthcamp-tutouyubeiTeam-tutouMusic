<template>
  <q-card class="my-card" @click="itemClick">
    <div class="num"><q-icon name="play_arrow" />{{ numFormat(item.playCount) }}</div>
    <q-img :src="item.coverImgUrl" class="img">
      <div class="absolute-bottom">{{ item.name }}</div>
    </q-img>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import { numFormat } from '../../utils/bigNum/bigNum'
import { useRouter } from 'vue-router'

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
    const router = useRouter()

    function itemClick() {
      router.push({
        path: '/playlist/' + props.item.id,
      })
    }

    return {
      numFormat,
      itemClick
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
  font-size: 16px;
  .img {
    border-radius: 15px;
  }
  .num {
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 10;
    height: 16px;
    line-height: 16px;
    color: white;
    // background-color: rgba($color: #ffffff, $alpha: 0.2);
    .q-icon {
      font-size: 16px;
      margin-right: 2px;
      margin-bottom: 3px;
    }
  }
}
</style>
