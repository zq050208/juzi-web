<template>
  <div class="content">
    <div class="menu">
      <el-input v-model="queryParams.serverName" clearable placeholder="名称"></el-input>
      <el-select
        v-model="queryParams.cardFromId"
        filterable
        clearable
        placeholder="来源"
        @change="handleSearch"
      >
        <el-option
          v-for="item in optSource"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="queryParams.postageType"
        filterable
        clearable
        placeholder="类型"
        @change="handleSearch"
      >
        <el-option
          v-for="item in optType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input v-model="queryParams.label" clearable placeholder="标签"></el-input>

      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate" v-show="serverGroupIdShow">添加</el-button>
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        border
        id="out-table"
        style="width: 95%"
        @sort-change="tableSortChange"
      >
        <el-table-column prop="serverId" label="序号" align="center" sortable="custom"></el-table-column>
        <el-table-column prop="serverName" label="名称" align="center"></el-table-column>
        <el-table-column prop="cardFromName" label="来源" align="center" min-width="150">
          <template slot-scope="{row}">
            <el-tag v-for="(item,index) in row.cardFromName" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="postageType" label="类型" align="center"></el-table-column>
        <el-table-column prop="flowInfo" label="资费信息" align="center" min-width="150">
          <template slot-scope="{row}">
            <el-tag v-for="(item,index) in row.flowInfo" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="flowCount" label="流量(MB)" align="center"></el-table-column>
        <el-table-column prop="floorPrice" label="价格" align="center"></el-table-column>
        <el-table-column prop="marketPrice" label="市场价格" align="center"></el-table-column>
        <el-table-column prop="label" label="标签" align="center">
          <template slot-scope="{row}">
            <el-tag v-show="row.label !== null">{{row.label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isDisable" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag>{{row.isDisable}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="handleEdit(row.serverId)" style="background:#B6A2DE;border: 1px solid #B6A2DE;">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- @size-change="pageChange" -->
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
import { listServerInfo } from "@/api/api.js"; //套餐列表
import { getServerInfo } from "@/api/api.js"; //套餐详情
import { cardSourceSelectListNoParam } from "@/api/api.js"; //卡来源列表
import { listAllServerInfo } from "@/api/api.js"; //全量套餐列表

export default {
  name: "packageList",
  data() {
    return {
      // 查询条件
      queryParams: {},
      optSource: [],
      serverGroupIdShow:true,
      optType: [
        { value: 1, label: "累计套餐" },
        { value: 2, label: "月套餐" },
        { value: 3, label: "加油包" }
      ],
      isDisable: [
        { value: 0, label: "已禁用" },
        { value: 1, label: "启用中" }
      ],
      // 分页器
      page: 1,
      pageSize: 20,
      total: 20,
      // 列表数据
      tableData: [],
      sortOrder: "",
      sortName: ""
    };
  },
  computed: {},
  methods: {
    // 类型转换
    transferPostageType(status) {
      let obj = {
        1: "累计套餐",
        2: "月套餐",
        3: "加油包"
      };
      return obj[status];
    },
    // 状态转换
    transferIsDisable(status) {
      let obj = {
        0: "未启用",
        1: "启用中"
      };
      return obj[status];
    },
    // 资费信息转换
    transferFlowRatio(status) {
      let obj = {
        1: "推荐",
        2: "基础资费",
        3: "仅续费充值",
        4: "限速套餐",
        5: "加速包",
        6: "月末折扣"
      };
      return obj[status];
    },

    // 获取列表
    queryInfo(basicPage) {
      this.page = basicPage ? 1 : this.page;
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
        order: this.sortOrder,
        sort: this.sortName
      };
      listServerInfo(params).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data);
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          let tableData = res.data.data.list;

          // 类型转换
          this.tableData.map(item => {
            item.postageType = this.transferPostageType(item.postageType);
            item.isDisable = this.transferIsDisable(item.isDisable);
            let flows = JSON.parse(item.flowInfo);
            let arr = [];
            if (Object.prototype.toString.call(flows) === "[object Array]") {
              flows.forEach(item => {
                arr.push(this.transferFlowRatio(item));
              });
            }
            item.flowInfo = arr;
            // console.log(item.flowInfo);

            // 卡来源转成中文
            item.cardFromName = [];
            let cardFromIdArr = JSON.parse(item.cardFromId);
            if (
              Object.prototype.toString.call(cardFromIdArr) === "[object Array]"
            ) {
              // 判断cardFromId字段是否为数组
              this.optSource.forEach(item1 => {
                cardFromIdArr.forEach(item2 => {
                  if (item2 === item1.value) {
                    item.cardFromName.push(item1.label);
                  }
                });
              });
            }
            return item;
          });
        }
      });
    },

    // 获取卡来源
    querySource() {
      cardSourceSelectListNoParam().then(res => {
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            this.optSource.push({
              value: Number(item.id),
              label: item.cardSourceName
            });
          });
        }
      });
    },

    //序号排序
    tableSortChange(val) {
      (this.sortOrder = val.order === "descending" ? "DESC" : "ASC"),
        (this.sortName = "id"),
        this.queryInfo();
    },

    handleSizeChange(e) {
      this.pageSize = e;
      this.queryInfo();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.queryInfo();
    },
    // 添加
    handleCreate() {
      this.$router.push({
        name: "add"
      });
    },
    // 编辑
    handleEdit: function(row) {
      this.$router.push({
        name: "edit",
        query: { pid: row }
      });
    },
    // 重置
    resetForm() {
      for (var k in this.queryParams) {
        this.queryParams[k] = null;
      }
      this.queryInfo(1);
    },
    // 搜索
    handleSearch() {
      this.queryInfo();
    }
  },
  mounted() {
    this.queryInfo();
  },
  created() {
    this.querySource();
    let level = localStorage.getItem("level");
    // console.log('level:',level);
    if(level == 0){
      this.serverGroupIdShow = true
    }else{
      this.serverGroupIdShow = false
    }

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
.el-message-box__btns .el-button--small {
  width: 75px;
}
.w95 {
  width: 95%;
}
</style>