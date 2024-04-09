import {login, logout, getInfo} from '@/api/login'
import {getToken, setToken, removeToken} from '@/js/token.js'
import defAva from '@/assets/images/avatar.jpeg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      id: '',
      username: '',
      avatar: '',
      roles: [],
      permissions: [],
      isFetch: false
    }),
    actions: {
      // 登录
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid

        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(data => {
            data.token && setToken(data.token)
            this.token = data.token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise(resolve => {

          this.isFetch = true
          getInfo().then(data => {
            this.$patch({
              ...data
            })
            this.avatar = data.avatar || defAva
            // 执行后面的 onFilFulled
            resolve()
          })
        })
      },

      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },

      clearInfo() {
        this.token = ''
        this.roles = []
        this.permissions = []
        removeToken()
      }
    }
  })

export default useUserStore
