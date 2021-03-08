<template>
  <div class="content">
    <el-input v-model="queryParams.iccid" placeholder="ICCID" style="width:150px;margin-left:10px"  @keyup.enter.native="search"></el-input>
    <el-input v-model="queryParams.msisdn" placeholder="MSISDN" style="width:150px;margin-left:10px"  @keyup.enter.native="search"></el-input>
    <el-input v-model="queryParams.realName" placeholder="姓名" style="width:150px;margin-left:10px" @keyup.enter.native="search"></el-input>
    <el-input v-model="queryParams.phone" placeholder="手机号" style="width:150px;margin-left:10px" @keyup.enter.native="search"></el-input>
    <el-select v-model="queryParams.status" filterable placeholder="实名状态" style="width:120px;margin-left:15px" @change="search">
      <el-option
        v-for="item in options"
        :key="item.cardStatus"
        :label="item.operationName"
        :value="item.cardStatus"
      ></el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
    <div class="table" style="margin-top: 10px">
      <el-table :data="tableData" border style="width: 95%" @sort-change="tableSortChange">
        <el-table-column prop="id" label="序号" align="center" sortable="custom"></el-table-column>
        <el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
        <el-table-column prop="msisdn" label="MSISDN" align="center"></el-table-column>
        <el-table-column prop="realName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.status == '已实名'">{{row.status}}</el-tag>
            <el-tag v-else-if="row.status =='实名中'" type="success">{{row.status}}</el-tag>
            <el-tag v-else-if="row.status =='未通过'" type="danger">{{row.status}}</el-tag>
            <el-tag v-else type="warning">{{row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="editRow(scope.row.id)" style="background:#24D2B5;border: 1px solid #24D2B5;">详情</el-button>
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
import { kycIndex } from "@/api/api.js"; //实名列表
export default {
  data() {
    return {
      queryParams:{},
      page: 1,
      pageSize: 20,
      total: 0,
      // 排序方式
      sortOrder: "",
      // 排序名称
      sortName: "",
      options: [
        {
          cardStatus: "0",
          operationName: "未实名"
        },
        {
          cardStatus: "1",
          operationName: "实名中 "
        },
        {
          cardStatus: "2",
          operationName: "已实名"
        },
        {
          cardStatus: "3",
          operationName: "未通过"
        },
        {
          cardStatus: "4",
          operationName: "已注销"
        }
      ],
      tableData: [],
    };
  },
  computed: {},
  methods: {
    // 审核状态
    transferOrderType(status) {
      let obj = {
        0: "未实名 ",
        1: "实名中",
        2: "已实名",
        3: "未通过",
        4: "已注销",
      };
      return obj[status];
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.initData();
    },
    // 获取列表
    initData() {
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
        order: this.sortOrder,
        sort: this.sortName,
      };
      kycIndex(params).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.tableData.map(item => {
            item.status = this.transferOrderType(item.status);
          })
          this.total = res.data.data.total;
        }
      })
    },
    // 排序
    tableSortChange(val){
      this.sortOrder = val.order === "descending" ? "desc" : "asc";
      this.sortName = 'id'

      this.initData()
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
      this.initData();
    },
    // 详情
    editRow(id) {
      this.$router.push({ path: `/certification?id=${id}` });
    },
  },
  created() {
    this.initData()
  },

  mounted() {}
};
</script>
<style scoped lang="less">
.el-button {
  margin-left: 5px;
  border-radius: 3px;
}
.el-dialog__wrapper .el-dialog {
  width: 40%;
}
</style>


