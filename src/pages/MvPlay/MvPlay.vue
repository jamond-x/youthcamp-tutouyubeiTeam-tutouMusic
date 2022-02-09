<template>
  <div class="box">
    <div class="video">
      <div class="title">{{ data.data.name }}播放中~~</div>
      <q-video :ratio="16 / 9" :src="mvUrl" />
    </div>
    <div class="list">
      <div class="title">相关MV推荐</div>
      <MvRecommend v-for="item in MVLikes.MVLikes" :key="item.id" :data="item"></MvRecommend>
    </div>
  </div>
</template>

<script>
import MvRecommend from 'src/components/mvRecommend/MvRecommend.vue'
import {
  QueryMvDetail,
  QueryMVInfo,
  QueryMVLikes,
  QueryMvPlay,
  QuerySongerCover,
} from 'src/utils/request/mv/mvdetail'
import { defineComponent, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'MvPlay',
  components: {
    MvRecommend,
  },
  setup() {
    const {
      params: { mvid },
    } = useRoute()
    let mvUrl = ref('')
    let Url = ref('')
    const data = reactive({
      data: {},
    })
    const info = reactive({
      info: {},
    })
    const MVLikes = reactive({
      MVLikes: [],
    })

    const mvMounted = async () => {
      const { data: data1 } = await QueryMvPlay(mvid)
      const { data: data2 } = await QueryMvDetail(mvid)
      const { mvs } = await QueryMVLikes(mvid)
      MVLikes.MVLikes = mvs
      const MVInfo = await QueryMVInfo(mvid)
      if (data2) {
        const { data } = await QuerySongerCover(data2.artists[0].id)
        Url.value = data.artist.cover
      }

      mvUrl.value = data1.url
      data.data = data2
      info.info = MVInfo
    }
    mvMounted()


    return { mvUrl, data, MVLikes }
  },
})
</script>

<style lang="scss" scoped>
.box {
  .title {
    font-size: 22px;
    font-weight: 700;
    text-align: center;
  }
  padding: 10px;
  width: 100%;
  /* min-height: 100vh; */
  display: grid;
  grid-template:
    'a a a b'
    'a a a b'
    'a a a b'
    'c c c b';
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  .video {
    grid-area: a;
  }
  .list {
    grid-area: b;
    .title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
    }
  }
  .card {
    border-radius: 10px;
    grid-area: c;
    display: flex;
    gap: 20px;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    // margin-top: -20px;
    .my-card {
      width: 200px;
      border-radius: 10px;
    }
  }
}
</style>
