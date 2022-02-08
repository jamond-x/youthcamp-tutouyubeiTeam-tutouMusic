<template>
  <q-card class="cardWrapper column items-center">
    <q-btn @click="toggleLoginShow" class="closeBtn" size="md" icon="fas fa-times" />
    <q-card-section>
      <div>欢迎登录</div>
    </q-card-section>
    <q-card-section class="InputBox">
      <q-input
        dense
        outlined
        v-model="phone"
        placeholder="手机号"
        :rules="[
          val => (val && val.length > 0 && /^1[35789]\d{9}$/.test(val)) || '请输入正确手机号',
        ]"
      />
    </q-card-section>
    <q-card-section class="InputBox">
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
    <q-card-section>
      <q-btn
        :loading="isLoading"
        type="submit"
        color="primary"
        label="登录"
        class="q-mb-md InputBox"
        @click="onSubmit"
      />
    </q-card-section>
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
    const nickname = ref('秃头预备')
    const loginFlag = inject('loginFlag')
    const toggleLoginShow = inject('toggleLoginShow')
    const updateLoginFlag = inject('updateLoginFlag')
    watch(loginFlag, () => {
      console.log('loginFlag变化了 ', loginFlag.value)
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
      if (userInfo) {
        nickname.value = userInfo['nickname']
        updateLoginFlag(Number(window.sessionStorage.getItem('loginFlag')))
      } else {
        nickname.value = '秃头预备'
        updateLoginFlag(0)
      }
    })
    const setUserStorage = res => {
      let { loginType, profile, cookie, token } = res
      let { userId: uid } = profile
      window.sessionStorage.setItem('userInfo', JSON.stringify(profile))
      window.sessionStorage.setItem('loginFlag', loginType)
      window.sessionStorage.setItem('uid', uid)
      window.sessionStorage.setItem('cookie', cookie)
      window.sessionStorage.setItem('token', token)
      nickname.value = profile['nickname']
      updateLoginFlag(loginType)
    }
    const onSubmit = () => {
      let data = {
        phone: phone.value,
        md5_password: md5(password.value),
      }
      isLoading.value = true
      store.dispatch('phoneLogin', data).then(res => {
        console.log(res)
        if (res.code === 200) {
          setUserStorage(res)
          showNotify(`登录成功!,欢迎${nickname.value}`)
          isLoading.value = false
          toggleLoginShow()
        } else {
          showNotify(`登录失败!,检查手机号和密码!`)
          isLoading.value = false
        }
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
      nickname,
      toggleLoginShow,
      showNotify,
      onSubmit,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.InputBox {
  min-width: 370px;
}
.closeBtn {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
