// 卡分配
<template>
  <div class="content">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="代理商：" prop="region" :required="true" label-width="151px">
        <el-select v-model="ruleForm.region" placeholder="请选择代理商" filterable>
          <el-option
            v-for="item in options"
            :key="item.userId"
            :label="item.companyName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要实名：" prop="status" label-width="151px" v-show="levelShow">
        <template>
          <el-switch
            v-model="ruleForm.status"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-value="1"
            inactive-value="0"
            @change="changeSwitch($event)"
          ></el-switch>
        </template>
      </el-form-item>
      <!-- <el-form-item label="新增标签：" prop="label" label-width="151px" >
				<el-input v-model="ruleForm.label" style="width:217px"></el-input>
      </el-form-item>-->
      <el-form-item label="ICCID/MSISDN列表：" prop="cardInfoList" label-width="151px">
        <el-input
          v-model="ruleForm.cardInfoList"
          type="textarea"
          placeholder="以回车键分割ICCID/MSISDN"
          rows="6"
          style="width:420px;font-size:14px"
        ></el-input>
      </el-form-item>
      <el-form-item label="ICCID/MSISDN范围：" prop="start" label-width="151px">
        <el-input
          v-model="ruleForm.cardStartValue"
          style="width: 200px;margin-right: 10px;"
          placeholder="包含开始值"
        ></el-input>
        <span>-</span>
        <el-input
          v-model="ruleForm.cardEndValue"
          style="width: 200px;margin-left: 10px;"
          placeholder="包含终止值"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('ruleForm')" :loading="isBtnLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { assignCardAgentListSelect } from "@/api/api.js"; //获取代理商的数据
import { assignCard } from "@/api/api.js"; //卡分配的提交
export default {
  data() {
    return {
      ruleForm: {
        region: "",
        cardInfoList: "",
        cardStartValue: "",
        cardEndValue: "",
        status:0
      },
      options: [],
      isBtnLoading:false,
      levelShow:true
    };
  },
  computed: {},
  methods: {
    submitForm(ruleForm) {
      let cardInfoList = this.ruleForm.cardInfoList.split("\n");
      let data = {
        userId: this.ruleForm.region,
        cardEndValue: this.ruleForm.cardEndValue,
        cardStartValue: this.ruleForm.cardStartValue,
        cardInfoList: cardInfoList,
        needKyc:this.ruleForm.status
      };
      if (!this.ruleForm.region) return this.$message("请选择运营商");
      this.isBtnLoading = true;
      assignCard(data).then(res => {
        if (res.data.code == 200) {
          this.isBtnLoading = false;
          this.$notify({
            title: "成功",
            message: "卡分配成功",
            type: "success"
          });
          this.$router.push({ path: `/cards`});
        }
      });
    },
    changeSwitch($event) {
      console.log($event);
    }
  },
  created() {
    assignCardAgentListSelect().then(res => {
      if (res.data.code == 200) {
        this.options = res.data.data;
      }
    });
    let level = localStorage.getItem("level");
    if(level == 0){
      this.levelShow = true
    }else{
      this.levelShow = false
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>
