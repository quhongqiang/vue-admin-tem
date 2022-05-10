import { asyncRoutes, constantRoutes } from '@/router'

export function filterAsyncRoutes(routes, pages) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (pages.indexOf(tmp.name) >= 0) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, pages)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  buttonsPermission: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttonsPermission = buttons
  }
}

const actions = {
  generateRoutes({ commit }, { page, btns }) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (page === 'super_user') {
      const accessedRoutes = asyncRoutes
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, constantRoutes)
      //   console.log(accessedRoutes)
      // }
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_BUTTONS', btns)
      resolve(accessedRoutes)
    })
  },
  setButtonsAction({
    commit
  }, buttons) {
    commit('SET_BUTTONS', buttons)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
