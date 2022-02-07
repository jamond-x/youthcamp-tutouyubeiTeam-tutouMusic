<template>
  <div class="flex row no-wrap q-pa-md">
    <q-skeleton height="180px" width="180px" />
    <q-separator vertical inset class="q-mx-lg" />
    <div class="column justify-between">
      <q-skeleton type="rect" width="320px" />
      <div class="row flex items-center">
        <q-skeleton type="QAvatar" />
        <div class="q-mr-md"></div>
        <q-skeleton type="rect" width="240px" height="30px" />
      </div>
      <q-skeleton type="QBtn" width="240px" height="30px" />
      <div class="row">
        <q-skeleton type="rect" width="200px" />
      </div>
    </div>
  </div>
  <div v-for="i in 3" :key="i" class="songList q-mt-md">
    <div class="song-list-item row q-mb-xs">
      <div class="col">
        <div class="song-item">
          <div class="song-item-content">
            <q-skeleton class="text-h4 text-weight-bold" type="text" width="55%" />
            <q-skeleton class="text-subtitle2" type="text" width="30%" />
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <q-skeleton class="text-h4" type="text" width="35%" />
        </div>
        <div class="row">
          <q-skeleton class="offset-md-10 text-h5" type="text" width="25%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlaylistSkeleton',
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
