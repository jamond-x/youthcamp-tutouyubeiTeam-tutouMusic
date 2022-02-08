<template>
  <div class="artist-item" :id="aid">
    <div>
      <img :src="trueAvatar" />
      <div class="shadow" :style="'background-image: url(' + avatar + ');'"></div>
    </div>

    <div class="text-subtitle1 text-center" style="width: 100%">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'ArtistItem',
  props: ['avatar', 'aid', 'name'],
  data() {
    return {
      trueAvatar: 'https://www.tupians.top/imgs/2022/02/e1ee4b35916d1b57.png',
    }
  },
  created() {
    let src = this.avatar + '?param=500y500'
    let that = this
    new Promise((rs, rj) => {
      let img = new Image()
      img.onload = function () {
        rs(
          img.width == img.height
            ? img.src
            : 'https://img.gejiba.com/images/aa2ee58648295652ba10be5ec1b5b0ea.png'
        )
      }
      img.src = src
    })
      .then(success => {
        that.trueAvatar = success
      })
      .catch(error => {
        console.log('加载失败', error)
      })
  },
}
</script>

<style lang="scss" scoped>
.artist-item {
  position: relative;
  width: calc((100% - 10rem) / 5);
  margin: 1rem;
  cursor: pointer;
  user-select: none;
}

.artist-item img {
  position: relative;
  width: 100%;
  border-radius: 50%;
  margin-bottom: 0.25rem;
  z-index: 2;
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
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.artist-item:hover .shadow {
  opacity: 1;
}
</style>
