<template>
  <div class="content" style="width:800px">
    <el-form ref="propsParams" :rules="ruleValidate" :model="propsParams" label-width="200px" >
      <el-form-item label="资费套餐:" prop="serverId">
        <el-select
          v-model="propsParams.serverId"
          filterable
          clearable
          placeholder="请选择资费套餐:"
          style="width:95%"
        >
          <el-option
            v-for="item in optPackage"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ICCID/MSISDN列表:" prop="iccids">
        <el-input
          type="textarea"
          v-model="propsParams.iccids"
          rows="8"
          placeholder="以回车键分割ICCID/MSISDN"
        ></el-input>
      </el-form-item>
      <el-form-item label="ICCID/MSISDN范围:" prop="range">
        <el-row>
          <el-col :span="11">
            <el-input v-model="propsParams.start" placeholder="包含开始值" clearable></el-input>
          </el-col>
          <el-col :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-input v-model="propsParams.end" placeholder="包含终止值" clearable></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input type="password" v-model="propsParams.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="isBtnLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import commonIpt from '@/components/commonIpt'
import { addOrderInfo } from "@/api/api.js"; //批量充值
import { listAllServerInfo } from "@/api/api.js"; //全量套餐列表
export default {
  data() {
    return {
      propsParams: {},
      optPackage: [],
      iccids: [],
      isBtnLoading:false,
      ruleValidate: {
        serverId: [
          { required: true, message: "请输入资费名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  components: {
    // commonIpt,
  },
  computed: {},
  methods: {
    // 资费套餐下拉
    queryServerList() {
      listAllServerInfo().then(res => {
        if (res.data.code == 200) {
          this.dataList = res.data.data;
          // console.log(this.dataList)
          this.dataList.forEach(item => {
            this.optPackage.push({
              value: item.serverId,
              label: `${item.serverId}-${item.serverName}-${item.floorPrice}`
            });
          });
        }
      });
    },
    handleSubmit() {
      let params = {
        ...this.propsParams
      };
      this.isBtnLoading = true;
      this.$refs.propsParams.validate(valid => {
        if (valid) {
          if (params.iccids !== undefined) {
            params.iccids = params.iccids.split(/[(\r\n)\r\n]+/);
          }
          addOrderInfo(params).then(res => {
            if (res.data.code == 200) {
              this.$message.success("批量充值成功");
              this.propsParams = {};
              this.isBtnLoading = false;
            } else {
              this.$message.error("批量充值失败");
            }
          });
        }
      });
    }
  },
  created() {
    this.queryServerList();
  }
};
</script>
<style>
  @media screen and (max-width: 750px){
    /deep/ .el-form-item__label{
      width: 145px!important;
    }
  }
</style>

