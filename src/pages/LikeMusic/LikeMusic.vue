<template>
  <div>
    <div>
      <q-btn @click="getUserSongList">获取用户歌单</q-btn>
      <q-btn @click="getSongDetail">获取歌曲详情</q-btn>
      <q-btn @click="getLikeList">喜欢音乐列表</q-btn>
    </div>
    <div class="flex listCardWrapper">
      <q-img src="./example.png" class="listHeadImg q-mr-lg" />
      <div class="listInfo">
        <div>我喜欢的音乐</div>
        <div>
          <q-btn round class="q-mr-lg">
            <q-avatar size="40px">
              <img class="listHeadImg" src="https://cdn.quasar.dev/img/avatar.png" alt="" />
            </q-avatar>
          </q-btn>
          <span>{{ userName }} {{ time }}创建</span>
        </div>
        <div class="row">
          <q-btn> > 播放全部 + </q-btn>
          <q-btn> + 收藏({{ collectNum }}) </q-btn>
          <q-btn> ^ 分享 </q-btn>
          <q-btn> ↓ 下载全部 </q-btn>
        </div>
        <div>歌曲: {{ songNum }}</div>
        <div>播放: {{ playNum }}</div>
      </div>
    </div>
    <div class="menu">
      <ul class="flex" style="list-style: none">
        <li class="selected-item"><q-btn>歌曲列表</q-btn></li>
        <li><q-btn>评论</q-btn></li>
        <li><q-btn>收藏者</q-btn></li>
      </ul>
    </div>
    <div v-for="(sitem, _) in songBatchList" v-bind:key="_">
      <q-list v-for="(item, index) in sitem" v-bind:key="index" bordered separator>
        <!-- <q-infinite-scroll @load="loadSongList" :offset="250"> -->
        <q-item>
          <q-item-section avatar>
            <q-icon name="fas fa-download" />
          </q-item-section>
          <q-item-section avatar>
            <!-- 空心 -->
            <q-icon name="far fa-heart" />
            <!-- 实心 -->
            <!-- <q-icon name="fas fa-heart" /> -->
          </q-item-section>
          <q-item-section>{{ item['name'] }}</q-item-section>
          <q-item-section>{{ item['author'].join('/') }}</q-item-section>
          <q-item-section>{{ item['album']['name'] }}</q-item-section>
        </q-item>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
        <!-- </q-infinite-scroll> -->
      </q-list>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { LikeMusicList, SongDetail } from 'src/utils/request/song/song'

export default defineComponent({
  name: 'LikeMusic',
  components: {},
  methods: {
    async loadSongList(batchIdx, done) {
      console.log(batchIdx)
      let idsString = this.ids.slice(batchIdx, batchIdx + 100).join(',')
      data = { ids: idsString }
      let res = await SongDetail(data)
      let songList = []
      res['songs'].forEach(raw => {
        let song = {}
        song['name'] = raw['name']
        song['album'] = raw['al']
        song['authorList'] = raw['ar']
        song['author'] = []
        song['authorList'].forEach(author => {
          song['author'].push(author['name'])
        })
        songList.push(song)
      })
      this.songBatchList.push(songList)
      done()
    },
    getUserSongList() {},
    getSongDetail() {},
    async getLikeList() {
      let uid = window.sessionStorage.getItem('uid') || '121963173'
      let res = await LikeMusicList({ uid })
      console.log(res)
      this.ids = res.ids
      let batchIdx = 0
      let idsString = this.ids.slice(batchIdx, batchIdx + 100).join(',')
      console.log(idsString)
      let data = { ids: idsString }
      res = await SongDetail(data)
      let songList = []
      console.log(res)
      res['songs'].forEach(raw => {
        let song = {}
        song['name'] = raw['name']
        song['album'] = raw['al']
        song['authorList'] = raw['ar']
        song['author'] = []
        song['authorList'].forEach(author => {
          song['author'].push(author['name'])
        })
        songList.push(song)
      })
      this.songBatchList.push(songList)
    },
  },
  data() {
    return {
      userName: '果冻0w0',
      time: '2016-01-09',
      songNum: 893,
      playNum: 76,
      collectNum: 0,
      songBatchList: [],
      ids: [],
    }
  },
  setup() {
    return {}
  },
})
</script>

<style scoped>
.listHeadImg {
  max-height: 200px;
  max-width: 200px;
  border-radius: 0.5rem;
}
.listCardWrapper {
  /* width: 850px; */
  /* height: 250px; */
  background-color: #23232b;
  border: #2a2a29 2px solid;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
.selected-item {
  font-size: larger;
  font: bold;
  border-bottom: #af3131 1px solid;
}
</style>
