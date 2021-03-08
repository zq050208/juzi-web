import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login'),
  },
  {
    path: '/test',
    component: () => import('@/views/test'),
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
  },
  {
    path: '/dashboard',
    component: Layout,
		redirect: '/dashboard',
		name: '运营情况',
		meta: {
      title: '运营情况',
      icon: 'lock'
    },
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard'),
        name: 'dashboard',
        meta: { title: '运营情况', icon: 'el-icon-orange', affix: true}
      },
    ]
  },
  {
    path: '/dashboardList',
    component: Layout,
    redirect: '/dashboardList',
    name: '代理管理',
    meta: {
      title: '代理管理',
      icon: 'edit'
    },
    children: [
      {
        path: 'dashboardList',
        component: () => import('@/views/dashboardList'),
        name: 'dashboardList',
        meta: { title: '代理管理' , keepAlive: true }
      },
      {
        path: '/agent',
        name: 'agent',
        component: () => import('@/views/partners/agent'),
        meta: {
          title: '代理列表'
        },
      },
      {
        path: '/createAgent',
        name: 'createAgent',
        component: () => import('@/views/partners/createAgent'),
        meta: {
          title: '创建代理'
        }
      },
    ]
  },
  {
    path: '/cards',
    component: Layout,
    redirect: '/device/cards',
    name: '流量卡管理',
    meta: {
      title: '流量卡管理',
      icon: 'edit'
    },
    children: [
      {
        path: 'cards',
        component: () => import('@/views/device/cards'),
        name: 'cards',
        meta: { 
          title: '流量卡列表' ,
          keepAlive: true
        }
      },
      {
        path: 'source',
        component: () => import('@/views/device/source'),
        name: 'source',
        meta: { title: '卡源管理' }
      },
      {
        path: 'cardlock',
        component: () => import('@/views/device/cardlock'),
        name: 'cardlock',
        meta: { title: '流量卡解锁' }
      },
    ]
  },
  {
    path: '/packagelist',
    component: Layout,
		redirect: '/package/packagelist',
		name: '套餐管理',
		meta: {
      title: '套餐管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'packagelist',
        component: () => import('@/views/package/packagelist'),
        name: 'packagelist',
        meta: { title: '套餐列表', icon: 'el-icon-orange' }
      },
      {
        path: '/add',
        name: 'add',
        component: () => import('@/views/package/add'),
        meta: {
          title: '套餐添加'
        }
      },
      {
        path: '/edit',
        name: 'edit',
        component: () => import('@/views/package/edit'),
        meta: {
          title: '套餐修改'
        }
      },
      {
        path: 'group',
        component: () => import('@/views/package/group'),
        name: 'group',
        meta: { title: '套餐组', icon: 'el-icon-orange' }
      },
      {
        path: 'proxy',
        component: () => import('@/views/package/proxy'),
        name: 'proxy',
        meta: { title: '底价套餐', icon: 'el-icon-orange' }
      },
    ]
  },
  {
    path: '/orderlist',
    component: Layout,
    redirect: '/order/orderlist',
    name: '订单管理',
    meta: {
      title: '订单管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'orderlist',
        component: () => import('@/views/order/orderlist'),
        name: 'orderlist',
        meta: { title: '订单列表' }
      },
      {
        path: 'topUp',
        component: () => import('@/views/order/topUp'),
        name: 'topUp',
        meta: { title: '批量充值'}
      },
      {
        path: 'deleteOrder',
        name: 'deleteOrder',
        component: () => import('@/views/order/deleteOrder'),
        meta: { title: '删除订单' }
      },
      {
        path: 'commission',
        name: 'commission',
        component: () => import('@/views/order/commission'),
        meta: { title: '佣金列表' }
      }
    ]
  },
  {
    path: '/auths',
    component: Layout,
    redirect: '/auths/auths',
    name: '实名管理',
    meta: {
      title: '实名管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'auths',
        component: () => import('@/views/auths/auths'),
        name: 'auths',
        meta: { title: '实名列表' }
      },
      {
        path: 'certification',
        component: () => import('@/views/auths/certification'),
        name: 'certification',
        meta: { title: '实名详情' }
      },
    ]
  },
  {
    path: '/missionList',
    component: Layout,
    redirect: '/taskCenter/missionList',
    name: '任务列表',
    meta: {
      title: '任务列表',
      icon: 'nested'
    },
    children: [
      {
        path: 'missionList',
        component: () => import('@/views/taskCenter/missionList'),
        name: 'missionList',
        meta: { title: '任务列表' }
      },
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles 需要权限限制的页面
 */
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
