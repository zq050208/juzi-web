// 卡更新
<template>
	<div class="content">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="Excel文件：" prop="excel"  label-width="151px" ref="bookimg">
				<el-upload
					v-model="ruleForm.excel"
					class="upload-Excel"
					action="https://jsonplaceholder.typicode.com/posts/"
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					:before-remove="beforeRemove"
					multiple
					accept=".xlsx, .xls, .csv"
					:limit="1"
					:on-exceed="handleExceed"
					:on-success="handleSuccess"
					:file-list="fileList">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
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
				excel:''
			},
			rules: {
				excel:[
					{required: true, message: '请选择文件', trigger: 'blur'}
				]
				
			},
			fileList: [
			
			]	
			
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
				console.log(this.fileList.length)
			})
		},
		handleRemove(file, fileList) {
        	console.log(file, fileList);
			},
		handlePreview(file) {
			console.log(file);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${ file.name }？`);
		},
		handleExceed(files, fileList) {
        	this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		  },
		  handleSuccess(file){
			let formData = new FormData()
			this.$refs.ruleForm.clearValidate('excel');
			formData.append('file',file)
			this.ruleForm.excel = file
			// axios.post(url, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/octet-stream' } })
			// .then(res => {
			// 	if (res.status === 200) {
			// 		this.ruleForm.excel = res.data.key
			// 		this.uploadList.push({
			// 		status: 'finished',
			// 		url: this.formData.icon
			// 		})
			// 	} else {
			// 		that.$Message.error('上传失败')
			// 	}
			// })
			console.log("成功",formData)
		}


	},
	created(){
		
	},
	mounted(){
		
	}
}
</script>

<style scoped>
    
.upload-Excel{
	width: 280px;
}

</style>
