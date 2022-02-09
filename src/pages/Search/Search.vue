<template>
  <div class="search">
    <div class="text-h3 text-weight-light text-italic">{{ keywords }}</div>
    <div class="text-h5 q-pt-md">
      看看我们找到了什么？
      <span class="text-subtitle2" v-if="keywords == 'undefined'">bug or feature?</span>
    </div>

    <div class="songs q-pt-xl">
      <div class="row">
        <div class="col">
          <div>
            <div class="text-h4 text-weight-bold">单曲</div>
            <div class="text-subtitle q-pt-xs more" @click="jump('song')">更多</div>
          </div>
        </div>
        <div class="col-10">
          <div class="content" style="justify-content: space-between">
            <SongItem
              v-for="song in songs"
              :key="song.id"
              :id="song.id"
              cover="default"
              :title="song.name"
              :singer="song.artists[0].name"
              @immediatelyBroadcast="play"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="artists q-pt-xl">
      <div class="row">
        <div>
          <div class="text-h4 text-weight-bold">艺人</div>
          <div class="text-subtitle q-pt-xs more" @click="jump('artist')">更多</div>
        </div>
        <div class="content q-pt-md">
          <ArtistItem
            v-for="artist in artists"
            :key="artist.id"
            :avatar="artist.img1v1Url"
            :name="artist.name"
            :aid="artist.id"
          />
        </div>
      </div>
    </div>

    <div class="album q-pt-xl">
      <div class="row">
        <div class="col">
          <div>
            <div class="text-h4 text-weight-bold">专辑</div>
            <div class="text-subtitle q-pt-xs more" @click="jump('album')">更多</div>
          </div>
        </div>
        <div class="col-10">
          <div class="content">
            <AlbumItem
              v-for="al in albums"
              :key="al.id"
              :avatar="al.picUrl"
              :name="al.name"
              :aid="al.id"
              @newPlaylist="playList"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="playlist q-pt-xl">
      <div class="row">
        <div class="col">
          <div>
            <div class="text-h4 text-weight-bold">歌单</div>
            <div class="text-subtitle q-pt-xs more" @click="jump('playlist')">更多</div>
          </div>
        </div>
        <div class="col-10">
          <div class="content">
            <PlayListItem
              v-for="pl in playlists"
              :key="pl.id"
              :avatar="pl.coverImgUrl"
              :name="pl.name"
              :aid="pl.id"
              @newPlaylist="playList"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongItem from 'src/components/User/SongItem.vue'
import ArtistItem from 'src/components/User/ArtistItem.vue'
import AlbumItem from 'src/components/User/AlbumItem.vue'
import PlayListItem from 'src/components/User/PlayListItem.vue'
import { QuerySearch } from 'src/utils/request/search'
export default {
  name: 'Search',
  props: ['keywords'],
  components: {
    SongItem,
    ArtistItem,
    AlbumItem,
    PlayListItem,
  },
  data() {
    return {
      songs: [],
      albums: [],
      artists: [],
      playlists: [],
    }
  },
  methods: {
    search() {
      let that = this
      QuerySearch(this.keywords).then(res => {
        res.result.songs = res.result.songs.slice(0, 9)
        that.songs = res.result.songs
      })
      QuerySearch(this.keywords, 10).then(res => {
        res.result.albums = res.result.albums.slice(0, 5)
        that.albums = res.result.albums
      })
      QuerySearch(this.keywords, 100).then(res => {
        res.result.artists = res.result.artists.slice(0, 5)
        that.artists = res.result.artists
      })
      QuerySearch(this.keywords, 1000).then(res => {
        res.result.playlists = res.result.playlists.slice(0, 5)
        that.playlists = res.result.playlists
      })
    },
    jump(to) {
      this.$router.push('/search/' + this.keywords + '/' + to)
    },
    play(_id) {
      this.$emit('immediatelyBroadcast', _id + '')
    },
    playList(list) {
      this.$emit('newPlaylist', list)
    },
  },
  mounted() {
    this.search()
  },
  watch: {
    keywords(n, o) {
      this.search()
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  padding: 2rem;
  box-sizing: border-box;

  .content {
    display: flex;
    flex-wrap: wrap;
  }

  .more {
    cursor: pointer;
  }
}
</style>
