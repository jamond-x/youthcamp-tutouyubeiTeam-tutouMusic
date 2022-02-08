<template>
  <div class="artist-profile">
    <div class="content">
      <img
        :src="info.artist.cover + '?param=500y500'"
        :alt="info.artist.name"
        :title="info.artist.name"
        class="avatar shadow-2"
      />
      <div class="detail">
        <div class="text-h2 text-weight-bold q-mb-lg">{{ info.artist.name }}</div>
        <div class="q-mb-lg">
          <div class="text-h6">艺人</div>
          <div class="text-subtitle1 text-grey-7">
            {{ info.artist.musicSize }}首歌 · {{ info.artist.albumSize }}张专辑 ·
            {{ info.artist.mvSize }}个MV
          </div>
        </div>
        <div class="text-body1 text-grey-7 desc" @click="showDesc = !showDesc">
          {{ info.artist.briefDesc }}
        </div>
      </div>
    </div>
    <q-dialog v-model="showDesc">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">艺人详情</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-body1">
            {{ info.artist.briefDesc }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { QueryArtist } from 'src/utils/request/search'
export default {
  name: 'ArtistProfile',
  props: ['aid'],
  data() {
    return {
      visible: true,
      showDesc: false,
      info: {
        artist: {
          name: 'Artist',
          briefDesc: '简介~',
          albumSize: 0,
          musicSize: 0,
          mvSize: 0,
          cover: 'https://www.tupians.top/imgs/2022/02/e1ee4b35916d1b57.png',
        },
        user: {
          avatarUrl: 'https://www.tupians.top/imgs/2022/02/e1ee4b35916d1b57.png',
        },
      },
    }
  },
  methods: {
    updateData(_id) {
      let that = this
      QueryArtist(_id).then(res => {
        that.info = res.data
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
      this.showDesc = false
    },
  },
}
</script>

<style lang="scss">
.artist-profile {
  position: relative;
  .content {
    height: 12rem;
    display: flex;
    position: relative;

    .avatar {
      height: 12rem;
      width: 12rem;
      border-radius: 50%;
      margin-right: 2rem;
    }

    .detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .desc {
        width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }
}
</style>
