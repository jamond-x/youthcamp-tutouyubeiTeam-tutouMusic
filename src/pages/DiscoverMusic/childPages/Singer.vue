<template>
  <div class="container">
    <div class="select">
      <q-btn-toggle v-model="yuzhong" toggle-color="primary" :options="yuzhongData" flat />
      <q-btn-toggle v-model="fenlei" toggle-color="primary" :options="fenleiData" flat />
      <q-btn-toggle v-model="shaixuan" toggle-color="primary" :options="shaixuanData" flat />
    </div>

    <q-infinite-scroll @load="onLoad" :debounce="1200" :offset="250" scroll-target="body">
      <transition name="show-hide">
        <div class="box">
          <singerItem v-for="item in data.list" :key="item.id" :item="item"></singerItem>
        </div>
      </transition>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots size="40px"></q-spinner-dots>
        </div>
      </template>
    </q-infinite-scroll>

    <!-- 返回顶部按钮 -->
    <back-to-top bottom="100px" right="50px" visibleoffset="600">
      <q-btn round color="primary" icon="navigation" size="lg" />
    </back-to-top>
  </div>
</template>

<script>
import singerItem from 'src/components/singer/singerItem'
import { SingerList } from 'src/utils/request/singer/singer'
import { defineComponent, reactive, ref, watch } from 'vue'
import BackToTop from 'vue-backtotop'

export default defineComponent({
  name: 'Singer',
  components: {
    singerItem,
    BackToTop,
  },

  setup() {
    const data = reactive({
      list: [],
      newData: [],
    })

    const yuzhong = ref('-1')
    const fenlei = ref('-1')
    const shaixuan = ref('-1')

    let count = 0
    let onLoad = (index, done) => {
      console.log('执行' + index)
      let url = [(count += 24), data.newData[0], data.newData[1], 24, data.newData[2]]

      // const { artists } = await SingerList(...url)
      let artists = []
      SingerList(...url).then(res => {
        console.log(res)
        artists = res.artists
        data.list.push(...artists)
        done()
      })
    }

    watch([yuzhong, fenlei, shaixuan], async newValue => {
      const { artists } = await SingerList(
        0,
        newValue[0],
        newValue[1],
        24,
        newValue[2].toLowerCase()
      )
      data.list = artists
      data.newData = newValue
      count = 0
    })

    const yuzhongData = [
      { label: '全部', value: '-1' },
      { label: '男歌手', value: '1' },
      { label: '女歌手', value: '2' },
      { label: '乐队', value: '3' },
    ]
    const fenleiData = [
      { label: '全部', value: '-1' },
      { label: '华语', value: '7' },
      { label: '欧美', value: '96' },
      { label: '日本', value: '8' },
      { label: '韩国', value: '16' },
      { label: '其他', value: '0' },
    ]
    const shaixuanData = [
      { label: '热门', value: '-1' },
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
      { label: 'D', value: 'd' },
      { label: 'E', value: 'e' },
      { label: 'F', value: 'f' },
      { label: 'G', value: 'g' },
      { label: 'H', value: 'h' },
      { label: 'I', value: 'i' },
      { label: 'J', value: 'j' },
      { label: 'K', value: 'k' },
      { label: 'L', value: 'l' },
      { label: 'M', value: 'm' },
      { label: 'N', value: 'n' },
      { label: 'O', value: 'o' },
      { label: 'P', value: 'p' },
      { label: 'Q', value: 'q' },
      { label: 'R', value: 'r' },
      { label: 'S', value: 's' },
      { label: 'T', value: 't' },
      { label: 'U', value: 'u' },
      { label: 'V', value: 'v' },
      { label: 'W', value: 'w' },
      { label: 'X', value: 'x' },
      { label: 'Y', value: 'y' },
      { label: 'Z', value: 'z' },
      { label: '其他', value: '0' },
    ]

    return {
      data,
      onLoad,
      yuzhong,
      fenlei,
      shaixuan,
      yuzhongData,
      fenleiData,
      shaixuanData,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  bottom: 0;
  padding: 0 20px;
  // background-color: #121212;
  opacity: 0.8;
  // background-image: radial-gradient(#9fc5f9 1.1px, #121212 1.1px);
  background-size: 22px 22px;
  .select {
    display: flex;
    flex-direction: column;
    margin: 20px 10px;
    gap: 10px;
  }
  .box {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
    // overflow: hidden;
  }
}
</style>
