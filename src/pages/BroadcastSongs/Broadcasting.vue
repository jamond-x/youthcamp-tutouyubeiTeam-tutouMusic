<template>
  <div class="broadcast-container">
    <div class="header">
      <div class="column items-center">
        <div class="q-mt-md">龙卷风</div>
        <div>周杰伦</div>
      </div>
      <div class="row reverse items-center">
        <q-btn class="q-mr-xl" icon="fas fa-angle-down" v-close-popup flat round />
      </div>
    </div>
    <div class="lyric flex flex-center">
      <ul>
        <li>爱像一阵风</li>
        <li>吹完她就走</li>
        <li>这样的节奏</li>
        <li>谁都无可奈何</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Broadcasting',
  components: {},
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.broadcast-container {
  position: fixed;
  display: grid;
  grid-template-rows: 1fr 6fr 2fr;
  margin: 0;
  padding: 0;
  background-color: #2c1919;
  .header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    & > div {
      grid-area: 1/2/2/3;
      & > div {
        @include custom-font(20px, 900, 3px, inherit);
        & + div {
          @include custom-font(14px, 100, 2px, inherit);
        }
      }
    }
    & > div + div {
      grid-area: 1/3/2/4;
    }
  }
  .lyric {
    & ul {
      list-style: none;
    }
  }
}
</style>
