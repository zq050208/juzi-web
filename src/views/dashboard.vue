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
    <div class="panel-block" v-if="levelShow">
      <div class="white-box">
        <div class="title">
          <h3>中国电信：{{telecoma}}</h3>
        </div>
        <div id="chart1" class="panel-chart"></div>
      </div>
      <div class="white-box">
        <div class="title">
          <h3>中国移动：{{mobilea}}</h3>
        </div>
        <div id="chart2" class="panel-chart"></div>
      </div>
      <div class="white-box">
        <div class="title">
          <h3>中国联通：{{unicoma}}</h3>
        </div>
        <div id="chart3" class="panel-chart"></div>
      </div>
    </div>
    <!-- 卡源的统计 -->
    <div class="panel-block" v-if="levelShow">
      <div class="white-box distribution">
        <div class="wrap">
            <el-select v-model="cardSourceName" filterable placeholder="请选择卡源"  style="width:130px;padding:5px 0 0 5px"  @change="search">
              <el-option
                v-for="item in source"
                :key="item.cardSourceId"
                :label="item.cardSourceName"
                :value="item.cardSourceName"
              ></el-option>
            </el-select>
          <div id="chart4" class="panel-chart"></div>
          <p style="text-align: right;padding-right:3%;color:#DCDFE6">
            <span style="text-align: right;display: inline-block;width: 65px;">未分配：</span>
            <span style="text-align: left;display: inline-block;width: 65px;">{{undistributed}}</span>
          </p>
          <p style="text-align: right;padding-right:3%;color:#DCDFE6">
            <span style="text-align: right;display: inline-block;width: 65px;">总<i style="display: inline-block;width:17px"></i>数：</span>
            
            <span style="text-align: left;display: inline-block;width: 65px;">{{totalNumber}}</span>
          </p>
        </div>
      </div>
      <div class="white-box business">
        <div class="wrap wrapl">
          <div id="chart5" class="panel-chart" style="height: 230px;"></div>
        </div>
        <div class="wrap wrapr">
          <div class="top-title">昨日TOP排名</div>
          <p class="table-head"><span>MSISDN</span><span>使用量 (GB)</span></p>
          <div class="table-data" v-for="(item,index) in datas" :key="index">
            <div>
              <span class="number1-bg">{{item.num}}</span>
              <span @click="delRow(item.iccid)">{{item.iccid}}</span>
            </div>
            <div>
              <span>{{item.yl}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="beianhao">
      <a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备20053887号</a>
    </div>

  </div>
</template>

<script>
import echarts from "echarts"; // 水球图https://gallery.echartsjs.com/editor.html?c=liquidfill-echarts， 中国热力分布图
// https://echarts.apache.org/examples/zh/editor.html?c=map-polygon
import countTo from "vue-count-to";
import { getOrderInfoCount } from "@/api/api.js"; //获取金额与订单数量
import { lineChart, listOperationFlow, listCardStatus,cardSourceSelectListNoParam } from "@/api/api.js"; //折线图  三大运营商的饼图 卡源的状态图
export default {
  components: { countTo },
  data() {
    return {
      datas:[
        {
          num:1,
          iccid:1400084218801,
          yl:40
        },
                {
          num:2,
          iccid:1400084218802,
          yl:40
        },
        {
          num:3,
          iccid:1400084218803,
          yl:40
        },
        {
          num:4,
          iccid:1400084218804,
          yl:40
        },
        {
          num:5,
          iccid:1400084218805,
          yl:40
        },
      ],
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
      levelShow:true,
      // 饼图的数据
      telecomData:[],//电信
      telecoma:'',
      mobileData:[],//移动
      mobilea:'',
      unicomData:[],//联通
      unicoma:'',
      // 卡源的状态的数据
      source: [],// 来源
      cardSourceName:'',
      totalNumber:'',
      undistributed:'',
      cardsdata:[]
    };
  },
  computed: {},
  methods: {
    checkCard(val, index) {
      this.activeIndex = index;
      this.getOrderInfo(val);
    },
    // 折线图
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
    // 三大运营商的饼图
    piechart(){
      listOperationFlow().then(res =>{
        if (res.data.code == 200) {
          // 电信
          this.telecomData = res.data.data[2].cardSourceFlowDtoList;
          this.telecoma = res.data.data[2].operationTotalFlow + 'G';
          // 移动
          this.mobileData = res.data.data[0].cardSourceFlowDtoList;
          this.mobilea = res.data.data[0].operationTotalFlow + 'G';
          // 联通
          this.unicomData = res.data.data[1].cardSourceFlowDtoList;
          this.unicoma = res.data.data[1].operationTotalFlow + 'G';
        }
      })
    },
    // 卡源的状态图
    search(){
      let params = {
        cardSourceName: this.cardSourceName,
      };
      listCardStatus(params).then(res =>{
        if (res.data.code == 200) {
          this.cardsdata = res.data.data.cardStatusInfoList;
          this.totalNumber = res.data.data.totalNumber;
          this.undistributed = res.data.data.unDistributionNumber;
          this.initData();
        }
      })
    },
    // 跳转详情
    delRow(id){
      this.$router.push({ path: `/detail?iccid=${id}` });
      // console.log(id)
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
          legend: {
            x: 'center',
            y: 'bottom',
          },
          color:['#91C7AE', '#61A0A8', '#2F4554', '#D48265', '#C23531'],
          series: [
            {
              type: 'pie',
              radius: '75%',
              center: ['50%', '45%'],
              label: {
                  normal: {
                    position: 'inner',
                    show : false
                  }
                },
              data: this.telecomData,
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
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            x: 'center',
            y: 'bottom',
          },
          color:['#91C7AE', '#61A0A8', '#2F4554', '#D48265', '#C23531'],
          series: [
            {
              type: 'pie',
              radius: '75%',
              center: ['50%', '45%'],
              label: {
                  normal: {
                    position: 'inner',
                    show : false
                  }
                },
              data: this.mobileData,
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
        let chartOption3 = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            x: 'center',
            y: 'bottom',
          },
          color:['#91C7AE', '#61A0A8', '#2F4554', '#D48265', '#C23531'],
          series: [
            {
              type: 'pie',
              radius: '75%',
              center: ['50%', '45%'],
              label: {
                  normal: {
                    position: 'inner',
                    show : false
                  }
                },
              data: this.unicomData,
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
        let chartOption4 = {
          tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
          },
          color:['#91C7AE', '#61A0A8', '#2F4554', '#D48265', '#C23531'],
          series: [
              {
                  type: 'pie',
                  radius: ['60%', '80%'],
                  center: ['45%', '45%'],
                  label: {
                      show: false,
                      position: 'center'
                  },
                  labelLine: {
                      show: false
                  },
                  data: this.cardsdata
              }
          ]
        };
        let chartOption5 = {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '5%',   // 与容器左侧的距离
            right: '5%', // 与容器右侧的距离
            top: '20%',   // 与容器顶部的距离
            bottom: '0%', // 与容器底部的距离
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['01', '02', '03', '04', '05','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',],
              axisTick: {
                  alignWithLabel: true
              },
              // axisLine:{
              //   lineStyle:{
              //       color:'#DDE6EA',
              //   }
              // }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '流量统计',
              type: 'line',
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#A2CEFE '
                }, {
                    offset: 1,
                    color: '#E9F3FF'
                }])
              },
              itemStyle : {  
                normal : {  
                  lineStyle:{  
                    color:'#3398DB'  
                  }  
                }  
              },  
              barGap:'0',
              barWidth: '20%',//柱图宽度
              data: [10, 52, 200, 334, 20, 50, 90, 200, 500, 399, 39, 390, 390, 390, 100, 390, 390, 200, 390, 390, 390, 230, 390, 200,240]
            }
          ]
        };
        let newEcharts = echarts.init(document.getElementById("newEcharts"));
        newEcharts.setOption(option);
        let chart1 = echarts.init(document.getElementById("chart1"));
        chart1.setOption(chartOption1);
        let chart2 = echarts.init(document.getElementById("chart2"));
        chart2.setOption(chartOption2);
        let chart3 = echarts.init(document.getElementById("chart3"));
        chart3.setOption(chartOption3);
        let chart4 = echarts.init(document.getElementById("chart4"));
        chart4.setOption(chartOption4);
        let chart5 = echarts.init(document.getElementById("chart5"));
        chart5.setOption(chartOption5);
        window.onresize = function () {
          newEcharts.resize();
          chart1.resize();
          chart2.resize();
          chart3.resize();
          chart4.resize();
          chart5.resize();
        }
      }, 0);
    }
  },

  mounted() {
    this.$nextTick(function () {
      this.initData();
      this.getOrderInfo();
      this.piechart();
      this.search();
      this.username = localStorage.getItem("uesrname");
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
    let level = localStorage.getItem("level");
    if(level == 0){
      this.levelShow = true
    }else{
      this.levelShow = false
    }
  }
};
</script>

<style scoped lang="less">
  .beianhao{
    width:100%;
    font-size:30rpx;
    text-align: center;
    margin-top: 80px;
    margin-bottom: 30px;
  }
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
      background-color: #fff;
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
      .wrapl{
        width: 70%;
        display: inline-block;
      }
      .wrapr{
        width: 30%;
        display: inline-block;
        .top-title{
          text-align: center;
          margin: 0 auto;
          width: 80%;
          height: 30px;
          font-size: 14px;
          color: #899caf;
          background-color: #e7eaf3;
          line-height: 30px;
        }
        .table-head{
          text-align: center;
          margin-top: 2px;
          display: flex;
          justify-content: space-around;
          span{
            color: #aab4cd;
            font-size: 14px;
          }
        }
        .table-data{
          text-align: center;
          height: 32px;
          margin-top: 2px;
          display: flex;
          justify-content: space-around;
          .number1-bg{
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 18px;
            text-align: center;
            color: #fff;
            background: #fb973b;
            margin-right: 3px;
          }
          span{
            font-size: 13px;
            color: #3398DB;
            cursor: pointer;
          }
        }
        p{
          text-align: center;
          line-height: 200%;
          color: #3398DB;
        }
      }
    }
  }
</style>


