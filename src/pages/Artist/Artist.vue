<template>
  <div class="artist">
    <ArtistProfile :aid="id" />
    <ArtistTopSongs @immediatelyBroadcast="play" :aid="id" />
    <ArtistAlbum @newPlaylist="playList" :aid="id" />
    <SimiArtist :aid="id" />
  </div>
</template>

<script>
import ArtistProfile from './ArtistProfile.vue'
import ArtistTopSongs from './ArtistTopSongs.vue'
import ArtistAlbum from './ArtistAlbum.vue'
import SimiArtist from './SimiArtist.vue'
export default {
  name: 'Artist',
  props: ['id'],
  components: {
    ArtistProfile,
    ArtistTopSongs,
    ArtistAlbum,
    SimiArtist,
  },
  data() {
    return {}
  },
  methods: {
    updateData(_id) {},
    play(_id) {
      this.$emit('immediatelyBroadcast', _id + '')
    },
    playList(list) {
      this.$emit('newPlaylist', list)
    },
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.artist {
  box-sizing: border-box;
  margin: 2rem;
}
</style>
