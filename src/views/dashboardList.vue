<template>
  <div class="content">
    <div class="box">
      <p>
        <span>{{this.username}}：</span>
        <span>运营情况</span>
      </p>
    </div>
    <div class="order">

      <div class="lists" style="background:#36A3F7">
        <div class="amount">
          <p style="color:#fff">订单数量</p>
          <p style="font-size: 18px;">
            <countTo :startVal="startVal" :endVal="ordernumber" :duration="2000"></countTo>
          </p>
        </div>
      </div>
      <div class="lists" style="background:#30C7C9">
        <div class="amount">
          <p style="color:#fff">订单金额</p>
          <p style="font-size: 18px;">
            <countTo :startVal="startVal" :endVal="orderamount" :duration="2000"></countTo>
          </p>
        </div>
      </div>
      <div class="lists" style="background:#B6A2DE">
        <div class="amount">
          <p style="color:#fff">佣金金额</p>
          <p style="font-size: 18px;">
            <countTo :startVal="startVal" :endVal="ordercommission" :duration="2000"></countTo>
          </p>
        </div>
      </div>
    </div>
    <div class="nian">
      <h3>订单统计</h3>
      <div style="margin-right:10% ; text-align: right;">
        <span
          v-for="(item,index) in data"
          :key="index"
          :class="{cur: activeIndex === index}"
          @click="checkCard(item,index)"
        >{{item}}</span>
      </div>
    </div>
    <div id="newEcharts" class="simpleDemo"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import countTo from "vue-count-to";
import { getOrderInfoCount } from "@/api/api.js"; //获取金额与订单数量
import { lineChart } from "@/api/api.js"; //折线图
export default {
  components: { countTo },
  data() {
    return {
      startVal: 0,
      orderamount: 0,
      ordernumber: 0,
      ordercommission:0,
      activeIndex: 0,
      data: ["日",  "月", "年"],
      commissionAmountList:[], //佣金金额
      orderAmountList: [], //订单金额
      orderNumberList: [], //订单数量
      timeList: [], //时间
      username:''
    };
  },
  computed: {},
  methods: {
    checkCard(val, index) {
      this.activeIndex = index;
      this.getOrderInfo(val);
    },
    getOrderInfo(type = "日") {
          
      let userId = this.$route.query.userId;
      let params = {
        type: type,
        userId: userId
      };
      lineChart(params).then(res => {
        if (res.data.code == 200) {
          this.orderAmountList = res.data.data.orderAmountList;
          this.orderNumberList = res.data.data.orderNumberList;
          this.timeList = res.data.data.timeList;
          this.commissionAmountList = res.data.data.commissionAmountList;
          this.initData();
        }
      });
    },
    initData() {
      setTimeout(() => {
        // 指定图表的配置项和数据
        var option = {
          tooltip: {
            //设置tip提示
            trigger: "axis"
          },
          legend: {
            //设置区分（哪条线属于什么）
            data: [ "订单数量","佣金金额","订单金额",],
            x: "45%",
            y: "500px"
          },
          color: [ "#36A3F7","#B6A2DE",'#30C7C9',], //设置区分（每条线是什么颜色，和 legend 一一对应）
          xAxis: {
            //设置x轴
            type: "category",
            boundaryGap: true, //坐标轴两边不留白
            data: this.timeList,
            // name: "DATE", //X轴 name
            nameTextStyle: {
              //坐标轴名称的文字样式
              color: "#FA6F53",
              fontSize: 16,
              padding: [0, 0, 0, 10]
            },
            axisLine: {
              //坐标轴轴线相关设置。
              lineStyle: {
                color: "#2B2F3A",
              }
            }
          },
          yAxis: {
            // name: "SALES VOLUME",
            nameTextStyle: {
              color: "#FA6F53",
              fontSize: 16,
              padding: [0, 0, 10, 0]
            },
            axisLine: {
              lineStyle: {
                color: "#2B2F3A"
              }
            },
            type: "value"
          },
          series: [
            {
              name: "订单数量",
              data: this.orderNumberList,
              barGap:'0',
              barWidth: '21%',//柱图宽度
              type: "bar",
            },
            {
              name: "佣金金额",
              data: this.commissionAmountList,
              barGap:'0',
              barWidth: '21%',//柱图宽度
              type: "bar",
            },
            {
              name: "订单金额",
              data: this.orderAmountList,
              barGap:'0',
              barWidth: '21%',//柱图宽度
              type: "bar", // 类型为折线图
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        let chartLine = echarts.init(document.getElementById("newEcharts"));
        chartLine.setOption(option);
        window.onresize = function() {
          chartLine.resize();
        };
      }, 0);
    }
  },

  mounted() {
  },
  created() {
    getOrderInfoCount({ userId:this.$route.query.userId}).then(res => {
      if (res.data.code == 200) {
        this.orderamount = res.data.data.orderInfoCount.accountMoney;
        this.ordernumber = res.data.data.orderInfoCount.orderCount;
        this.ordercommission = res.data.data.commissionInfoCount.commissionMoney;
      }
    });
    this.initData();
    this.getOrderInfo();
    this.username = this.$route.query.username
  }
};
</script>

<style scoped lang="less">
.box {
  width: 100%;
  text-align: center;
}
.box p span {
  font-size: 30px;
  color: #1c1c1c;
  font-weight: bold;
}
.order {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 100px;
}
.order .lists {
  width: 260px;
  height: 108px;
  cursor: pointer;
  display: flex;
}
.imgs {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.amount {
  flex: 1;
  height: 108px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.amount p {
  font-size: 18px;
  color: #666666;
  font-weight: bold;
  margin-top: 5px;
}
.cur {
  color: #fff;
  background-color:#30C7C9;
  border-color:#30C7C9;
}
.content {
  width: 100%;
}
.nian {
  width: 100%;
  margin-top: 20px;
}
.nian h3 {
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: #000000;
  font-weight: bold;
}
.nian span {
  display: inline-block;
  width: 56px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  margin-left: 3px;
  font-size: 14px;
  border-radius: 4px;
}

.simpleDemoaa {
  width: 100%;
  margin: 0 auto;
}
.simpleDemo {
  width: 100%;
  height: 520px;
}
</style>


