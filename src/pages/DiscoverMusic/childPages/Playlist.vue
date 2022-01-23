<template>
  <div class="row">
    <!-- 上方的banner -->
    <div class="col-12 q-mt-md row justify-center">
      <div class="imgBox col-9 row items-center no-wrap">
        <div class="mask">
          <img :src="state.banner.coverImgUrl" />
        </div>
        <div class="songlistImg">
          <img :src="state.banner.coverImgUrl" />
        </div>
        <div class="songlistDetail">
          <p class="name">{{ state.banner.name }}</p>
          <p>{{ state.banner.copywriter }}</p>
        </div>
      </div>
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
    <song-list :song-lists="state.songlist" />
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

import SongList from 'components/songList/SongList'

import {
  QueryQualitySongList,
  QuerySongListTags,
  QuerySongListByTag,
} from '../../../utils/request/songList/songList'

export default defineComponent({
  name: 'Playlist',
  components: {
    SongList,
  },
  setup() {
    const state = reactive({
      banner: {},
      songlist: [],
      tags: [],
    })

    // 获取精品歌单
    QueryQualitySongList().then(res => {
      // console.log(res.playlists)
      state.banner = res.playlists[0]
      state.songlist = res.playlists.splice(1, 30)
    })

    // 获取标签
    QuerySongListTags().then(res => {
      state.tags = res.tags.splice(0, 10)
      // console.log(state.tags)
    })

    function GetSongListByTag(tag) {
      QuerySongListByTag(tag).then(res => {
        // console.log(res)
        state.songlist = res.playlists.splice(1, 30)
      })
    }

    return {
      state,
      GetSongListByTag,
    }
  },
})
</script>

<style lang="scss" scoped>
.imgBox {
  position: relative;
  height: 13vw;
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
    filter: blur(45px) brightness(0.8);
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
    z-index: 999;
    img {
      width: 100%;
      height: 100%;
      border-radius: 15px;
    }
  }

  .songlistDetail {
    // 歌单文字描述
    z-index: 999;
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
</style>
