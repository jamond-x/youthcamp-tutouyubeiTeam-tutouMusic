<template>
  <div>
    <q-dialog v-model="alert">
      <div v-show="type === 'login'">
        <LoginVue @closeDialog="closeDialog" @changeType="changeTypeData" />
      </div>
      <div v-show="type === 'register'">
        <RegisterVue @closeDialog="closeDialog" @changeType="changeTypeData" />
      </div>
      <div v-show="type === 'resetPwd'">
        <ResetPwdVue @closeDialog="closeDialog" @changeType="changeTypeData" />
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import LoginVue from 'src/components/login/Login.vue'
import RegisterVue from 'src/components/login/Register.vue'
import ResetPwdVue from 'src/components/login/ResetPwd.vue'

export default defineComponent({
  name: 'AuthPanel',
  components: { LoginVue, RegisterVue, ResetPwdVue },
  props: {},
  data() {
    return {
      alert: true,
      type: 'login',
    }
  },
  methods: {
    closeDialog: function () {
      this.alert = !this.alert
    },
    changeTypeData: function (params) {
      this.type = params
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
</style>
