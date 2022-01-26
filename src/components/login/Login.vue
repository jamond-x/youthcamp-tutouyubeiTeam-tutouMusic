<template>
  <q-card class="cardWrapper column items-center">
    <q-btn @click="closeDialog" class="closeBtn" size="md" icon="fas fa-times" />
    <q-card-section>
      <div>欢迎登录</div>
    </q-card-section>
    <q-form @submit="onSubmit">
      <q-card-section class="InputWrapper row justify-between">
        <q-select class="col-4" dense outlined v-model="prefix" :options="prefixOptions" />
        <q-input
          class="col-8"
          dense
          outlined
          v-model="phoneNum"
          placeholder="手机号"
          :rules="[val => (val && val.length > 0) || '请输入手机号']"
        />
      </q-card-section>
      <q-card-section class="InputWrapper">
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
        <div class="leftBox column justify-around">
          <q-btn flat @click="goResetPwd" label="设置密码" />
          <q-checkbox label="自动登录" v-model="autoLogin" />
        </div>
        <div class="rightBox column">
          <q-btn
            :loading="isLoading"
            type="submit"
            color="primary"
            label="登录"
            class="btn q-mb-md"
          />
          <q-btn @click="goRegister" color="purple" label="注册" class="btn" />
        </div>
      </q-card-section>
    </q-form>
    <q-dialog v-model="secondDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">登录成功</div>
        </q-card-section>
        <q-card-section class="q-pt-none"> 欢迎回来 {{ userName }}! </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="goBack" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Login',
  props: {
    type: String,
  },
  methods: {
    goRegister: function () {
      this.$emit('changeType', 'register')
    },
    goResetPwd: function () {
      this.$emit('changeType', 'resetPwd')
    },
    closeDialog: function () {
      this.$emit('closeDialog')
    },
    onSubmit: async function () {
      let data = { phone: this.phoneNum, password: this.password }
      this.isLoading = true
      let res = await this.$store.dispatch('phoneLogin', data)
      setInterval(() => {
        this.isLoading = false
      }, 500)
      if (res.code === 200) {
        console.log(this.$store.state)
        this.userName = this.$store.state.userInfo.nickname
        this.secondDialog = true
        let { loginType, profile } = res
        let { userId: uid } = profile
        window.sessionStorage.setItem('userInfo', JSON.stringify(profile))
        window.sessionStorage.setItem('loginFlag', loginType)
        window.sessionStorage.setItem('uid', uid)
      }
    },
    checkPhone() {
      return /^1[35789]\d{9}$/.test(this.phoneNum)
    },
  },
  data() {
    return {
      phoneNum: '',
      password: '',
      prefixOptions: ['+86 CN', '+999', '+123', '+44', '+2'],
      prefix: '+86 CN',
      autoLogin: false,
      isPwd: true,
      isLoading: false,
      secondDialog: false,
      userName: '',
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.InputWrapper {
  width: 370px;
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
