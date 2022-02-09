<template>
  <div class="box" :class="[$q.dark.mode ? 'body--dark' : 'body--light']">
    <div class="mian">
      <h2 class="title">官方榜单</h2>
      <div class="line" :class="[$q.dark.mode ? 'body--light' : 'body--dark']"></div>
      <!-- quasar组件 -->

      <q-carousel
        v-model="slide"
        swipeable
        animated
        control-type="unelevated"
        control-color="red"
        padding
        arrows
        height="324px"
        class="bg-white shadow-2 myCarousel"
      >
        <q-carousel-slide name="style" class="column no-wrap flex-center">
          <BigRankItem :item="data.list[0]"></BigRankItem>
        </q-carousel-slide>

        <q-carousel-slide name="tv" class="column no-wrap flex-center">
          <BigRankItem :item="data.list[1]"></BigRankItem>
        </q-carousel-slide>
        <q-carousel-slide name="tv2" class="column no-wrap flex-center">
          <BigRankItem :item="data.list[2]"></BigRankItem>
        </q-carousel-slide>
        <q-carousel-slide name="tv3" class="column no-wrap flex-center">
          <BigRankItem :item="data.list[3]"></BigRankItem>
        </q-carousel-slide>
      </q-carousel>

      <!-- quasar组件 -->
    </div>

    <div class="title">全球榜单</div>
    <div class="line" :class="[$q.dark.mode ? 'body--light' : 'body--dark']"></div>
    <div class="smallRank">
      <smallRankItem
        v-for="item in data.restList"
        :key="item.id"
        :item="item"
        class="item"
      ></smallRankItem>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { AllRank } from 'src/utils/request/rank/rank'
import BigRankItem from 'src/components/rankItem/BigRankItem'
import smallRankItem from 'src/components/rankItem/smallRankItem'

export default defineComponent({
  name: 'Rank',
  components: {
    BigRankItem,
    smallRankItem,
  },
  setup() {
    const data = reactive({
      list: [],
      restList: [],
    })
    const ctrated = async () => {
      const res = await AllRank()
      data.list = res.list.slice(0, 4)
      data.restList = res.list.slice(4)
    }

    ctrated()

    return {
      data,
      slide: ref('style'),
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';

.box {
  opacity: 0.8;
  background-size: 22px 22px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .mian {
    width: 92%;
    height: 400px;
    margin-top: 30px;
    border-radius: 20px;
    text-align: center;
    margin-bottom: 40px;
    .title {
      font-size: 32px;
      font-weight: bolder;
      margin-top: 10px;
    }
    .line {
      width: 200px;
      height: 4px;
      margin: -35px auto 11px;
    }
    .myCarousel {
      width: 100%;
      border-radius: 20px;
    }
  }
  .title {
    font-size: 32px;
    font-weight: bolder;
    margin-top: 10px;
  }
  .line {
    width: 200px;
    height: 4px;
    margin: 5px auto 20px;
  }

  .smallRank {
    margin-bottom: 40px;
    width: 92%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin-left: 10px;

    .item {
      justify-items: center;
      align-items: center;
      filter: brightness(0.9) saturate(1) contrast(0.8);
    }
    .item:hover {
      transform: scale(1.05) translateZ(0);
      filter: contrast(1.2) brightness(1.2);
      transition: 0.6s;
      z-index: 10;
      overflow: hidden;
    }
  }
  .smallRank:hover .item:not(:hover) {
    filter: brightness(0.9) saturate(1) contrast(0.8);
  }
}
</style>
