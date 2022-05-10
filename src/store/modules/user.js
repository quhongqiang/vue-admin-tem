import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import MD5 from 'js-md5'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userInfo: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password, vercode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: MD5(`${password}`), vercode: vercode }).then(response => {
        const { token } = response.data
        commit('SET_TOKEN', token)
        setToken(token)
        commit('SET_USERINFO', response.data)
        localStorage.setItem('userInfo', JSON.stringify(response.data))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 超级管理员
      const data = {
        roles: ['super_user'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
      commit('SET_AVATAR', data.avatar)
      commit('SET_ROLES', data.roles)

      const userInfo = JSON.parse(localStorage.getItem('userInfo'))

      const pageList = this.state.user.userInfo?.pageList || userInfo.pageList || []
      const buttonList = this.state.user.userInfo?.buttonList || userInfo.buttonList || []

      var is_super_user = this.state.user.userInfo?.loginname || userInfo.loginname
      let btns = []
      let page = []
      // 超级管理员
      if (is_super_user === 'zhangyugang') {
        btns = 'super_user'
        page = 'super_user'
      } else {
        if (pageList.length !== 0) {
          btns = buttonList || []
          page = pageList || []
        } else {
          btns = ['']
          page = ['']
        }
      }
      btns = 'super_user'
      page = 'super_user'
      resolve({ page, btns })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)
    const { roles } = await dispatch('getInfo')
    resetRouter()
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    router.addRoutes(accessRoutes)
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
