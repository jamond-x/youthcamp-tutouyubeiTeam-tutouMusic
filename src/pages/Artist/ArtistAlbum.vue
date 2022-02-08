<template>
  <div class="albums q-mt-xl">
    <div class="content">
      <div class="text-h4">热门专辑</div>
      <div class="text-subtitle1 more" @click="jump">所有专辑</div>
      <div style="display: flex; flex-wrap: wrap">
        <AlbumItem
          v-for="item in albums"
          :key="item.id"
          :aid="item.id"
          :avatar="item.picUrl"
          :name="item.name"
          @newPlaylist="playList"
        />
      </div>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { QueryArtistAlbum } from 'src/utils/request/search'
import AlbumItem from 'src/components/User/AlbumItem.vue'
export default {
  name: 'ArtistAlbum',
  props: ['aid'],
  data() {
    return {
      visible: true,
      albums: [],
    }
  },
  components: {
    AlbumItem,
  },
  methods: {
    updateData(_id) {
      let that = this
      QueryArtistAlbum(_id).then(res => {
        that.albums = res.hotAlbums
        that.visible = false
      })
    },
    playList(list) {
      this.$emit('newPlaylist', list)
    },
    jump() {
      this.$router.push('/artist/' + this.aid + '/album')
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
.albums {
  position: relative;
  .content {
    .more {
      cursor: pointer;
    }
  }
}
</style>
