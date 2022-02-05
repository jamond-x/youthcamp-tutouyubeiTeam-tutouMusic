<template>
  <div class="search">
    <div class="text-h3 text-weight-light text-italic">{{ keywords }}</div>
    <div class="text-h5 q-pt-md">看看我们找到了什么？</div>

    <div class="songs q-pt-xl">
      <div class="row">
        <div class="col">
          <div>
            <div class="text-h4 text-weight-bold">单曲</div>
            <div class="text-subtitle q-pt-xs">更多</div>
          </div>
        </div>
        <div class="col-10">
          <div class="content">
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
            <SongItem
              id="123"
              cover="https://p2.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg"
              title="年少有为"
              singer="李荣浩"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="artists q-pt-xl">
      <div class="row">
        <div>
          <div class="text-h4 text-weight-bold">艺人</div>
          <div class="text-subtitle q-pt-xs">更多</div>
        </div>
        <div class="content q-pt-md">
          <ArtistItem
            avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
            name="火西肆"
            aid="123"
          />
          <ArtistItem
            avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
            name="火西肆"
            aid="123"
          />
          <ArtistItem
            avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
            name="火西肆"
            aid="123"
          />
          <ArtistItem
            avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
            name="火西肆"
            aid="123"
          />
          <ArtistItem
            avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
            name="火西肆"
            aid="123"
          />
        </div>
      </div>
    </div>

    <div class="album q-pt-xl">
      <div class="row">
        <div class="col">
          <div>
            <div class="text-h4 text-weight-bold">专辑</div>
            <div class="text-subtitle q-pt-xs">更多</div>
          </div>
        </div>
        <div class="col-10">
          <div class="content">
            <AlbumItem
              avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
              name="火西肆"
              aid="123"
            />
            <AlbumItem
              avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
              name="火西肆"
              aid="123"
            />
            <AlbumItem
              avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
              name="火西肆"
              aid="123"
            />
            <AlbumItem
              avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
              name="火西肆"
              aid="123"
            />
            <AlbumItem
              avatar="https://p2.music.126.net/77ttigyv96047MlQx4HzSw==/109951165986578673.jpg"
              name="火西肆"
              aid="123"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongItem from 'src/components/User/SongItem.vue'
import ArtistItem from 'src/components/User/ArtistItem.vue'
import AlbumItem from 'src/components/User/AlbumItem.vue'
export default {
  name: 'Search',
  props: ['keywords'],
  components: {
    SongItem,
    ArtistItem,
    AlbumItem,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.search {
  padding: 2rem;
  box-sizing: border-box;

  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
