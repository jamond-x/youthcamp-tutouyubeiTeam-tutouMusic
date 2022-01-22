<template>
  <div class="song-item">
    <img :src="cover" alt="title" />
    <div class="song-item-content">
      <h5 class="text-h6 text-weight-bold">{{ title }}</h5>
      <div class="text-subtitle2">{{ singer }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongItem',
  props: ['id', 'cover', 'title', 'singer'],
  data() {
    return {}
  },
  methods: {},
  created() {},
}
</script>

<style lang="scss" scoped>
.song-item {
  display: flex;
  width: 30%;
  height: 5rem;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 0.5rem;
  transition: background 0.2s;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.song-item-content {
  position: relative;
  width: calc(100% - 4.75rem);
}

.song-item img {
  border-radius: 15px;
  margin-right: 0.75rem;
  height: 4rem;
  width: 4rem;
}

.text-h6 {
  position: relative;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-item:hover {
  background-color: $grey-9;
}
</style>
