<template>
  <div class="content">
    <el-input v-model="queryParams.cardSourceName" placeholder="名称" style="width:150px" clearable></el-input>
    <el-select
      v-model="queryParams.operationId"
      filterable
      placeholder="运营商"
      style="width:150px;margin-left:15px"
      @change="search"
    >
      <el-option
        v-for="item in options"
        :key="item.operationId"
        :label="item.operationName"
        :value="item.operationId"
      ></el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
    <el-button
      type="primary"
      size="medium"
      @click="add=true;dialog = true"
      icon="el-icon-plus"
      style="padding:12px 20px"
    >新增</el-button>
    <!-- 新增信息 -->
    <div>
      <el-dialog
        :title="add?'新增卡源':'修改卡源'"
        :visible.sync="dialog"
        style="text-align:left !important"
        :before-close="handleClose"
        width="460px"
      >
        <el-form :model="form" label-width="80px" ref="form" :rules="rules">
          <el-form-item label="卡源名称:" prop="cardSourceName" label-width="85px">
            <el-input v-model="form.cardSourceName" autocomplete="off" style="width:260px"></el-input>
          </el-form-item>
          <el-form-item label="运营商:" prop="operationId">
            <el-select
              v-model="form.operationId"
              filterable
              placeholder="请选择"
              style="width:260px"
              @change="selectGet"
            >
              <el-option
                v-for="item in options"
                :key="item.operationId"
                :label="item.operationName"
                :value="item.operationId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <template>
              <el-switch
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
                active-value="1"
                inactive-value="0"
                @change="changeSwitch($event)"
              ></el-switch>
            </template>
          </el-form-item>
          <el-form-item label="描述信息:" prop="remark" label-width="85px">
            <el-input v-model="form.remark" autocomplete="off" style="width:260px"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button type="primary" @click="dialog = false">取 消</el-button>
          <el-button type="success" @click="saveInfo(form)">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="table" style="margin-top: 10px">
      <el-table :data="tableData" border style="width: 95%">
        <el-table-column prop="id" label="序号" align="center"></el-table-column>
        <el-table-column prop="cardSourceName" label="卡源名称" align="center"></el-table-column>
        <el-table-column prop="operationName" label="运营商" align="center"></el-table-column>
        <el-table-column prop="remark" label="描述" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.status == '1'">已启用</el-tag>
            <el-tag v-if="row.status == '0'" type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="editRow(scope.row.cardSourceId,scope.row)" style="background:#B6A2DE;border: 1px solid #B6A2DE;">编辑</el-button>
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
import { operationList } from "@/api/api.js"; //运营商列表
import { addCardSource } from "@/api/api.js"; //增加卡源
import { cardSourceList } from "@/api/api.js"; //获取卡源列表
import { changeCardSource } from "@/api/api.js"; //修改卡源列表
export default {
  data() {
    return {
      rules: {
        cardSourceName: [
          { required: true, message: "请输入卡源名称", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入描述", trigger: "blur" }],
        operationId: [
          { required: true, message: "请选择运营商", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择必填项目", trigger: "blur" }]
      },
      // 搜索
      queryParams:{},
      page: 1,
      pageSize: 20,
      total: 0,
      options: [],
      tableData: [],
      // 弹窗的信息
      add: true,
      dialog: false,
      form: {}
    };
  },
  computed: {},
  methods: {
    // 重置
    resetForm() {
      for (var i in this.queryParams) {
        this.queryParams[i] = null;
      }
      this.initData();
    },
    // 搜索
    search() {
      this.page = 1,
      this.initData();
    },
    // 开关
    changeSwitch($event) {
      // console.log($event);
    },
    // 弹窗
    handleClose(done) {
      this.form = {};
      this.input = "";
      done();
    },
    // 新增
    saveInfo(form) {
      if (this.add == true) {
        if (form.status == undefined) {
          form.status = 0;
        }
        // return
        if (!form.cardSourceName) return this.$message("请输入卡源名称");
        if (!form.operationId) return this.$message("请选择运营商");
        if (!form.remark) return this.$message("请输入描述");
        addCardSource(form).then(res => {
          if (res.data.code == 200) {
            this.$message.success("添加成功");
            this.dialog = false;
            this.form = {};
            this.initData();
          } else {
            this.$message("请输入必填项");
          }
        });
      } else {
        changeCardSource(form).then(res => {
          if (res.data.code == 200) {
            this.dialog = false;
            this.form = {};
            this.initData();
          }
        });
      }
    },
    // 修改
    editRow(id, row) {
      this.dialog = true;
      this.add = false;
      this._index = id;
      this.form = Object.assign({}, row);
      this.form.status = (row.status).toString();

    },
    selectGet(val) {
      let obj = {};
      obj = this.options.find(item => {
        return item.operationId === val;
      });
      let label = obj.operationName;
    },
    // 获取列表
    initData() {
      let params = {
        ...this.queryParams,
        page: this.page,
        pageSize: this.pageSize
      };
      cardSourceList(params).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.initData();
    }
  },
  mounted() {
    // 初始化获取运营商
    operationList().then(res => {
      this.options = res.data.data;
    });
    this.initData();
  }
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


