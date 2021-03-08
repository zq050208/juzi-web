<template>
  <div class="qunping content">
    <div class="kxq">
      <h3 class="detail-h3">
        <i class="el-icon-tickets"></i> 卡详情
      </h3>
      <div class="kxqline">
        <div class="hang">
          <div class="left">
            <span class="left-l">ICCID:</span>
            <span class="left-r">{{data.iccid}}</span>
          </div>
          <div class="right">
            <span class="left-l">MSISDN:</span>
            <span class="left-r">{{data.msisdn}}</span>
          </div>
        </div>
        <div class="hang">
          <div class="left">
            <span class="left-l">IMSI:</span>
            <span class="left-r">无</span>
          </div>
          <div class="right">
            <span class="left-l">GRRS:</span>
            <span class="left-r">{{data.gprsStatus}}</span>
          </div>
        </div>
        <div class="hang">
          <div class="left">
            <span class="left-l">代理商:</span>
            <span class="left-r">{{data.companyName}}</span>
          </div>
          <div class="right">
            <span class="left-l">运营商:</span>
            <span class="left-r">{{data.operationName}}</span>
          </div>
        </div>
        <div class="hang">
          <div class="left">
            <span class="left-l">同步时间:</span>
            <span class="left-r">{{data.syncTime}}</span>
          </div>
          <div class="right">
            <span class="left-l">卡源:</span>
            <span class="left-r">{{data.cardSourceName}}</span>
          </div>
        </div>

        <div class="hang">
          <div class="left">
            <span class="left-l">状态:</span>
            <span class="left-r">{{data.cardStatus}}</span>
          </div>
          <div class="right">
            <span class="left-l">IMEI状态:</span>
            <span class="left-r">未设置</span>
          </div>
        </div>
        <div class="hang">
          <div class="left">
            <span class="left-l">实名状态:</span>
            <span class="left-r">{{data.kycStatus}}</span>
          </div>
          <div class="right">
            <span class="left-l">是否开启同步:</span>
            <span class="left-r">{{data.sync}}</span>
          </div>
        </div>
        <div class="hang">
          <div class="left">
            <span class="left-l">当月流量:</span>
            <span class="left-r">{{data.monthFlow}}</span>
          </div>
          <div class="right">
            <span class="left-l">备注信息:</span>
            <span class="left-r">{{data.remark}}</span>
          </div>
        </div>
        <div class="hang">
          <div class="left">
            <span class="left-l">激活时间:</span>
            <span class="left-r">{{data.activeTime}}</span>
          </div>
          <div class="right">
            <span class="left-l">过期时间:</span>
            <span class="left-r">{{data.expireDate}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="guanli" v-if="levelShow">
      <h3 class="detail-h3">
        <i class="el-icon-service"></i> SIM卡管理
      </h3>
      <el-button type="primary" class="anniu" size="medium" v-if="openSynchronization" @click="kaiguantongbu">关闭同步</el-button>
      <el-button type="primary" class="anniu" v-if="offSynchronization" @click="kaiguantongbu">打开同步</el-button>
      <el-button type="success" @click="updateNow">立即更新</el-button>
      <el-button type="danger"  @click="kaiji">{{this.boot ? '开机' : '关机'}}</el-button>
      <!-- <el-button type="warning" @click="kggprsgn()">{{this.kggprs ? '开启GPRS' : '关闭GPRS'}}</el-button> -->
    </div>
    <div class="zifei">
      <h3 class="detail-h3">
        <i class="el-icon-mobile-phone"></i> 资费列表
      </h3>
      <div class="table">
        <el-table :data="tableServerInfo" border style="width: 95%">
          <el-table-column prop="serverId" label="套餐ID" align="center"></el-table-column>
          <el-table-column prop="serverName" label="套餐名" align="center"></el-table-column>
          <el-table-column prop="useFlow" label="已用流量" align="center"></el-table-column>
          <el-table-column prop="monthFlow" label="总流量" align="center"></el-table-column>
          <el-table-column prop="status" label="套餐状态" align="center"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="dingdan">
      <h3 class="detail-h3">
        <i class="el-icon-goods"></i> 订单列表
      </h3>
      <div class="table">
        <el-table :data="tableOrderInfo" border style="width: 95%">
          <el-table-column prop="orderNum" label="订单号" align="center"></el-table-column>
          <el-table-column prop="serverName" label="资费名" align="center"></el-table-column>
          <el-table-column prop="serverFlowCount" label="资费流量" align="center"></el-table-column>
          <!-- <el-table-column prop="takeEffectTime" label="有效期(天)" align="center"></el-table-column> -->
          <el-table-column prop="accountMoney" label="价格" align="center"></el-table-column>
          <el-table-column prop="orderStatus" label="状态" align="center"></el-table-column>
          <el-table-column prop="payType" label="支付方式" align="center"></el-table-column>
          <el-table-column prop="paymentDate" label="时间" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
// 详情
import { cardDetail } from "@/api/api.js";
import { listCardServer } from "@/api/api.js"; //资费列表
import { listOrderInfo } from "@/api/api.js"; //订单列表
import { singleCardSync,changeCardStatus,syncCard } from "@/api/api.js";//卡状态的开关

export default {
  data() {
    return {
      openSynchronization:false,
      offSynchronization:false,
      boot:false,
      levelShow:true,
      kggprs:false,
      data: {},
      tableServerInfo: [],
      tableOrderInfo: [],
      iccid:this.$route.query.iccid
    };
  },
  computed: {},
  methods: {
    transferFlowRatio(status) {
      let obj = {
        1: "库存",
        2: "待激活",
        3: "可测试",
        4: "已激活",
        5: "已停机",
        6: "预销户",
        7: "已销户"
      };
      return obj[status];
    },
    Packagestatus(status) {
      let obj = {
        1: "未使用",
        2: "使用中",
        3: "已使用",
        4: "已过期",
      };
      return obj[status];
    },
    Realnamestatus(status) {
      let obj = {
        0: "未实名 ",
        1: "实名中",
        2: "已实名",
        3: "未通过",
        4: "已注销",
      };
      return obj[status];
    },
    Openthesynchronization(status) {
      let obj = {
        0: "未开启",
        1: "已开启",
      };
      return obj[status];
    },
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
    flowRates(status) {
      let obj = {
        '-1': "畅享",
      };
      return obj[status];
    },
    initData() {
      let iccid = this.$route.query.iccid;
      cardDetail({ iccid: iccid }).then(res => {
        if (res.data.code == 200) {
          this.data = res.data.data;
          this.data.kycStatus = this.Realnamestatus(this.data.kycStatus)
           if(this.data.monthFlow > 1024){
              res.data.data.monthFlow =  (this.data.monthFlow / 1024).toFixed(2) + 'G'
            }else if(this.data.monthFlow == null || this.data.monthFloww == 0 ){
              res.data.data.monthFlow =  '无'
            }else if(1024 > this.data.monthFlow > 0){
              res.data.data.monthFlow =  this.data.monthFlow + 'M'
          }
          this.data.cardStatus = this.transferFlowRatio(this.data.cardStatus);
          this.data.isReal = this.Realnamestatus(this.data.isReal);
          this.data.sync = this.Openthesynchronization(this.data.sync);
          if(res.data.data.cardStatus == "库存"|| res.data.data.cardStatus == "待激活" || res.data.data.cardStatus == "可测试" || res.data.data.cardStatus == "已停机" ){
              this.boot = true
          }else if(res.data.data.cardStatus == "已激活"){
              this.boot = false;
          };
          // this.data.gprsStatus = 0
          if(this.data.gprsStatus == '0'){
            this.data.gprsStatus = "关闭";
            this.kggprs = true
          }else{
            this.data.gprsStatus = "开启";
            this.kggprs = false
          }
          if(res.data.data.sync == "未开启"){
              this.offSynchronization = true;
          };
          if(res.data.data.sync == "已开启"){
              this.openSynchronization = true;
          };

          if(this.data.monthFlow == null){
            this.data.monthFlow = '无'
          };
          if(this.data.remark == null){
            this.data.remark = '无'
          };
          if(this.data.activeTime == null){
            this.data.activeTime = '无'
          };
        }
      });
    },
    // 获取订单列表
    queryOrderInfo() {
      let params = {
        iccid: this.$route.query.iccid,
        page: 1,
        pageSize: 100
      };
      listOrderInfo(params).then(res => {
        if (res.data.code == 200) {
          this.tableOrderInfo = res.data.data.list;
          for(var i = 0;i < this.tableOrderInfo.length;i++){
            this.tableOrderInfo[i].serverFlowCount = Math.round(this.tableOrderInfo[i].serverFlowCount*100)/100
            if(this.tableOrderInfo[i].serverFlowCount < 0 ){
              this.tableOrderInfo[i].serverFlowCount = '畅享'
            }
          }
          this.tableOrderInfo.map(item => {
            item.orderStatus = this.transferOrderStatus(item.orderStatus);
            item.orderType = this.transferOrderType(item.orderType);
            item.payType = this.transferPayType(item.payType);
          })
        }
      });
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
    // 获取资费列表
    queryServerInfo() {
      let iccid = this.$route.query.iccid;
      listCardServer({ iccid: iccid }).then(res => {
        if (res.data.code == 200) {
          this.tableServerInfo = res.data.data;
          let tableServerInfo = res.data.data;
          for(var i = 0;i < this.tableServerInfo.length;i++){
            this.tableServerInfo[i].useFlow = this.formatDecimal(this.tableServerInfo[i].useFlow,2);
            this.tableServerInfo[i].monthFlow = this.formatDecimal(this.tableServerInfo[i].monthFlow,2);
            if(this.tableServerInfo[i].monthFlow < 0){
              this.tableServerInfo[i].monthFlow = '畅享'
            }
          }
          this.tableServerInfo.map(item => {
            item.status = this.Packagestatus(item.status);
          });
        }
      });
    },
    // 打开同步
    kaiguantongbu(){
      console.log(this.data.sync)
       let stastus = this.data.sync ==='已开启' ? 0:1;
       let stastus1 = this.data.sync ==='未开启' ? 0:1;
      if(this.data.sync == '已开启'){
        singleCardSync({ iccid: this.iccid ,syncStatus:stastus }).then(res => {
            if (res.data.code == 200) {
              this.initData();
              this.openSynchronization = false;
              this.$message({
              message: '关闭同步成功',
              type: 'success'
            });
          }
       })
      }
      if(this.data.sync == '未开启'){
        singleCardSync({ iccid: this.iccid ,syncStatus:stastus }).then(res => {
            if (res.data.code == 200) {
              this.initData();
              this.offSynchronization = false;
              this.$message({
              message: '开启同步成功',
              type: 'success'
            });
          }
       })
      }
    },
    // 开关机
    kaiji(){
      if(this.boot == false){
        let params = {
          iccid: this.iccid,
          cardStatus:5
        };
        changeCardStatus(params).then(res => {
          if (res.data.code == 200){
            this.boot = !this.boot;
            this.$message({
              message: '关机成功',
              type: 'success'
            });
            this.initData();
          }else{
            this.$message.error(res.data.message);
          }
        })
      }else{
        let params = {
          iccid: this.iccid,
          cardStatus:4
        };
        changeCardStatus(params).then(res => {
          if (res.data.code == 200){
            this.boot = !this.boot;
            this.$message({
              message: '开机成功',
              type: 'success'
            });
            this.initData();
          }else{
            this.$message.error(res.data.message);
          }
        })
      }
    },
    //立即更新
    updateNow(){
      let params = {
        iccid: this.iccid,
      }
      syncCard(params).then(res => {
        if (res.data.code == 200){
          location.reload()
        }else{
          this.$message.error(res.data.message);
        }
      })
    }
    // 关闭开启GPGS
    // kggprsgn(){
    //   console.log(this.data.gprsStatus)
    //   if(this.kggprs == false){
    //     let params = {
    //       iccid: this.iccid,
    //       gprsStatus:0
    //     };
    //     changeCardGprs(params).then(res => {
    //       if (res.data.code == 200){
    //         this.kggprs = !this.kggprs;
    //         this.$message({
    //           message: 'GPRS关闭成功',
    //           type: 'success'
    //         });
    //         this.initData();
    //       }else{
    //         this.$message.error(res.data.message);
    //       }
    //     })
    //   }else{
    //     let params = {
    //       iccid: this.iccid,
    //       gprsStatus:1
    //     };
    //     changeCardGprs(params).then(res => {
    //       if (res.data.code == 200){
    //         this.kggprs = !this.kggprs;
    //         this.$message({
    //           message: 'GPRS开启成功',
    //           type: 'success'
    //         });
    //         this.initData();
    //       }else{
    //         this.$message.error(res.data.message);
    //       }
    //     })

    //   }

    // }
  },
  created() {
    this.initData();
    this.queryOrderInfo();
    this.queryServerInfo();
    let level = localStorage.getItem("level");
    if(level == 0){
      this.levelShow = true
    }else{
      this.levelShow = false
    }
  },
  mounted() {

  }
};
</script>

<style scoped>
.qunping {
  width: 100%;
}
.detail-h3 {
  font-size: 22px;
  color: #000000;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.detail-h3 i {
  color: #5298ff;
}
.hang {
  width: 80%;
  height: 50px;
  line-height: 50px;
  /* background:#fff; */
  display: flex;
  margin-top: 15px;
}
.left {
  flex: 1;
  text-align: center;
}
.left-l {
  color: #606266;
  font-weight: 700;
}
.left-r {
  color: #1890ff;
  margin-left: 10px;
}
.right {
  flex: 1;
  text-align: center;
}
.anniu {
  margin-left: 80px;
}
.zifei {
  margin-top: 30px;
}
.dingdan {
  margin: 30px 0;
  
}
 @media screen and (max-width: 750px){
    .content {
      width: 750px;
    }
  .hang{
    width: 100%;
  }
  .hang div{
    width: 100%;
  }
}

/* .dingdan{
		margin-top: 30px;
	} */
</style>
