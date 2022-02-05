<template>
  <div class="user-profile">
    <q-parallax :src="bg" class="user-profile-bg">
      <div class="user-profile-content">
        <div>
          <q-avatar size="200px" class="avatar">
            <img :src="avatar" />
          </q-avatar>
          <div class="text-h3 text-weight-bold">{{ username }}</div>
          <div class="text-subtitle1">{{ signature }}</div>
        </div>
      </div>
    </q-parallax>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: ['avatar', 'username', 'bg', 'signature'],
  data() {
    return {}
  },
  methods: {},
  created() {},
}
</script>

<style lang="scss" scoped>
.user-profile-bg {
  border-radius: 15px;
  margin-bottom: 20px;
}

.user-profile-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: RGBA(0, 0, 0, 0.6);
}

.user-profile-content .avatar {
  margin-bottom: 1.5rem;
}

.body--light .user-profile-content {
  color: white;
}
</style>
