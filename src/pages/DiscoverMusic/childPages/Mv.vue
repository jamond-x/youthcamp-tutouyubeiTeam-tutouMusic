<template>
  <div class="container row">
    <div class="select">
      <q-btn-toggle
        v-model="area"
        toggle-color="primary"
        :options="areaData"
        @update:model-value="areaClick"
        flat
      />
      <q-btn-toggle
        v-model="type"
        toggle-color="primary"
        :options="typeData"
        @update:model-value="typeClick"
        flat
      />
      <q-btn-toggle
        v-model="sort"
        toggle-color="primary"
        :options="sortData"
        @update:model-value="sortClick"
        flat
      />
    </div>

    <q-infinite-scroll class="col-12" @load="onLoad" :debounce="1200" :offset="250" scroll-target="body">
      <transition name="show-hide">
        <mv-list :mv-lists="state.mvList" />
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
import { defineComponent, ref, reactive, watchEffect } from 'vue'

import { QueryMv } from 'src/utils/request/mv/mv'

import MvList from 'components/mvList/MvList'

import BackToTop from 'vue-backtotop'

export default defineComponent({
  name: 'Mv',
  components: {
    MvList,
    BackToTop,
  },
  setup() {
    const state = reactive({
      mvList: [],
    })

    const area = ref('')
    const type = ref('')
    const sort = ref('')

    const choose = reactive({
      area: '',
      type: '',
      order: '',
      index: 0,
    })

    const areaData = [
      { label: '地区', value: '' },
      { label: '全部', value: '全部' },
      { label: '内地', value: '内地' },
      { label: '港台', value: '港台' },
      { label: '欧美', value: '欧美' },
    ]

    const typeData = [
      { label: '类型', value: '' },
      { label: '全部', value: '全部' },
      { label: '官方版', value: '官方版' },
      { label: '原声', value: '原声' },
      { label: '现场版', value: '现场版' },
    ]

    const sortData = [
      { label: '排序', value: '' },
      { label: '上升最快', value: '上升最快' },
      { label: '最热', value: '最热' },
      { label: '最新', value: '最新' },
    ]

    function areaClick(value) {
      console.log(value)
      choose.area = value
      choose.index = 0
      QueryMV()
    }

    function typeClick(value) {
      console.log(value)
      choose.type = value
      choose.index = 0
      QueryMV()
    }

    function sortClick(value) {
      console.log(value)
      choose.order = value
      choose.index = 0
      QueryMV()
    }

    // 事件监听，当地区，类型，排序发生改变时调用
    // watchEffect(() => {
    //   // 20是每页的数值，已在请求函数里写死了
    //   let offset = choose.index * 20
    //   QueryMv(choose.area, choose.type, choose.order, offset).then(res => {
    //     if (!offset) {
    //       state.mvList = res.data
    //     } else {
    //       state.mvList.push(...res.data)
    //     }
    //   })
    // })

    function QueryMV() {
      QueryMv(choose.area, choose.type, choose.order, choose.index * 20).then(res => {
        if (!choose.index) {
          state.mvList = res.data
        } else {
          state.mvList.push(...res.data)
        }
      })
    }

    function onLoad(index, done) {
      console.log('执行' + index)
      choose.index = index - 1
      QueryMv(choose.area, choose.type, choose.order, choose.index * 20).then(res => {
        if (!choose.index) {
          state.mvList = res.data
        } else {
          state.mvList.push(...res.data)
        }
        done()
      })
    }

    return {
      state,
      area,
      type,
      sort,
      areaData,
      typeData,
      sortData,
      areaClick,
      typeClick,
      sortClick,
      onLoad
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  padding: 0 20px;
  .select {
    display: flex;
    flex-direction: column;
    margin: 20px 10px;
    gap: 10px;
  }
}

// 懒加载的动画
.show-hide-enter-active {
  transition: all 0.5s ease;
}
.show-hide-leave-active {
  transition: all 1s ease;
}
.show-hide-enter,
.show-hide-leave-active {
  transform: translate(-100%, 0);
  opacity: 0;
}
</style>
