<template>
  <div class="content">
    <el-input v-model="iccid" placeholder="ICCID" :disabled="true"></el-input>
    <el-input v-model="msisdn" placeholder="MSISDN" :disabled="true"></el-input>
    <!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
    <el-button type="primary" @click="open">一键开启</el-button>
 
    <template>
      <div class="table" style="margin-top: 20px">
        <el-table :data="tableData" border style="width: 95%" id="out-table">
          <el-table-column prop="id" label="序号" align="center"></el-table-column>
          <el-table-column prop="companyName" label="代理商" align="center"></el-table-column>
          <el-table-column prop="operationName" label="运营商" align="center"></el-table-column>
          <el-table-column prop="cardSourceName" label="来源" align="center"></el-table-column>
          <el-table-column prop="iccid" label="ICCID" align="center" width="180px"></el-table-column>
          <el-table-column prop="msisdn" label="MSISDN" align="center"></el-table-column>
          <el-table-column prop="cardStatus" label="状态" align="center"></el-table-column>
          <el-table-column prop="monthFlow" label="月流量" align="center"></el-table-column>
          <el-table-column prop="expireDate" label="过期时间" align="center"></el-table-column>
        </el-table>
      </div>
    </template>
    <div class="block" style="margin-top: 30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {gprsIndex,gprsBatchOpen} from "@/api/api.js";
export default {
  data() {
    return {
      iccid:'',
      msisdn:'',
      page: 1,
      pageSize: 10,
      total: 0,
      tableData:[],
      iccidData:[]
    }
     
  },
  computed: {},
  methods: {
    // 批量开启GPRS
    open(){
      gprsBatchOpen({iccid:this.iccidData}).then( res => {
        if (res.data.code == 200) {
            this.$message({
            message: '批量开启GPRS功能成功',
            type: 'success'
          });
        }
      })
    },
    // 库存状态的判断
    inventoryStatus() {
      for (var i = 0, l = this.tableData.length; i < l; i++) {
        if (this.tableData[i].cardStatus == "1") {
          this.tableData[i].cardStatus = "库存";
        } else if (this.tableData[i].cardStatus == "2") {
          this.tableData[i].cardStatus = "待激活";
        } else if (this.tableData[i].cardStatus == "3") {
          this.tableData[i].cardStatus = "可测试";
        } else if (this.tableData[i].cardStatus == "4") {
          this.tableData[i].cardStatus = "已激活";
        } else if (this.tableData[i].cardStatus == "5") {
          this.tableData[i].cardStatus = "已停机";
        } else if (this.tableData[i].cardStatus == "6") {
          this.tableData[i].cardStatus = "预销户";
        } else if (this.tableData[i].cardStatus == "7") {
          this.tableData[i].cardStatus = "已销户";
        }
      }
    },
    initData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize
      };
      gprsIndex(params).then( res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          this.total = res.data.data.total;
          this.inventoryStatus();
          for(var i = 0, l = this.tableData.length; i < l; i++){
            this.iccidData.push(this.tableData[i].iccid);
            if(this.tableData[i].expireDate == null){
                this.tableData[i].expireDate = '无'
            }
            if(this.tableData[i].monthFlow > 1024){
                this.tableData[i].monthFlow =  (this.tableData[i].monthFlow / 1024).toFixed(2) + 'G'
            }else if(this.tableData[i].monthFlow == null || this.tableData[i].monthFlow == 0 ){
                this.tableData[i].monthFlow =  0 + 'Byte'
            }else if(1024 > this.tableData[i].monthFlow > 0){
                this.tableData[i].monthFlow =  this.tableData[i].monthFlow + 'M'
            }
          }
        }

      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.initData();
    },
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.el-input {
  width: 170px;
  margin-left: 5px;
}
.el-button {
  margin-left: 50px;
  border-radius: 3px;
  padding: 10px 20px;
}

</style>





