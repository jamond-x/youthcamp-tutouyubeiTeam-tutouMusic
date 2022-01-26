<template>
  <div class="row">
    <div class="col-4">
      <q-card class="bg-light-blue-2 text-light-blue-10 user-like">
        <q-card-section>
          <div class="text-h3">喜欢</div>
          <div>{{ playListData.trackIds.length }}首歌曲</div>
        </q-card-section>

        <q-card-actions align="right" class="user-like-bottom">
          <q-btn flat>播放</q-btn>
          <q-btn flat>查</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-8">
      <div class="user-like-preview">
        <SongItem
          v-for="(song, index) in playListData.tracks"
          :key="index"
          :cover="song.al.picUrl"
          :title="song.name"
          :singer="song.ar[0].name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SongItem from '../../components/User/SongItem.vue'
import { QueryPlayListDetail } from 'src/utils/request/user'
export default {
  name: 'UserLikeBar',
  props: ['list'],
  components: {
    SongItem,
  },
  data() {
    return {
      playListData: {
        trackIds: [],
        tracks: [],
      },
    }
  },
  methods: {
    updateData(id) {
      let that = this
      if (id)
        QueryPlayListDetail(id).then(res => {
          res.playlist.tracks = res.playlist.tracks.slice(0, 9)
          that.playListData = res.playlist
        })
    },
  },
  watch: {
    list(n, o) {
      this.updateData(n)
    },
  },
  mounted() {
    this.updateData(this.list)
  },
}
</script>

<style lang="scss" scoped>
.user-like {
  height: calc(300px - 2rem);
  margin: 1rem;
  border-radius: 15px;
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
