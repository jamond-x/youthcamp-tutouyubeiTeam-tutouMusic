<template>
  <div class="song-list-item row q-mb-xs" @click="play">
    <div class="col">
      <div class="song-item">
        <img :src="trueCover" alt="title" />
        <div class="song-item-content">
          <h5 class="text-h6 text-weight-bold">{{ title }}</h5>
          <div class="text-subtitle2">{{ singer }}</div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="row">
        <div class="col">
          <div class="text-subtitle1 album">
            <p>
              {{ album }}
            </p>
          </div>
        </div>
        <div class="col">
          <div class="text-subtitle1 duration q-pr-md">
            <p>
              {{ length }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QuerySong } from 'src/utils/request/search'
export default {
  name: 'SongListItem',
  props: ['id', 'cover', 'title', 'singer', 'album', 'duration'],
  data() {
    return {
      trueCover: 'https://www.tupians.top/imgs/2022/02/e1ee4b35916d1b57.png',
      length: '0:00',
    }
  },
  methods: {
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n)
    },
    play() {
      this.$emit('immediatelyBroadcast', this.id)
    },
  },
  created() {
    if (this.cover == 'default') {
      QuerySong(this.id).then(res => {
        this.trueCover = res.songs[0].al.picUrl
      })
    } else {
      this.trueCover = this.cover
    }
    this.length = this.duration / 1000
    this.length =
      Math.floor(this.length / 60) + ':' + this.PrefixZero(Math.floor(this.length % 60), 2)
  },
}
</script>

<style lang="scss" scoped>
.song-list-item {
  height: 5rem;
  width: 100%;
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem;

  .album p,
  .duration p {
    margin: 0;
    line-height: 4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .duration {
    text-align: right;
  }
}
.song-item {
  display: flex;
  width: 100%;

  border-radius: 15px;
  box-sizing: border-box;
  transition: background 0.2s;

  position: relative;

  img {
    border-radius: 15px;
    margin-right: 1.5rem;
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
}

.song-item-content {
  position: relative;
  width: calc(100% - 4.75rem);
}

.song-list-item:hover {
  background-color: $grey-9;
}

.body--light .song-list-item:hover {
  background-color: $grey-3;
}
</style>
