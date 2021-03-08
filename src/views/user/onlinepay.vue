<template>
<!-- 充值页面 -->
  <div class="content">
    <ul class="wx_pay_cont">
      <li class="wx_pay">
        <span class="wx_pay_span1">当前账户：</span>
        <span>{{ datalist.companyName }}</span>
      </li>
      <li class="wx_pay">
        <span class="wx_pay_span1">账户余额(元)：</span>
        <span>{{ datalist.totalBalance }}</span>
      </li>
      <li class="wx_pay">
        <span class="wx_pay_span1">充值金额(元)：</span>
        <el-input v-model="ruleForm.amount" placeholder="最低充值10元" style="width:220px"  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"></el-input>
      </li>
      <li class="wx_pay">
        <span class="wx_pay_span1">请选择支付方式：</span>
        <ul class="wx_pay_content">
          <li class="pay-sp" :class="{'checked': isCheckedPay === 1}" @click="checkPayWay(1)">
              <img src="../../assets/img/wx_payImg.png" alt="微信支付" data-type="1">
          </li>
          <li class="pay-sp wx_curr" :class="{'checked': isCheckedPay === 2}" @click="checkPayWay(2)" style="margin-left: 10px;">
              <img src="../../assets/img/zf_payImg.png" alt="支付宝支付" data-type="2">
          </li>
        </ul>
      </li>
      <li class="wx_pay" style="margin-left: 150px; margin-top: 50px;">
        <el-button type="primary" @click="onlinepay()" :disabled="true">去充值</el-button>
      </li>
    </ul>
  </div>
</template>
<script>
import { userCenter } from "@/api/api.js";//获取个人中心的信息
export default {
  data() {
    return {
      datalist:{},
      ruleForm:{},
      isCheckedPay: 1,
    };
  },
  computed: {},
  methods: {
    initData() {
      userCenter().then(res => {
        if (res.data.code == 200) {
          this.datalist = res.data.data;
        }
      })
    },
    onlinepay(){
      if (this.ruleForm.amount < 10) return this.$message("充值金额不能小于10元");
    },
    checkPayWay(type){
      this.isCheckedPay = type
    }
  },

  mounted() {

  },
  created() {
    this.initData();
  }
};
</script>
<style scoped lang="less">
  .wx_pay_cont{
    padding: 10px 0 0 50px;
  }
  .wx_pay{
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
  }
  .wx_pay span{
    color: #666;
    font-size: 14px;
  }
  .wx_pay_span1{
    width: 150px;
    text-align: right;
    display: inline-block;
  }
  .wx_pay_content{
    display: inline-block;
    height: 28px;
  }
  .wx_pay_content li{
    float: left;
    width: 200px;
    height: 45px;
    border: 1px solid #eeeeee;
    text-align: center;
    
  }
  .wx_pay_content li.checked{
     border: 1px solid #32c169;
     background: url(../../assets/img/wx_payImg2.png) no-repeat center center;
  }
</style>


