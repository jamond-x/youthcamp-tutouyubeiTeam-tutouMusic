<template>
  <div class="card q-ma-md">
    <q-img class="img" :src="data.cover" @click="handleClick" />
    <div class="info column q-ml-md">
      <div class="song-name">
        {{ data.name }}
      </div>
      <div class="row opacity q-mt-md">
        <div class="artistName col-12">By {{ data.artistName }}</div>
        <div>{{ numFormat(data.playCount) }}播放</div>
      </div>
    </div>
  </div>
</template>

<script>
import { numFormat } from 'src/utils/bigNum/bigNum'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'MvRecommend',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  setup(props) {
    const router = useRouter()
    function handleClick() {
      // mvMounted()
      router.push(`/`)
      setTimeout(() => {
        router.push('/mvplay/' + props.data.id)
      }, 10)
    }
    return {
      numFormat,
      handleClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 300px;
  .img {
    border-radius: 5px;
    cursor: pointer;
  }
  .info {
    .song-name {
      font-size: 20;
      font-weight: 900;
      word-spacing: 2px;
    }
    .opacity {
      opacity: 0.7;
    }
  }
}
</style>
