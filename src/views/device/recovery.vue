// 卡回收
<template>
  <div class="content">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="ICCID/MSISDN列表：" prop="cardInfoList" label-width="151px">
        <el-input
          v-model="ruleForm.cardInfoList"
          type="textarea"
          placeholder="以回车键分割ICCID/MSISDN"
          rows="6"
          style="width:420px"
        ></el-input>
      </el-form-item>
      <el-form-item label="ICCID/MSISDN范围：" prop="cardStartValue" label-width="151px">
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
        <el-button type="primary" size="medium" @click="note()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { recycleCard } from "@/api/api.js";
export default {
  data() {
    return {
      ruleForm: {
        cardInfoList: "",
        cardStartValue: "",
        cardEndValue: ""
      }
    };
  },
  computed: {},
  methods: {
    note() {
      let data = {
        cardEndValue: this.ruleForm.cardEndValue.replace(/ /g, ""),
        cardStartValue: this.ruleForm.cardStartValue.replace(/ /g, ""),
        cardInfoList: this.ruleForm.cardInfoList.split("\n")
      };
      recycleCard(data).then(res => {
        if (res.data.code == 200) {
          this.$notify({
            title: "成功",
            message: "卡回收成功",
            type: "success"
          });
          this.$router.push({ path: `/cards`});
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped>
</style>
