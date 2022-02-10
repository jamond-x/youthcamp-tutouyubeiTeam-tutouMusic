<template>
  <div class="comment q-mt-xl">
    <div class="location">
      <div class="column justify-center items-center">
        <div class="top q-my-xl q-pt-xl">
          <span :class="{ unActiveHead: !commentMode }" @click="changeComment(true)">精彩评论</span>
          <span
            :class="{ unActiveHead: commentMode }"
            class="q-ml-sm"
            @click="changeComment(false)"
          >
            最新评论
          </span>
          <div>
            <q-btn
              class="pen"
              icon="fas fa-pen"
              flat
              rounded
              size="10px"
              @click="replyCommentType = 1"
            />
            <q-popup-edit
              @save="sendComment_"
              class="bg-brown-7 text-white"
              color="white"
              buttons
              v-model="useless"
              v-slot="scope"
              label-set="发送"
              label-cancel="取消"
              title="编辑评论"
              max-width="500px"
            >
              <q-input
                dark
                type="textarea"
                color="white"
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              >
                <template v-slot:append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </q-popup-edit>
          </div>
        </div>
        <div v-if="isUnNull(currentComment) || currentComment.length === 0">
          <div class="each-comment q-my-md" v-for="item in 10" :key="item">
            <q-skeleton type="QAvatar" />
            <q-skeleton type="QSlider" />
          </div>
        </div>

        <div v-else>
          <div class="each-comment q-my-md" v-for="(item, index) in currentComment" :key="index">
            <div class="column">
              <router-link :to="`/user/${item.user.userId}`">
                <q-avatar
                  :class="['q-mt-xs', $q.dark.isActive ? 'user-avatar' : 'user-avatar__dark']"
                  v-close-popup
                >
                  <img :src="item.user.avatarUrl" />
                </q-avatar>
              </router-link>
              <q-badge
                v-if="item.user.authStatus === 1"
                class="badge"
                rounded
                color="orange"
                label="v"
              />
            </div>
            <div class="column justify-center">
              <div class="name">
                <span class="cursor__pointer">{{ item.user.nickname }}</span> :{{ item.content }}
              </div>
              <div
                v-if="item.beReplied.length > 0"
                :class="[$q.dark.isActive ? 'comment-replied__dark' : 'comment-replied']"
                class="q-my-sm q-py-xs q-pl-sm"
              >
                @{{ item.beReplied[0].user.nickname }}： {{ item.beReplied[0].content }}
              </div>
              <div class="bar q-mt-sm">
                <div class="time">{{ item.timeStr }}</div>
                <div class="row reverse">
                  <span class="liked-count">{{ item.likedCount }}</span>
                  <q-btn
                    v-if="!item.liked"
                    @click="like(id, item.commentId, 1, type), (item.liked = true)"
                    size="10px"
                    rounded
                    flat
                    icon="far fa-heart"
                  />
                  <q-btn
                    v-else
                    size="10px"
                    @click="like(id, item.commentId, 0, type), (item.liked = false)"
                    rounded
                    flat
                    color="red"
                    icon="fas fa-heart"
                  />
                  <div>
                    <q-btn
                      class="comment-replay"
                      @click=";(replyCommentType = 2), (replyCommentId = item.commentId)"
                      icon="far fa-comment"
                      size="10px"
                      rounded
                      flat
                    />
                    <q-popup-edit
                      @save="sendComment_"
                      class="bg-brown-7 text-white"
                      color="white"
                      buttons
                      v-slot="scope"
                      v-model="useless"
                      label-set="发送"
                      label-cancel="取消"
                      title="回复评论"
                      max-width="500px"
                    >
                      <q-input
                        dark
                        type="textarea"
                        color="white"
                        v-model="scope.value"
                        dense
                        autofocus
                        counter
                        @keyup.enter="scope.set"
                      >
                        <template v-slot:append>
                          <q-icon name="edit" />
                        </template>
                      </q-input>
                    </q-popup-edit>
                  </div>
                </div>
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
import {
  GetComment,
  GetHotComment,
  LikeComment,
  SendComment,
  GetMVComment,
} from 'src/utils/request/broadcastSong/broadcast'
import { isUnNull } from 'src/utils'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Comment',
  components: {},
  props: {
    id: {
      type: String,
    },
    type: {
      type: Number, // 0 歌曲  1 mv  5 视频
    },
  },
  setup(props) {
    let currentComment = ref([])
    let hotComment_ = ref([])
    let comment_ = ref([])
    let commentMode = ref(true)
    let commentAmount = ref(20)
    let hotCommentAmount = ref(15)
    let replyCommentType = ref(1) // 1: 发送   2: 回复
    let replyCommentId = ref('')
    let $q = useQuasar()

    const get = async id => {
      if (isUnNull(id)) return
      let res
      if (props.type === 0) {
        res = await GetComment(id)
      }
      if (props.type === 1) {
        res = await GetMVComment(id)
      }
      const { hotComments, comments } = res
      hotComment_.value = hotComments
      comment_.value = comments
      currentComment.value = hotComments
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
      let { code } = await LikeComment(...args)
      if (code === 200) {
        // 点赞成功
      }
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
        let res
        if (props.type === 0) {
          res = await GetComment(props.id, (commentAmount.value += 20))
        }
        if (props.type === 1) {
          res = await GetMVComment(props.id, (commentAmount.value += 20))
        }
        let { comments } = res
        comment_.value = comments
        currentComment.value = comment_.value
        return
      }
      let { hotComments } = await GetHotComment(
        props.id,
        props.type,
        (hotCommentAmount.value += 15)
      )
      hotComment_.value = hotComments
      currentComment.value = hotComment_.value
    }
    const sendComment_ = async comment => {
      let res = await SendComment(
        replyCommentType.value,
        props.type,
        props.id,
        comment,
        replyCommentId.value
      )
      if (res.code === 200) {
        const { comment } = res
        comment.beReplied = []
        comment.timeStr = '刚刚'
        comment.liked = false
        comment.likedCount = 0
        comment_.value.unshift(comment)
        $q.notify({
          message: '评论成功！',
          color: 'purple',
          position: 'top',
        })
        return
      }
      $q.notify({
        message: '评论失败，请刷新重试',
        color: 'purple',
        position: 'top',
      })
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
      replyCommentType,
      replyCommentId,
      useless: ref(''),
      changeComment,
      loadMoreComment,
      like,
      sendComment_,
      isUnNull,
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
      position: relative;
      .pen {
        position: absolute;
        top: 48px;
        right: -120px;
      }
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
      .user-avatar {
        cursor: pointer;
      }
      .user-avatar__dark {
        cursor: pointer;
        box-shadow: 8px 8px 16px #797979, -8px -8px 16px #ffffff;
      }

      .badge {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 5px;
        left: 35px;
      }
      .comment-replied__dark {
        width: 320px;
        opacity: 0.4;
        background-color: #165156;
        border-radius: 5px;
      }
      .comment-replied {
        width: 320px;
        background-color: black;
        opacity: 0.5;
        border-radius: 5px;
        color: white;
      }
      .bar {
        display: grid;
        grid-template-columns: 1fr 3fr;
        .time {
          opacity: 0.7;
          height: 10px;
        }
        .comment-replay {
          margin-right: -15px;
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
