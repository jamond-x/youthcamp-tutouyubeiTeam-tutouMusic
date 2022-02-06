<template>
  <q-page class="container">
    <div class="header">
      <UserProfile
        :avatar="userdata.avatarUrl"
        :username="userdata.nickname"
        :bg="userdata.backgroundUrl"
        :signature="userdata.signature"
      />

      <UserLikeBar :list="like" />
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
          <div class="sub-albums">
            <AlbumItem
              v-for="(item, index) in subAlbums"
              :key="index"
              :aid="item.id"
              :avatar="item.picUrl"
              :name="item.name"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="artist" class="tab-panel">
          <div class="sub-artists">
            <ArtistItem
              v-for="(item, index) in subArtists"
              :key="index"
              :aid="item.id"
              :avatar="item.picUrl"
              :name="item.name"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="follow" class="tab-panel">
          <div class="sub-artists">
            <UserItem
              v-for="(item, index) in followList"
              :key="index"
              :aid="item.userId"
              :avatar="item.avatarUrl"
              :name="item.nickname"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="follower" class="tab-panel">
          <div class="sub-artists">
            <UserItem
              v-for="(item, index) in followerList"
              :key="index"
              :aid="item.userId"
              :avatar="item.avatarUrl"
              :name="item.nickname"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
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
      _id = _id || sessionStorage.getItem('uid') || 'none'
      if (_id === 'none') {
        alert('请先登录~')
        this.$router.push('/')
      }
      if (_id === sessionStorage.getItem('uid')) {
        this.self = true
        this.tab = 'album'
        that.userdata = JSON.parse(sessionStorage.getItem('userInfo'))
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
  },
  mounted() {
    this.updateData(this.$route.params.uid)
  },
  watch: {
    uid(n, o) {
      this.updateData(n)
    },
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
  justify-content: space-around;
  margin-bottom: 5rem;
}
</style>
