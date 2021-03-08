<template>
  <div class="content">
    <div class="el-row">
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">ICCID：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            {{data.iccid}}
          </div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">MSISDN：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">{{data.msisdn}}</div>
        </div>
      </div>
      <!-- <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">设备ID：</label>
          <div class="el-form-item__content" style="margin-left: 120px;"></div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">用户IP：</label>
          <div class="el-form-item__content" style="margin-left: 120px;"></div>
        </div>
      </div> -->
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">姓名：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">{{data.realName}}</div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">身份证号码：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">{{data.idCard}}</div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">手机号码：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">{{data.phone}}</div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">实名状态：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">{{data.status}}</div>
        </div>
      </div>
      <div class="el-col el-col-12">  
        <div class="el-form-item el-form-item--medium"> 
          <label class="el-form-item__label" style="width: 120px;">创建时间：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">{{data.createTime}}</div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">更新时间：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">{{data.createTime}}</div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">封面：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <viewer>
              <img :src="signImages1" class="reg-img"/>
            </viewer>
          </div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">背面：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <viewer>
              <img :src="signImages2" class="reg-img"/>
            </viewer>
          </div>
        </div>
      </div>
      <div class="el-col el-col-12">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">人像：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <viewer>
              <img :src="signImages3" class="reg-img"/>
            </viewer>
          </div>
        </div>
      </div>
      <div class="el-col el-col-24">
        <div class="el-form-item el-form-item--medium">
          <label class="el-form-item__label" style="width: 120px;">备注：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <div class="el-textarea el-input--medium" style="width: 35%;">
              <textarea
                autocomplete="off"
                rows="5"
                class="el-textarea__inner"
                style="min-height: 33px;"
                v-model="input"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="left" style="padding-left:120px;padding-bottom: 30px;">
      <el-button type="primary" size="medium" @click="boot()">审核通过</el-button>
      <el-button type="primary" size="medium" @click="turnoff()" class="el-button--danger">审核不通过</el-button>
      <el-button type="warning" size="medium" @click="xiaohu()">销户</el-button>
    </div>
  </div>
</template>

<script>
// 详情
import { kycDetail,updateKycStatus} from "@/api/api.js";
import { compressImage } from '../../utils' // 具体路径按自己存放的位置而定
export default {
  data() {
    return {
      data: {},
      input: "",
      signImages1: '',
      signImages2: '',
      signImages3: '',
      url:'http://iot.juzi1688.cn/wwhl/upload/image/',
      id:this.$route.query.id
    };
  },
  computed: {},
  methods: {
    transferOrderType(status) {
      let obj = {
        0: "未实名",
        1: "实名中",
        2: "已实名",
        3: "未通过",
        4: "已注销",
      };
      return obj[status];
    },
    // 获取列表
    initData() {
      kycDetail({id:this.id}).then(res => {
        if (res.data.code == 200) {
          this.data = res.data.data;
          this.data.status = this.transferOrderType(res.data.data.status);
          this.signImages1 = this.url + res.data.data.headImg;
          this.signImages2 = this.url + res.data.data.backImg;
          this.signImages3 = this.url + res.data.data.peopleImg;
        }
      })
    },
    // 审核通过
    boot() {
      let params = {
        id:this.id,
        status:'2'
      };
      updateKycStatus(params).then(res =>{
        if (res.data.code == 200) {
          this.$message({
            message: '审核通过',
            type: 'success'
          });
          this.initData()
        }
      })
    },
    // 审核不通过
    turnoff() {
      if (!this.input) return this.$message.error("审核不通过请输入备注内容");
      let params = {
        id:this.id,
        status:'3',
        remarks:this.input
      };
      updateKycStatus(params).then(res =>{
        if (res.data.code == 200) {
          this.$message({
            message: '审核不通过',
            type: 'success'
          });
          this.initData()
        }
      })
    },
    xiaohu(){
      let params = {
        id:this.id,
        status:'4',
      };
      updateKycStatus(params).then(res =>{
        if (res.data.code == 200) {
          this.$message({
            message: '已注销成功',
            type: 'success'
          });
          this.initData()
        }
      })

    }
  },
  created() {
    this.initData();
  },
  mounted() {}
};
</script>

<style scoped>
.reg-img{
  max-width: 300px;
  max-height: 300px;
}
.el-form-item__content{
  color: #1890ff;
}
</style>
