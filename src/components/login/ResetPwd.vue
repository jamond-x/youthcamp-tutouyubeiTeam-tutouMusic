<template>
  <q-card class="cardWrapper column items-center">
    <q-btn @click="goLogin" class="backBtn" size="md" icon="fas fa-chevron-left" />
    <q-btn @click="closeDialog" class="closeBtn" size="md" icon="fas fa-times" />
    <q-card-section>
      <div>重设密码</div>
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
      <q-card-section class="column justify-between InputWrapper">
        <div class="q-mb-lg">"密码8-20位，至少包含字母/数字/字符2种组合"</div>
        <q-btn type="submit" icon="fas fa-cog" color="primary" label="重设密码" />
      </q-card-section>
    </q-form>
  </q-card>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ResetPwd',
  props: {},
  methods: {
    goLogin: function () {
      console.log(1)
      this.$emit('changeType', 'login')
    },
    closeDialog: function () {
      this.$emit('closeDialog')
    },
    onSubmit: function () {
      console.log(this.phoneNum && this.phoneNum.length > 0)
    },
  },
  data() {
    return {
      phoneNum: '',
      password: '',
      prefixOptions: ['+86 CN', '+999', '+123', '+44', '+2'],
      prefix: '+86 CN',
      isPwd: true,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/css/common.scss';
.InputWrapper {
  width: 370px;
}
.backBtn {
  position: absolute;
  left: 0;
  top: 0;
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
