<template>
  <div class="row">
    <!-- 上方的banner -->
    <div class="col-12 q-mt-md row justify-center">
      <div class="imgBox col-9 row items-center no-wrap" v-if="finishLoading">
        <div class="mask">
          <img :src="state.banner.coverImgUrl" />
        </div>
        <div class="songlistImg" @click="itemClick">
          <img :src="state.banner.coverImgUrl" />
        </div>
        <div class="songlistDetail">
          <p class="name">{{ state.banner.name }}</p>
          <p>{{ state.banner.copywriter }}</p>
        </div>
      </div>

      <q-skeleton width="75%" height="14vw" class="skeleton" v-else />
    </div>

    <div class="row col-12 justify-between items-center tag">
      <!-- 下面歌单部分 -->
      <p class="title">
        全部歌单
        <q-icon name="chevron_right" />
      </p>
      <div class="rightTag">
        <span
          v-for="item in state.tags"
          :key="item"
          class="q-mx-sm"
          @click="GetSongListByTag(item.name)"
          >{{ item.name }}</span
        >
      </div>
    </div>

    <q-infinite-scroll
      class="col-12"
      @load="onLoad"
      :debounce="1200"
      :offset="250"
      scroll-target="body"
    >
      <transition name="show-hide">
        <song-list :song-lists="state.songlist" />
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
import { defineComponent, reactive, ref } from 'vue'

import SongList from 'components/songList/SongList'

import BackToTop from 'vue-backtotop'

import { useRouter } from 'vue-router'

import {
  QueryQualitySongList,
  QuerySongListTags,
  QuerySongListByTag,
} from 'src/utils/request/songList/songList'

export default defineComponent({
  name: 'Playlist',
  components: {
    SongList,
    BackToTop,
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      banner: {},
      songlist: [],
      tags: [],
      currTag: '华语',
    })
    const finishLoading = ref(false)

    // 获取精品歌单
    QueryQualitySongList().then(res => {
      // console.log(res.playlists)
      state.banner = res.playlists[0]
      finishLoading.value = true
    })

    QuerySongListByTag(state.currTag, 0).then(res => {
      // console.log(res.playlists)
      state.songlist = res.playlists
    })

    // 获取标签
    QuerySongListTags().then(res => {
      state.tags = res.tags.splice(0, 10)
      // console.log(state.tags)
    })

    function GetSongListByTag(tag) {
      state.currTag = tag
      QuerySongListByTag(tag).then(res => {
        // console.log(res)
        state.songlist = res.playlists
      })
    }

    function itemClick() {
      router.push({
        path: '/playlist/' + state.banner.id,
      })
    }

    function onLoad(index, done) {
      // console.log(index)
      QuerySongListByTag(state.currTag, index * 20).then(res => {
        console.log(res.playlists)
        // state.songlist = res.playlists
        state.songlist.push(...res.playlists)
        done()
      })
    }

    return {
      state,
      GetSongListByTag,
      onLoad,
      itemClick,
      finishLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.skeleton {
  border-radius: 15px;
}
.imgBox {
  position: relative;
  height: 14vw;
  overflow: hidden;
  // background-color: pink;
  border-radius: 15px;
  vertical-align: middle;
  .mask {
    // 遮罩层
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* background: url(./img/109951164840594920.jpg); */
    filter: blur(35px) brightness(0.8);
    img {
      width: 100%;
      height: 100%;
    }
  }

  .songlistImg {
    // 左部歌单图片
    width: 10vw;
    height: 10vw;
    margin-left: 3vw;
    z-index: 1;
    &:hover {
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 15px;
    }
  }

  .songlistDetail {
    // 歌单文字描述
    z-index: 1;
    margin-left: 2vw;
    // width: 20vw;
    p {
      font-size: 1vw;
      color: #bbb5b5;
    }
    .name {
      font-size: 2vw;
      color: white;
    }
  }
}

.tag {
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;

  // margin-bottom: 5px;
  .title {
    font-weight: bold;
    font-size: 20px;
    .q-icon {
      margin-left: -4px;
    }
  }
  .rightTag {
    height: 30px;
    color: #87877a;
    span:hover {
      cursor: pointer;
      color: #d0d0b6;
    }
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
