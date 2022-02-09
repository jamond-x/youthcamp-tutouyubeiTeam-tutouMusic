<template>
  <div class="search-detail">
    <div class="text-h3 text-weight-light text-italic">{{ keywords }}</div>
    <div class="text-h5 q-pt-md">{{ title }}</div>

    <div class="content q-pt-xl">
      <div v-if="type === 'artist'">
        <q-infinite-scroll @load="update" :offset="250">
          <div class="flexbox">
            <ArtistItem
              v-for="item in artists"
              :avatar="item.img1v1Url"
              :name="item.name"
              :aid="item.id"
              :key="item.id"
            />
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>

      <div v-if="type === 'album'">
        <q-infinite-scroll @load="update" :offset="250">
          <div class="flexbox">
            <AlbumItem
              v-for="item in albums"
              :avatar="item.picUrl"
              :name="item.name"
              :aid="item.id"
              :key="item.id"
              @newPlaylist="playList"
            />
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>

      <div v-if="type === 'song'">
        <q-infinite-scroll @load="update" :offset="250">
          <div class="flexbox">
            <SongListItem
              v-for="item in songs"
              cover="default"
              :title="item.name"
              :id="item.id"
              :singer="item.artists[0].name"
              :singers="item.artists"
              :key="item.id"
              :duration="item.duration"
              :album="item.album.name"
              @immediatelyBroadcast="play"
            />
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>

      <div v-if="type === 'playlist'">
        <q-infinite-scroll @load="update" :offset="250">
          <div class="flexbox">
            <PlayListItem
              v-for="pl in playlists"
              :key="pl.id"
              :avatar="pl.coverImgUrl"
              :name="pl.name"
              :aid="pl.id"
              @newPlaylist="playList"
            />
          </div>

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
import PlayListItem from 'src/components/User/PlayListItem.vue'
export default {
  name: 'SearchDetail',
  props: ['keywords', 'type'],
  components: {
    ArtistItem,
    AlbumItem,
    SongListItem,
    PlayListItem,
  },
  data() {
    return {
      title: '',
      songs: [],
      albums: [],
      artists: [],
      playlists: [],
    }
  },
  methods: {
    update(index = 0, done) {
      let that = this
      let offset = (index - 1) * 30
      if (this.type === 'artist') {
        QuerySearch(this.keywords, 100, offset).then(res => {
          that.artists = that.artists.concat(res.result.artists)
          done(!res.result.hasMore)
        })
      } else if (this.type === 'album') {
        QuerySearch(this.keywords, 10, offset).then(res => {
          that.albums = that.albums.concat(res.result.albums)
          done(res.result.albums.length < 30)
        })
      } else if (this.type === 'song') {
        QuerySearch(this.keywords, 1, offset).then(res => {
          that.songs = that.songs.concat(res.result.songs)
          done(!res.result.hasMore)
        })
      } else {
        QuerySearch(this.keywords, 1000, offset).then(res => {
          console.log(res)
          that.playlists = that.playlists.concat(res.result.playlists)
          done(!res.result.hasMore)
        })
      }
    },
    play(_id) {
      this.$emit('immediatelyBroadcast', _id + '')
    },
    playList(list) {
      this.$emit('newPlaylist', list)
    },
  },
  created() {
    switch (this.type) {
      case 'song':
        this.title = '歌曲'
        break
      case 'album':
        this.title = '专辑'
        break
      case 'artist':
        this.title = '艺人'
        break
      default:
        this.title = '歌单'
        break
    }
  },
}
</script>

<style lang="scss" scoped>
.search-detail {
  padding: 2rem;
  box-sizing: border-box;

  .flexbox {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
