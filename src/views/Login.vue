<template>
  <div class="login">
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">系统登陆</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="form.username" style="width:80%" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password" style="width:80%" @keyup.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">登录</el-button>
      </el-form-item>
    </el-form>
    <div class="beianhao">
      <a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备20053887号</a>
    </div>
  </div>
</template>
<script>
import { login } from "@/api/api.js"; //引入login
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不可为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // this.initData();
  },
  methods: {
    // 用户登陆
    onSubmit(form) {
      // console.log(this.$router)
      //  this.$router.push("@/views/dashboard");
      if (this.form.username == "" && this.form.password == "") {
        this.$message.error("请输入账号或者密码");
      } else {
        login(this.form).then(res => {
          if (res.data.code == 200) {
            localStorage.setItem("uesrname", res.data.data.username);
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("userId", res.data.data.userId);
            localStorage.setItem("level", res.data.data.level);
            localStorage.setItem("userCommissionType", res.data.data.userCommissionType);
            this.$router.push("/dashboard");
          }else{
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 判断token是否存在
    initData() {
      // if (localStorage.getItem("token")) {
      //   return this.$router.push("/index");
      // }
    }
  }
};
</script>
<style scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(../assets/img/bj3.jpg) no-repeat center;
}
.login-p {
  width: 1200px;
  /* margin: 0 auto; */
  text-align: center;
  font-size: 30px;
  color: #3e3e3e;
  margin-top: 40px;
}
.login-box {
  border: 1px solid #dcdfe6;
  width: 450px;
  height: 310px;
  padding: 35px 35px 15px 35px;
  border-radius: 15px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  box-shadow: 0 0 25px #909399;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -155px;
  margin-left: -225px;
  background: #8993af;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}
.el-button {
  width: 80%;
}
.el-button span {
  font-size: 16px;
}
.dialog-footer button {
  width: 70px;
  text-align: center;
  font-size: 14px;
}
.beianhao{
    position: absolute;
    bottom: 3%;
    font-size: 14px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    left: 50%;
}
 @media screen and (max-width: 750px){
   .login{
     background: linear-gradient(to right top, #50C7C3, #9ED6A5 50%, #D3E2A7);
   }
   .login-box{
    width: 80%;
    height: 40%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -40%;
    margin-left: -40%;
    background: none;
    border: none;
    padding: 0;
    box-shadow: 0 0 0 0;
   }
   .login-box h3{
    color:#fff;
    font-size: 20px;
   }
    .el-button{
      background: #EAF4DB;
      border: none;
      color: #9BD2BC;
      font-weight: bold;
      font-size: 16px;
    }
}
</style>

