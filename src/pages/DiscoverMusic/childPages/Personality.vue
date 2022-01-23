<template>
  <div class="row">
    <!-- 轮播图 -->
    <q-carousel
      v-model="slide"
      swipeable
      animated
      infinite
      :autoplay="5000"
      control-color="white"
      navigation
      arrows
      class="bg-transparent text-white rounded-borders col-12"
    >
      <q-carousel-slide
        :name="index"
        v-for="(item, index) in state.banners"
        :key="index"
        class="column no-wrap text-center"
      >
        <a :href="item.url">
          <img class="bannerImage" :src="item.imageUrl" alt="" />
        </a>
      </q-carousel-slide>
    </q-carousel>

    <p class="title">
      推荐歌单
      <q-icon name="chevron_right" />
    </p>
    <song-list :song-lists="state.songlist" />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'

import SongList from 'components/songList/SongList'

import { QueryBanner } from '../../../utils/request/image/image.js'
import { QueryRecommendSongList } from '../../../utils/request/songList/songList'

export default defineComponent({
  name: 'Personality',
  components: {
    SongList,
  },
  setup() {
    const state = reactive({
      // 轮播图
      banners: [],
      // 推荐歌单
      songlist: [],
    })

    QueryBanner().then(res => {
      // banners = reactive(res.banners)
      state.banners = res.banners.splice(0, 4)
      // console.log(state.banners)
    })

    QueryRecommendSongList().then(res => {
      console.log(res.result)
      state.songlist = res.result.splice(0, 10)
    })

    return {
      // ...toRefs(state),
      state,
      slide: ref('style'),
    }
  },
})
</script>

<style lang="scss" scoped>
.bannerImage {
  width: 80%;
}
.title {
  font-weight: bold;
  font-size: 20px;
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  .q-icon {
    margin-left: -4px;
  }
}
</style>
