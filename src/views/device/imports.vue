// 卡导入
<template>
  <div class="content">
    <aside class="aside">
      <strong>注意事项:</strong>
      <br />1. 导入卡只能导入不存在的，已经存在库里面的不会更改起卡源，网络等
      <br />2. excel工作表必须叫 Sheet1
      <br />3. 至少包含ICCID, MSISDN两列，区分大小写，顺序无关
    </aside>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="运营商:" prop="region" :required="true" label-width="151px">
        <el-select v-model="ruleForm.region" filterable placeholder="请选择运营商" @change="operation">
          <el-option
            v-for="item in operationList"
            :key="item.operationId"
            :label="item.operationName"
            :value="item.operationId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡源：" prop="source" :required="true" label-width="151px">
        <el-select filterable v-model="ruleForm.source" placeholder="请选择卡源">
          <el-option
            v-for="item in sourceList"
            :key="item.cardSourceId"
            :label="item.cardSourceName"
            :value="item.cardSourceId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网络：" prop="network" :required="true" label-width="151px">
        <el-select v-model="ruleForm.network" placeholder="请选择网络">
          <el-option
            v-for="item in networkList"
            :key="item.networkType"
            :label="item.operationName"
            :value="item.networkType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Excel文件：" prop="excel" :required="true" label-width="151px">
        <el-upload
          v-model="ruleForm.excel"
          class="upload-Excel"
          action
          multiple
          accept=".xlsx, .xls, .csv"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :http-request="httpRequest"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  operationList,
  cardSourceSelectList,
  batchImportCard
} from "@/api/api.js"; //运营商列表,
export default {
  data() {
    return {
      ruleForm: {
        region: "",
        source: "",
        network: "",
        excel: ""
      },
      operationList: [],
      sourceList: [],
      networkList: [
        {
          networkType: "1",
          operationName: "2G"
        },
        {
          networkType: "2",
          operationName: "3G"
        },
        {
          networkType: "3",
          operationName: "4G"
        },
        {
          networkType: "4",
          operationName: "5G"
        }
      ],
      fileList: []
    };
  },
  computed: {},
  methods: {
    httpRequest(param) {
      this.ruleForm.excel = param.file;
    },
    submitForm() {
      if (!this.ruleForm.region) return this.$message("请选择运营商");
      if (!this.ruleForm.source) return this.$message("请选择卡源");
      if (!this.ruleForm.network) return this.$message("请选择网络");
      if (!this.ruleForm.excel) return this.$message("请选择表格");
      let formData = new FormData();
      formData.append("file", this.ruleForm.excel);
      formData.append("cardSourceId", this.ruleForm.source);
      formData.append("networkType", this.ruleForm.network);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      batchImportCard(formData, config).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          this.$notify({
            title: "成功",
            message: "卡导入成功",
            type: "success"
          });
          this.$router.push({ path: `/cards`});
        }else{
          return this.$message(res.data.msg);
        }
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 提交运营商出现对应的卡源
    operation() {
      cardSourceSelectList({ operationId: this.ruleForm.region }).then(res => {
        if (res.data.code == 200) {
          (this.ruleForm.source = ""), (this.sourceList = res.data.data);
        }
      });
    }
  },
  created() {
    operationList().then(res => {
      this.operationList = res.data.data;
    });
  },
  mounted() {}
};
</script>

<style scoped>
.aside {
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
  margin-left: 70px;
}
.upload-Excel {
  width: 280px;
}
</style>
