<template v-if="loginFlag">
  <q-item v-for="list in songList" :key="list" :to="list.link">
    <q-item-section v-if="list.icon" class="q-ml-md" avatar>
      <q-icon size="20px" :name="list.icon" class="q-ml-xs" />
    </q-item-section>

    <q-item-section class="slide">
      <q-item-label class="font">{{ list.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { QueryUserSongList } from 'src/utils/request/userSongList/userSongList'
import { uid } from 'quasar'
export default defineComponent({
  name: 'UserSongListLink',
  setup() {
    const loginFlag = ref(0)
    if (window.localStorage.getItem('loginFlag')) {
      loginFlag.value = window.localStorage.getItem('loginFlag')
    }
    const songList = reactive([])
    let data = {
      uid: window.localStorage.getItem('uid') || '',
      offset: 0,
    }
    if (uid) {
      QueryUserSongList(data).then(res => {
        console.log(res)
        let { playlist } = res
        playlist.forEach(item => {
          let list = {}
          list['id'] = item['id']
          list['title'] = item['name']
          list['coverUrl'] = item['coverImgUrl']
          list['creator_name'] = item['creator']['nickname']
          list['creator_avatarUrl'] = item['creator']['avatarUrl']
          list['playCount'] = item['playCount']
          list['tags'] = item['tags']
          list['description'] = item['description']
          list['privacy'] = item['privacy']
          list['icon'] = list['privacy'] === 0 ? 'queue_music' : 'lock'
          list['link'] = `/playlist/${list['id']}`
          songList.push(list)
        })
        let songListStr = JSON.stringify(songList)
        window.localStorage.setItem('userSongList', songListStr)
      })
    }

    return {
      songList,
      loginFlag,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.slide {
  .font {
    @include custom-font(14px, 600, 1px, inherit);
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
    margin-left: -20px;
  }
}
</style>
