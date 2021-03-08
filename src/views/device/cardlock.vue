<template>
  <div class="content">
    <!-- <el-select v-model="queryParams.cardSourceId" filterable clearable placeholder="来源" style="width:170px;">
      <el-option v-for="item in optSource" :key="item.cardSourceId" :label="item.cardSourceName" :value="item.cardSourceId"></el-option>
    </el-select> -->
    <el-input v-model="queryParams.iccid" placeholder="ICCID"  @keyup.enter.native="search" style="width:210px;margin-left:15px" clearable></el-input>
    <el-button type="primary" class="anniu" icon="el-icon-search" @click="search" style="margin-left:15px">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="handleCls">重置</el-button>
    <div class="table" style="margin-top: 20px">
      <h3 class="detail-h3">智能诊断：</h3>
      <div class="table" style="margin-top: 10px">
        <el-table :data="tableData" border style="width: 95%" id="out-table">
          <el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
          <el-table-column prop="imei" label="IMEI" align="center"></el-table-column>
          <el-table-column prop="cardSourceId" label="卡源" align="center">
            <template slot-scope="{row}">
              <span v-if="row.cardSourceId == '1290527594088894464'">WH电信</span>
              <span v-else-if="row.cardSourceId == '1295607947866542080'">联通</span>
              <span v-else-if="row.cardSourceId == '1294178997919420416'">BW移动</span>
              <span v-else-if="row.cardSourceId == '1276723955557863424'">DCP电信</span>
              <span v-else type="success">DG移动</span>
            </template>
          </el-table-column>
          <el-table-column prop="lockStatus" label="状态" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.lockStatus == 0 ">未锁定</el-tag>
              <el-tag v-else-if="row.lockStatus == 1 ">已锁定</el-tag>
              <el-tag v-else>未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="danger" @click="delRow()" style="background:#24D2B5;border: 1px solid #24D2B5;">获取IMEI</el-button> -->
              <el-button size="mini" type="success" @click="retie(scope.row.iccid)" style="background:#B6A2DE;border: 1px solid #B6A2DE;">机卡重绑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 75389836206891 -->
    <div class="table" style="margin-top: 20px">
      <h3 class="detail-h3">历史操作：</h3>
      <div class="table" style="margin-top: 10px">
        <el-table :data="tableData1" border style="width: 95%" id="out-table">
          <el-table-column prop="operator" label="操作账号" align="center"></el-table-column>
          <el-table-column prop="operationType" label="操作类型" align="center">
            <template slot-scope="{row}">
              <span v-if="row.operationType == 1">解锁</span>
            </template>
          </el-table-column>
          <el-table-column prop="operationStatus" label="操作情况" align="center">
            <template slot-scope="{row}">
              <span v-if="row.operationStatus == 0 ">处理中</span>
              <span v-else-if="row.operationStatus == 1 ">成功</span>
              <span v-else>失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="finishTime" label="完成时间" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  
</template>
<script>
import { cardSourceSelectListNoParam } from "@/api/api.js"; //卡源
import { searchCardLockInfo } from "@/api/api.js"; //查询
import { unLockCard } from "@/api/api.js"; //机卡重绑
export default {
  data() {
    return {
      queryParams:{
        // iccid:'8986111926608767965',
      },
      optSource: [],
      tableData:[],
      tableData1:[],
    };
  },
  computed: {},
  methods: {
    search(){
      let params = {
        ...this.queryParams,
      };
      searchCardLockInfo(params).then(res => {
        if (res.data.code == 200) {
          this.tableData  = res.data.data.cardLockInfo;
          // 锁定状态 0未锁定 1 已锁定 2 未知
          // for(var i =0;i<this.tableData.length;i++){
          //   this.tableData[i].lockStatus = this.tableData[i].lockStatus + '';
          // }
          this.tableData1  = res.data.data.cardOperationRecord;

        }
      })
    },
    //重置
    handleCls(){
      for (var i in this.queryParams) {
        this.queryParams[i] = null;
      };
      this.tableData = [];
      this.tableData1 = []
    },
    delRow(){

    },
    // 机卡重绑
    retie(iccid){
      unLockCard({iccid:iccid}).then(res => {
        if (res.data.code == 200) {
          this.$message({ message: '机卡重绑成功',type: 'success'});
        }else{
          this.$message.error('机卡重绑失败');
        }
      })
    }
  },

  mounted() {

  },
  created() {
    // 查找卡源列表
    cardSourceSelectListNoParam().then(res => {
      if (res.data.code == 200) {
        this.optSource = res.data.data;
      }
    });
  }
};
</script>
<style>
  .detail-h3 {
    color: #909399;
  }
</style>


