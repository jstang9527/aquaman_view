import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/cus',
  //   name: "业务管理",
  //   component: Layout,
  //   meta: { title: '业务管理', icon: 'tree', affix: false },
  //   redirect: '/cus',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/cus/index'),
  //       name: '业务列表',
  //       meta: { title: '业务列表', affix: false }
  //     },
  //     {
  //       path: 'task_create',
  //       component: () => import('@/views/cus/info'),
  //       name: '新建业务',
  //       meta: { title: '新建业务', affix: false },
  //       hidden: true
  //     },
  //     {
  //       path: 'task_edit',
  //       component: () => import('@/views/cus/info'),
  //       name: '更新业务',
  //       meta: { title: '更新业务', affix: false },
  //       hidden: true
  //     }
  //   ]
  // },
  {
    path: '/asset',
    name: "资产管理",
    component: Layout,
    meta: { title: '资产管理', icon: 'example', affix: false },
    redirect: '/asset',
    children: [
      {
        path: 'index',
        component: () => import('@/views/asset/index'),
        name: '资产列表',
        meta: { title: '资产列表', affix: false }
      },{
        path: 'info',
        component: () => import('@/views/asset/info'),
        name: '实例详情',
        meta: { title: '实例详情', affix: false },
        hidden: true
      },{
        path: '资产服务',
        component: () => import('@/views/asset/service'),
        name: '资产服务',
        meta: { title: '资产服务', affix: false }
      },{
        path: 'task_create',
        component: () => import('@/views/asset/curd'),
        name: '新建资产',
        meta: { title: '新建资产', affix: false },
        hidden: true
      },{
        path: 'task_edit',
        component: () => import('@/views/asset/curd'),
        name: '更新实例',
        meta: { title: '更新实例', affix: false },
        hidden: true
      },{
        path: 'discovery',
        component: () => import('@/views/asset/task_list'),
        name: '批量探测',
        meta: { title: '批量探测', affix: false }
      },{
        path: 'discovery/task_create',
        component: () => import('@/views/asset/task'),
        name: '新建探测任务',
        meta: { title: '新建探测任务', affix: false },
        hidden: true
      },{
        path: 'discovery/task_edit',
        component: () => import('@/views/asset/task'),
        name: '修改探测任务',
        meta: { title: '修改探测任务', affix: false },
        hidden: true
      }
    ]
  },{
    path: '/poc_vul',
    name: "POC检测",
    component: Layout,
    meta: { title: 'POC检测', icon: 'bug', affix: false },
    redirect: '/poc_vul',
    children: [
      {
        path: 'index',
        component: () => import('@/views/poc-vul/index'),
        name: '漏洞列表',
        meta: { title: '漏洞列表', affix: false }
      },
      {
        path: 'task_list',
        component: () => import('@/views/poc-vul/task_list'),
        name: '任务列表',
        meta: { title: '任务列表', affix: false }
      },
      {
        path: 'task_create',
        component: () => import('@/views/poc-vul/task'),
        name: '新建POC任务',
        meta: { title: '新建POC任务', affix: false },
        hidden: true
      },
      {
        path: 'task_edit',
        component: () => import('@/views/poc-vul/task'),
        name: '更新POC任务',
        meta: { title: '更新POC任务', affix: false },
        hidden: true
      },
      {
        path: 'plugin',
        component: () => import('@/views/poc-vul/plugin'),
        name: 'POC插件',
        meta: { title: 'POC插件', affix: false },
      }
    ]
  }, {
    path: '/web_vul',
    name: "Web漏洞",
    component: Layout,
    meta: { title: 'Web漏洞', icon: 'international', affix: false },
    redirect: '/web_vul',
    children: [
      {
        path: 'index',
        component: () => import('@/views/web-vul/index'),
        name: '站点列表',
        meta: { title: '站点列表', affix: false }
      },
      {
        path: 'task_list',
        component: () => import('@/views/web-vul/task_list'),
        name: '任务管理',
        meta: { title: '任务管理', affix: false }
      }, 
      {
        path: 'task_create',
        component: () => import('@/views/web-vul/task'),
        name: '新建任务',
        meta: { title: '新建任务', affix: false },
        hidden: true
      }
    ]
  }, {
    path: '/auth_tester',
    name: "权限爆破",
    component: Layout,
    meta: { title: '权限爆破', icon: 'password', affix: false },
    redirect: '/auth_tester',
    children: [
      {
        path: 'index',
        component: () => import('@/views/auth-tester/index'),
        name: '检出列表',
        meta: { title: '检出列表', affix: false }
      }, {
        path: 'task_list',
        component: () => import('@/views/auth-tester/task_list'),
        name: '检测任务',
        meta: { title: '检测任务', affix: false }
      }, {
        path: 'task_create',
        component: () => import('@/views/auth-tester/task'),
        name: '创建爆破任务',
        meta: { title: '创建爆破任务', affix: false },
        hidden: true
      }, {
        path: 'task_update',
        component: () => import('@/views/auth-tester/task'),
        name: '更新爆破任务',
        meta: { title: '更新爆破任务', affix: false },
        hidden: true
      }
    ]
  }, {
    path: '/setting',
    component: Layout,
    redirect: '/setting',
    children: [
      {
        path: 'index',
        component: () => import('@/views/sys_config/index'),
        // component: () => import('@/views/error-page/401'),
        name: '系统设置',
        meta: { title: '系统设置', icon: 'el-icon-setting', affix: false },
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // componentsRouter
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
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
