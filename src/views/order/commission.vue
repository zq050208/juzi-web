<template>
  <div class="content">
    <div class="menu">
      <el-select
        v-model="queryParams.userId"
        filterable
        clearable
        placeholder="代理商"
        @change="handleSearch"
      >
        <el-option
          v-for="item in optProxy"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="searchTime"
        @change="handleSearch"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>

      <span style="margin-left:10px;">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
      </span>
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        border
        id="out-table"
        style="width: 95%"
        @sort-change="tableSortChange"
      >
        <el-table-column prop="commissionId" label="ID" align="center" sortable="custom"></el-table-column>
        <el-table-column prop="companyName" label="代理商" align="center"></el-table-column>
        <el-table-column prop="orderNum" label="订单号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="realPayAmount" label="支付金额" align="center"></el-table-column>
        <el-table-column prop="totalRebateAmount" label="总返利" align="center"></el-table-column>
        <el-table-column prop="realRebateAmount" label="实返" align="center"></el-table-column>
        <el-table-column prop="subRealRebateAmount" label="下级实返" align="center"></el-table-column>
      </el-table>
    </div>

    <div class="page">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
// import commonIpt from '@/components/commonIpt'
import { assignCardAgentListSelect } from "@/api/api.js"; //获取代理商下拉列表
import { listCommissionInfo ,exportListCommissionInfo} from "@/api/api.js"; //佣金列表
export default {
  name: "commission",
  data() {
    return {
      queryParams: {},
      tableData: [],
      searchTime: [],
      optProxy: [],
      // 分页器
      page: 1,
      pageSize: 20,
      total: 20,
      sortOrder: "",
      sortName: ""
    };
  },
  components: {
    // commonIpt,
  },
  computed: {},
  methods: {
    queryInfo(basicPage) {
      this.page = basicPage ? 1 : this.page;
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
        order: this.sortOrder,
        sort: this.sortName
      };
      // 搜索日期
      if (this.searchTime && this.searchTime[0]) {
        params.startTime = this.searchTime[0].Format();
        params.endTime = this.searchTime[1].Format();
      }
      listCommissionInfo(params).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data);
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          let tableData = res.data.data.list;
        }
      });
    },
    //代理商下拉列表
    queryAgentList() {
      assignCardAgentListSelect().then(res => {
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            this.optProxy.push({
              value: item.userId,
              label: item.companyName
            });
          });
        }
      });
    },
    // 导出
    handleExport() {
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
      this.$alert("确定要佣金导出吗？", "佣金导出", {
        confirmButtonText: "确定"
      }).then(() => {
        exportListCommissionInfo(params).then(res => {
          if (res.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "列表导出成功，请在任务中心查看",
              type: "success"
            });
          }
        });
      }).catch(() => {});
      // exportListCommissionInfo(params).then(res => {
      //   if (res.data.code == 200) {
      //     this.$notify({
      //       title: "成功",
      //       message: "列表导出成功，请在任务中心查看",
      //       type: "success"
      //     });
      //   }
      // })
    },
    //序号排序
    tableSortChange(val) {
      (this.sortOrder = val.order === "descending" ? "DESC" : "ASC"),
        (this.sortName = "id");
      this.queryInfo();
    },
    // 搜索
    handleSearch() {
      this.queryInfo();
    },
    // 重置
    resetForm() {
      for (var k in this.queryParams) {
        this.queryParams[k] = null;
      }
      this.searchTime = [];
      this.queryInfo();
    },
    handleSizeChange(e) {
      this.pageSize = e;
      this.queryInfo();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.queryInfo();
    }
  },
  created() {
    this.queryInfo();
    this.queryAgentList();
  }
};
</script>
<style scoped lang="less">
.table {
  margin-top: 20px;
  width: 95%;
}
.page {
  margin-top: 20px;
}
.el-select {
  width: 140px;
  margin-right: 5px;
}
.el-input {
  width: 140px;
  margin-right: 5px;
}
.el-button {
  margin-right: 5px;
  border-radius: 3px;
  padding: 10px 20px;
}
.cell button {
  width: 50px;
  font-size: 12px;
  text-align: center;
  padding: 6px;
}
.el-date-editor {
  margin: 10px 0;
}
</style>

