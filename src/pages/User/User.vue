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
        <q-tab :ripple="false" name="album" label="专辑" content-class="tab-item" />
        <q-tab :ripple="false" name="artist" label="艺人" content-class="tab-item" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="album" class="tab-panel">
          <div class="sub-albums">
            <AlbumItem
              v-for="(item, index) in subalbums"
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
              v-for="(item, index) in subartists"
              :key="index"
              :aid="item.id"
              :avatar="item.picUrl"
              :name="item.name"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { QueryUser, QueryPlayList, QuerySubArtist, QuerySubAlbum } from 'src/utils/request/user'
import UserProfile from './UserProfile.vue'
import UserLikeBar from './UserLikeBar.vue'
import ArtistItem from 'src/components/User/ArtistItem.vue'
import AlbumItem from 'src/components/User/AlbumItem.vue'
export default defineComponent({
  name: 'User',
  components: {
    UserProfile,
    UserLikeBar,
    ArtistItem,
    AlbumItem,
  },
  props: ['uid'],
  data() {
    return {
      userdata: {},
      like: 0,
      tab: 'album',
      subartists: [],
      subalbums: [],
    }
  },
  methods: {
    updateData(_id) {
      let that = this
      _id = _id || localStorage.getItem('userId') || '58323110'
      QueryUser(_id).then(res => {
        that.userdata = res.profile
      })
      QueryPlayList(_id).then(res => {
        that.like = res.playlist[0].id
      })
      QuerySubArtist().then(res => {
        that.subartists = res.data
      })
      QuerySubAlbum().then(res => {
        that.subalbums = res.data
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

.sub-artists,
.sub-albums {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 5rem;
}
</style>
