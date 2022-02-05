<template>
  <div class="list-item" @click="itemClick">
    <div class="img-box">
      <img :src="listItem.cover" />
      <q-icon name="play_circle" />
    </div>
    <div class="list-info">
      <p>{{ listItem.name }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MvListItem',
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

<style lang='scss' scoped>
.list-item {
  position: relative;
  // flex: 20%;
  width: 25%;
  height: 13vw;
  margin-bottom: 10px;
  overflow: hidden;
  text-align: center;
  // align-items: center;
  /* background-color: pink; */
  .q-icon {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4vw;
    color: white;
    opacity: 0;
    transition: opacity 1s;
  }
  .img-box:hover {
    cursor: pointer;
    .q-icon {
      opacity: 1;
    }
    img {
      filter: brightness(80%);
    }
  }
  img {
    width: 17vw;
    height: 10vw;
    border-radius: 8px;
    /* 消除图片下的间隙 */
    vertical-align: middle;
    transition: filter 1s;
  }
  .list-info {
    width: 100%;
    height: 35px;
    font-size: 14px;
    padding-top: 10px;
    box-sizing: border-box;
    p {
      /* white-space: nowrap; */
      /* margin-bottom: 3px; */
      width: 100%;
      display: -webkit-box;
      /* color: white; */
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
}
</style>
