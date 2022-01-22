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

    <div class="content"></div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { QueryUser, QueryPlayList } from 'src/utils/request/user'
import UserProfile from './UserProfile.vue'
import UserLikeBar from './UserLikeBar.vue'
export default defineComponent({
  name: 'User',
  components: {
    UserProfile,
    UserLikeBar,
  },
  data() {
    return {
      userdata: {},
      like: 0,
    }
  },
  methods: {},
  mounted() {
    let that = this
    QueryUser(58323110).then(res => {
      that.userdata = res.profile
    })
    QueryPlayList(58323110).then(res => {
      that.like = res.playlist[0].id
    })
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
</style>
