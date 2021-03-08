<template>
  <div class="content">
    <el-form ref="propsParams" :rules="ruleValidate" :model="propsParams" label-width="100px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="资费名" prop="serverName">
              <el-input v-model="propsParams.serverName"></el-input>
            </el-form-item>
            <el-form-item label="卡来源" prop="cardFromId">
              <el-select v-model="propsParams.cardFromId" multiple placeholder>
                <el-option
                  v-for="item in optSource"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="网络" prop="netType">
              <el-select v-model="propsParams.netType" multiple placeholder>
                <el-option
                  v-for="item in optNetwork"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资费类型" prop="postageType">
              <el-select v-model="propsParams.postageType" placeholder>
                <el-option
                  v-for="item in optType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流量比例" prop="flowRatio">
              <el-input v-model="propsParams.flowRatio"></el-input>
            </el-form-item>
            <el-form-item label="总流量" prop="flowCount">
              <el-input placeholder="-1为不限，流量MB" v-model="propsParams.flowCount">
                <template slot="append">MB</template>
              </el-input>
            </el-form-item>
            <el-form-item label="有效期" prop="validityTime">
              <el-input placeholder="有效期，30天为一月" v-model="propsParams.validityTime">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
            <el-form-item label="价格" prop="floorPrice">
              <el-input placeholder v-model="propsParams.floorPrice">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="市场价格" prop="marketPrice">
              <el-input placeholder v-model="propsParams.marketPrice">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="首冲价格" prop="firstChargePrice">
              <el-input placeholder v-model="propsParams.firstChargePrice">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="充值次数" prop="chargeCount">
              <el-input placeholder v-model="propsParams.chargeCount"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item label="标签" prop="label">
              <el-input placeholder v-model="propsParams.label"></el-input>
            </el-form-item>
            <el-form-item label="描述信息" prop="descriptionInformation">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入描述信息"
                v-model="propsParams.descriptionInformation"
              ></el-input>
            </el-form-item>
            <el-form-item label="资费" prop="flowInfo">
              <el-checkbox-group v-model="flowInfosList">
                <el-checkbox
                  v-for="flowInfo in flowInfos"
                  :label="flowInfo"
                  :key="flowInfo"
                >{{flowInfo}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-input placeholder="0" v-model="propsParams.priority"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="isDisable">
              <el-switch v-model="propsParams.isDisable" active-color="#13ce66"></el-switch>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import commonIpt from '@/components/commonIpt'
import { addServerInfo } from "@/api/api.js"; //添加套餐
import { cardSourceList } from "@/api/api.js"; //卡来源下拉
import { cardSourceSelectListNoParam } from "@/api/api.js"; //卡来源列表
export default {
  name: "packageAdd",
  data() {
    return {
      checkList: [],
      flowInfos: [
        "推荐",
        "基础资费",
        "仅续费充值",
        "限速套餐",
        "加速包",
        "月末折扣"
      ],
      flowInfosList: [],
      propsParams: {
        isDisable:true,
      },
      flowInfo: [],
      optType: [
        { value: 1, label: "累计套餐" },
        { value: 2, label: "月套餐" },
        { value: 3, label: "加油包" }
      ],
      optSource: [],
      optNetwork: [
        { value: 2, label: "2G" },
        { value: 3, label: "3G" },
        { value: 4, label: "4G" },
        { value: 5, label: "5G" }
      ],
      ruleValidate: {
        serverName: [
          { required: true, message: "请输入资费名", trigger: "blur" }
        ],
        cardFromId: [
          { required: true, message: "请选择卡来源", trigger: "blur" }
        ],
        postageType: [
          { required: true, message: "请选择资费类型", trigger: "blur" }
        ],
        flowRatio: [
          { required: true, message: "请输入流量比例", trigger: "blur" }
        ],
        flowCount: [
          { required: true, message: "请输入总流量", trigger: "blur" }
        ],
        validityTime: [
          { required: true, message: "请输入有效期", trigger: "blur" }
        ],
        floorPrice: [
          { required: true, message: "请输入价格", trigger: "blur" }
        ],
        marketPrice: [
          { required: true, message: "请输入市场价格", trigger: "blur" }
        ],
        descriptionInformation:[
          { required: true, message: "请输入描述信息", trigger: "blur"}
        ]
      }
    };
  },
  components: {
    // commonIpt,
  },
  computed: {},
  methods: {
    // 创建套餐
    handleSubmit() {
      let params = {
        ...this.propsParams
      };

      this.$refs.propsParams.validate(valid => {
        params.isDisable = params.isDisable ? 1 : 0;
        // console.log(params.isDisable);

        let arr = [];
        let list = [
          { label: "推荐", value: 1 },
          { label: "基础资费", value: 2 },
          { label: "仅续费充值", value: 3 },
          { label: "限速套餐", value: 4 },
          { label: "加速包", value: 5 },
          { label: "月末折扣", value: 6 }
        ];
        list.forEach(item1 => {
          this.flowInfosList.forEach(item2 => {
            if (item1.label === item2) {
              arr.push(item1.value);
            }
          });
        });
        params.flowInfo = JSON.stringify(arr);
        params.cardFromId = JSON.stringify(this.propsParams.cardFromId);
        params.netType = JSON.stringify(this.propsParams.netType);

        if (valid) {
          addServerInfo(params).then(res => {
            if (res.data.code == 200) {
              this.$message.success("添加套餐成功");
              this.$router.replace({
                name: "packagelist"
              });
            } else {
              this.$message.error("添加套餐失败");
            }
          });
        }
      });
    },
    // 获取卡来源
    querySource() {
      cardSourceSelectListNoParam().then(res => {
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            this.optSource.push({
              value: Number(item.id),
              label: item.cardSourceName
            });
          });
        }
      });
    }

  },
  mounted() {
    let serverId = this.$route.query.id;
  },
  created() {
    this.querySource();
  }
};
</script>
<style scoped lang="less">
.el-select {
  width: 350px;
  margin-left: 5px;
}
.el-input {
  width: 350px;
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
