<template>
  <div class="comment q-mt-xl">
    <div class="main">
      <div class="top q-my-xl q-pt-xl">精彩评论</div>
      <div class="each-comment q-my-md" v-for="(item, index) in comment" :key="index">
        <div class="column">
          <q-avatar class="q-mt-xs">
            <img :src="item.user.avatarUrl" />
          </q-avatar>
        </div>
        <div class="column justify-center">
          <div class="name">{{ item.user.nickname }} :{{ item.content }}</div>
          <div class="bar q-mt-sm">
            <div class="time">{{ item.timeStr }}</div>
            <div class="row reverse">
              <span class="liked-count">{{ item.likedCount }}</span>
              <q-btn
                v-if="!item.liked"
                @click="like(id, item.commentId, 1, 0)"
                size="10px"
                rounded
                flat
                icon="far fa-heart"
              />
              <q-btn
                v-else
                size="10px"
                @click="like(id, item.commentId, 0, 0)"
                rounded
                flat
                color="red"
                icon="fas fa-heart"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'
import { GetComment, LikeComment } from 'src/utils/request/broadcastSong/broadcast'
export default defineComponent({
  name: 'Comment',
  components: {},
  props: {
    id: {
      type: Number,
    },
  },
  setup(props) {
    let comment = reactive([])
    const get = async id => {
      const { hotComments } = await GetComment({ id })
      hotComments.forEach(el => {
        comment.push(el)
      })
      console.log(hotComments)
      // const { hotComments } = JSON.parse(window.localStorage.getItem('comment'))
      // comment = hotComments
      // console.log(comment)
    }
    get(props.id)

    const like = async (...args) => {
      // let res = await LikeComment(...args)
      // console.log(res)
      console.log('目前用不了欸！！！')
      // 估计是目前没有登录的问题！！
    }

    watch(
      () => props.id,
      newVal => {
        console.log('评论页面id改变')
        get(newVal)
      }
    )

    return {
      comment,
      like,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.comment {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  .main {
    grid-area: 1/2/2/3;
    .top {
      font-size: 18px;
    }
    .each-comment {
      width: 400px;
      // border-radius: 20px;
      display: grid;
      grid-template-columns: 1fr 5fr;

      .bar {
        display: grid;
        grid-template-columns: 1fr 3fr;
        .time {
          opacity: 0.7;
          height: 10px;
        }
        .liked-count {
          margin-top: 2px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
