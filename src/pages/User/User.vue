<template>
  <q-page class="container">
    <div class="header">
      <div class="text-h2" style="margin-bottom: 3rem">{{ userdata.name }}的音乐库</div>
      <div class="row">
        <div class="col-4">
          <q-card class="bg-light-blue-2 text-light-blue-10 user-like">
            <q-card-section>
              <div class="text-h3">喜欢</div>
              <div>112首歌曲</div>
            </q-card-section>

            <q-card-actions align="right" class="user-like-bottom">
              <q-btn flat>播放</q-btn>
              <q-btn flat>查看</q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-8">
          <div class="user-like-preview">
            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />
            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />
            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />

            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />
            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />
            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />

            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />
            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />
            <SongItem
              cover="https://p2.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg?param=224y224"
              title="测试"
              singer="歌手"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content"></div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import SongItem from '../../components/User/SongItem.vue'
export default defineComponent({
  name: 'User',
  components: {
    SongItem,
  },
  data() {
    return {
      userdata: {
        name: '用户名',
      },
    }
  },
  methods: {},
  created() {},
})
</script>

<style scoped>
.container {
  box-sizing: border-box;
  padding: 2rem;
}

.content {
  box-sizing: border-box;
  height: 300px;
  padding: 1rem 0;
}

.user-like {
  height: calc(300px - 2rem);
  margin: 1rem;
}

.user-like-bottom {
  position: absolute;
  bottom: 0;
  right: 0;
}

.user-like-preview {
  display: flex;
  margin: 1rem;
  height: calc(300px - 2rem);
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
</style>
