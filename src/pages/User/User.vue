<template>
  <q-page class="container">
    <div class="header">
      <UserProfile
        :avatar="userdata.avatarUrl"
        :username="userdata.nickname"
        :bg="userdata.backgroundUrl"
        :signature="userdata.signature"
      />

      <UserLikeBar :list="like" @immediatelyBroadcast="play" @newPlaylist="playList" />
    </div>

    <div class="content">
      <q-tabs v-model="tab" indicator-color="transparent" active-bg-color="#303030" align="left">
        <q-tab :ripple="false" name="album" label="专辑" content-class="tab-item" v-if="self" />
        <q-tab :ripple="false" name="artist" label="艺人" content-class="tab-item" v-if="self" />
        <q-tab :ripple="false" name="follow" label="关注" content-class="tab-item" />
        <q-tab :ripple="false" name="follower" label="粉丝" content-class="tab-item" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="album" class="tab-panel">
          <q-infinite-scroll @load="updateSubAlbum" :offset="250">
            <div class="sub-albums">
              <AlbumItem
                v-for="item in subAlbums"
                :key="item.id"
                :aid="item.id"
                :avatar="item.picUrl"
                :name="item.name"
                @newPlaylist="playList"
              />
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-tab-panel>

        <q-tab-panel name="artist" class="tab-panel">
          <q-infinite-scroll @load="updateSubArtist" :offset="250">
            <div class="sub-artists">
              <ArtistItem
                v-for="item in subArtists"
                :key="item.id"
                :aid="item.id"
                :avatar="item.img1v1Url"
                :name="item.name"
              />
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-tab-panel>

        <q-tab-panel name="follow" class="tab-panel">
          <q-infinite-scroll @load="updateFollowList" :offset="250">
            <div class="sub-artists">
              <UserItem
                v-for="item in followList"
                :key="item.id"
                :aid="item.userId"
                :avatar="item.avatarUrl"
                :name="item.nickname"
              />
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-tab-panel>

        <q-tab-panel name="follower" class="tab-panel">
          <q-infinite-scroll @load="updateFollowerList" :offset="250">
            <div class="sub-artists">
              <UserItem
                v-for="item in followerList"
                :key="item.id"
                :aid="item.userId"
                :avatar="item.avatarUrl"
                :name="item.nickname"
              />
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import {
  QueryUser,
  QueryPlayList,
  QuerySubArtist,
  QuerySubAlbum,
  QueryFollowList,
  QueryFollowerList,
} from 'src/utils/request/user'
import UserProfile from './UserProfile.vue'
import UserLikeBar from './UserLikeBar.vue'
import ArtistItem from 'src/components/User/ArtistItem.vue'
import AlbumItem from 'src/components/User/AlbumItem.vue'
import UserItem from 'src/components/User/UserItem.vue'
export default defineComponent({
  name: 'User',
  components: {
    UserProfile,
    UserLikeBar,
    ArtistItem,
    AlbumItem,
    UserItem,
  },
  props: ['uid'],
  data() {
    return {
      userdata: {},
      like: 0,
      tab: 'album',
      subArtists: [],
      subAlbums: [],
      followList: [],
      followerList: [],
      self: true,
    }
  },
  methods: {
    updateData(_id) {
      let that = this
      _id = _id || localStorage.getItem('uid') || 'none'
      if (_id === 'none') {
        this.q.notify({ message: '请先登录', position: 'top' })
        this.$router.push('/')
      }
      if (_id === localStorage.getItem('uid')) {
        this.self = true
        this.tab = 'album'
        that.userdata = JSON.parse(localStorage.getItem('userInfo'))
      } else {
        this.self = false
        this.tab = 'follow'
        QueryUser(_id).then(res => {
          that.userdata = res.profile
        })
      }

      QueryPlayList(_id).then(res => {
        that.like = res.playlist[0].id
      })
      QuerySubArtist().then(res => {
        that.subArtists = res.data
      })
      QuerySubAlbum().then(res => {
        that.subAlbums = res.data
      })
      QueryFollowList(_id).then(res => {
        that.followList = res.follow
      })
      QueryFollowerList(_id).then(res => {
        that.followerList = res.followeds
      })
    },
    play(_id) {
      this.$emit('immediatelyBroadcast', _id + '')
    },
    playList(list) {
      this.$emit('newPlaylist', list)
    },
    updateSubArtist(index, done) {
      let that = this
      let offset = index * 30
      QuerySubArtist(offset).then(res => {
        that.subArtists = that.subArtists.concat(res.data)
        done(res.data.length < 30)
      })
    },
    updateSubAlbum(index, done) {
      let that = this
      let offset = index * 30
      QuerySubAlbum(offset).then(res => {
        that.subAlbums = that.subAlbums.concat(res.data)
        done(res.data.length < 30)
      })
    },
    updateFollowList(index, done) {
      let _id = this.$route.params.uid || localStorage.getItem('uid')
      let that = this
      let offset = index * 30
      QueryFollowList(_id, offset).then(res => {
        that.followList = that.followList.concat(res.follow)
        done(!res.hasMore)
      })
    },
    updateFollowerList(index, done) {
      let _id = this.$route.params.uid || localStorage.getItem('uid')
      let that = this
      let offset = index * 30
      QueryFollowerList(_id, offset).then(res => {
        that.followerList = that.followerList.concat(res.followeds)
        done(!res.hasMore)
      })
    },
  },
  mounted() {
    this.updateData(this.$route.params.uid)
  },
  watch: {
    uid(n, o) {
      this.updateData(n)
    },
  },
  setup() {
    let q = useQuasar()

    return {
      q,
    }
  },
})
</script>

<style scoped>
.container {
  box-sizing: border-box;
  padding: 2rem;
}

.content {
  box-sizing: border-box;
  height: 300px;
  padding: 1rem 0;
}

.tab-panel {
  background: #121212;
  padding: 0;
}

.body--light .tab-panel {
  background: #fafafa;
}

.sub-artists,
.sub-albums {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5rem;
}
</style>
