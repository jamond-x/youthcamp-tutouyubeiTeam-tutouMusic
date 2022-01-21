<template>
  <div class="song-item">
    <img :src="cover" alt="title" />
    <div class="song-item-content">
      <div class="text-h5">{{ title }}</div>
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
}

.song-item img {
  border-radius: 15px;
  margin-right: 0.75rem;
}

.text-h5 {
  font-weight: 600;
}

.song-item:hover {
  background-color: $grey-9;
}
</style>
