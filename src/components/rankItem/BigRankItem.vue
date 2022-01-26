<template>
  <div class="bigBox">
    <!-- 遮罩层 -->
    <div class="mask">
      <q-img class="img" :src="item.coverImgUrl"> </q-img>
    </div>

    <q-img class="img" :src="item.coverImgUrl">
      <div class="over">
        <div class="text">→点击前往{{ item.name }}</div>
      </div>
      <div class="absolute-bottom text-subtitle1 text-center">
        <div class="updateTime">更新于{{ formatDate(item.updateTime) }}</div>
        <div class="description">{{ item.updateFrequency }}</div>
      </div>
    </q-img>

    <q-list bordered class="right">
      <div v-for="(item, index) in data.songList" :key="item.id">
        <q-item v-if="flag" lickable v-ripple class="songItem">
          <div class="num">{{ index + 1 }}</div>

          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="item.picUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ item.name }}</q-item-section>

          <q-item-section>
            <div v-for="(name, i) in data.author[index].slice(0, 2)" :key="i" class="rightText">
              {{ name }}
            </div>
          </q-item-section>
        </q-item>

        <!-- 骨架屏 -->
        <q-item v-else style="width: 360px" class="songItem">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="90%" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <!-- 骨架屏 -->
      </div>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { DetailRank } from '../../utils/request/rank/rank'
import { formatDate } from '../../utils/time/time'

export default defineComponent({
  name: 'BigRankItem',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  setup(props) {
    const data = reactive({
      songList: [],
      author: [],
    })
    const flag = ref(false)
    const demo = async () => {
      const id = props.item.id ? props.item.id : 19723756
      const res = await DetailRank(id)
      const temp = res.playlist.tracks.slice(0, 10)
      data.songList = temp.map(item => item.al)

      const temp2 = temp.map(item => item.ar)
      const temp3 = []
      temp2.forEach(element => {
        temp3.push(element.map(item => item.name))
      })

      data.author = temp3

      if (temp && temp3) {
        setTimeout(() => {
          flag.value = true
        }, 1 * 1000)
      }
    }
    demo()

    return {
      formatDate,
      data,
      flag,
    }
  },
})
</script>

<style lang="scss" scoped>
.bigBox {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  box-sizing: border-box;
  padding-left: 60px;
  color: black;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter: blur(35px) brightness(0.8);
    .img {
      width: 100%;
      height: 100%;
      border-radius: 15px;
    }
  }
  .img {
    width: 300px;
    height: 300px;
    border-radius: 15px;
  }
  .over {
    display: none;
  }
  .img:hover {
    transition: 0.6s;
    filter: contrast(1.5);
    transform: scale(1.02);
  }
  .img:hover {
    .over {
      display: block;
      width: 300px;
      height: 300px;
      text-align: center;
      line-height: 200px;
      .text {
        font-size: 32px;
        font-weight: 700;
        color: white;
        filter: none;
        z-index: 200;
      }
    }
  }
  .updateTime {
    font-size: 18px;
    font-weight: 700;
  }
  .description {
    font-size: 14px;
  }

  .right {
    height: 325px;
    overflow: hidden;
    width: 800px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    gap: 6px;
    margin-right: 10px;
    .songItem {
      background-color: rgba($color: #121212, $alpha: 0.6);
      border-radius: 10px;
      width: 360px;
      height: 55px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      .rightText {
        background-color: white;
        color: black;
        margin: 2px;
        border-radius: 4px;
      }

      .num {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        margin-right: 10px;
        margin-left: -5px;
        background-color: #ffffff;
        color: black;
      }
    }
  }
}
</style>
