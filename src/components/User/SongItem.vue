<template>
  <div class="song-item" @click="play">
    <img :src="trueCover" alt="title" />
    <div class="song-item-content">
      <h5 class="text-h6 text-weight-bold">{{ title }}</h5>
      <div class="text-subtitle2">{{ singer }}</div>
    </div>
  </div>
</template>

<script>
import { QuerySong } from 'src/utils/request/search'
export default {
  name: 'SongItem',
  props: ['id', 'cover', 'title', 'singer'],
  data() {
    return {
      trueCover: 'https://www.tupians.top/imgs/2022/02/e1ee4b35916d1b57.png',
    }
  },
  methods: {
    play() {
      this.$emit('immediatelyBroadcast', this.id + '')
    },
  },
  created() {
    if (this.cover == 'default') {
      QuerySong(this.id).then(res => {
        this.trueCover = res.songs[0].al.picUrl + '?param=500y500'
      })
    } else {
      this.trueCover = this.cover
    }
  },
}
</script>

<style lang="scss" scoped>
.song-item {
  display: flex;
  width: 30%;
  height: 5rem;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 0.5rem;
  transition: background 0.2s;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.song-item-content {
  position: relative;
  width: calc(100% - 4.75rem);
}

.song-item img {
  border-radius: 15px;
  margin-right: 0.75rem;
  height: 4rem;
  width: 4rem;
}

.text-h6 {
  position: relative;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-item:hover {
  background-color: $grey-9;
}

.body--light .song-item:hover {
  background-color: $grey-3;
}
</style>
