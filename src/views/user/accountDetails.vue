<template>
<!-- 账户明细 -->
  <div class="content">
     <el-input v-model="queryParams.iccid" placeholder="ICCID" style="width:150px;"  @keyup.enter.native="search"></el-input>
    <el-date-picker
     style="margin-left:10px"
      v-model="searchTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-select v-model="queryParams.type" filterable placeholder="收支类型" style="width:110px;margin-left:15px" @change="search">
      <el-option
        v-for="item in options"
        :key="item.cardStatus"
        :label="item.operationName"
        :value="item.cardStatus"
      ></el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-search" @click="search" style="margin-left:10px">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
    <div class="table" style="margin-top: 10px">
      <el-table :data="tableData" border style="width: 95%">
        <el-table-column prop="id" label="序号" align="center"></el-table-column>
        <el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
        <el-table-column prop="msisdn" label="MSISDN" align="center"></el-table-column>
        <el-table-column prop="orderNum" label="订单号" align="center"></el-table-column>
        <el-table-column prop="type" label="收支类型" align="center">
          <template slot-scope="{row}">
            <span v-if="row.type == '1'">收入</span>
            <span v-else>支出</span>
          </template>
        </el-table-column>
        <el-table-column prop="changeAmount" label="金额" align="center">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.type == '1'">{{"+"+ row.changeAmount}}</el-tag>
            <el-tag type="danger" v-if="row.type == '2'">{{"-"+ row.changeAmount}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="targetAmount" label="账户余额" align="center"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
      </el-table>
    </div>
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
import { walletRecord } from "@/api/api.js"; //金额的收支明细
export default {
  data() {
    return {
      page: 1,
      pageSize: 20,
      total: 0,
      queryParams:{},
      tableData:[],
      searchTime:[],
      options: [
        {
          cardStatus: "1",
          operationName: "收入"
        },
        {
          cardStatus: "2",
          operationName: "支出"
        },
      ],
    };
  },
  computed: {},
  methods: {
    initData() {
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
      };
      if (this.searchTime && this.searchTime[0]) {
        params.startTime = this.searchTime[0].Format();
        params.endTime = this.searchTime[1].Format();
      }
      walletRecord(params).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data.list)
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        }
      })
    },
    // 搜索
    search() {
      this.page = 1,
      this.initData();
    },
    // 重置
    resetForm() {
      for (var i in this.queryParams) {
        this.queryParams[i] = null;
      }
      this.searchTime = [];
      this.initData();
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

  mounted() {

  },
  created() {
    this.initData();
  }
};
</script>
<style scoped lang="less">
  /deep/ .el-date-editor .el-range-separator{
  width: 6%;
}
</style>


