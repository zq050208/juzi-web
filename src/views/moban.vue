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
    <!-- 金额的统计图 -->
    <div id="newEcharts" class="simpleDemo"></div>
    <!-- 三大运营商的统计 -->
    <div class="panel-block">
      <div class="white-box">
        <div class="title">
          <h3>中国电信</h3>
          <span>100G</span>
        </div>
        <div id="chart1" class="panel-chart"></div>
      </div>
      <div class="white-box">
        <div class="title">
          <h3>中国移动</h3>
          <span>100G</span>
        </div>
        <div id="chart2" class="panel-chart"></div>
      </div>
      <div class="white-box">
        <div class="title">
          <h3>中国联通</h3>
          <span>100G</span>
        </div>
        <div id="chart3" class="panel-chart"></div>
      </div>
    </div>
    <!-- 卡源的统计 -->
    <div class="panel-block">
      <div class="white-box distribution">
        <div class="wrap">
            <el-select v-model="cardSourceName" filterable placeholder="卡源" clearable style="width:120px;padding:5px 0 0 5px"  @change="search">
              <el-option
                v-for="item in source"
                :key="item.cardSourceId"
                :label="item.cardSourceName"
                :value="item.cardSourceName"
              ></el-option>
            </el-select>
          <div id="chart4" class="panel-chart"></div>
        </div>
      </div>
      <div class="white-box business">
        <div class="wrap">
          jjjj
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import echarts from "echarts"; // 水球图https://gallery.echartsjs.com/editor.html?c=liquidfill-echarts， 中国热力分布图
// https://echarts.apache.org/examples/zh/editor.html?c=map-polygon
import countTo from "vue-count-to";
import { getOrderInfoCount } from "@/api/api.js"; //获取金额与订单数量
import { lineChart,cardSourceSelectListNoParam } from "@/api/api.js"; //折线图
export default {
  components: { countTo },
  data() { 1
    return {
      startVal: 0,
      orderamount: 0,
      ordernumber: 0,
      ordercommission:0,
      activeIndex: 0,
      data: ["日",  "月", "年"],
      commissionAmountList:[], //佣金列表
      orderAmountList: [], //订单金额
      orderNumberList: [], //订单数量
      timeList: [], //时间
      username:'',
      source: [],// 来源
      cardSourceName:'WH电信'
    };
  },
  computed: {},
  methods: {
    search(){
      console.log(this.cardSourceName)
    },
    checkCard(val, index) {
      this.activeIndex = index;
      this.getOrderInfo(val);
    },
    getOrderInfo(type = "日") {
      let params = {
        type: type,
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
    async initData() {
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
              padding: [0, 0, 0, 20]
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
              barGap:'0',
              barWidth: '21%',//柱图宽度
              data: this.orderNumberList,
              type: "bar",
            },
            {
              name: "佣金金额",
              barGap:'0',
              barWidth: '21%',//柱图宽度
              data: this.commissionAmountList,
              type: "bar",
            },
            {
              name: "订单金额",
              barGap:'0',
              barWidth: '21%',//柱图宽度
              data: this.orderAmountList,
              type: "bar", // 类型为折线图
              // lineStyle: {
              //   // 线条样式 => 必须使用normal属性
              //   normal: {
              //     color: "#91C7AE",
                  
              //   }
              // }
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        let chartOption1 = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: '80%',
              center: ['50%', '50%'],
              label: {
                  normal: {
                    position: 'inner',
                    show : false
                  }
                },
              data: [
                  {value: 335, name: '直接访问'},
                  {value: 310, name: '邮件营销'},
                  {value: 234, name: '联盟广告'},
                  {value: 135, name: '视频广告'},
                  {value: 1548, name: '搜索引擎'}
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        let chartOption2 = {
          tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)'
          },
          color:['#FE8463', 'red', 'green'],
          series: [
              {
                  type: 'pie',
                  radius: ['63%', '80%'],
                  center: ['50%', '50%'],
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '15',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: [
                      {value: 335, name: '直接访问'},
                      {value: 310, name: '邮件营销'},
                      {value: 234, name: '联盟广告'},
                      {value: 135, name: '视频广告'},
                      {value: 1548, name: '搜索引擎'}
                  ]
              }
          ]
      };
 
        let newEcharts = echarts.init(document.getElementById("newEcharts"));
        newEcharts.setOption(option);
        let chart1 = echarts.init(document.getElementById("chart1"));
        chart1.setOption(chartOption1);
        let chart2 = echarts.init(document.getElementById("chart2"));
        chart2.setOption(chartOption1);
        let chart3 = echarts.init(document.getElementById("chart3"));
        chart3.setOption(chartOption1);
        let chart4 = echarts.init(document.getElementById("chart4"));
        chart4.setOption(chartOption2);
        let index = 0; // 高亮索引
        chart4.dispatchAction({
          type: "highlight",
          seriesIndex: index,
          dataIndex: index
        });
        chart4.on("mouseover", function(e) {
          if (e.dataIndex != index) {
            chart4.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: index
            });
          }
        });
        chart4.on("mouseout", function(e) {
          chart4.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: 0
          });
        });
        window.onresize = function () {
          newEcharts.resize();
          chart1.resize();
          chart2.resize();
          chart3.resize();
          chart4.resize();
        }
      }, 0);
    }
  },

  mounted() {
    this.$nextTick(function () {
      this.initData();
      this.getOrderInfo();
      this.username = localStorage.getItem("uesrname");
      this.search()
    });
  },
  created() {
    getOrderInfoCount({ userId:''}).then(res => {
      if (res.data.code == 200) {
        this.orderamount = res.data.data.orderInfoCount.accountMoney;
        this.ordernumber = res.data.data.orderInfoCount.orderCount;
        this.ordercommission = res.data.data.commissionInfoCount.commissionMoney;
      }
    });
    cardSourceSelectListNoParam().then(res => {
      if (res.data.code == 200) {
        this.source = res.data.data;
      }
    });
  }
};
</script>

<style scoped lang="less">
.content{
  padding: 20px 7% 20px;
}
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
  justify-content: space-between;
  margin-top: 100px;
}
.order .lists {
  width: 15%;
  height: 108px;
  cursor: pointer;
  display: flex;
  background:#30C7C9;
  // margin-left: 50px;
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
.simpleDemo {
  width: 100%;
  height: 520px;
}
.panel-block{
  display: flex;
  justify-content: space-between;
  margin-top: 5%;
  .white-box{
    width: 32%;
    border-radius: 5px;
    border: 1px solid rgba(83,130,152,.2);
    .title{
      margin-top: 5%;
      color: #899caf;
      text-align: center;
      font-size: 18px;
    }
    .panel-chart{
      width: 100%;
      height: 200px;
    }
  }
  .distribution{
    width: 32%;
  }
  .business{
    width: 66%;
  }
}
</style>


