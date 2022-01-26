<template>
  <div class="album-item" :id="aid">
    <div>
      <img :src="avatar" />
      <div class="shadow" :style="'background-image: url(' + avatar + ');'"></div>
    </div>

    <div class="text-subtitle1 text-center">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'AlbumItem',
  props: ['avatar', 'aid', 'name'],
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.album-item {
  position: relative;
  width: 17%;
  margin: 1rem;
  cursor: pointer;
  user-select: none;
}

.album-item img {
  position: relative;
  width: 100%;
  border-radius: 15px;
  margin-bottom: 0.25rem;
  z-index: 2;
  transition: transform 0.2s;
}

.shadow {
  position: absolute;
  top: 0.5rem;
  width: 100%;
  filter: blur(16px) opacity(0.6);
  transform: scale(0.92, 0.96);
  z-index: 1;
  background-size: cover;
  aspect-ratio: 1/1;
  opacity: 0;
  transition: opacity 0.2s;
}

.album-item:hover img {
  transform: translateY(-0.2rem);
}

.album-item:hover .shadow {
  opacity: 1;
}
</style>
