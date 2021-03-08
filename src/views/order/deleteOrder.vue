<template>
  <div class="content" style="width:800px">
    <el-form ref="propsParams" :rules="ruleValidate" :model="propsParams" label-width="200px">
      <el-form-item label="订单ID列表:" prop="orderIds">
        <el-input
          type="textarea"
          v-model="propsParams.orderIds"
          autocomplete="off"
          rows="8"
          placeholder="以回车键分割订单ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input type="password" v-model="propsParams.password" placeholder="请输入密码"></el-input>
      </el-form-item>
	   <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
    </el-form>

   
  </div>
</template>


<script>
// import commonIpt from '@/components/commonIpt'
import { delOrderInfo } from "@/api/api.js"; //删除订单
export default {
  name: "deleteOrder",
  data() {
    return {
      propsParams: {},
      ruleValidate: {
        orderIds: [
          { required: true, message: "请输入订单ID列表", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  components: {
    // commonIpt,
  },
  computed: {},
  methods: {
	  handleSubmit() {
      let params = {
        ...this.propsParams
      };

      this.$refs.propsParams.validate(valid => {
        if (valid) {
          //todo 密码暂未加密
          if (params.orderIds !== undefined) {
            params.orderIds = params.orderIds.split(/[(\r\n)\r\n]+/);
          }
          delOrderInfo(params).then(res => {
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              this.propsParams = {};
            } else {
              this.$message.error("删除失败");
            }
          });
        }
      });
    }
  },
  created() {}
};
</script>
<style scoped>

</style>

