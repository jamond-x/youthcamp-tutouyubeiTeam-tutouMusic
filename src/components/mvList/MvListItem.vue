<template>
  <div class="list-item" @click="itemClick">
    <div class="img-box">
      <q-img :src="listItem.cover" />
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
      this.$router.push(`/mvplay/${id}`)
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
  width: 25%;
  height: 13vw;
  margin-bottom: 5px;
  overflow: hidden;
  text-align: center;
  // align-items: center;
  /* background-color: pink; */

  .img-box {
    width: 17vw;
    height: 10vw;
    overflow: hidden;
    border-radius: 8px;
    .q-img {
      width: 17vw;
      height: 10vw;
      /* 消除图片下的间隙 */
      vertical-align: middle;
      transition: all 0.8s;
    }
    .q-icon {
      position: absolute;
      top: 39%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 4vw;
      color: white;
      opacity: 0;
      transition: opacity 1s;
    }
    &:hover {
      cursor: pointer;
      .q-icon {
        opacity: 1;
      }
      .q-img {
        filter: brightness(75%);
        transform: scale(1.05);
      }
    }
  }

  .list-info {
    width: 100%;
    height: 40px;
    font-size: 14px;
    font-weight: 700;
    padding-top: 5px;
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
      }
    }
  }
}
</style>
