<template>
  <div class="playlist-item" :id="aid" @dblclick="play" @click="jump">
    <div>
      <img :src="trueAvatar" />
      <div class="shadow" :style="'background-image: url(' + trueAvatar + ');'"></div>
    </div>

    <div class="text-subtitle1 text-center" style="width: 100%">{{ name }}</div>
  </div>
</template>

<script>
import { QueryPlayListDetail } from 'src/utils/request/user'
export default {
  name: 'PlayListItem',
  props: ['avatar', 'aid', 'name'],
  data() {
    return {
      trueAvatar: 'https://cdn.exia.xyz/img/ttlogo.png',
    }
  },
  methods: {
    play() {
      if (localStorage.getItem('playlist' + this.aid)) {
        this.$emit('newPlaylist', JSON.parse(localStorage.getItem('playlist' + this.aid)))
      } else {
        QueryPlayListDetail(this.aid).then(res => {
          let list = []
          res.playlist.trackIds.forEach(element => {
            list.push(element.id + '')
          })
          localStorage.setItem('playlist' + this.aid, JSON.stringify(list))
          this.$emit('newPlaylist', list)
        })
      }
    },
    jump() {
      this.$router.push('/playlist/' + this.aid)
    },
  },
  created() {
    let src = this.avatar + '?param=500y500'
    let that = this
    new Promise((rs, rj) => {
      let img = new Image()
      img.onload = function () {
        rs(img.src)
      }
      img.src = src
    })
      .then(success => {
        that.trueAvatar = success
      })
      .catch(error => {
        console.log('加载失败惹！', error)
      })
  },
}
</script>

<style lang="scss" scoped>
.playlist-item {
  position: relative;
  width: calc((100% - 10rem) / 5);
  margin: 1rem;
  cursor: pointer;
  user-select: none;
}

.playlist-item img {
  position: relative;
  width: 100%;
  border-radius: 15px;
  margin-bottom: 0.25rem;
  z-index: 2;
  transition: transform 0.2s;
}

.shadow {
  position: absolute;
  top: 0.5rem;
  width: 100%;
  filter: blur(16px) opacity(0.6);
  transform: scale(0.92, 0.96);
  z-index: 1;
  background-size: cover;
  aspect-ratio: 1/1;
  opacity: 0;
  transition: opacity 0.2s;
}

.playlist-item:hover img {
  transform: translateY(-0.2rem);
}

.playlist-item:hover .shadow {
  opacity: 1;
}
</style>
