<template>
  <div class="bar">
    <div class="song-detail row justify-start items-center">
      <q-img
        class="img q-ml-xl"
        src="https://pic1.zhimg.com/80/v2-83ca68baff4c5c4236f0c0da143b5d00_720w.jpg?source=1940ef5c"
      ></q-img>
      <div class="q-ml-md">
        <div class="song-name">龙卷风</div>
        <div class="singer">周杰伦</div>
      </div>
      <div class="offset-2">爱像一阵风 吹完她就走~</div>
    </div>
    <div class="controller column">
      <div class="row justify-around">
        <q-btn icon="fas fa-step-backward" size="10px" flat rounded />
        <q-btn icon="fas fa-pause-circle" size="19px" flat rounded />
        <q-btn icon="fas fa-step-forward" size="10px" flat rounded />
      </div>
      <q-linear-progress size="sm" value="0.6" color="white" label="Change Model" />
    </div>
    <div class="tools row reverse">
      <q-btn icon="fas fa-stream" flat rounded class="q-mr-lg" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Playlist',
  components: {},
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.bar {
  background-color: #2c1919;
  position: relative;
  width: 100%;
  height: 70px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  .song-detail {
    .pointer {
      cursor: pointer;
    }
    .img {
      width: 50px;
      height: 50px;
      border: solid 1px white;
      position: relative;
      @extend .pointer;
    }
    .img:hover {
      opacity: 0.4;
    }
    .song-name {
      @include custom-font(16px, 600, 1px, inherit);
      @extend .pointer;
    }
    .singer {
      @include custom-font(15px, 100, 1px, inherit);
      @extend .pointer;
    }
  }
}
</style>
