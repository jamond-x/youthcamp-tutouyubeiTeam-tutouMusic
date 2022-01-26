<template>
  <div class="artist-item" :id="aid">
    <div>
      <img :src="avatar" />
      <div class="shadow" :style="'background-image: url(' + avatar + ');'"></div>
    </div>

    <div class="text-subtitle1 text-center">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'ArtistItem',
  props: ['avatar', 'aid', 'name'],
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.artist-item {
  position: relative;
  width: 17%;
  margin: 1rem;
  cursor: pointer;
  user-select: none;
}

.artist-item img {
  position: relative;
  width: 100%;
  border-radius: 50%;
  margin-bottom: 0.25rem;
  z-index: 2;
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
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.artist-item:hover .shadow {
  opacity: 1;
}
</style>
