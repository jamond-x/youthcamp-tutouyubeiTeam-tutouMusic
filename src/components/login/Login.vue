<template>
  <q-card class="cardWrapper column items-center">
    <q-btn @click="toggleLoginShow" class="closeBtn" size="md" icon="fas fa-times" />
    <q-card-section>
      <div>欢迎登录</div>
    </q-card-section>
    <q-form @submit="onSubmit">
      <q-card-section class="row justify-between">
        <q-select class="col-4" dense outlined v-model="prefix" :options="prefixOptions" />
        <q-input
          class="col-8"
          dense
          outlined
          v-model="phoneNum"
          placeholder="手机号"
          :rules="[
            val => (val && val.length > 0 && /^1[35789]\d{9}$/.test(val)) || '请输入正确手机号',
          ]"
        />
      </q-card-section>
      <q-card-section>
        <q-input
          dense
          outlined
          :type="isPwd ? 'password' : 'text'"
          v-model="password"
          placeholder="密码"
          :rules="[val => (val && val.length > 0) || '请输入密码']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="row justify-between InputWrapper">
        <div class="rightBox column InputWrapper">
          <q-btn
            :loading="isLoading"
            type="submit"
            color="primary"
            label="登录"
            class="btn q-mb-md"
          />
        </div>
      </q-card-section>
    </q-form>
    <q-dialog v-model="secondDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">登录成功</div>
        </q-card-section>
        <q-card-section class="q-pt-none"> 欢迎回来 {{ username }}! </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="toggleLoginShow" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
import { defineComponent, ref, computed, watch, inject } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Login',
  props: {
    type: {
      type: String,
      default: 'Login',
    },
  },
  methods: {
    setUserStorage: function (res) {
      let { loginType, profile } = res
      let { userId: uid } = profile
      window.sessionStorage.setItem('userInfo', JSON.stringify(profile))
      window.sessionStorage.setItem('loginFlag', loginType)
      window.sessionStorage.setItem('uid', uid)
    },
    onSubmit: async function () {
      let data = { phone: this.phoneNum, password: this.password }
      this.isLoading = true
      let res = await this.$store.dispatch('phoneLogin', data)
      console.log(res)
      setInterval(() => {
        this.isLoading = false
      }, 500)
      console.log(this.$store.state)
      this.secondDialog = true
      // 设置sessionStorage便于其他组件使用（万一不用vuex）
      this.setUserStorage(res)
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const phoneNum = ref('')
    const password = ref('')
    const prefixOptions = ref(['+86 CN'])
    const prefix = ref('+86 CN')
    const autoLogin = ref(false)
    const isPwd = ref(true)
    const isLoading = ref(false)
    const secondDialog = ref(false)
    const username = computed(() => {
      return store.state.userInfo.nickname
    })
    const loginFlag = computed(() => {
      return store.state.loginFlag
    })
    const updateType = param => {
      emit('update:type', param)
    }
    const toggleLoginShow = inject('toggleLoginShow')
    watch(loginFlag, () => {
      console.log('loginFlag变化了 ', loginFlag.value)
    })
    return {
      phoneNum,
      password,
      prefixOptions,
      prefix,
      autoLogin,
      isPwd,
      isLoading,
      secondDialog,
      username,
      toggleLoginShow,
      updateType,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.InputWrapper {
  min-width: 370px;
}
.closeBtn {
  position: absolute;
  right: 0;
  top: 0;
}
.btn {
  min-width: 120px;
}
</style>
