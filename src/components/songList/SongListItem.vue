<template>
  <div class="list-item" @click="itemClick">
    <div class="img-box">
      <q-img :src="listItem.picUrl || listItem.coverImgUrl" :width="imgWidth" :height="imgHeight" />
      <q-icon name="play_circle" />
    </div>
    <div class="list-info">
      <p>{{ listItem.name }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SongListItem',
  props: {
    listItem: {
      type: Object,
      default() {
        return {}
      },
    },
    width: {
      type: Number,
      default() {
        return 13
      },
    },
    height: {
      type: Number,
      default() {
        return 13
      },
    },
  },
  setup(props) {
    const imgWidth = computed(() => {
      return props.width + 'vw'
    })
    const imgHeight = computed(() => {
      return props.height + 'vw'
    })

    function itemClick() {
      let id = this.listItem.id
      this.$router.push({
        path: '/playlist/' + id,
      })
    }
    return {
      itemClick,
      imgWidth,
      imgHeight
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
  margin-bottom: 1vw;
  overflow: hidden;
  text-align: center;
  // align-items: center;
  /* background-color: pink; */

  .img-box {
    width: 13vw;
    .q-img {
      // width: 13vw;
      // height: 13vw;
      border-radius: 10px;
      /* 消除图片下的间隙 */
      vertical-align: middle;
      transition: filter 1s;
    }
    .q-icon {
      position: absolute;
      top: 58%;
      right: 17%;
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
      .q-img {
        filter: brightness(75%);
      }
    }
  }

  .list-info {
    width: 100%;
    // height: 45px;
    font-size: 13px;
    font-weight: 700;
    padding-top: 0.65vw;
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
