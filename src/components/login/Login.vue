<template>
  <q-card class="cardWrapper column items-center justify-evenly">
    <q-btn
      @click="toggleLoginShow"
      class="closeBtn q-mr-md"
      size="md"
      flat
      round
      icon="fas fa-times"
    />
    <div>
      <div class="login_font">登录</div>
    </div>
    <div class="InputBox">
      <q-input
        rounded
        v-model="phone"
        standout
        label="手机号"
        :rules="[
          val => (val && val.length > 0 && /^1[35789]\d{9}$/.test(val)) || '请输入正确手机号',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-mobile" />
        </template>
      </q-input>
    </div>
    <div class="InputBox">
      <q-input
        rounded
        standout
        :type="isPwd ? 'password' : 'text'"
        v-model="password"
        label="密码"
        :rules="[val => (val && val.length > 0) || '请输入密码']"
      >
        <template v-slot:prepend>
          <q-icon name="fas fa-ellipsis-h" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </div>
    <div class="row justify-center">
      <q-btn
        :loading="isLoading"
        :color="$q.dark.isActive ? 'grey-4' : 'black'"
        :text-color="$q.dark.isActive ? 'black' : 'white'"
        glossy
        unelevated
        label="登 录"
        class="q-mb-md InputBox"
        @click="onSubmit"
      />
    </div>
  </q-card>
</template>
<script>
import { defineComponent, ref, watch, inject } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import md5 from 'js-md5'
export default defineComponent({
  name: 'Login',
  setup(props, { emit }) {
    const $q = useQuasar()
    const store = useStore()
    const phone = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const isLoading = ref(false)
    const loginFlag = inject('loginFlag')
    const toggleLoginShow = inject('toggleLoginShow')
    const updateLoginFlag = inject('updateLoginFlag')
    const setUserStorage = res => {
      let { loginType, profile, cookie, token } = res
      let { userId: uid } = profile
      window.localStorage.setItem('userInfo', JSON.stringify(profile))
      window.localStorage.setItem('loginFlag', loginType)
      window.localStorage.setItem('uid', uid)
      window.localStorage.setItem('cookie', cookie)
      window.localStorage.setItem('token', token)
      updateLoginFlag(loginType)
    }
    const onSubmit = () => {
      let data = {
        phone: phone.value,
        md5_password: md5(password.value),
      }
      isLoading.value = true
      store.dispatch('phoneLogin', data).then(res => {
        if (res.code === 200) {
          setUserStorage(res)
          showNotify(`登录成功!,欢迎${res.profile.nickname}`)
          toggleLoginShow()
        } else {
          showNotify(`登录失败!,检查手机号和密码!`)
        }
        isLoading.value = false
      })
    }
    const showNotify = msg => {
      $q.notify({
        message: msg,
        color: 'primary',
        position: 'top',
      })
    }

    return {
      phone,
      password,
      isPwd,
      isLoading,
      toggleLoginShow,
      showNotify,
      onSubmit,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.cardWrapper {
  width: 470px;
  height: 350px;
  border-radius: 30px;
}
.login_font {
  @include custom-font(35px, 600, 8px, inherit);
}
.InputBox {
  min-width: 370px;
}
.closeBtn {
  position: absolute;
  right: 30px;
  top: 25px;
}
</style>
