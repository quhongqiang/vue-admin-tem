import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 无重定向白名单

// function getRouteNames(routes) {
//   let routesName = []
//   routes.forEach(item => {
//     routesName.push(item.name)
//     if (item.children && item.children.length > 0) {
//       const childrenRoutes = getRouteNames(item.children)
//       routesName = [...routesName, ...childrenRoutes]
//     }
//   })
//   return routesName
// }

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意：角色必须是对象数组！例如：['admin']或，['developer'，'editor']
          const roles = await store.dispatch('user/getInfo')
          console.log(roles, '获取登录用户的角色权限')
          // 根据角色生成可访问的路线图
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log(accessRoutes, '登录者获取的菜单列表')
          // const allRoutesNames = getRouteNames(accessRoutes)
          // console.log(allRoutesNames, '所有route的name')
          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)

          // 黑客方法，以确保addRoutes是完整的
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          console.log(error, 'error || er')
          Message.error('Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
