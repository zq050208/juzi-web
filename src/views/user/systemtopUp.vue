<template>
<!-- 系统充值 -->
  <div class="content">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="rules">
      <el-form-item label="代理商：" prop="userId" :required="true" label-width="151px">
        <el-select v-model="ruleForm.userId" placeholder="请选择代理商" filterable >
          <el-option
            style="width:220px"
            v-for="item in options"
            :key="item.userId"
            :label="item.companyName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="充值金额：" prop="amount" label-width="151px" :required="true">
        <el-input v-model="ruleForm.amount" placeholder="请输入充值金额" style="width:220px" @blur=focus()></el-input>
      </el-form-item>
      <el-form-item label="大写金额：" label-width="151px" prop="aa">
        <el-input  placeholder="大写金额" style="width:220px" v-model="ruleForm.aa" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="密码：" label-width="151px" prop="password" :required="true" >
        <el-input  placeholder="请输入密码" style="width:220px" v-model="ruleForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="备注：" label-width="151px" prop="remark">
        <el-input  placeholder="请输入备注内容" style="width:220px" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { assignCardAgentListSelect } from "@/api/api.js"; //获取代理商的数据
import { recharge } from "@/api/api.js";//系统充值
export default {
  data() {
    return {
      ruleForm:{
        amount:'',
        userId:'',
        password:'',
        remark:'',
        aa:''
      },
      aa:'',
      options: [],
      rules: {
        amount:[
          { required: true, message: "请输入充值金额", trigger: "blur" }
        ],
        password:[
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
      }
    };
  },
  computed: {},
  methods: {
    // 获取初始化代理商列表
    ListSelect(){
      assignCardAgentListSelect().then(res => {
        if (res.data.code == 200) {
          this.options = res.data.data;
        }
      })
    },
    // 焦点时触发大写金额
    focus(){
      this.ruleForm.aa = this.convertCurrency(this.ruleForm.amount)
    },
    // 转换大写的
    convertCurrency(money) {
      //汉字的数字
      var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
      //基本单位
      var cnIntRadice = new Array('', '拾', '佰', '仟');
      //对应整数部分扩展单位
      var cnIntUnits = new Array('', '万', '亿', '兆');
      //对应小数部分单位
      var cnDecUnits = new Array('角', '分', '毫', '厘');
      //整数金额时后面跟的字符
      var cnInteger = '整';
      //整型完以后的单位
      var cnIntLast = '元';
      //最大处理的数字
      var maxNum = 999999999999999.9999;
      //金额整数部分
      var integerNum;
      //金额小数部分
      var decimalNum;
      //输出的中文金额字符串
      var chineseStr = '';
      //分离金额后用的数组，预定义
      var parts;
      if (money == '') { return ''; }
      money = parseFloat(money);
      if (money >= maxNum) {
        //超出最大处理数字
        return '';
      }
      if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      //转换为字符串
      money = money.toString();
      if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
      } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n == '0') {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            //归零
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
          var n = decimalNum.substr(i, 1);
          if (n != '0') {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == '') {
        chineseStr += cnInteger;
      }
      return chineseStr;
    },
    submitForm(formName){
      this.ruleForm.userId = '1272407528508100608';
      // if (!this.ruleForm.userId) return this.$message("请选择运营商");
      recharge(this.ruleForm).then(res => {
        if (res.data.code == 200) {
          this.$notify({
            title: "成功",
            message: "系统充值成功",
            type: "success"
          });
          this.$refs[formName].resetFields();
        }else{
          this.$message.error(res.data.message);
        }
      })
    }
  },
  mounted() {

  },
  created() {
    this.ListSelect()
  }
};
</script>
<style scoped lang="less">
  
</style>


