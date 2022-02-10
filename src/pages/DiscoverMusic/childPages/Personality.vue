<template>
  <div class="row">
    <!-- 轮播图 -->
    <q-carousel
      v-model="slide"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      infinite
      :autoplay="4000"
      control-color="grey-6"
      navigation
      arrows
      height="25vw"
      class="rounded-borders col-12"
      :class="[$q.dark.mode ? 'body--dark' : 'body--light']"
    >
      <q-carousel-slide
        :name="index"
        v-for="(item, index) in state.banners"
        :key="item"
        class="row justify-center no-wrap"
      >
        <img class="bannerImage" :src="item.imageUrl" alt="" />
      </q-carousel-slide>
    </q-carousel>
    <q-skeleton v-show="!finishLoading" width="100%" height="25vw" class="skeleton" />

    <p class="title">
      推荐歌单
      <q-icon name="chevron_right" />
    </p>
    <song-list class="col-12" :song-lists="state.songlist" :width="13" :height="13" />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watchEffect, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'

import SongList from 'components/songList/SongList'

import { QueryBanner } from 'src/utils/request/image/image.js'
import { QueryRecommendSongList } from 'src/utils/request/songList/songList'

export default defineComponent({
  name: 'Personality',
  components: {
    SongList,
  },
  setup() {
    const store = useStore()

    const loginFlag = computed(() => {
      return store.state.loginFlag
    })
    const state = reactive({
      // 轮播图
      banners: [],
      // 推荐歌单
      songlist: [],
    })

    const finishLoading = ref(false)

    watchEffect(() => {
      if (loginFlag.value === 1) {
        QueryRecommendSongList('recommend/resource').then(res => {
          console.log(res)
          state.songlist = res.recommend.splice(0, 10)
        })
      } else {
        QueryRecommendSongList().then(res => {
          console.log(res)
          state.songlist = res.result
        })
      }
    })

    QueryBanner().then(res => {
      state.banners = res.banners.splice(0, 4)
      // console.log(state.banners)
      setTimeout(() => {
        finishLoading.value = true
      }, 4000)
    })

    // QueryRecommendSongList().then(res => {
    //   // console.log(res.result)
    //   state.songlist = res.result
    // })

    onUnmounted(() => {
      console.log('erer')
    })

    return {
      // ...toRefs(state),
      state,
      slide: ref('style'),
      finishLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.skeleton {
  position: absolute;
  z-index: 1;
  background-color: #dcdcdc;
}
.bannerImage {
  width: 74%;
}
.title {
  font-weight: bold;
  font-size: 20px;
  // margin-top: .1vh;
  margin-left: 1.5vw;
  margin-top: 0.4vw;
  margin-bottom: 0.4vw;
  .q-icon {
    margin-left: -4px;
  }
}
</style>
