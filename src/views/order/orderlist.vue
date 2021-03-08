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
      <el-select
        v-model="queryParams.cardSourceName"
        filterable
        clearable
        placeholder="来源"
        @change="handleSearch"
        v-if="levelShow"
      >
        <el-option
          v-for="item in optSource"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        ></el-option>
      </el-select>
      <el-select
        v-model="queryParams.operationName"
        filterable
        clearable
        placeholder="运营商"
        @change="handleSearch"
      >
        <el-option
          v-for="item in optOperators"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="queryParams.orderStatus"
        filterable
        clearable
        placeholder="订单状态"
        @change="handleSearch"
      >
        <el-option
          v-for="item in optOrderStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="queryParams.orderType"
        filterable
        clearable
        placeholder="订单类型"
        @change="handleSearch"
      >
        <el-option
          v-for="item in optOrderType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- <el-select
        v-model="queryParams.payType"
        filterable
        clearable
        placeholder="支付类型"
        @change="handleSearch"
      >
        <el-option
          v-for="item in optpayType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select> -->
      <el-input v-model="queryParams.serverName" clearable placeholder="套餐名"></el-input>
      <el-input v-model="queryParams.iccid" clearable placeholder="ICCID"></el-input>
      <el-input v-model="queryParams.msisdn" clearable placeholder="MSISDN"></el-input>
      <el-input v-model="queryParams.orderNum" clearable placeholder="订单号"></el-input>
      <el-date-picker
        v-model="searchTime"
        @change="handleSearch"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <!-- <div> -->
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
      <!-- </div> -->
    </div>

    <div class="table">
      <el-table :data="tableData" border id="out-table">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="订单ID：">
                <span>{{ props.row.orderId }}</span>
              </el-form-item>
              <el-form-item label="MSISDN：">
                <span>{{ props.row.msisdn }}</span>
              </el-form-item>
              <el-form-item label="支付类型：">
                <span>{{ props.row.payType }}</span>
              </el-form-item>
              <el-form-item label="套餐详情：">
                <span>{{ props.row.serverFlowCount }}</span>
              </el-form-item>
              <el-form-item label="生效日期：">
                <span>{{ props.row.takeEffectTime }}</span>
              </el-form-item>
              <el-form-item label="支付时间：">
                <span>{{ props.row.payTime }}</span>
              </el-form-item>
              <el-form-item label="到账时间：">
                <span>{{ props.row.paymentDate }}</span>
              </el-form-item>
              <el-form-item label="创建时间：">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="更新时间：">
                <span>{{ props.row.modifyTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="订单号" align="center"></el-table-column>
        <el-table-column prop="companyName" label="代理商" align="center"></el-table-column>
        <el-table-column prop="cardSourceName" label="来源" align="center" v-if="levelShow"></el-table-column>
        <el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
        <el-table-column prop="serverName" label="套餐名" align="center"></el-table-column>
        <el-table-column prop="orderType" label="订单类型" align="center"></el-table-column>
        <el-table-column prop="accountMoney" label="价格" align="center"></el-table-column>
        <el-table-column prop="orderStatus" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.orderStatus == '已到账'">{{row.orderStatus}}</el-tag>
            <el-tag v-else-if="row.orderStatus =='未支付'" type="danger">{{row.orderStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="130">
          <template slot-scope="{row}">
            <el-button size="mini" type="danger" @click="handleDetail(row.iccid)" style="background:#24D2B5;border: 1px solid #24D2B5;">详情</el-button>
          </template>
        </el-table-column>
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

import { listOrderInfo,exportDataList} from "@/api/api.js"; //订单列表
import { assignCardAgentListSelect } from "@/api/api.js"; //获取代理商下拉列表
import { cardSourceSelectListNoParam } from "@/api/api.js"; //卡来源列表

export default {
  name: "orderList",
  data() {
    return {
      proxy: "",
      source: "",
      operators: "",
      orderState: "",
      orderType: "",
      payType: "",
      packageName: "",
      iccid: "",
      msisdn: "",
      order: "",
      daterange: "",
      levelShow:true,
      optProxy: [],
      optSource: [],
      optOperators: [
        { value: "中国移动" },
        { value: "中国联通" },
        { value: "中国电信" }
      ],
      optOrderStatus: [
        { value: 1, label: "未支付" },
        { value: 2, label: "已支付" },
        { value: 3, label: "已到账" },
        { value: 4, label: "已退款" }
      ],
      optOrderType: [
        { value: 1, label: "用户" },
        { value: 2, label: "系统" },
        { value: 3, label: "代理商" }
      ],
      optpayType: [
        { value: 1, label: "微信" },
        { value: 2, label: "支付宝" },
        { value: 3, label: "线下支付" },
        { value: 4, label: "其他" }
      ],
      tableData: [],
      queryParams: {},
      searchTime: [],
      // 分页器
      page: 1,
      pageSize: 20,
      total: 20,
      startTime: "",
      endTime: ""
    };
  },
  components: {},
  computed: {},
  methods: {
    // 状态转换
    transferOrderType(status) {
      let obj = {
        1: "用户",
        2: "系统",
        3: "代理商"
      };
      return obj[status];
    },
    transferOrderStatus(status) {
      let obj = {
        1: "未支付",
        2: "已支付",
        3: "已到账",
        4: "已退款"
      };
      return obj[status];
    },
    transferPayType(status) {
      let obj = {
        1: "微信",
        2: "支付宝",
        3: "线下支付",
        4: "其他"
      };
      return obj[status];
    },
    // 获取列表
    queryInfo(basicPage) {
      this.page = basicPage ? 1 : this.page;
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize
      };
      // 搜索日期
      if (this.searchTime && this.searchTime[0]) {
        params.startTime = this.searchTime[0].Format();
        params.endTime = this.searchTime[1].Format();
      }
      listOrderInfo(params).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data);
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          let tableData = res.data.data;
          // 类型转换
          this.tableData.map(item => {
            item.orderStatus = this.transferOrderStatus(item.orderStatus);
            item.orderType = this.transferOrderType(item.orderType);
            item.payType = this.transferPayType(item.payType);
            // item.createTime = item.createTime.replace(/\\/g, "");
            // item.paymentDate = item.paymentDate.replace(/\\/g, "");
            // item.payTime = item.payTime.replace(/\\/g, "");
            // item.modifyTime = item.modifyTime.replace(/\\/g, "");;
          });
        }
      });
    },
    //代理商下拉列表
    queryAgentList() {
      assignCardAgentListSelect().then(res => {
        if (res.data.code == 200) {
          // console.log("代理商", res.data.data);
          res.data.data.forEach(item => {
            this.optProxy.push({
              value: item.userId,
              label: item.companyName
            });
          });
        }
      });
    },

    // 获取卡来源下拉
    querySource() {
      cardSourceSelectListNoParam().then(res => {
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            this.optSource.push({
              value: item.cardSourceName,
              label: item.cardSourceName
            });
          });
        }
      });
    },

    // 搜索
    handleSearch() {
      this.queryInfo();
    },
    // 编辑
    handleDetail: function(row) {
      this.$router.push({
        name: "detail",
        query: { iccid: row }
      });
    },
    // 重置
    resetForm() {
      for (var k in this.queryParams) {
        this.queryParams[k] = null;
      }
      this.searchTime = [];
      this.queryInfo();
    },
    // 导出
    handleExport() {
      let params = {
        ...this.queryParams,
      };
      // 搜索日期
      if (this.searchTime && this.searchTime[0]) {
        params.startTime = this.searchTime[0].Format();
        params.endTime = this.searchTime[1].Format();
      }
      this.$alert("确定要订单导出吗？", "订单导出", {
        confirmButtonText: "确定"
      }).then(() => {
        exportDataList(params).then(res => {
          if (res.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "列表导出成功，请在任务中心查看",
              type: "success"
            });
          }
        });
      }).catch(() => {});
      // exportDataList(params).then(res => {
      //   if (res.data.code == 200) {
      //     this.$notify({
      //       title: "成功",
      //       message: "列表导出成功，请在任务中心查看",
      //       type: "success"
      //     });
      //   }
      // })
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
    this.querySource();
    let level = localStorage.getItem("level");
    if(level == 0){
      this.levelShow = true
    }else{
      this.levelShow = false
    }
  },
  mounted() {
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
