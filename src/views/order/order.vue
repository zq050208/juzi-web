<template>
	<div class="content">
		<div class="search_cont">
			<label>站点关键字：</label><el-input v-model="searchData.stationName" placeholder=""></el-input>
			<label>编号：</label><el-input v-model="searchData.orderNo" placeholder=""></el-input>
			<label>地址关键字：</label><el-input v-model="searchData.address" placeholder=""></el-input>
			<el-button type="primary" class="anniu" @click="search">搜索</el-button>
		</div>
		<div class="table">
			<el-table
				:data="tableData"
				border
				style="width: 95%">
				<el-table-column
					prop="orderNo"
					label="订单号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="stationName"
					label="加油站"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="fillingMachineCode"
					label="油机"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="oilGunNo"
					label="枪号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="oilsVarieties"
					label="油号"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="payAmount"
					label="结算金额"
					align="center"
					>
				</el-table-column>
				<el-table-column
					prop="orderStatus"
					label="订单状态"
					align="center"
					>
          <template slot-scope="scope">
						<span v-if="scope.row.orderStatus === 1">待支付</span>
						<span v-if="scope.row.orderStatus === 2">支付中（受理中）</span>
						<span v-if="scope.row.orderStatus === 3">支付成功</span>
						<span v-if="scope.row.orderStatus === 4">支付失败</span>
						<span v-if="scope.row.orderStatus === 5">转入退款</span>
						<span v-if="scope.row.orderStatus === 6">关闭订单(退款成功)</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="payTime"
					label="支付时间"
					align="center"
					>
				</el-table-column>
				<!-- <el-table-column label="操作" width="230" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" plain @click="refund(scope.$index,scope.row)">退款</el-button>
						
					</template>
				</el-table-column> -->
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pageParams.current_page"
				:page-sizes="[10, 20, 30, 50]"
				:page-size="pageParams.page_size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="pageParams.total"
				style="margin-top: 20px;text-align:center;"
			>
			</el-pagination>	
		</div>
	</div>
</template>

<script>
import { getOrderList } from '@/api/api'
export default {
components: {},
	data(){
		return {
			searchData: {
				stationName: '',
				orderNo: '',
				address: '',
			},
			tableData: [],
			pageParams: {
				current_page: 1,
				page_size: 10,
				total: 0
			}
		}
	},
	computed:{
		
	},
	mounted(){
		this.getInitData()
	},
	methods:{
		getInitData(){
			const params = {
				current: this.pageParams.current_page,
				size: this.pageParams.page_size,
				...this.searchData
			}
			getOrderList(params).then(res => {
				this.tableData = res.data.records
				this.pageParams.page_size = res.data.size
				this.pageParams.total = res.data.total
			})
		},
		search(){
			console.log(this.$router)
			this.getInitData()
    },
    // refund(index,row){

    // },
		//分页
		handleSizeChange(val) {
			this.pageParams.page_size = val
			this.getInitData()
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			this.pageParams.current_page = val
			this.getInitData()
			console.log(`当前页: ${val}`);
		}
	},
	created(){
		

	}
}
</script>

<style scoped lang="less">
	.content .el-input{
		width: 200px;
		margin-right: 10px;
	}
	.search_cont{
		margin-bottom: 10px;
	}

	
    

</style>
