// 卡废弃
<template>
	<div class="content">
		<el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="ICCID/MSISDN列表：" prop="lists"  label-width="151px" >
				<el-input v-model="ruleForm.lists" type="textarea" placeholder="以回车键分割ICCID/MSISDN" rows="6" style="width:420px"></el-input>
			</el-form-item>
			<el-form-item label="ICCID/MSISDN范围：" prop="scope" label-width="151px" >
				<el-input v-model="ruleForm.scope" style="width: 200px; margin-right: 10px;" placeholder="包含开始值"></el-input>
				<span>  -  </span>
				<el-input v-model="ruleForm.scope" style="width: 200px;margin-left: 10px;" placeholder="包含终止值"></el-input>
			</el-form-item>


			<el-form-item>
				<el-button type="primary" size="medium" @click="submitForm('ruleForm')" >提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
    
export default {
	data(){
		return {
			ruleForm: {
				lists: '',
				scope: '',
			},
		}
	},
	computed:{
		
	},
	methods:{
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					alert('submit!');
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
	created(){
		
	},
	mounted(){
		
	}
}
</script>

<style scoped>
    
    

</style>
