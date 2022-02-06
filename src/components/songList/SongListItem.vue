<template>
  <div class="list-item" @click="itemClick">
    <div class="img-box">
      <img :src="listItem.picUrl || listItem.coverImgUrl" />
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  // flex: 20%;
  width: 20%;
  height: 15vw;
  margin-bottom: 10px;
  overflow: hidden;
  text-align: center;
  // align-items: center;
  /* background-color: pink; */

  .img-box {
    width: 13vw;
    img {
      width: 13vw;
      height: 13vw;
      border-radius: 8px;
      /* 消除图片下的间隙 */
      vertical-align: middle;
      transition: filter 1s;
    }
    .q-icon {
      position: absolute;
      top: 58%;
      right: 16%;
      font-size: 3.6vw;
      color: white;
      opacity: 0;
      transition: opacity 1s;
    }
    &:hover {
      cursor: pointer;
      .q-icon {
        opacity: 1;
      }
      img {
        filter: brightness(75%);
      }
    }
  }

  .list-info {
    width: 100%;
    height: 45px;
    font-size: 13px;
    font-weight: 700;
    padding-top: 10px;
    box-sizing: border-box;
    p {
      /* white-space: nowrap; */
      /* margin-bottom: 3px; */
      width: 100%;
      display: -webkit-box;
      // color: white;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      /* 文本溢出 */
      text-overflow: ellipsis;
      overflow: hidden;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
