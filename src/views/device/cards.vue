<template>
  <div class="content">
    <el-select v-model="queryParams.userId" filterable placeholder="代理商" @change="search" clearable >
      <el-option
        v-for="item in agent"
        :key="item.userId"
        :label="item.companyName"
        :value="item.userId"
      ></el-option>
    </el-select>
    <el-select v-model="queryParams.cardSourceId" filterable placeholder="卡源" @change="search" clearable v-show="levelShow">
      <el-option
        v-for="item in source"
        :key="item.cardSourceId"
        :label="item.cardSourceName"
        :value="item.cardSourceId"
      ></el-option>
    </el-select>
    <el-select v-model="queryParams.province" filterable placeholder="选择地区" @change="search" clearable style="width:160px" v-if="levelShow" multiple>
      <el-option
        v-for="item in provs"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="queryParams.cardStatus" filterable placeholder="状态" @change="search" clearable multiple style="width:160px">
      <el-option
        v-for="item in state"
        :key="item.cardStatus"
        :label="item.operationName"
        :value="item.cardStatus"
      ></el-option>
    </el-select>

    <!-- <el-select v-model="value" filterable placeholder="EMEI状态">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select> -->
    <!-- <el-select v-model="queryParams.gprsStatus" filterable placeholder="GPRS状态" @change="search" clearable >
      <el-option v-for="item in gprsStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select> -->
    <el-input v-model="queryParams.iccid" placeholder="ICCID"  @keyup.enter.native="search" style="width:210px" clearable></el-input>
    <el-input v-model="queryParams.cardStartValue" placeholder="开始号段"  @keyup.enter.native="search" style="width:210px" clearable></el-input>
    <el-input v-model="queryParams.cardEndValue" placeholder="结束号段"  @keyup.enter.native="search" style="width:210px" clearable></el-input>
    <el-input v-model="queryParams.msisdn" placeholder="MSISDN"  @keyup.enter.native="search" clearable></el-input>
    <el-input v-model="queryParams.remark" placeholder="备注"  @keyup.enter.native="search" clearable></el-input>
    <div style="margin-top: 5px;">
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="primary" @click="resetForm" icon="el-icon-refresh">重置</el-button>
      <el-button type="primary" @click="outTable" icon="el-icon-download" v-if="levelShow">导出</el-button>
      <el-dropdown>
      <el-button type="primary">SIM配置<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in sim" :key="index" @click.native="handleClick(item.label)" :icon = item.icon>{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <template>
      <div class="table" style="margin-top: 20px">
        <el-table :data="tableData" border style="width: 95%" id="out-table"  @sort-change="tableSortChange" ref="tableData">
          <el-table-column prop="id" label="序号" align="center" sortable="custom"></el-table-column>
          <el-table-column prop="companyName" label="代理商" align="center"></el-table-column>
          <el-table-column prop="operationName" label="运营商" align="center" ></el-table-column>
          <el-table-column prop="cardSourceName" label="来源" align="center" v-if="levelShow"></el-table-column>
          <!-- <el-table-column prop="gprsStatus" label="GPRS" align="center" v-if="levelShow">
            <template slot-scope="{row}">
              <el-tag v-if="row.gprsStatus == '开启'">开启</el-tag>
              <el-tag v-if="row.gprsStatus == '关闭'" type="danger">关闭</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="iccid" label="ICCID" align="center" width="180px"></el-table-column>
          <el-table-column prop="msisdn" label="MSISDN" align="center"></el-table-column>
          <el-table-column prop="cardStatus" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.cardStatus =='已激活'">{{row.cardStatus}}</el-tag>
            <el-tag v-else-if="row.cardStatus =='库存'" type="success">{{row.cardStatus}}</el-tag>
            <el-tag v-else-if="row.cardStatus =='已停机'" type="danger">{{row.cardStatus}}</el-tag>
            <el-tag v-else-if="row.cardStatus =='待激活'" type="info">{{row.cardStatus}}</el-tag>
            <el-tag v-else type="warning">{{row.cardStatus}}</el-tag>
          </template>
          </el-table-column>
          <el-table-column prop="monthFlow" label="月流量" align="center" sortable="custom" v-if="levelShow"></el-table-column>
          <el-table-column prop="expireDate" label="过期时间" align="center" sortable="custom"></el-table-column>
          <el-table-column prop="province" label="所属省份" align="center" v-if="levelShow"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="170">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delRow(scope.row.iccid,scope.row)" style="background:#24D2B5;border: 1px solid #24D2B5;">详情</el-button>
              <el-button size="mini" type="success" @click="editRow(scope.row.cardId,scope.row)" style="background:#B6A2DE;border: 1px solid #B6A2DE;">备注</el-button>
            </template>
          </el-table-column>
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
import {
  cardIndex,
  assignCardAgentListSelect,
  cardSourceSelectList,
  updateCardRemark,
  cardSourceSelectListNoParam,
  searchCard,
  cardOperationList,
  exportCardList //流量卡列表的导出
} from "@/api/api.js"; //流量卡列表
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      // 搜索
      queryParams:{},
      page: 1,
      pageSize: 20,
      total: 0,
      // 排序方式
      sortOrder: "",
      // 排序名称
      sortName: "",
      levelShow:true,
      sim:[],
      // 省份
      provs:[
        {label:"北京市",value:"北京市"},
        {label:"天津市",value:"天津市"},
        {label:"河北省",value:"河北省"},
        {label:"山西省",value:"山西省"},
        {label:"辽宁省",value:"辽宁省"},
        {label:"吉林省",value:"吉林省"},
        {label:"上海市",value:"上海市"},
        {label:"江苏省",value:"江苏省"},
        {label:"浙江省",value:"浙江省"},
        {label:"安徽省",value:"安徽省"},
        {label:"福建省",value:"福建省"},
        {label:"江西省",value:"江西省"},
        {label:"山东省",value:"山东省"},
        {label:"河南省",value:"河南省"},
        {label:"湖北省",value:"湖北省"},
        {label:"湖南省",value:"湖南省"},
        {label:"广东省",value:"广东省"},
        {label:"海南省",value:"海南省"},
        {label:"重庆市",value:"重庆市"},
        {label:"四川省",value:"四川省"},
        {label:"贵州省",value:"贵州省"},
        {label:"云南省",value:"云南省"},
        {label:"陕西省",value:"陕西省"},
        {label:"甘肃省",value:"甘肃省"},
        {label:"青海省",value:"青海省"},
        {label:"台湾省",value:"台湾省"},
        {label:"黑龙江省",value:"黑龙江省"},
        {label:"西藏自治区",value:"西藏自治区"},
        {label:"内蒙古自治区",value:"内蒙古自治区"},
        {label:"香港特别行政区",value:"香港特别行政区"},
        {label:"澳门特别行政区",value:"澳门特别行政区"},
        {label:"广西壮族自治区",value:"广西壮族自治区"},
        {label:"宁夏回族自治区",value:"宁夏回族自治区"},
        {label:"新疆维吾尔自治区",value:"新疆维吾尔自治区"},
      ],
      sim1: [
        {
          value: "选项1",
          label: "卡分配",
          icon: "el-icon-star-on"
        },
        {
          value: "选项2",
          label: "卡回收",
          icon: "el-icon-star-off"
        },
        {
          value: "选项3",
          label: "卡导入",
          icon: "el-icon-circle-plus"
        },
        {
          value: "选项4",
          label: "卡更新",
          icon: "el-icon-edit"
        },
        {
          value: "选项5",
          label: "卡废弃",
          icon: "el-icon-delete"
        },
        {
          value: "选项6",
          label: "卡操作",
          icon: "el-icon-s-help"
        }
      ],
      simval: "",
      tableData: [],
      // 代理商
      agent: [],
      // 来源
      source: [],
      // 状态
      state: [
        {
          cardStatus: "1",
          operationName: "库存"
        },
        {
          cardStatus: "2",
          operationName: "待激活"
        },
        {
          cardStatus: "3",
          operationName: "可测试"
        },
        {
          cardStatus: "4",
          operationName: "已激活"
        },
        {
          cardStatus: "5",
          operationName: "已停机"
        },
        {
          cardStatus: "6",
          operationName: "预销户"
        },
        {
          cardStatus: "7",
          operationName: "已销户"
        }
      ],
      gprsStatus:[
        {
          value: 0,
          label: "关闭"
        },
        {
          value: 1,
          label: "开启"
        },
      ]
    };
  },
  computed: {},
  methods: {
    // 页面跳转
    handleClick(label){
      if (label == "卡分配") {
        this.$router.push("/transfer");
      } else if (label == "卡回收") {
        this.$router.push("/recovery");
      } else if (label == "卡导入") {
        this.$router.push("/imports");
      } else if (label == "卡更新") {
        this.$router.push("/update");
      } else if (label == "卡废弃") {
        this.$router.push("/discard");
      } else if (label == "卡操作") {
        this.$router.push("/query");
      }
    },
    // 排序
    tableSortChange(val){
      // console.log(val)
      this.sortOrder = val.order === "descending" ? "desc" : "asc";
      if(val.prop === 'id'){
        this.sortName = 'id'
      }else if(val.prop === 'monthFlow'){
        this.sortName = 'month_flow'
      }else if(val.prop === 'expireDate'){
        this.sortName = 'expire_date'
      }
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
      this.page = 1;
      this.pageSize = 20;
      this.sortOrder = '';
      this.sortName = '';
      this.$refs.tableData.clearSort();
      this.initData();
    },
    // 导出
    outTable() {
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
      };
      if(this.iccid) {
        params.iccid = this.iccid.trim();
      }
      this.$alert("确定要流量卡导出吗？", "流量卡导出", {
        confirmButtonText: "确定"
      }).then(() => {
        exportCardList(params).then(res => {
          if (res.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "列表导出成功，请在任务中心查看",
              type: "success"
            });
          }
        });
      });
      // exportCardList(params).then(res => {
      //   if (res.data.code == 200) {
      //     this.$notify({
      //       title: "成功",
      //       message: "列表导出成功，请在任务中心查看",
      //       type: "success"
      //     });
      //   }
      // })
    },
    // 添加备注
    editRow(id,val) {
      this.$prompt("请输入备注内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue:val.remark
      })
        .then(({ value }) => {
          if (!value) {
            return this.$message("请输入备注信息");
          } else {
            updateCardRemark({ remark: value, cardId: id }).then( res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "备注成功"
                });
                this.initData();
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 详情
    delRow(id) {
      this.$router.push({ path: `/detail?iccid=${id}` });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.initData();
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
      let {iccid,cardStartValue,cardEndValue} = this.queryParams;
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize,
        order: this.sortOrder,
        sort: this.sortName,
        iccid:iccid ? iccid.trim() : "",
        cardStartValue:cardStartValue ? cardStartValue.trim() : "",
        cardEndValue:cardEndValue ? cardEndValue.trim() : "",
      };
      cardIndex(params).then(res => {
        // console.log(res.data.data);
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.inventoryStatus();
          for(var i = 0, l = this.tableData.length; i < l; i++){
            if(this.tableData[i].expireDate == null){
                this.tableData[i].expireDate = '无'
            }else{
                this.tableData[i].expireDate = (this.tableData[i].expireDate).slice(0, 10);
            };
            if(this.tableData[i].monthFlow > 1024){
                this.tableData[i].monthFlow =  (this.tableData[i].monthFlow / 1024).toFixed(2) + 'G'
            }else if(this.tableData[i].monthFlow == null || this.tableData[i].monthFlow == 0 ){
                this.tableData[i].monthFlow =  0 + 'Byte'
            }else if(1024 > this.tableData[i].monthFlow > 0){
                this.tableData[i].monthFlow =  this.tableData[i].monthFlow + 'M'
            } 
            this.tableData[i].gprsStatus = this.tableData[i].gprsStatus == 0 ? '关闭' : "开启";
          }
        }
      });
    }
  },
  created() {
    this.initData();
    // 获取卡分配的代理商列表
    assignCardAgentListSelect().then(res => {
      if (res.data.code == 200) {
        this.agent = res.data.data;
      }
    });
    // 查找卡源列表
    cardSourceSelectListNoParam().then(res => {
      if (res.data.code == 200) {
        this.source = res.data.data;
      }
    });
    // 获取卡的跳转页面
    cardOperationList().then(res =>{
      if (res.data.code == 200) {
        this.sim = res.data.data;
      }
    })
    let level = localStorage.getItem("level");
    if(level == 0){
      this.levelShow = true
    }else{
      this.levelShow = false
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.el-select {
  width: 140px;
  margin-left: 5px;
  margin-top: 5px;
}
.el-input {
  width: 120px;
  margin-left: 5px;
}
.el-button {
  margin-left: 5px;
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

</style>