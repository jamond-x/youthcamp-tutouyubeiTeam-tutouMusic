<template>
  <div class="list-item" @click="itemClick">
    <div class="img-box">
      <img :src="listItem.picUrl || listItem.coverImgUrl" />
      <i class="el-icon-video-play" />
    </div>
    <div class="list-info">
      <p>{{ listItem.name }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SongListItem',
  props: {
    listItem: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  setup() {
    function itemClick() {
      let id = this.listItem.id
      this.$router.push({
        path: '/index/songListContent' + id,
      })
    }
    return {
      itemClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.list-item {
  position: relative;
  flex: 20%;
  // width: 145px;
  height: 15vw;
  margin-bottom: 10px;
  overflow: hidden;
  text-align: center;
  // align-items: center;
  /* background-color: pink; */
  .img-box:hover {
    cursor: pointer;
    i {
      opacity: 1;
    }
  }
  img {
    width: 12vw;
    height: 12vw;
    border-radius: 5px;
    /* 消除图片下的间隙 */
    vertical-align: middle;
  }
  .list-info {
    width: 100%;
    height: 45px;
    font-size: 14px;
    padding-top: 10px;
    box-sizing: border-box;
    p {
      /* white-space: nowrap; */
      /* margin-bottom: 3px; */
      width: 100%;
      display: -webkit-box;
      color: white;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      /* 文本溢出 */
      text-overflow: ellipsis;
      overflow: hidden;
      &:hover {
        cursor: pointer;
        color: gainsboro;
      }
    }
  }

  i {
    position: absolute;
    top: 109px;
    right: 6px;
    font-size: 30px;
    color: white;
    opacity: 0;
    transition: opacity 1s;
  }
}
</style>
