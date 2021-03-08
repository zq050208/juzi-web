<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" style="width:211px">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menu" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data(){
    return{
      showLogo: true,
      // list1:[
      //       {
      //           "id": 1,
      //           "parentId": 0,
      //           "createTime": "2020-02-02T06:50:36.000+0000",
      //           "name": "运营情况",
      //           "level": 0,
      //           "sort": 0,
      //           "route": "/dashboard",
      //           "iconClass": "",
      //           "hidden": 0,
      //           "subMenu": []
      //       },
      //       {
      //           "id": 2,
      //           "parentId": 0,
      //           "createTime": "2020-02-02T06:51:50.000+0000",
      //           "name": "代理管理",
      //           "level": 0,
      //           "sort": 0,
      //           "route": "/agent",
      //           "iconClass": "",
      //           "hidden": 0,
      //           "subMenu": [
      //               {
      //                   "id": 3,
      //                   "parentId": 2,
      //                   "createTime": "2020-02-02T06:52:44.000+0000",
      //                   // "name": "代理列表",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "agent",
      //                   "name": "agent",
      //                   "meta": { title: '代理列表', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               },
      //               {
      //                   "id": 4,
      //                   "parentId": 2,
      //                   "createTime": "2020-02-02T06:53:51.000+0000",
      //                   "name": "创建代理",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "createAgent",
      //                   "name": "createAgent",
      //                   "meta": { title: '创建代理', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               }
      //           ]
      //       },
      //       {
      //           "id": 5,
      //           "parentId": 0,
      //           "createTime": "2020-06-17T06:48:15.000+0000",
      //           "name": "流量卡管理",
      //           "level": 0,
      //           "sort": 0,
      //           "route": "/cards",
      //           "iconClass": "",
      //           "hidden": 0,
      //           "subMenu": [
      //               {
      //                   "id": 6,
      //                   "parentId": 5,
      //                   "createTime": "2020-06-17T06:49:04.000+0000",
      //                   "name": "流量卡列表",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "cards",
      //                   "name": "cards",
      //                   "meta": { title: '流量卡列表', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               },
      //               {
      //                   "id": 7,
      //                   "parentId": 5,
      //                   "createTime": "2020-06-17T06:49:44.000+0000",
      //                   "name": "卡源管理",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "source",
      //                   "name": "source",
      //                   "meta": { title: '卡源管理', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               }
      //           ]
      //       },
      //       {
      //           "id": 8,
      //           "parentId": 0,
      //           "createTime": "2020-06-17T06:50:19.000+0000",
      //           "name": "套餐管理",
      //           "level": 0,
      //           "sort": 0,
      //           "route": "packagelist",
      //           "iconClass": "",
      //           "hidden": 0,
      //           "subMenu": [
      //               {
      //                   "id": 9,
      //                   "parentId": 8,
      //                   "createTime": "2020-06-17T06:51:06.000+0000",
      //                   "name": "套餐列表",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "packagelist",
      //                   "name": "packagelist",
      //                   "meta": { title: '套餐列表', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               },
      //               {
      //                   "id": 10,
      //                   "parentId": 8,
      //                   "createTime": "2020-06-17T06:51:40.000+0000",
      //                   "name": "套餐组",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "group",
      //                   "name": "group",
      //                   "meta": { title: '套餐组', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               },
      //               {
      //                   "id": 11,
      //                   "parentId": 8,
      //                   "createTime": "2020-06-17T06:52:11.000+0000",
      //                   "name": "代理套餐",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "proxy",
      //                   "name": "proxy",
      //                   "meta": { title: '代理套餐', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               }
      //           ]
      //       },
      //       {
      //           "id": 12,
      //           "parentId": 0,
      //           "createTime": "2020-06-17T06:52:43.000+0000",
      //           "name": "订单管理",
      //           "level": 0,
      //           "sort": 0,
      //           "route": "orderlist",
      //           "iconClass": "",
      //           "hidden": 0,
      //           "subMenu": [
      //               {
      //                   "id": 13,
      //                   "parentId": 12,
      //                   "createTime": "2020-06-17T06:53:15.000+0000",
      //                   "name": "订单列表",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "orderlist",
      //                   "name": "orderlist",
      //                   "meta": { title: '订单列表', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               },
      //               {
      //                   "id": 14,
      //                   "parentId": 12,
      //                   "createTime": "2020-06-17T06:53:50.000+0000",
      //                   "name": "批量充值",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "topUp",
      //                   "name": "topUp",
      //                   "meta": { title: '批量充值', icon: 'dashboard', affix: true },
      //                   "iconClass": "",
      //                   "hidden": 0
      //               },
      //               {
      //                   "id": 15,
      //                   "parentId": 12,
      //                   "createTime": "2020-06-17T06:54:33.000+0000",
      //                   "name": "删除订单",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "deleteOrder",
      //                   "iconClass": "",
      //                   "hidden": 0
      //               },
      //               {
      //                   "id": 16,
      //                   "parentId": 12,
      //                   "createTime": "2020-06-17T06:55:03.000+0000",
      //                   "name": "佣金列表",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "commission",
      //                   "iconClass": "",
      //                   "hidden": 0
      //               }
      //           ]
      //       },
      //       {
      //           "id": 17,
      //           "parentId": 0,
      //           "createTime": "2020-06-17T06:56:01.000+0000",
      //           "name": "实名管理",
      //           "level": 0,
      //           "sort": 0,
      //           "route": "auths",
      //           "iconClass": "",
      //           "hidden": 0,
      //           "subMenu": [
      //               {
      //                   "id": 18,
      //                   "parentId": 17,
      //                   "createTime": "2020-06-17T06:59:13.000+0000",
      //                   "name": "实名列表",
      //                   "level": 1,
      //                   "sort": 0,
      //                   "route": "auths",
      //                   "iconClass": "",
      //                   "hidden": 0
      //               }
      //           ]
      //       }
        
      // ],
      menu: [
        {
          path: '/dashboard',
          icon: 'star',
          name: '运营情况',
          children: [
            {
              path: '/dashboard',
              meta: { title: '运营情况',icon: 'star', }
            },
          ]
        },
        {
          path: '/dashboardList',
          icon: 'edit',
          name: '代理管理',
          children: [
            {
              path: '/agent',
              meta: {
                title: '代理列表'
              },
            },
            {
              path: '/createAgent',
              meta: {
                title: '创建代理'
              }
            },
          ]
        },
        {
          path: '/cards',
          name: '流量卡管理',
          icon: 'list',
          children: [
            {
              path: 'cards',
              meta: { title: '流量卡列表' }
            },
            {
              path: 'source',
              meta: { title: '卡源管理'}
            },
            {
              path: 'cardlock',
              meta: { title: '流量卡解锁'}
            },
          ]
        },
        {
          path: '/packagelist',
          icon: 'star',
          name: '套餐管理',
          children: [
            {
              path: 'packagelist',
              meta: { title: '套餐列表'}
            },
            {
              path: 'group',
              meta: { title: '套餐组'}
            },
            {
              path: 'proxy',
              meta: { title: '底价套餐'}
            },
          ]
        },
        {
          path: '/orderlist',
          icon: 'star',
          name: '订单管理',
          children: [
            {
              path: 'orderlist',
              meta: { title: '订单列表' }
            },
            {
              path: 'topUp',
              meta: { title: '批量充值'}
            },
            {
              path: 'deleteOrder',
              meta: { title: '删除订单' }
            },
            {
              path: 'commission',
              meta: { title: '佣金列表' }
            }
          ]
        },
        {
          path: '/auths',
          // redirect: '/auths/auths',
          icon: 'star',
          name: '实名管理',
          children: [
            {
              path: 'auths',
              meta: { title: '实名列表' }
            },
          ]
        },
        {
          path: '/missionList',
          // redirect: '/user/missionList',
          icon: 'star',
          name: '任务列表',
          children: [
            {
              path: 'missionList',
              meta: { title: '任务列表' }
            },
          ]
        },
      /** when your routing map is too long, you can split it into small modules **/
      // 404 page must be placed at the end !!!
        { path: '*', redirect: '/404', hidden: true }
      ]
    }
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      // 'permission_routes',
      // 'menu',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
  .wanwu{
    height: 50px;
    color:#DFDFDF;
    font-size: 16px;
    text-align: center;
    line-height: 50px;
    background: #2b2f3a;
  }
  /deep/ .el-menu{
    border-right: none;
  }
</style>

