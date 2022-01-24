<template>
  <div class="comment q-mt-xl">
    <div class="location">
      <div class="column justify-center items-center">
        <div class="top q-my-xl q-pt-xl">
          <span :class="{ unActiveHead: !commentMode }" @click="changeComment(true)">精彩评论</span>
          <span :class="{ unActiveHead: commentMode }" class="q-ml-md" @click="changeComment(false)"
            >最新评论</span
          >
        </div>
        <div class="each-comment q-my-md" v-for="(item, index) in currentComment" :key="index">
          <div class="column">
            <q-avatar class="q-mt-xs">
              <img :src="item.user.avatarUrl" />
            </q-avatar>
            <q-badge class="badge" rounded color="orange" label="v" />
          </div>
          <div class="column justify-center">
            <div class="name">{{ item.user.nickname }} :{{ item.content }}</div>
            <div v-if="item.beReplied.length > 0" class="comment-replied q-my-sm q-py-xs q-pl-sm">
              @{{ item.beReplied[0].user.nickname }}： {{ item.beReplied[0].content }}
            </div>
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
        <q-btn @click="loadMoreComment" label="加载更多.." rounded />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { GetComment, LikeComment, LoginStatus } from 'src/utils/request/broadcastSong/broadcast'
import { isUnNull } from 'src/utils'
export default defineComponent({
  name: 'Comment',
  components: {},
  props: {
    id: {
      type: Number,
    },
  },
  setup(props) {
    // TODO: 评论是否为回复评论
    // TODO: 认证用户图标
    // TODO: 点击用户头像跳转至用户主页
    let currentComment = ref([])
    let hotComment_ = ref([])
    let comment_ = ref([])
    let commentMode = ref(true)
    let commentAmount = ref(20)
    const get = async id => {
      if (isUnNull(id)) return
      let res = await GetComment({ id })
      console.log(res)
      const { hotComments, comments } = res

      // hotComments.forEach(el => {
      //   comment.push(el)
      // })
      hotComment_.value = hotComments
      comment_.value = comments
      console.log(hotComments)
      currentComment.value = hotComments
      // const { hotComments } = JSON.parse(window.localStorage.getItem('comment'))
      // comment = hotComments
      // console.log(comment)
    }
    get(props.id)
    const initCommentData = () => {
      currentComment.value = []
      hotComment_.value = []
      comment_.value = []
      commentMode.value = true
      commentAmount.value = 20
    }
    const like = async (...args) => {
      let res = await LikeComment(...args)
    }

    const changeComment = mode => {
      if (mode) {
        commentMode.value = true
        currentComment.value = hotComment_.value
      } else {
        commentMode.value = false
        currentComment.value = comment_.value
      }
    }

    const loadMoreComment = async () => {
      if (!commentMode.value) {
        let { comments } = await GetComment({ id: props.id, limit: (commentAmount.value += 20) })
        comment_.value = comments
        currentComment.value = comment_.value
      }
      // TODO: 解决加载给多热门评论问题
    }

    watch(
      () => props.id,
      newVal => {
        initCommentData()
        get(newVal)
      }
    )

    return {
      currentComment,
      commentMode,
      changeComment,
      loadMoreComment,
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
  .location {
    grid-area: 1/2/2/3;
    & > div {
      margin-bottom: 300px;
    }
    .top {
      font-size: 18px;
      cursor: pointer;
      .unActiveHead {
        opacity: 0.7;
        font-size: 15px;
        transition: all 0.2;
      }
    }
    .each-comment {
      width: 400px;
      // border-radius: 20px;
      display: grid;
      grid-template-columns: 1fr 5fr;
      position: relative;
      .badge {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 5px;
        left: 35px;
      }
      .comment-replied {
        width: 320px;
        opacity: 0.4;
        background-color: #165156;
        border-radius: 5px;
      }
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
