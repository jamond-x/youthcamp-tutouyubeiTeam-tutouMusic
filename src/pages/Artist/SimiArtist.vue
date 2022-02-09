<template>
  <div class="simi-artists q-mt-xl">
    <div class="content">
      <div class="text-h4 q-mb-lg">相似艺人</div>
      <div style="display: flex; flex-wrap: wrap">
        <ArtistItem
          v-for="a in artists"
          :key="a.id"
          :aid="a.id"
          :avatar="a.picUrl"
          :name="a.name"
        />
      </div>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { QuerySimiArtist } from 'src/utils/request/search'
import ArtistItem from 'src/components/User/ArtistItem.vue'
export default {
  name: 'SimiArtist',
  props: ['aid'],
  data() {
    return {
      visible: true,
      artists: [],
    }
  },
  components: {
    ArtistItem,
  },
  methods: {
    updateData(_id) {
      let that = this
      QuerySimiArtist(_id).then(res => {
        that.artists = res.artists
        that.visible = false
      })
    },
  },
  created() {
    this.updateData(this.aid)
  },
  watch: {
    aid(n, o) {
      this.updateData(n)
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
.simi-artists {
  position: relative;
  .content {
    .more {
      cursor: pointer;
    }
  }
}
</style>
