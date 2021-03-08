<template>
  <div class="content">
    <el-input v-model="queryParams.serverGroupName" clearable placeholder="资费组名"></el-input>
    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="addItem">添加</el-button>

    <div class="table" style="margin-top: 20px">
      <el-table
        :data="tableData"
        border
        style="width: 95%"
        id="out-table"
        @sort-change="tableSortChange"
      >
        <el-table-column
          prop="serverGroupId"
          label="序号"
          align="center"
          sortable="custom"
          width="80"
        ></el-table-column>
        <el-table-column prop="serverGroupName" label="资费组名" align="center"></el-table-column>
        <el-table-column prop="serverInfoIds" label="资费列表" align="center">
          <template slot-scope="{row}">
            <el-tag
              v-for="(item,index) in row.list"
              :key="index"
            >{{`${item.serverId}-${item.serverName}-${item.floorPrice}`}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="handleEdit(row)" style="background:#B6A2DE;border: 1px solid #B6A2DE;">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(row)">删除</el-button>
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
      <el-dialog :title="title" :visible.sync="dialog" @close="closeDialog">
        <el-form :model="propsParams" :rules="ruleValidate" ref="propsParams">
          <el-form-item label="资费组名:" prop="serverGroupName" :label-width="LabelWidth">
            <el-input v-model="propsParams.serverGroupName" autocomplete="off" style="width:95%"></el-input>
          </el-form-item>
          <el-form-item label="资费套餐:" prop="serverInfoIds" :label-width="LabelWidth">
            <el-select
              v-model="propsParams.serverInfoIds"
              multiple
              default-first-option
              filterable
              placeholder="请选择资费套餐"
              style="width:95%"
            >
              <el-option
                v-for="item in optPackage"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
import { listServerGroupInfo } from "@/api/api.js"; //套餐组列表
import { listAllServerInfo } from "@/api/api.js"; //全量套餐列表
import { listAllServerGroupInfo } from "@/api/api.js"; //全量套餐组列表
import { addServerGroupInfo } from "@/api/api.js"; //添加套餐组
import { delServerGroupInfo } from "@/api/api.js"; //删除套餐组
import { updateServerGroupInfo } from "@/api/api.js"; //修改套餐组

export default {
  name: "group",
  data() {
    return {
      // 查询条件
      queryParams: {},
      // 分页器
      page: 1,
      pageSize: 20,
      total: 20,
      // 列表数据
      tableData: [],
      options: [],
      // 弹窗
      add: true,
      title: "创建资费组",
      dialog: false,
      LabelWidth: "100px",
      propsParams: {
        serverGroupName: "",
        serverGroupId: "",
        serverInfoIds: []
      },
      
      //表单校验
      ruleValidate: {
        serverGroupName: [
          { required: true, message: "请输入资费组名", trigger: "blur" }
        ],
        serverInfoIds: [
          { required: true, message: "请输入资费套餐", trigger: "blur" }
        ]
      },

      optPackage: [],
      sortOrder: "",
      sortName: ""
    };
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
      listServerGroupInfo(params).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
    },

    //序号排序
    tableSortChange(val) {
      this.sortOrder = val.order === "descending" ? "DESC" : "ASC";
       this.sortName = "id",
      this.queryInfo();
    },

    // 资费套餐下拉
    queryServerList() {
      listAllServerInfo().then(res => {
        if (res.data.code == 200) {
          this.dataList = res.data.data;
          this.dataList.forEach(item => {
            this.optPackage.push({
              value: item.serverId,
              label: `${item.serverId}-${item.serverName}-${item.floorPrice}`
            });
          });
        }
      });
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
      this.title = "创建资费组";
      this.propsParams = {};
    },
    // 编辑
    handleEdit: function(row) {
      this.dialog = true;
      this.title = "编辑资费组";
      this.add = false;
      // this.propsParams = Object.assign({}, row);
      this.propsParams.serverGroupName = row.serverGroupName;
      this.propsParams.serverGroupId = row.serverGroupId;
      this.propsParams.serverInfoIds = [];
      row.list.forEach(item => {
        this.propsParams.serverInfoIds.push(item.serverId);
      });
    },
    saveDialog: function() {
      let { serverGroupName, serverInfoIds, serverGroupId } = this.propsParams;
      // console.log(params);
      this.$refs.propsParams.validate(valid => {
        if (valid) {
          if (this.title === "创建资费组") {
            let params = {
              serverGroupName,
              serverInfoIds
            };
            addServerGroupInfo(params).then(res => {
              if (res.data.code === 200) {
                this.$message.success("创建套餐组成功");
                this.dialog = false;
                this.queryInfo();
              } else if (res.data.code === 500) {
                this.$message.error("接口错误");
              }
            });
          } else if (this.title === "编辑资费组") {
            let params = {
              serverGroupName,
              serverInfoIds,
              serverGroupId
            };
            // console.log(params);
            updateServerGroupInfo(params).then(res => {
              if (res.data.code === 200) {
                this.$message.success("编辑套餐组成功");
                this.dialog = false;
                this.queryInfo();
              } else if (res.data.code === 500) {
                this.$message.error("接口错误");
              }
            });
          }
        }
      });
    },

    // 关闭弹窗
    closeDialog() {
      this.$refs.propsParams.clearValidate();
      this.dialog = false;
    },

    // 删除
    deleteRow(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delServerGroupInfo(row).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除套餐组成功!"
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
    // deleteRow(row) {
    //   delServerGroupInfo(row).then(res => {
    //     if (res.data.code == 200) {
    //       this.$message.success("删除套餐组成功");
    //       this.queryInfo();
    //     }
    //   });
    // },

    cancelDialog() {
      this.dialog = false;
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
  created() {},
  mounted() {
    this.queryInfo();
    this.queryServerList();
  }
};
</script>

<style scoped lang="less">
.table {
  margin-top: 20px;
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