<template>
  <div class="song-list-item row q-mb-xs" @click="play" @contextmenu.prevent="addFavor">
    <div class="col">
      <div class="song-item">
        <img :src="trueCover" alt="title" />
        <div class="song-item-content">
          <h5 class="text-h6 text-weight-bold">{{ title }}</h5>
          <div class="text-subtitle2 singers">{{ trueSinger }}</div>
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
import { QueryPlayList, AddFavorSong } from 'src/utils/request/user'
import { useQuasar } from 'quasar'
export default {
  name: 'SongListItem',
  props: ['id', 'cover', 'title', 'singer', 'album', 'duration', 'singers'],
  data() {
    return {
      trueCover: 'https://cdn.exia.xyz/img/ttlogo.png',
      length: '0:00',
      trueSinger: '',
    }
  },
  methods: {
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n)
    },
    play() {
      this.$emit('immediatelyBroadcast', this.id)
    },
    addFavor() {
      if (localStorage.getItem('uid')) {
        let that = this
        QueryPlayList(localStorage.getItem('uid')).then(res => {
          AddFavorSong(this.id, res.playlist[0].id)
            .then(r => {
              that.$q.notify({
                message: '收藏成功',
                position: 'top',
              })
            })
            .catch(error => {
              that.$q.notify({
                message: '哎呀，出了点问题',
                position: 'top',
              })
            })
        })
      } else {
        this.qua.notify({
          message: '请先登录！',
          position: 'top',
        })
      }
    },
    setup() {
      const $q = useQuasar()
      return {
        $q,
      }
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
    this.length = this.duration / 1000
    this.length =
      Math.floor(this.length / 60) + ':' + this.PrefixZero(Math.floor(this.length % 60), 2)
    if (this.singers) {
      let singerList = []
      this.singers.forEach(element => {
        singerList.push(element.name)
      })
      this.trueSinger = singerList.join(' / ')
    } else this.trueSinger = this.singer
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
    width: 90%;
  }
}

.song-item-content {
  position: relative;
  width: calc(100% - 4.75rem);

  .singers {
    position: relative;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.song-list-item:hover {
  background-color: $grey-9;
}

.body--light .song-list-item:hover {
  background-color: $grey-3;
}
</style>
