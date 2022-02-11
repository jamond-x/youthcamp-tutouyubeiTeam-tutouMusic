<template>
  <div class="room_container">
    <div class="pieces_container">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="one" label="二人间" />
        <q-tab name="two" label="多人间" />
        <q-tab name="three" label="Movies" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="one"> 万事不入耳，世间只你我！ </q-tab-panel>

        <q-tab-panel name="two">
          <div class="head q-ma-lg">一起听多人间</div>

          <div class="row justify-center">
            <div
              class="pieces q-ma-md flex flex-center"
              :class="`bg_color_${Math.floor(Math.random() * 11) + 1}`"
              v-for="(room, index) in rooms"
              :key="index"
            >
              <div>
                <div class="font__decorate font-GEO text-white">
                  {{ String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0)) }}
                </div>
                <q-btn
                  class="btn_enter"
                  @click="joinSongRoom(room)"
                  :to="`/room/${room.id}`"
                  text-color="white"
                  flat
                  round
                  icon="fas fa-sign-in-alt"
                ></q-btn>
              </div>
              <div class="room_name text-white q-px-md">{{ room.name }}</div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="three">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import socket from 'src/utils/socket'

export default defineComponent({
  name: 'RoomsPages',
  components: {},
  props: {},
  setup() {
    let store = useStore()
    let rooms = ref([])

    onMounted(() => {
      socket.connect()
    })

    onUnmounted(() => {
      socket.disconnect()
    })

    socket.on('rooms list', rooms_ => {
      rooms.value = rooms_
    })

    const connect = () => {
      socket.connect()
    }

    const disconnect = () => {
      socket.disconnect()
    }

    const joinSongRoom = room => {
      // 传入用户信息
      socket.emit('join room', { roomId: room.id, userId: '123456789' })
      store.commit('setCurrentRoom', room)
    }

    const sendMsgToRoom = () => {
      socket.emit('to room', {
        roomId: '10001',
        eventType: 'group msg',
        msg: '客户端向群发送的消息',
      })
    }

    const play = roomId => {
      socket.emit('play', { roomId })
    }

    const pause = roomId => {
      socket.emit('pause', { roomId })
    }

    return {
      tab: ref('two'),
      connect,
      disconnect,
      joinSongRoom,
      sendMsgToRoom,
      play,
      pause,
      rooms,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/theme.scss';
@import 'src/css/common.scss';
.room_container {
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  .pieces_container {
    grid-area: 1/2/2/3;
    .head {
      font-size: 25px;
      font-weight: 900;
    }
    .pieces {
      width: 185px;
      height: 185px;
      border-radius: 15px;
      position: relative;
      .room_name {
        @include custom-font(17px, 900, inherit, inherit);
      }
      .font__decorate {
        position: absolute;
        top: 5px;
        left: 18px;
        font-size: 30px;
      }
      .btn_enter {
        display: none;
        position: absolute;
        right: 18px;
        top: 18px;
        transition: all 0.3s ease;
      }
      &:hover .btn_enter {
        display: block;
      }
    }
  }
}
</style>
