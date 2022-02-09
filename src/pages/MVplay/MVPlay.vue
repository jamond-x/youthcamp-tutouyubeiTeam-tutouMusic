<template>
  <div class="box">
    <div class="video">
      <div class="title">{{ data.data.name }}播放中~~</div>
      <q-video :ratio="16 / 9" :src="mvUrl" />
    </div>
    <div class="list">
      <div class="title">相关MV推荐</div>
      <MVLikesItem v-for="item in MVLikes.MVLikes" :key="item.id" :data="item"></MVLikesItem>
    </div>

    <div class="card">
      <q-card class="my-card">
        <q-img :src="Url" fit="fill"> </q-img>
      </q-card>

      <!-- 第一列 -->
      <q-list separator>
        <q-item v-ripple>
          <q-item-section>MV名称：{{ data.data.name }}</q-item-section>
          <q-item-section avatar>
            <q-btn flat round color="red" icon="favorite" />
          </q-item-section>
          <q-item-section>(点赞数量：{{ numFormat(info.info.likedCount) }})</q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>作者名：{{ data.data.artistName }}</q-item-section>
          <q-item-section avatar>
            <q-btn flat round color="accent" icon="bookmark" />
          </q-item-section>
          <q-item-section>(评论数量：{{ numFormat(info.info.commentCount) }})</q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>{{ data.data.desc === '' ? '暂无描述' : data.data.desc }}</q-item-section>
          <q-item-section avatar>
            <q-btn flat round color="primary" icon="share" />
          </q-item-section>
          <q-item-section>(分享数量：{{ numFormat(info.info.shareCount) }})</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script>
import MVLikesItem from 'src/components/MVLikesItem/MVLikesItem.vue'
import { numFormat } from 'src/utils/bigNum/bigNum'
import {
  QueryMvDetail,
  QueryMVInfo,
  QueryMVLikes,
  QueryMvPlay,
  QuerySongerCover,
} from 'src/utils/request/mv/mvdetail'
import { defineComponent, ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'MVplay',
  components: {
    MVLikesItem,
  },
  setup() {
    const {
      params: { mvid },
    } = useRoute()
    console.log('%c 🍶 mvid: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', mvid)
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

    const mounted = async () => {
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
    mounted()

    return { mvUrl, data, Url, info, numFormat, MVLikes }
  },
})
</script>
<style lang="scss">
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
    margin-top: -20px;
    .my-card {
      width: 200px;
      border-radius: 10px;
    }
  }
}
</style>
