<template>
  <div class="box">
    <div class="video">
      <div>
        <div class="video-name q-my-sm">{{ state.mvData.name }}</div>
        <q-video :ratio="16 / 9" :src="mvUrl" />
      </div>
      <div class="video-info q-my-md q-ml-lg">
        <q-badge
          class="q-mr-sm q-mt-sm"
          color="cyan-2"
          v-for="(item, index) in videoGroup"
          :key="index"
        >
          {{ item.name }}
        </q-badge>
        <span class="opacity">播放：{{ playCount }}</span>
        <span class="opacity">发布：{{ publishTime }}</span>

        <div class="q-mt-sm">
          <q-chip v-for="(item, index) in videoArtists" :key="index">
            <q-avatar> src/utils/request/mv/mvDetailuasar.dev/img/boy-avatar.png" /> </q-avatar>
            {{ item.name }}
          </q-chip>
        </div>
      </div>

      <div>
        <Comment :id="mvid" :type="1" />
      </div>
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
} from 'src/utils/request/mv/mvDetail'
import { defineComponent, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Comment from 'src/pages/BroadcastSongs/Comment.vue'

export default defineComponent({
  name: 'MVPlay',
  components: {
    MvRecommend,
    Comment,
  },
  setup() {
    const {
      params: { mvid },
    } = useRoute()
    let mvUrl = ref('')
    let Url = ref('')
    let playCount = ref('0')
    let publishTime = ref('')
    let videoGroup = ref([])
    let videoArtists = ref([])
    const state = reactive({
      mvData: {},
    })
    const MVLikes = reactive({
      MVLikes: [],
    })
    const mvMounted = async () => {
      const { data: data1 } = await QueryMvPlay(mvid)
      const res = await QueryMvDetail(mvid)
      console.log(res)
      const { data: data2 } = res
      playCount.value = res.data.playCount
      publishTime.value = res.data.publishTime
      videoGroup.value = res.data.videoGroup
      videoArtists.value = res.data.artists
      const { mvs } = await QueryMVLikes(mvid)
      MVLikes.MVLikes = mvs
      const MVInfo = await QueryMVInfo(mvid)
      if (data2) {
        const { data } = await QuerySongerCover(data2.artists[0].id)
        Url.value = data.artist.cover
      }
      mvUrl.value = data1.url
      state.mvData = data2
    }
    mvMounted()
    return { mvid, mvUrl, state, MVLikes, playCount, publishTime, videoGroup, videoArtists }
  },
})
</script>

<style lang="scss" scoped>
.opacity {
  opacity: 0.7;
}
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
  grid-template-columns: 5fr 2fr;
  gap: 10px;
  .video {
    .video-name {
      font-size: 22px;
      font-weight: 700;
    }
    .video-info {
      font-size: 13px;
    }
  }
  .list {
    .title {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
    }
  }
}
</style>
