<template>
  <div class="bigBox">
    <!-- 遮罩层 -->
    <div class="mask">
      <q-img class="img" :src="item.coverImgUrl"> </q-img>
    </div>

    <q-img class="img" :src="item.coverImgUrl" @click="itemClick">
      <div class="over">
        <div class="text">→点击前往{{ item.name }}</div>
      </div>
      <div class="absolute-bottom text-center">
        <div class="updateTime">更新于{{ formatDate(item.updateTime) }}</div>
        <div class="description">{{ item.updateFrequency }}</div>
      </div>
    </q-img>

    <q-list class="right">
      <div v-for="(item, index) in data.songList" :key="item.id">
        <q-item v-if="flag" clickable v-ripple class="songItem" @click="immediatelyBroadcast(item.id + '')">
          <div class="num">{{ index + 1 }}</div>

          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="resPicUrl(item.picUrl)" />
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
import { defineComponent, reactive, ref, inject } from 'vue'
import { DetailRank } from '../../utils/request/rank/rank'
import { formatDate } from '../../utils/time/time'
import { useRouter } from 'vue-router'

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
    const router = useRouter()
    const data = reactive({
      songList: [],
      author: [],
      bannerImage: '',
    })
    const flag = ref(false)
    const id = props.item.id ? props.item.id : 3778678
    const demo = async () => {
      const res = await DetailRank(id)
      const temp = res.playlist.tracks.slice(0, 10)
      // trackIds里面的id才能播放音乐
      const realIds = res.playlist.trackIds.slice(0, 10)
      data.songList = temp.map(item => item.al)
      data.bannerImage = data.songList[0].picUrl
      data.songList = data.songList.map((item,index) => {
        item.id = realIds[index].id
        return item
      })
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

    const itemClick = () => {
      router.push({
        path: '/playlist/' + id,
      })
    }

    const resPicUrl = url => {
      return url + '?param=200y200'
    }

    const immediatelyBroadcast = inject('immediatelyBroadcast')


    return {
      formatDate,
      data,
      flag,
      resPicUrl,
      itemClick,
      immediatelyBroadcast
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
  // padding-left: 60px;
  color: black;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter: blur(35px) brightness(0.9);
    .img {
      width: 100%;
      height: 100%;
      border-radius: 15px;
    }
  }
  .img {
    width: 15.5vw;
    height: 15.5vw;
    border-radius: 15px;
    margin-right: 20px;
  }
  .over {
    display: none;
  }
  .img:hover {
    cursor: pointer;
    .over {
      display: block;
      width: 15.5vw;
      height: 15.5vw;
      text-align: center;
      line-height: 200px;
      .text {
        font-size: 22px;
        font-weight: 700;
        color: white;
        filter: none;
        z-index: 200;
      }
    }
  }
  .updateTime {
    font-size: 16px;
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
    // gap: 6px;
    margin-right: 10px;
    .songItem {
      // background-color: rgba($color: #121212, $alpha: 0.6);
      border-radius: 10px;
      width: 360px;
      height: 55px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      &:hover {
        cursor: pointer;
      }
      .rightText {
        // background-color: white;
        // color: black;
        margin: 2px;
        border-radius: 5px;
      }

      .num {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        margin-right: 25px;
        margin-left: -5px;
        background-color: #ffffff;
        color: black;
      }
    }
  }
}
</style>
