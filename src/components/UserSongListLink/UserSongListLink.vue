<template>
  <q-item v-for="list in songList" :key="list" :to="list.link">
    <q-item-section v-if="list.icon" class="q-ml-md" avatar>
      <q-icon :name="list.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="font">{{ list.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { QueryUserSongList } from 'src/utils/request/userSongList/userSongList'
import { uid } from 'quasar'
export default defineComponent({
  name: 'UserSongListLink',
  setup() {
    const songList = reactive([])
    let data = {
      uid: window.sessionStorage.getItem('uid') || '',
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
          list['icon'] = list['privacy'] === 0 ? 'fas fa-lock' : 'fas fa-coffee'
          list['link'] = `/userSongList/${list['id']}`
          songList.push(list)
        })
        let songListStr = JSON.stringify(songList)
        window.sessionStorage.setItem('userSongList', songListStr)
      })
    }

    return {
      songList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.font {
  @include custom-font(16px, 900, 3px, inherit);
}
</style>
