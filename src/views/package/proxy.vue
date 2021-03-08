<template>
  <div class="content">
    <el-select
      v-model="queryParams.id"
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
      v-model="queryParams.userId"
      filterable
      clearable
      placeholder="代理商"
      @change="handleSearch"
    >
      <el-option v-for="item in optProxy" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select
      v-model="queryParams.isShow"
      filterable
      clearable
      placeholder="是否上架"
      @change="handleSearch"
    >
      <el-option v-for="item in isshow" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>

    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="addItem">添加</el-button>

    <div class="table">
      <el-table :data="tableData" border id="out-table">
        <el-table-column
          prop="baseServerId"
          label="序号"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column prop="companyName" label="代理商" align="center"></el-table-column>
        <el-table-column prop="serverName" label="套餐名" align="center">
          <template slot-scope="{row}">{{`${row.serverId} -${row.serverName}`}}</template>
        </el-table-column>
        <el-table-column prop="subPrice" label="底价" align="center"></el-table-column>
        <el-table-column prop="price" label="套餐价格" align="center"></el-table-column>
        <el-table-column prop="marketPrice" label="市场价格" align="center"></el-table-column>
        <!-- <el-table-column prop="priority" label="优先级" sortable="custom" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column> -->
        <el-table-column prop="isShow" label="是否上架" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.isShow == '1'">已上架</el-tag>
            <el-tag v-if="row.isShow == '0'" type="danger">未上架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="handleEdit(row)" style="background:#B6A2DE;border: 1px solid #B6A2DE;">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="deleteRow(row)">删除</el-button> -->
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

    <!-- 新增/修改弹窗 -->
    <div>
      <el-dialog :title="title" :visible.sync="dialog" @close="dialogClose">
        <el-form :model="propsParams" :rules="ruleValidate" ref="propsParams">
          <el-form-item label="代理商:" prop="userId" :label-width="LabelWidth">
            <el-select
              v-model="propsParams.userId"
              filterable
              placeholder="请选择代理商"
              style="width: 95%"
              :disabled='useridDisabled'
            >
              <el-option
                v-for="(item,index) in optProxy"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资费套餐:" prop="serverId" :label-width="LabelWidth">
            <el-select
              v-model="propsParams.serverId"
              filterable
              placeholder="请选择资费套餐"
              style="width: 95%"
              :disabled='serveridDisabled'
            >
              <el-option
                v-for="item in optPackage"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="底价:" prop="subPrice" :label-width="LabelWidth">
            <el-input v-model="propsParams.subPrice" autocomplete="off" style="width: 95%" :disabled='subpriceDisabled'></el-input>
          </el-form-item>
          <el-form-item label="套餐价格:" prop="price" :label-width="LabelWidth">
            <el-input v-model="propsParams.price" autocomplete="off" style="width: 95%" :disabled='priceDisabled'></el-input>
          </el-form-item>
          <el-form-item label="市场价格:" prop="marketPrice" :label-width="LabelWidth">
            <el-input v-model="propsParams.marketPrice" autocomplete="off" style="width: 95%" :disabled='marketpriceDisabled'></el-input>
          </el-form-item>
          <!-- <el-form-item label="优先级:" prop="priority" :label-width="LabelWidth">
            <el-input v-model="propsParams.priority" autocomplete="off" style="width: 95%"></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark" :label-width="LabelWidth">
            <el-input v-model="propsParams.remark" autocomplete="off" style="width: 95%"></el-input>
          </el-form-item> -->
          <el-form-item label="是否上架:" prop="isShow" :label-width="LabelWidth">
          <el-switch
            v-model="propsParams.isShow"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-value="1"
            inactive-value="0"
          ></el-switch>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" @click="cancelDialog">取消</el-button>
          <el-button type="success" @click="saveDialog">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
// import commonIpt from '@/components/commonIpt'
import { baseServerIndex } from "@/api/api.js"; //获取代理套餐列表
import { addBaseServer } from "@/api/api.js"; //添加代理套餐
import { getBaseServerList } from "@/api/api.js"; //全量套餐列表
import { updateBaseServer } from "@/api/api.js"; //修改代理套餐
import { delBaseServer } from "@/api/api.js"; //删除代理套餐
import { getBaseServerDetail } from "@/api/api.js"; //获取代理套餐详情
import { getBaseServerUserList } from "@/api/api.js"; //获取代理商下拉列表
import { cardSourceSelectListNoParam } from "@/api/api.js"; //卡来源列表

export default {
  name: "proxy",
  data() {
    return {
      useridDisabled:false,//代理商
      serveridDisabled:false,//资费套餐
      subpriceDisabled:false,//底价
      priceDisabled:false,//套餐价格
      marketpriceDisabled:false,//市场价格
      queryParams: {},
      tableData: [],
      // 分页器
      page: 1,
      pageSize: 20,
      total: 20,
      optSource: [],
      optProxy: [],
      options: [],
      optPackage: [],
      sortOrder: "",
      sortName: "",
      level:'',
      title: "创建代理商资费",
      // 弹窗
      add: true,
      dialog: false,
      LabelWidth: "100px",
      propsParams: {
        isShow:'0',
        price:"",
        marketPrice:"",
        subPrice:""
      },
      newpropsParams: {
        isShow:'0',
        price:"",
        marketPrice:"",
        subPrice:""
      },
      //表单校验
      ruleValidate: {
        userId: [
          { required: true, message: "请选择代理商", trigger: "blur" }
        ],
        serverId: [
          { required: true, message: "请选择资费套餐", trigger: "blur" }
        ],
        subPrice:[
          { required: true, message: "请输入底价", trigger: "blur" }
        ]
      },
      isshow:[
        {
          value: 0,
          label: "未上架"
        },
        {
          value: 1,
          label: "已上架"
        },
      ]
    };
  },
  components: {
    // commonIpt,
  },
  computed: {},
  methods: {
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
      baseServerIndex(params).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
    },

    // 资费套餐下拉列表
    querylistAllServer() {
      getBaseServerList().then(res => {
        if (res.data.code == 200) {
          this.dataList = res.data.data;
          if(this.level == 0){
            this.dataList.forEach(item => {
              this.optPackage.push({
                value: item.serverId,
                label: `${item.serverId}-${item.serverName}`
              });
            });
          }else{
            this.dataList.forEach(item => {
              this.optPackage.push({
                value: item.serverId,
                // label: `${item.serverId}-${item.serverName}-${item.subPrice}`
                label: `${item.serverId}-${item.serverName}`
              });
            });
          }
        }
      });
    },

    //代理商下拉列表
    queryAgentList() {
      getBaseServerUserList().then(res => {
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
          // console.log(res.data.data)
          res.data.data.forEach(item => {
            this.optSource.push({
              value: Number(item.id),
              label: item.cardSourceName
            });
          });
        }
      });
    },

    //表格排序
    tableSortChange(val) {
      this.sortOrder = val.order === "descending" ? "DESC" : "ASC";
      this.sortName = val.prop === "priority" ? "priority" : "id";
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
      this.queryInfo();
    },
    // 添加
    addItem() {
      this.dialog = true;
      this.title = "创建底价套餐";
      this.propsParams = { ...this.newpropsParams };
      this.priceDisabled = false;
      this.marketpriceDisabled = false;
      this.subpriceDisabled = false;
    },

    // 修改
    handleEdit: function(row) {
      this.title = "编辑底价套餐";
      this.dialog = true;
      this.add = false;

      let params = {
        baseServerId: row.baseServerId
      };
      getBaseServerDetail(params).then(res => {
        if (res.data.code == 200) {
          let level = localStorage.getItem("level");
          let userId = localStorage.getItem("userId");
          let userIdname = res.data.data.userId;
          if(level == 0){
            this.useridDisabled = false;
            this.serveridDisabled = false;
            this.priceDisabled = false;
            this.marketpriceDisabled = false;
            this.subpriceDisabled = false;
            this.propsParams = Object.assign({}, res.data.data);
          }else{
            if(userId != userIdname){
              this.propsParams = Object.assign({}, res.data.data);
              this.useridDisabled = false;
              this.serveridDisabled = false;
              this.subpriceDisabled = false;
              this.priceDisabled = true;
              this.marketpriceDisabled = true;
            }else if(userId == userIdname){
              this.propsParams = Object.assign({}, res.data.data);
              this.useridDisabled = true;
              this.serveridDisabled = true;
              this.subpriceDisabled = true;
              this.priceDisabled = false;
              this.marketpriceDisabled = false;
              this.$message.error('不允许修改底价，如想修改，请先下架，再新建底价套餐');
            }
          }
        }
      });
    },
    // 删除
    deleteRow(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delBaseServer({baseServerId: row.baseServerId}).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除底价套餐成功!"
              });
              this.queryInfo();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancelDialog() {
      this.dialog = false;
    },
    saveDialog() {
      let params = {};
      this.$refs.propsParams.validate(valid => {
        if (valid) {
          if (this.title === "创建底价套餐") {
            params = {
              ...this.propsParams
            };

            if(params.subPrice != '' && params.price == '' && params.marketPrice == ''){
              params.isShow = 0;
              addBaseServer(params).then(res => {
                if (res.data.code === 200) {
                  this.$message.error("创建底价套餐成功但未上架成功");
                  this.dialog = false;
                  this.queryInfo();
                }
              });
            }else if(params.subPrice != '' && params.price == ''){
              params.isShow = 0;
              addBaseServer(params).then(res => {
                if (res.data.code === 200) {
                  this.$message.error("创建底价套餐成功但未上架成功");
                  this.dialog = false;
                  this.queryInfo();
                }
              });
            }else if(params.subPrice != '' && params.marketPrice == ''){
              params.isShow = 0;
              addBaseServer(params).then(res => {
                if (res.data.code === 200) {
                  this.$message.error("创建底价套餐成功但未上架成功");
                  this.dialog = false;
                  this.queryInfo();
                }
              });
            }else{
              addBaseServer(params).then(res => {
                if (res.data.code === 200) {
                  this.$message.success("创建底价套餐成功");
                  this.dialog = false;
                  this.queryInfo();
                }
              });
            }
          } else if (this.title === "编辑底价套餐") {

            params = {
              ...this.propsParams
            };
            updateBaseServer(params).then(res => {
              if (res.data.code === 200) {
                this.$message.success("编辑底价套餐成功");
                this.dialog = false;
                this.queryInfo();
              } else if (res.data.code === 404) {
                this.$message.error(res.data.message);
              }
            });
          }
        }
      });
    },
    // 获取套餐价格
    selectChange(val) {
      let tempArr = [];
      tempArr = this.dataList.filter(item => {
        return item.serverId === val;
      });
      if(this.level == 0){
        this.propsParams.price = tempArr[0].marketPrice;
      }else{
        this.propsParams.price = tempArr[0].subPrice;
      }
    },

    // 关闭弹窗
    dialogClose() {
      this.$refs.propsParams.clearValidate();
      this.dialog = false;
    },

    handleCurrentChange(page) {
      this.page = page;
      this.queryInfo();
    },
    handleSizeChange(e) {
      this.pageSize = e;
      this.queryInfo();
    }
  },
  created() {
    this.querySource();
    this.querylistAllServer();
    this.level = localStorage.getItem("level");

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
.el-message-box__btns .el-button--small {
  width: 75px;
}
</style>