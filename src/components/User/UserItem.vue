<template>
  <div class="user-item" :id="aid" @click="jump">
    <div>
      <img :src="trueAvatar" />
      <div class="shadow" :style="'background-image: url(' + avatar + ');'"></div>
    </div>

    <div class="text-subtitle1 text-center">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'UserItem',
  props: ['avatar', 'aid', 'name'],
  data() {
    return {
      trueAvatar: 'https://cdn.exia.xyz/img/ttlogo.png',
    }
  },
  methods: {
    jump() {
      this.$router.push('/user/' + this.aid)
    },
    updateData() {
      let src = this.avatar + '?param=500y500'
      let that = this
      new Promise((rs, rj) => {
        let img = new Image()
        img.onload = function () {
          rs(img.width == img.height ? img.src : 'https://cdn.exia.xyz/img/ttdefault.png')
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
  },
  mounted() {
    this.updateData()
  },
  watch: {
    avatar(n, o) {
      this.updateData()
    },
  },
}
</script>

<style lang="scss" scoped>
.user-item {
  position: relative;
  width: calc((100% - 10rem) / 5);
  margin: 1rem;
  cursor: pointer;
  user-select: none;
}

.user-item img {
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

.user-item:hover .shadow {
  opacity: 1;
}
</style>
