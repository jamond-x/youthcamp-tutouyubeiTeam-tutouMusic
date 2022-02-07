<template>
  <div class="q-page container">
    <template class="flex column items-center no-wrap">
      <div class="Wrapper flex row no-wrap q-pa-md">
        <div class="col topBanner">
          <q-img src="./example.png" :ratio="1" class="img q-mr-lg">
            <div class="absolute-full text-subtitle2 flex flex-center">Caption</div>
          </q-img>
        </div>
        <q-separator vertical inset class="q-mx-lg" />
        <div class="flex column col listInfo justify-between">
          <div class="title row">我喜欢的音乐(还没改好,到时候改菜单分割线下面?)</div>
          <div class="row flex items-center">
            <q-btn round class="q-mr-lg">
              <q-avatar size="40px">
                <img class="listHeadImg" :src="avatarUrl" alt="" />
              </q-avatar>
            </q-btn>
            <q-chip color="purple" icon="bookmark">{{ userName }} {{ time }}创建</q-chip>
          </div>
          <div class="row">
            <q-btn-group class="q-mr-md">
              <q-btn>
                <q-icon name="fas fa-chevron-right" size="16px" />
                播放全部
              </q-btn>
              <q-btn>
                <q-icon name="fas fa-plus" size="16px" />
              </q-btn>
            </q-btn-group>
            <q-btn label="收藏">({{ collectNum }})</q-btn>
          </div>

          <div class="row">
            <q-chip> 歌曲: {{ songNum }} </q-chip>
            <q-chip>播放: {{ playNum }}</q-chip>
          </div>
        </div>
      </div>
    </template>
    <div class="songList">
      <q-infinite-scroll v-if="loginFlag" @load="onLoad" :offset="1000">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">序号</th>
              <th class="text-left">操作</th>
              <th class="text-left">标题</th>
              <th class="text-left">歌手</th>
              <th class="text-left">专辑</th>
              <!-- <th class="text-left">时间</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in songTotalList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <!-- 空心 -->
                <q-icon name="far fa-heart" />
                <!-- 实心 -->
                <!-- <q-icon name="fas fa-heart" /> -->
              </td>
              <td>
                {{ item['name'] }}
              </td>
              <td>
                {{ item['author'].join('/') }}
              </td>
              <td>
                {{ item['album']['name'] }}
              </td>
              <!-- <td>
                {{ `${item['min']}分${item['sec']}秒` }}
              </td> -->
            </tr>
          </tbody>
        </q-markup-table>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
      <div v-else>
        <q-card> 没登录 </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { QueryUserLikeList, QuerySongDetail } from 'src/utils/request/userSongList/userSongList'

export default defineComponent({
  name: 'LikeMusic',
  setup() {
    const time = ref('2016-01-09')
    const songNum = ref(893)
    const playNum = ref(76)
    const collectNum = ref(0)
    const songTotalList = ref([])
    const ids = ref([])
    const avatarUrl = ref(
      'https://cdn.jsdelivr.net/gh/jamond-x/public-resources@latest/Avatar/Avatar-Maker%20(3).png'
    )
    const userName = ref('秃头预备')
    const loginFlag = ref(0)
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    if (userInfo && userInfo['avatarUrl'] && userInfo['nickname']) {
      avatarUrl.value = userInfo['avatarUrl']
      userName.value = userInfo['nickname']
      loginFlag.value = 1
    }

    let uid = window.sessionStorage.getItem('uid') || '121963173'

    function onLoad(index, done) {
      const LoadDetail = () => {
        let id = index - 1
        let idsString = ids.value.slice(id, id + 100).join(',')
        // console.log(idsString)
        let data = { ids: idsString }
        QuerySongDetail(data).then(res => {
          let songList = []
          if (res.code != 200) {
            return
          }
          console.log(res)
          res['songs'].forEach(raw => {
            let song = {}
            song['name'] = raw['name']
            song['album'] = raw['al']
            song['authorList'] = raw['ar']
            song['dt'] = parseInt(raw['dt']) / 1000
            song['min'] = Math.floor(song['dt'] / 60)
            song['sec'] = Math.floor(song['dt'] % 60)
            song['author'] = []
            song['authorList'].forEach(author => {
              song['author'].push(author['name'])
            })
            songList.push(song)
          })
          songTotalList.value.push(...songList)
          console.log(songTotalList.value)
          done()
        })
      }
      const Query = async () => {
        if (uid === '') {
          done()
        }
        if (ids.value.length === 0) {
          let res = await QueryUserLikeList({ uid })
          // console.log(res)
          ids.value = res.ids
        }
        LoadDetail()
      }
      Query()
    }

    return {
      userName,
      avatarUrl,
      time,
      songNum,
      playNum,
      collectNum,
      songTotalList,
      onLoad,
      loginFlag,
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  padding: 2rem;
}
.topBanner {
  position: relative;
  height: 13vw;
  overflow: hidden;
  filter: blur(5px) brightness(0.4);
}
.listInfo {
  .title {
    font-size: 1.5rem;
  }
}
.Wrapper {
  width: 100%;
  background-color: #23232b;
  border: #2a2a29 2px solid;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
.selected-item {
  font-size: larger;
  font: bold;
  border-bottom: #af3131 1px solid;
}
</style>
