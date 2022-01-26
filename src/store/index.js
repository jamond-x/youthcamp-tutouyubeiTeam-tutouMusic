import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

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
      userInfo: {},
      loginFlag: false,
    },
    mutations: {
      setUser(state, payload) {
        state.userInfo = payload.profile
        state.loginFlag = payload.loginType
      },
    },
    actions: {
      async phoneLogin(content, payload) {
        let res = await LoginPhone(payload)
        if (res.code === 200) {
          let { loginType, profile } = res
          content.commit('setUser', { loginType, profile })
        }
        return res
      },
    },
  })

  return Store
})
