<template>
  <div class="row">
    <div class="col-4">
      <q-card class="bg-light-blue-2 text-light-blue-10 user-like" flat>
        <q-card-section>
          <div class="text-h3">喜欢</div>
          <div>{{ playListData.trackIds.length }}首歌曲</div>
        </q-card-section>

        <q-card-actions align="right" class="user-like-bottom">
          <q-btn flat @click="playList">播放</q-btn>
          <q-btn flat @click="jump">查看</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-8">
      <div class="user-like-preview" v-if="!visible">
        <SongItem
          v-for="(song, index) in playListData.tracks"
          :key="index"
          :cover="song.al.picUrl"
          :title="song.name"
          :singer="song.ar[0].name"
          :singers="song.ar"
          :id="song.id"
          @immediatelyBroadcast="play"
        />
      </div>
      <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
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
        raw: [],
      },
      visible: true,
    }
  },
  methods: {
    updateData(id) {
      let that = this
      if (id)
        QueryPlayListDetail(id).then(res => {
          that.visible = false
          that.raw = res.playlist
          res.playlist.tracks = res.playlist.tracks.slice(0, 9)
          that.playListData = res.playlist
        })
    },
    play(_id) {
      this.$emit('immediatelyBroadcast', _id + '')
    },
    playList() {
      let list = []
      this.raw.trackIds.forEach(element => {
        list.push(element.id + '')
      })
      this.$emit('newPlaylist', list)
    },
    jump() {
      this.$router.push('/playlist/' + this.list)
    },
  },
  watch: {
    list(n, o) {
      this.updateData(n)
      this.visible = true
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
