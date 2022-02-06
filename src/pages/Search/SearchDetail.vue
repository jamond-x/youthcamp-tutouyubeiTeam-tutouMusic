<template>
  <div class="search-detail">
    <div class="text-h3 text-weight-light text-italic">{{ keywords }}</div>
    <div class="text-h5 q-pt-md">{{ title }}</div>

    <div class="content q-pt-xl">
      <div v-if="type === 'artist'">
        <q-infinite-scroll @load="update" :offset="250">
          <ArtistItem
            v-for="item in artists"
            :avatar="item.img1v1Url"
            :name="item.name"
            :aid="item.id"
            :key="item.id"
          />

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>

      <div v-if="type === 'album'">
        <q-infinite-scroll @load="update" :offset="250">
          <AlbumItem
            v-for="item in albums"
            :avatar="item.picUrl"
            :name="item.name"
            :aid="item.id"
            :key="item.id"
          />

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>

      <div v-if="type === 'song'">
        <q-infinite-scroll @load="update" :offset="250">
          <SongListItem
            v-for="item in songs"
            cover="default"
            :title="item.name"
            :id="item.id"
            :singer="item.artists[0].name"
            :key="item.id"
            :duration="item.duration"
            :album="item.album.name"
            @immediatelyBroadcast="play"
          />

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
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
      songs: [],
      albums: [],
      artists: [],
    }
  },
  methods: {
    update(index = 0, done) {
      let that = this
      let offset = (index - 1) * 30
      let finished = false
      if (this.type === 'artist') {
        QuerySearch(this.keywords, 100, offset).then(res => {
          that.artists = that.artists.concat(res.result.artists)
          if (res.result.artists.length < 30) finished = true
          if (typeof done === 'function') done(finished)
        })
      } else if (this.type === 'album') {
        QuerySearch(this.keywords, 10, offset).then(res => {
          that.albums = that.albums.concat(res.result.albums)
          if (res.result.albums.length < 30) finished = true
          if (typeof done === 'function') done(finished)
        })
      } else {
        QuerySearch(this.keywords, 1, offset).then(res => {
          that.songs = that.songs.concat(res.result.songs)
          if (res.result.songs.length < 30) finished = true
          if (typeof done === 'function') done()
        })
      }
    },
    play(_id) {
      console.log(_id)
      this.$emit('immediatelyBroadcast', _id + '')
    },
  },
  created() {
    this.title = this.type === 'song' ? '歌曲' : this.type === 'album' ? '专辑' : '歌手'
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
