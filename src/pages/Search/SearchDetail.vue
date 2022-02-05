<template>
  <div class="search-detail">
    <div class="text-h3 text-weight-light text-italic">{{ keywords }}</div>
    <div class="text-h5 q-pt-md">{{ title }}</div>

    <div class="content q-pt-xl">
      <div v-if="type === 'artist'">
        <ArtistItem
          v-for="item in results.artists"
          :avatar="item.img1v1Url"
          :name="item.name"
          :aid="item.id"
          :key="item.id"
        />
      </div>

      <div v-if="type === 'album'">
        <AlbumItem
          v-for="item in results.albums"
          :avatar="item.picUrl"
          :name="item.name"
          :aid="item.id"
          :key="item.id"
        />
      </div>

      <div v-if="type === 'song'">
        <SongListItem
          v-for="item in results.songs"
          cover="default"
          :title="item.name"
          :id="item.id"
          :singer="item.artists[0].name"
          :key="item.id"
          :duration="item.duration"
          :album="item.album.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { QuerySearch } from 'src/utils/request/search'
import ArtistItem from 'src/components/User/ArtistItem.vue'
import AlbumItem from 'src/components/User/AlbumItem.vue'
import SongListItem from 'src/components/User/SongListItem.vue'
export default {
  name: 'SearchDetail',
  props: ['keywords', 'type'],
  components: {
    ArtistItem,
    AlbumItem,
    SongListItem,
  },
  data() {
    return {
      title: '',
      results: {},
      page: 0,
    }
  },
  created() {
    this.title = this.type === 'song' ? '歌曲' : this.type === 'album' ? '专辑' : '歌手'
    let that = this
    if (this.type === 'artist') {
      QuerySearch(this.keywords, 100).then(res => {
        that.results = res.result
      })
    } else if (this.type === 'album') {
      QuerySearch(this.keywords, 10).then(res => {
        that.results = res.result
      })
    } else {
      QuerySearch(this.keywords).then(res => {
        that.results = res.result
        console.log(res)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.search-detail {
  padding: 2rem;
  box-sizing: border-box;

  .content div {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
