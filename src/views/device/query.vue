// 卡查询
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
      <el-form-item label="批量备注内容：" prop="content" label-width="151px">
        <el-input v-model="ruleForm.content" placeholder="请输入备注内容" style="width:420px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" @click="note()">批量备注</el-button>
        <el-button type="primary" size="medium" @click="boot()">批量开机</el-button>
        <el-button type="primary" size="medium" @click="turnoff()">批量关机</el-button>
        <el-button type="primary" size="medium" @click="openSynchronization()">批量开启同步</el-button>
        <el-button type="primary" size="medium" @click="closeSynchronization()">批量关闭同步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  updateCardByListRemarks,
  activationCardList,
  shunDownCardList,
  openCardListSync,
  closeCardListSync
} from "@/api/api.js";
export default {
  data() {
    return {
      ruleForm: {
        cardInfoList: "",
        cardStartValue: "",
        cardEndValue: "",
        content: ""
      },
      tableData: []
    };
  },
  computed: {},
  methods: {
    note() {
      let data = {
        cardEndValue: this.ruleForm.cardEndValue.replace(/ /g, ""),
        cardStartValue: this.ruleForm.cardStartValue.replace(/ /g, ""),
        cardInfoList: this.ruleForm.cardInfoList.split("\n"),
        remark: this.ruleForm.content
      };
      this.$alert("确定要批量备注吗？", "批量备注", {
        confirmButtonText: "确定"
      }).then(() => {
        updateCardByListRemarks(data).then(res => {
          if (res.data.status == 200) {
            this.$notify({
              title: "成功",
              message: "批量备注成功",
              type: "success"
            });
          }
        });
      });
    },
    boot() {
      let data = {
        cardEndValue: this.ruleForm.cardEndValue.replace(/ /g, ""),
        cardStartValue: this.ruleForm.cardStartValue.replace(/ /g, ""),
        cardInfoList: this.ruleForm.cardInfoList.split("\n"),
        remark: this.ruleForm.content
      };
      this.$alert("确定要批量开机吗？", "批量开机", {
        confirmButtonText: "确定"
      }).then(() => {
        activationCardList(data).then(res => {
          if (res.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "批量开机成功",
              type: "success"
            });
          }
        });
      });
    },
    turnoff() {
      let data = {
        cardEndValue: this.ruleForm.cardEndValue.replace(/ /g, ""),
        cardStartValue: this.ruleForm.cardStartValue.replace(/ /g, ""),
        cardInfoList: this.ruleForm.cardInfoList.split("\n"),
        remark: this.ruleForm.content
      };
      this.$alert("确定要批量关机吗？", "批量关机", {
        confirmButtonText: "确定"
      }).then(() => {
        shunDownCardList(data).then(res => {
          if (res.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "批量关机成功",
              type: "success"
            });
          }
        });
      });
    },
    openSynchronization(){
      let data = {
        cardEndValue: this.ruleForm.cardEndValue.replace(/ /g, ""),
        cardStartValue: this.ruleForm.cardStartValue.replace(/ /g, ""),
        cardInfoList: this.ruleForm.cardInfoList.split("\n"),
        remark: this.ruleForm.content
      };
      this.$alert("确定要批量开启同步吗？", "批量开启同步", {
        confirmButtonText: "确定"
      }).then(() => {
        openCardListSync(data).then(res => {
          if (res.data.status == 200) {
            this.$notify({
              title: "成功",
              message: "批量开启同步成功",
              type: "success"
            });
          }
        });
      });
    },
    closeSynchronization(){
      let data = {
        cardEndValue: this.ruleForm.cardEndValue.replace(/ /g, ""),
        cardStartValue: this.ruleForm.cardStartValue.replace(/ /g, ""),
        cardInfoList: this.ruleForm.cardInfoList.split("\n"),
        remark: this.ruleForm.content
      };
      this.$alert("确定要批量关闭同步吗？", "批量关闭同步", {
        confirmButtonText: "确定"
      }).then(() => {
        closeCardListSync(data).then(res => {
          if (res.data.status == 200) {
            this.$notify({
              title: "成功",
              message: "批量关闭同步成功",
              type: "success"
            });
          }
        });
      });
    },
  },
  created() {},
  mounted() {}
};
</script>

<style scoped>
</style>
