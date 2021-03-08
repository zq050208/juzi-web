<template>
  <div class="sidebar">

    <el-col :span="24">
      <el-menu
        default-active="0"
        class="el-menu-vertical-demo"
        background-color="#2A3644"
        text-color="#fff"
        active-text-color="#24D2B5"
        :unique-opened = true  
      >
        <el-submenu v-for = '(item,index) in list' :key="index" :index="index + ''">
            <template slot="title">
                <i :class="item.iconClass"></i>
                <span>{{item.name}}</span>
            </template>
            <el-menu-item  v-for = "(i, idx) in item.data" :key="idx" :index="index + '' - idx + ''" @click="secMenuChange(i)">{{i.name}}</el-menu-item>
        </el-submenu>
        
      </el-menu>
    </el-col>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuActived: false,
      list: [
        {
          name: "运营管理",
          iconClass: '',
          data: [
            {
              name: "运营管理",
              route: "dashboard"
            }
          ]
        },
        {
          name: "代理管理",
          iconClass: '',
          data: [
            {
              name: "代理列表",
              route: "antenna"
            },
            {
              name: "创建代理",
              route: "createAgent"
            }
          ]
        },
        {
          name: "流量卡管理",
          iconClass: '',
          data: [
            {
              name: "流量卡列表",
              route: "cards"
            },
            {
              name: "卡源管理",
              route: "source"
            }
          ]
        },
        {
          name: "套餐管理",
          iconClass: '',
          data: [
            {
              name: "套餐列表",
              route: "packagelist"
            },
            {
              name: "套餐组",
              route: "group"
            },
            {
              name: "代理套餐",
              route: "proxy"
            }
          ]
        },
        {
          name: "订单管理",
          iconClass: '',
          data: [
            {
              name: "订单列表",
              route: "orderlist"
            },
            {
              name: "批量充值",
              route: "topUp"
            },
            {
              name: "删除订单",
              route: "deleteOrder"
            },
            {
              name: "佣金列表",
              route: "commission"
            }
          ]
        }
      ]
    };
  },
  computed: {},
  mounted () {
      for(var i=0,  l=this.list.length; i<l; i++){
          if(this.list[i].name === "运营管理"){
              this.list[i].iconClass = "el-icon-orange"
          } else if(this.list[i].name === "代理管理"){
              this.list[i].iconClass = "el-icon-user"
          } else if(this.list[i].name === "流量卡管理"){
              this.list[i].iconClass = "el-icon-printer"
          } else if(this.list[i].name === "套餐管理"){
              this.list[i].iconClass = "el-icon-collection"
          } else if(this.list[i].name === "订单管理"){
              this.list[i].iconClass = "el-icon-menu"
          } 
      }
      
  },
  methods: {
    secMenuChange(i) {
      console.log(i);
      this.$router.push({
        name: i.route,
        params: {
          id: Math.random()
        }
      });
    }
  },
  created() {}
};
</script>
<style scoped lang="less">
  .sidebar {
    width: 200px;
    height: 100%;
    padding-top: 50px;
    background: #304156;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    ul li {
      width: 100%;
      line-height: 50px;
      color: #dfdfdf;
      cursor: pointer;
      font-size: 14px;
    }
    .first_menu {
      width: 100%;
      padding-left: 45px;
      position: relative;
    }
    .sec_menu {
      padding-left: 60px;
    }
    .el-menu-item{
      min-width:198px;
    }
}
</style>