<template>
<!-- 修改资料页面 -->
  <div class="content">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" style="width:300px" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="ruleForm.companyName" style="width:300px" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="userRealName">
        <el-input v-model="ruleForm.userRealName" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="ruleForm.phone" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="less">
</style>

<script>
import { getUserDetail } from "@/api/api.js";
import { updateUser } from "@/api/api.js";
export default {
  data() {
    return {
      ruleForm: {
        userId:'',
        username: "",
        companyName: "",
        userRealName: "",
        phone: ""
      },
      rules: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        userRealName: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (/^1[34578]\d{9}$/.test(value) == false) {
                callback(new Error("请输入正确的联系电话"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    // 用户修改信息
    submitForm(formName) {
      updateUser(this.ruleForm).then(res => {
        if (res.data.code == 200) {
          this.ruleForm = Object.assign({}, res.data.data);
          this.$message({
            message: "修改信息成功",
            type: "success",
            duration: 1500
          });
          this.$router.push("/userCenter");
        }
      });
    },
    // 获取信息
    initData() {
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      getUserDetail({userId:this.userId}).then(res => {
        if (res.data.code == 200) {
          this.ruleForm = res.data.data;
          // console.log(res.data.data)
        }
      });
    }
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>
