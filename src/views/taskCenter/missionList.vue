<template>
  <div class="content">
    <el-select v-model="queryParams.beassigUser" filterable placeholder="代理商" @change="search" clearable style="width:140px">
      <el-option
        v-for="item in agent"
        :key="item.id"
        :label="item.beassigUser"
        :value="item.beassigUser"
      ></el-option>
    </el-select>
    <el-select v-model="queryParams.missionType" filterable placeholder="类型" @change="search" clearable style="width:140px;margin-left:15px">
      <el-option
        v-for="item in type"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="queryParams.status" filterable placeholder="状态" @change="search" clearable style="width:140px;margin-left:15px">
      <el-option
        v-for="item in state"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-date-picker
        style="margin-left:15px"
        v-model="searchTime"
        @change="search"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    <el-button type="primary" class="anniu" icon="el-icon-search" @click="search" style="margin-left:15px">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="handleCls">重置</el-button>
    <div class="table" style="margin-top: 10px">
      <el-table :data="tableData" border style="width: 95%">
        <el-table-column prop="id" label="序号" align="center"></el-table-column>
        <el-table-column prop="companyName" label="代理商" align="center"></el-table-column>
        <el-table-column prop="beassigUser" label="分配代理商" align="center"></el-table-column>
        <el-table-column prop="missionType" label="类型" align="center"></el-table-column>
        <el-table-column prop="cardStartValue" label="开始号段" align="center" width="180px"></el-table-column>
        <el-table-column prop="cardEndValue" label="结束号段" align="center" width="180px"></el-table-column>
        <el-table-column prop="order" label="进度" align="center" width="180px">
          <template slot-scope="{row}">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="row.order"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="进度详情" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.status == '1'">未完成</el-tag>
            <el-tag v-else-if="row.status == '2'" type="info">处理中</el-tag>
            <el-tag v-else type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
              <!-- <el-link target="_blank" :href="scope.row.note" :underline="false" download> -->
                <el-button size="mini" type="success" plain @click="editRow(scope.row.execlUrl)" v-if='scope.row.execlUrl'>下载</el-button>
              <!-- </el-link> -->
          </template>
        </el-table-column>
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

import { missionList ,beAssignList } from "@/api/api.js"; //任务中心列表
export default {
  data() {
    return {
      queryParams:{},
      agent:[],
      searchTime:'',
      type: [
        {
          value: "1",
          label: "卡分配"
        },
        {
          value: "2",
          label: "卡回收"
        },
        {
          value: "3",
          label: "批量充值"
        },
        {
          value: "4",
          label: "卡导入"
        },
        {
          value: "5",
          label: "流量卡列表导出"
        },
        {
          value: "6",
          label: "订单列表导出"
        },
        {
          value: "7",
          label: "佣金列表导出"
        }
      ],
      state:[
        {
          value: "1",
          label: "未完成"
        },
        {
          value: "2",
          label: "处理中"
        },
        {
          value: "0",
          label: "已完成"
        },
      ],
      page: 1,
      pageSize: 20,
      total: 0,
      tableData:[],
      execlShow:false,
      url:'http://iot.juzi1688.cn/wwhl/upload/execl/',
    };
  },
  computed: {},
  methods: {
    operationType(status) {
      let obj = {
        1: "卡分配",
        2: "卡回收",
        3: "批量充值",
        4: "卡导入",
        5: "流量卡列表导出",
        6: "订单列表导出",
        7: "佣金列表导出",
      };
      return obj[status];
    },
    initData() {
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
      };
      // 搜索日期
      if (this.searchTime && this.searchTime[0]) {
        params.startTime = this.searchTime[0].Format();
        params.endTime = this.searchTime[1].Format();
      }
      missionList(params).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          for(let i = 0;i < this.tableData.length; i++){
            this.tableData[i].missionType = this.operationType(this.tableData[i].missionType);
            this.tableData[i].sort = this.tableData[i].successNumber +"/"+ this.tableData[i].totalNumber;
            this.tableData[i].order = parseInt(this.formatDecimal(this.tableData[i].successNumber/this.tableData[i].totalNumber *100,2));
            if(!this.tableData[i].order){
              this.tableData[i].order = 0
            }
          }
        }
      })
    },
    // 截取小数点的方法
    formatDecimal(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
          num = num.substring(0, decimal + index + 1)
      } else {
          num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.initData();
    },
    // 下载表格
    editRow(url){
      window.location.href= this.url + url;
    },
    // 搜索
    search(){
      this.initData();
    },
    // 重置
    handleCls(){
      for (var k in this.queryParams) {
        this.queryParams[k] = null;
      }
      this.page = 1;
      this.pageSize = 20;
      this.searchTime = [];
      this.initData();
    }
  },
  mounted() {

  },
  created() {
    this.initData();
    // 获取卡分配的代理商列表
    beAssignList().then(res => {
      if (res.data.code == 200) {
        this.agent = res.data.data.list;
        // let obj = {};
        // let peon = res.data.data.list.reduce((cur,next) => {
        //     obj[next.beassigUser] ? "" : obj[next.beassigUser] = true && cur.push(next);
        //     return cur;
        // },[])
        // this.agent = peon;
      }
    });
  }
};
</script>
<style scoped lang="less">
 .el-input{
   width: 140px;
 }
</style>


