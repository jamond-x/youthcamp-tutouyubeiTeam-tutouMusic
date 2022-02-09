<template>
  <q-card class="my-card" flat bordered>
    <q-card-section horizontal>
      <q-img class="col" :src="data.cover" @click="handleClick">
        <q-btn class="icon" size="xl" flat round color="red" icon="share" />
      </q-img>

      <q-list separator>
        <q-item v-ripple>
          <q-item-section
            ><q-item-label overline>播放量：</q-item-label
            >{{ numFormat(data.playCount) }}</q-item-section
          >
        </q-item>

        <q-item v-ripple>
          <q-item-section>
            <q-item-section class="MVName"
              ><q-item-label overline>MV名称</q-item-label>{{ data.name }}</q-item-section
            >
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>
            <q-item-section
              ><q-item-label overline>作者:</q-item-label>{{ data.artistName }}</q-item-section
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script>
import { numFormat } from 'src/utils/bigNum/bigNum'
import { defineComponent, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'MVLikesItem',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  setup(props) {
    const router = useRouter()

    const mvMounted = inject('mvMounted')

    function handleClick() {
      // mvMounted()
      router.push(`/`)
      setTimeout(() => {
        router.push(`/mvplay/${props.data.id}`)
      }, 10)
      // Router.replace(`/mvplay/${props.data.id}`)
      // window.location.reload()
    }

    return {
      numFormat,
      handleClick,
    }
  },
})
</script>
<style lang="scss">
.my-card {
  .MVName {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  border-radius: 10px;
  .col {
    min-width: 200px;
    max-width: 200px;
    max-height: 158px;
    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
  }
  .col:hover {
    transform: scale(1.05);
    filter: contrast(1.2);
    z-index: 10;
    .icon {
      transition: 0.6s;
      opacity: 1;
    }
  }
}
</style>
