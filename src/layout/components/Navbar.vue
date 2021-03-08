<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <div class="header_r">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item @click.native="userCenter()" v-if="usernameShow">个人中心</el-dropdown-item>
          <!-- <el-dropdown-item @click.native="changedata()">修改资料</el-dropdown-item> -->
          <el-dropdown-item @click.native="add=true;dialog = true">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="systemtopUp" v-if="levelShow">系统充值</el-dropdown-item>
          <el-dropdown-item @click.native="exit">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
      <!-- 新增信息 -->
      <div>
        <el-dialog
          :title="'修改密码'"
          :visible.sync="dialog"
          style="text-align:left !important "
          :before-close="handleClose"
          width="460px"
          :modal-append-to-body="false"
        >
          <el-form :model="form" label-width="80px" ref="form">
            <el-form-item
              label="旧密码:"
              prop="password"
              :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]"
            >
              <el-input
                v-model="form.password"
                autocomplete="off"
                style="width:260px"
                type="password"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="新密码:"
              prop="newpw"
              :rules="[{ required: true, message: '请输入新密码',trigger: 'blur' }]"
            >
              <el-input v-model="form.newpw" autocomplete="off" style="width:260px" type="password"></el-input>
            </el-form-item>

            <el-form-item
              label="确认密码:"
              prop="newPassword"
              :rules="[{ required: true, message: '请再次输入新密码',trigger: 'blur' }]"
              label-width="83px"
            >
              <el-input
                v-model="form.newPassword"
                autocomplete="off"
                style="width:260px"
                type="password"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer" slot="footer">
            <el-button type="primary" @click="dialog = false">取 消</el-button>
            <el-button type="success" @click="saveInfo(form)">提交</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from "@/api/api.js";
import { updatePassword } from "@/api/api.js";
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data() {
    return {
      // 弹窗的信息
      username: "",
      token: "",
      dialog: false,
      levelShow:false,
      usernameShow:false,
      form: {
        password: "",
        newPassword: ""
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 系统充值
    systemtopUp(){
      this.$router.push("/systemtopUp");
    },
    //个人中心
    userCenter(){
      this.$router.push("/userCenter");
    },
    // 修改信息
    changedata() {
      this.$router.replace("/changedata");
    },
    // 注销
    exit() {
      logout({ Token: this.token }).then(res => {
        localStorage.clear();
        // localStorage.removeItem("userCommissionType");
        // localStorage.removeItem("level");
        // localStorage.removeItem("uesrname");
        // localStorage.removeItem("userId");
        // localStorage.removeItem("token");
        this.$router.push("/Login");
      });
    },
    // 弹窗
    handleClose(done) {
      this.form = {};
      this.input = "";
      done();
    },
    // 提交
    saveInfo(form) {
      if (!form.password) return this.$message("请输入旧密码");
      if (!form.newpw) return this.$message("请输入新密码");
      if (!form.newPassword) return this.$message("请再次输入新密码");
      if (form.newpw !== form.newPassword) return this.$message("两次密码不一致");
      if (form.newPassword.length < 6 && form.newpw.length < 6){
        return this.$message("新密码不能少于6位字符");
      }
      //   console.log(form);
      updatePassword(this.form).then(res => {
        if (res.data.code == 200) {
            this.form = {};
            this.dialog = false;
            this.$message({
              message: "修改密码成功",
              type: "success",
              duration: 1500
            });
          }else{
            this.$message.error(res.data.msg); 
            this.dialog = true;
          }
      });
    }
  },
  created() {
    let token = localStorage.getItem("token");
    let name = localStorage.getItem("uesrname");
    let level = localStorage.getItem("level");
    this.username = name;
    this.token = token;
    this.usernameShow = name == '乔安科技' ? true : false ;
    this.levelShow = level == 0 ? true : false
    // console.log("usernameShow:",this.usernameShow)
    // if(level == 0){
    //   this.levelShow = true;
    // }
    // if(name =='乔安科技'){
    //   this.usernameShow = true;
    // }else{
    //   this.usernameShow = false;
    // }
  },
    
}
</script>

<style lang="scss" scoped>
.header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  z-index: 11;
  .header_left{
      float: left;
      width: 350px;
      margin-left: 45px;
      span{
          color:#DFDFDF;
      }
  }
  .header_r{
      float: right;
      margin-right: 100px;
  }
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 18px;
    font-weight: bold;

}
.el-icon-arrow-down {
    font-size: 16px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    fill: #fff;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 2% ;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
