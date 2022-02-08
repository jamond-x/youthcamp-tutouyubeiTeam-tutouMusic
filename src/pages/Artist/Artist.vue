<template>
  <div class="artist">这里是{{ id }}</div>
</template>

<script>
export default {
  name: 'Artist',
  props: ['id'],
  data() {
    return {}
  },
  methods: {
    updateData(_id) {},
  },
}
</script>

<style lang="scss" scoped></style>
