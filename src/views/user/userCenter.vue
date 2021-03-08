<template>
<!-- 个人中心页面 -->
  <div class="content">
    <div class="information">
      <div class="infor_left">
        <img src="../../assets/img/avatarIco.png" alt="">
      </div>
      <div class="infor_right">
        <ul class="new_ul">
          <li>
            <span>公司名称：</span>
            <span>{{datalist.companyName}}</span>
          </li>
          <li>
            <span>账户余额：</span>
            <span style="color:#ff0000">￥</span>
            <span style="color:#ff0000">{{datalist.totalBalance}}</span>
            <span style="color:#ff0000;margin-left:100px;cursor:pointer" @click="accountDetails()">明细 ></span>
          </li>
          <li>
            <span>联系电话：</span>
            <span>{{datalist.phone}}</span>
          </li>
          <li>
            <el-button type="primary" plain size="mini" icon="el-icon-circle-plus" @click="onlinepay()">立即充值</el-button>
            <el-button type="primary" plain size="mini" icon="el-icon-crop" @click="changedata()">修改资料</el-button>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="充值记录" name="first">
            <el-date-picker
              v-model="searchTime"
              @change="search"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="queryParams.payType" filterable placeholder="充值方式" @change="search" clearable style="width:150px;margin-left:15px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="search" style="margin-left:15px">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <div class="table" style="margin-top: 20px">
              <el-table :data="tableData" border style="width: 95%">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="amount" label="充值金额" align="center"></el-table-column>
                <el-table-column prop="payType" label="充值方式" align="center">
                  <template slot-scope="{row}">
                    <span v-if="row.payType == '0'">系统</span>
                    <span v-else-if="row.payType == '1'">微信</span>
                    <span v-else-if="row.payType == '2'">支付宝</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="交易状态" align="center">
                  <template slot-scope="{row}">
                    <el-tag v-if="row.status == '0'">成功</el-tag>
                    <el-tag v-else-if="row.status =='1'" type="danger">失败</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
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
          </el-tab-pane>
          <el-tab-pane label="套餐购买内容" name="second">
            <el-date-picker
              v-model="searchTimePackage"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-input v-model="queryParamsPackage.iccid" placeholder="ICCID" style="width:150px;margin-left:10px"  @keyup.enter.native="search"></el-input>
            <el-select v-model="queryParamsPackage.userId" filterable placeholder="充值方式" @change="search" clearable style="width:150px;margin-left:15px">
              <el-option
                v-for="item in options"
                :key="item.cardStatus"
                :label="item.operationName"
                :value="item.cardStatus"
              ></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="searchPackage" style="margin-left:15px">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
            <div class="table" style="margin-top: 20px">
              <el-table :data="tableDataPackage" border style="width: 95%">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="iccid" label="ICCID" align="center"></el-table-column>
                <el-table-column prop="serverName" label="套餐名称" align="center"></el-table-column>
                <el-table-column prop="changeAmount" label="金额" align="center"></el-table-column>
                <el-table-column prop="targetAmount" label="账户余额" align="center"></el-table-column>
                <el-table-column prop="status" label="交易状态" align="center">
                  <template slot-scope="{row}">
                    <el-tag v-if="row.status == '0'">已到账</el-tag>
                    <el-tag v-else-if="row.status =='1'" type="danger">未支付</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
              </el-table>
            </div>
            <div class="block" style="margin-top: 30px;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagePackage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSizePackage"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPackage"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>
<script>
import { userRechargeList } from "@/api/api.js";//用户充值记录
import { userWalletRecordList } from "@/api/api.js";//套餐购买内容明细
import { userCenter } from "@/api/api.js";//获取个人中心的信息

export default {
  data() {
    return {
      activeName:'first',
      datalist:{},
      // 充值记录的操作
      options: [
        {
          value: "0",
          label: "系统"
        },
        {
          value: "1",
          label: "微信"
        },
        {
          value: "2",
          label: "支付宝"
        }
      ],
      queryParams:{},
      searchTime:[],
      tableData:[],
      page: 1,
      pageSize: 20,
      total: 0,
      // 套餐购买内容
      searchTimePackage:[],
      queryParamsPackage:{},
      tableDataPackage:[],
      pagePackage: 1,
      pageSizePackage: 20,
      totalPackage: 0,
    };
  },
  computed: {},
  methods: {
    // 去充值页面
    onlinepay(){
      this.$router.push("/onlinepay");
    },
    // 修改信息
    changedata() {
      this.$router.push("/changedata");
    },
    //tab切换
    handleClick(tab, event) {
      if(tab.label == "套餐购买内容"){
        this.resetFormPackage();
      }else{
        this.resetForm();
      }
    },
    // 初始化信息
    initData() {
      userCenter().then(res => {
        if (res.data.code == 200) {
          this.datalist = res.data.data;
        }
      })
    },
    // 用户充值记录
    phoneRecords(){
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
      };
      if (this.searchTime && this.searchTime[0]) {
        params.startTime = this.searchTime[0].Format();
        params.endTime = this.searchTime[1].Format();
      };
      userRechargeList(params).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        }
      })
    },
    // 用户充值记录的搜索
    search(){
      this.phoneRecords()
    },
    // 用户充值记录的重置
    resetForm(){
      for (var k in this.queryParams) {
        this.queryParams[k] = null;
      }
      this.searchTime = [];
      this.phoneRecords();
    },
    // 套餐购买内容的初始化数据
    purchasePackage(){
      let params = {
        ...this.queryParamsPackage,
        page: this.pagePackage,
        pageSize: this.pageSizePackage,
      };
      if (this.searchTimePackage && this.searchTimePackage[0]) {
        params.startTime = this.searchTimePackage[0].Format();
        params.endTime = this.searchTimePackage[1].Format();
      };
      userWalletRecordList(params).then(res => {
        if (res.data.code == 200) {
          this.tableDataPackage = res.data.data.list;
          this.totalPackage = res.data.data.total;
        }
      })
    },
    // 套餐购买内容的搜索 Package
    searchPackage(){
      this.purchasePackage();
    },
    // 套餐购买内容的重置
    resetFormPackage(){
      for (var k in this.queryParamsPackage) {
        this.queryParamsPackage[k] = null;
      };
      this.searchTimePackage = [];
      this.purchasePackage();
    },
    // 跳转到明细
    accountDetails(){
      this.$router.push("/accountDetails");
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.phoneRecords()
    },
    handleCurrentChange(page) {
      this.page = page;
      this.phoneRecords()
    },
  },

  mounted() {
    
  },
  created() {
    this.phoneRecords();
    this.initData();
  }
};
</script>
<style scoped lang="less">
.content{
  width: 100%;
}
.information{
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;;
}
.infor_left img{
  width: 175px;
  height: 175px;
}
.infor_right{
  margin-left: 2%;
}
.new_ul li{
  height: 40px;
  line-height: 40px;
}
.new_ul li span{
  font-size: 14px;
  color: #666;
  cursor: pointer;
}
/deep/ .el-tabs__item{
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}
/deep/ .el-date-editor .el-range-separator{
  width: 6%;
}
// /deep/ .el-tabs__active-bar{
//   margin-left: 10px;
// }
// /deep/ .el-tabs__item{
//   margin-left: 10px;
// }

</style>


