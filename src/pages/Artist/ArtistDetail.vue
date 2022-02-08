<template>
  <div class="artist-detail">
    <div class="text-h3 text-weight-light text-italic">{{ name }}的{{ title }}</div>

    <div class="content q-pt-xl">
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

      <div v-if="type === 'songs'">
        <q-infinite-scroll @load="update" :offset="250">
          <div class="flexbox">
            <SongListItem
              v-for="item in songs"
              cover="default"
              :title="item.name"
              :id="item.id"
              :singer="item.ar[0].name"
              :key="item.id"
              :duration="item.dt"
              :singers="item.ar"
              :album="item.al.name"
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
    </div>
  </div>
</template>

<script>
import { QueryArtistSong, QueryArtistAlbum, QueryArtist } from 'src/utils/request/search'
import AlbumItem from 'src/components/User/AlbumItem.vue'
import SongListItem from 'src/components/User/SongListItem.vue'
export default {
  name: 'ArtistDetail',
  props: ['id', 'type'],
  components: {
    AlbumItem,
    SongListItem,
  },
  data() {
    return {
      title: '',
      name: '',
      songs: [],
      albums: [],
    }
  },
  methods: {
    update(index = 0, done) {
      let that = this
      let offset = (index - 1) * 30
      if (this.type === 'songs') {
        QueryArtistSong(this.id, offset).then(res => {
          that.songs = that.songs.concat(res.songs)
          done(!res.more)
        })
      } else {
        QueryArtistAlbum(this.id, offset).then(res => {
          that.albums = that.albums.concat(res.hotAlbums)
          done(!res.more)
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
      case 'songs':
        this.title = '歌曲'
        break
      case 'album':
        this.title = '专辑'
        break
      default:
        break
    }
    let that = this
    QueryArtist(this.id).then(res => {
      that.name = res.data.artist.name
    })
  },
}
</script>

<style lang="scss" scoped>
.artist-detail {
  padding: 2rem;
  box-sizing: border-box;

  .flexbox {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
