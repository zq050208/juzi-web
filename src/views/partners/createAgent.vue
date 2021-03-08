<template>
  <div class="content">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <aside>
        <strong>佣金说明:</strong>
        <br />1. 佣金金额必须从0开始
        <br />2. 必须点击旁边的添加按钮才算添加成功
        <br />3. 佣金采用绝对分成，不要给下级分配比自己更多比例的佣金, 会导致佣金为负数
        <br />4. 佣金公式为(充值金额 x 对应的佣金比例 / 100)
      </aside>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="昵称" prop="username" :required="true">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :required="true">
              <el-input v-model="ruleForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmpassword" :required="true">
              <el-input v-model="ruleForm.confirmpassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="公司名" prop="companyName">
              <el-input v-model="ruleForm.companyName"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="userRealName" :required="true">
              <el-input v-model="ruleForm.userRealName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone" :required="true">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="联系人邮箱" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="选择分成模式" prop="userCommissionType">
              <!-- <el-checkbox v-model="ruleForm.userCommissionType" label="按分成比例" border></el-checkbox> -->
                <el-radio v-model="ruleForm.userCommissionType" label="0" @change="dividedModel" v-show = 'aa'>比例模式</el-radio>
                <el-radio v-model="ruleForm.userCommissionType" label="1" @change="dividedModel" v-show = 'bb'>底价模式</el-radio>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12" v-show="serverGroupIdShow">
        <!-- <el-col :span="12"> -->
          <!-- <el-form-item label="套餐组" v-show="serverGroupIdShow"> -->
          <el-form-item label="套餐组" v-show="serverShow">
            <el-select v-model="ruleForm.serverGroupId" placeholder="请选择套餐组" multiple filterable style="width:300px">
              <el-option
                v-for="item in options"
                :key="item.serverGroupId"
                :label="item.serverGroupName"
                :value="item.serverGroupId"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="grid-content bg-purple-light">
            <el-form-item label="分成比例">
              <input
                type="text"
                v-model="price"
                name="tel"
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="9"
                style="width: 150px;border:1px solid #dcdee2;border-radius:4px;line-height:40px;padding-left: 5px;height: 40px;color:#515a6e;"
                placeholder="金额"
              />
              <input
                type="text"
                v-model="percent"
                name="tel"
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="3"
                style="width: 150px;border:1px solid #dcdee2;border-radius:4px;line-height:40px;margin-left: 5px;padding-left: 5px;height: 40px;color:#515a6e;"
                placeholder="比例"
              />
              <el-button type="primary" size="small" @click="add" style=" margin-left: 3px;">添加</el-button>
              <el-table :data="percentList" style="width: 300px" v-if="percentList.length > 0">
                <el-table-column prop="price" label="金额" width="80"></el-table-column>
                <el-table-column prop="percent" label="比例" width="80"></el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="deleteOne(scope.$index)"
                      style="width: 60px;"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          size="medium"
          @click="submitForm('ruleForm')"
          style="width: 120px;"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

														

<script>
import { addUser, listAllServerGroupInfo } from "@/api/api.js";

export default {
  data() {
    return {
      ruleForm: {
        userCommissionType:'0',
        username: "",
        password: "",
        confirmpassword:'',
        userRealName: "",
        companyName: "",
        phone: "",
        email: "",
        address: "",
        serverGroupId: "",
        userRate: [],
      },
      serverGroupIdShow:true,
      serverShow:true,
      aa:false,
      bb:false,
      options: [],
      percentList: [],
      price: "",
      percent: "",
      rules: {
        username: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "请输入3至10字母数字或汉字",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "请输入6至11字母或者数字",
            trigger: "blur"
          }
        ],
        confirmpassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "请输入6至11字母或者数字",
            trigger: "blur"
          }
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
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        companyName:[
          { required: true, message: "请输入公司名", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  created() {
    listAllServerGroupInfo().then(res => {
      if (res.data.code == 200) {
        this.options = res.data.data;
          this.options.forEach((item) => {
          item.serverGroupName = item.serverGroupId + '-' + item.serverGroupName
        })
      }
    });
    let level = localStorage.getItem("level");
    let userCommissionType = localStorage.getItem("userCommissionType")
    // console.log('level:',level);
    // console.log('userCommissionType:',userCommissionType);
    if(level == 0){
      this.serverShow = true;
      this.aa = true;
      this.bb = true;
    }else{
      this.serverShow = false;
      if(userCommissionType == 0){
        this.ruleForm.userCommissionType = '0';
        this.aa = true;
      }else{
        this.serverGroupIdShow = false;
        this.ruleForm.userCommissionType = '1';
        this.bb = true;
      }
    }

  },
  mounted() {},
  methods: {
    submitForm(formName) {
      if (this.ruleForm.password !== this.ruleForm.confirmpassword ) return this.$message("两次密码不一致");
      // console.log(this.ruleForm.userCommissionType)
      // this.ruleForm.userCommissionType = this.ruleForm.userCommissionType === true ? 1 : 0;
      // console.log("ruleForm.userCommissionType:",this.ruleForm.userCommissionType)

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.userRate = this.percentList;
          addUser(this.ruleForm).then(res => {
              if (res.data.code == 200) {
              this.$notify({
                title: "成功",
                message: "新增代理商成功",
                type: "success",
                duration: 1500
              });
              this.$router.push({ path: `/agent`});
              } else {
                return this.$message.error(res.data.message);
              }
          });
        }
      });
    },
    // 分成模式
    dividedModel(val){
      this.serverGroupIdShow = val == 1 ? false : true
    },
    // 增加分成
    add() {
      if (!this.price || !this.percent) {
        return this.$message.error("请输入分成比例");
      }
      for (var i = 0, l = this.percentList.length; i < l; i++) {
        if (this.price == this.percentList[i].price) {
          return this.$message.error("金额不能重复");
        }
      }

      let obj = {
        price: this.price,
        percent: this.percent
      };
      this.percentList.push(obj);
      console.log(this.percentList);
      this.price = "";
      this.percent = "";
    },
    // 删除分成
    deleteOne(index) {
      this.percentList.splice(index, 1);
    }
  }
};
</script>
<style scoped>
aside {
  background: #eef1f6;
  padding: 8px 24px;
  margin-bottom: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

