import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import { LoginByPhone, Logout } from 'src/utils/request/login/login'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
    state: {
      userInfo: {
        nickname: '秃头预备',
        avatarUrl:
          'https://cdn.jsdelivr.net/gh/jamond-x/public-resources@latest/Avatar/Avatar-Maker%20(3).png',
      },
      loginFlag: 0,
      isFM: false,
      firstOpenFM: true,
    },
    mutations: {
      setUser(state, payload) {
        state.userInfo = payload.profile
        state.loginFlag = payload.loginType
      },
      setFMStatus(state, payload) {
        state.isFM = payload
      },
      setFirstOpenFM(state, payload) {
        state.firstOpenFM = payload
      },
    },
    actions: {
      async phoneLogin(content, payload) {
        let res = await LoginByPhone(payload)
        let { loginType, profile } = res
        content.commit('setUser', { loginType, profile })
        return res
      },
      async goLogout(content, payload) {
        let res = await Logout()
        let profile = {
          nickname: '秃头预备',
          avatarUrl:
            'https://cdn.jsdelivr.net/gh/jamond-x/public-resources@latest/Avatar/Avatar-Maker%20(3).png',
        }
        let loginType = 0
        content.commit('setUser', { loginType, profile })
        return res
      },
    },
  })

  return Store
})
