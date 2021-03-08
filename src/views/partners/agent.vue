<template>
  <div class="agent content">
    <el-input v-model="queryParams.companyName" placeholder="公司名称" class="nicheng" @keyup.enter.native="search"></el-input>
    <el-input v-model="queryParams.phone" placeholder="联系电话" class="dianhua" @keyup.enter.native="search"></el-input>
    <el-select v-model="queryParams.userCommissionType" filterable placeholder="分成模式" @change="search" clearable  style="margin-left: 20px;width:150px">
      <el-option v-for="item in gprsStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button type="primary" class="anniu" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="handleCls">重置</el-button>
    <div class="table">
      <el-table
        :data="tableData"
        border
        style="width: 95%"
        @sort-change="tableSortChange"
      >
        <el-table-column prop="id" label="id" align="center" sortable="custom"></el-table-column>
        <el-table-column prop="username" label="昵称" align="center"></el-table-column>
        <el-table-column prop="companyName" label="公司名" align="center"></el-table-column>
        <el-table-column prop="userRealName" label="联系人" align="center"></el-table-column>
        <el-table-column prop="userCommissionType" label="分成模式" align="center" v-if="levelShow">
          <template slot-scope="{row}">
            <el-tag v-if="row.userCommissionType == '1'">底价模式</el-tag>
            <el-tag v-else-if="row.userCommissionType == '0'" type="success">比例模式</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="level" label="等级" align="center" v-if="levelShow"></el-table-column> -->
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="设备数量" align="center" sortable="custom"></el-table-column>
        <el-table-column prop="monthSale" label="月充值金额" align="center" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delRow(scope.row.userId,scope.row.username)" style="background:#24D2B5;border: 1px solid #24D2B5;">运营情况</el-button>
            <el-button size="mini" type="success" @click="editRow(scope.row.userId)" style="background:#B6A2DE;border: 1px solid #B6A2DE;">编辑</el-button>
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
import { userIndex } from "@/api/api.js";
export default {
  data() {
    return {
      // 查询条件
      queryParams: {},
      levelShow: true,
      tableData: [],
      userId: "",
      page: 1,
      pageSize: 20,
      total: 0,
      // 排序方式
      sortOrder: "",
      // 排序名称
      sortName: "",
      gprsStatus:[
        {
          value: 0,
          label: "比例模式"
        },
        {
          value: 1,
          label: "底价模式"
        },
      ]
    };
  },
  computed: {},
  mounted() {
    let userId = localStorage.getItem("userId");
    this.userId = userId;
    this.initData();
    // let level = localStorage.getItem("level");
    // if(level == 0){
    //   this.levelShow = true
    // }else{
    //   this.levelShow = false
    // }
  },
  methods: {
    // 排序
    tableSortChange(val){
      console.log(val)
      console.log("prop:",val.prop)
      this.sortOrder = val.order === "descending" ? "desc" : "asc";
      if(val.prop === 'id'){
        this.sortName = 'id'
      }else if(val.prop === 'cardNumber'){
        this.sortName = 'card_number'
      }else if(val.prop === 'monthSale'){
        this.sortName = 'month_sale'
      }
      
      this.initData()
    },
    // 获取列表信息
    initData() {
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
        order: this.sortOrder,
        sort: this.sortName
      };
      userIndex(params).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          for (var i = 0; i < this.tableData.length; i++) {
            if(this.tableData[i].monthSale == null){
              return
            }else{
              this.tableData[i].monthSale = this.formatDecimal(this.tableData[i].monthSale,2);
            }
          }
        }
      });
    },
    // 搜索
    search() {
      this.page = 1,
      this.initData();
    },
    // 重置
    handleCls() {
      for (var i in this.queryParams) {
        this.queryParams[i] = null;
      }
      this.initData();
    },
    // 运营情况
    delRow(row,val) {
      this.$router.push({ path: `/dashboardList?userId=${row}&username=${val}`});
    },
    // 修改数据
    editRow(row) {
      this.$router.push({ path: `/editorAgent?id=${row}` });
    },
    // 排序
    changeSort(val) {
      console.log(val);
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
  },
  created() {}
};
</script>

<style scoped>
.agent .el-input {
  width: 150px;
}
.agent .dianhua {
  width: 150px;
  margin-left: 20px;
}
.agent .anniu {
  width: 100px;
  margin-left: 20px;
  border: 0;
}
.agent .table {
  margin-top: 20px;
}
.cell {
  text-align: center;
}

.cell button span {
  font-size: 14px;
}
</style>
      // let params = {
      //   sort: this.sort,
      //   type: this.type,
      //   currentPage: this.currentPage,
      //   pageSize: this.pageSize,
      //   name: this.name,
      //   mobile: this.mobile
      // }


