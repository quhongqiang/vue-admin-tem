import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import financeCenter from './modules/financeCenter' // 财务中心

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧边栏中（默认值为false）
 * alwaysShow: true               如果设置为true，项目将不会显示在侧边栏中（默认值为false）
 *                                如果未设置alwaysShow，则当项目有多个子路线时，
 *                                它将变成嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为noRedirect，则面包屑中不会重定向
 * name:'router-name'             该名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['super_user','editor']     控制页面角色（可以设置多个角色）
    title: 'title'                侧边栏和面包屑中显示的名称（推荐设置）
    icon: 'svg-name'/'el-icon-x'  图标显示在侧边栏中
    noCache: true                 如果设置为true，则不会缓存页面（默认值为false）
    affix: true                   如果设置为true，则标记将粘贴在“标记”视图中
    breadcrumb: false             如果设置为false，则项目将隐藏在面包屑中（默认值为true）
    activeMenu: '/example/list'   如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基页
 * 所有角色都可以访问
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/home/index'),
      name: 'DashboardAdmin',
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/systemMenu',
    component: Layout,
    redirect: 'noRedirect',
    name: 'systemMenu',
    meta: {
      title: '系统管理',
      icon: 'excel'
    },
    children: [{
      path: 'rolePage',
      component: () => import('@/views/system/rolePage'),
      name: 'RolePage',
      meta: { title: '角色管理' }
    },
    {
      path: 'userPage',
      component: () => import('@/views/system/userPage'),
      name: 'UserPage',
      meta: { title: '用户管理' }
    }
    ]
  },
  {
    path: '/dispatch-center',
    component: Layout,
    redirect: 'noRedirect',
    name: 'DispatchCenter',
    meta: {
      title: '调度中心',
      icon: 'excel'
    },
    alwaysShow: true,
    children: [
      {
        path: 'dispatchCardList',
        component: () => import('@/views/dispatchCenter/index'),
        name: 'DispatchCardList',
        meta: { title: '加油卡列表', noCache: false }
      },
      {
        path: 'driverList',
        component: () => import('@/views/dispatchCenter/driverList'),
        name: 'DriverList',
        meta: { title: '司机列表', noCache: false }
      }
    ]
  },
  financeCenter
]

const createRouter = () => new Router({
  // mode: 'history', // 需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
