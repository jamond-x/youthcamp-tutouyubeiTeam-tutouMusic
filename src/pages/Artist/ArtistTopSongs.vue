<template>
  <div class="top-songs q-mt-xl">
    <div class="content row">
      <div class="col-4">
        <div class="text-h4">热门歌曲</div>
        <div class="text-subtitle1 more" @click="jump">所有歌曲</div>
      </div>
      <div class="col-8" style="display: flex; flex-wrap: wrap; justify-content: space-between">
        <SongItem
          v-for="s in songs"
          :key="s.id"
          :cover="s.al.picUrl"
          :title="s.name"
          :singer="s.ar[0].name"
          :singers="s.ar"
          :id="s.id"
          @immediatelyBroadcast="play"
        />
      </div>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { QueryArtistTopSong } from 'src/utils/request/search'
import SongItem from 'src/components/User/SongItem.vue'
export default {
  name: 'ArtistTopSongs',
  props: ['aid'],
  data() {
    return {
      visible: true,
      songs: [],
    }
  },
  components: {
    SongItem,
  },
  methods: {
    updateData(_id) {
      let that = this
      QueryArtistTopSong(_id).then(res => {
        that.songs = res.songs.splice(0, 9)
        that.visible = false
      })
    },
    play(_id) {
      this.$emit('immediatelyBroadcast', _id + '')
    },
    jump() {
      this.$router.push('/artist/' + this.aid + '/songs')
    },
  },
  created() {
    this.updateData(this.aid)
  },
  watch: {
    aid(n, o) {
      this.updateData(n)
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
.top-songs {
  position: relative;
  .content {
    .more {
      cursor: pointer;
    }
  }
}
</style>
