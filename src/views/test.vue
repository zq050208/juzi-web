<template>
<div>

    <p class='fileT'>选择文件 <input accept="" type='file' ref="file" id='upload' /></p>
    <button class='sure' @click="upLoad()">上传</button>
</div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import axios from 'axios'
var Bucket = 'examplebucket-1250000000';
var Region = 'COS_REGION'; 
export default {
  methods: {
  //获取签名
    upLoad() {
      console.log(this.$options.methods.uploadFile)
      var fileObj = document.getElementById("upload").files[0];
      var blobFile = this.$options.methods.dataURLtoBlob.bind(this)(fileObj);
      var filename = fileObj.name;
      axios({
        method: "get",
        url: "https://refuel-1258944054.cos.ap-guangzhou.myqcloud.com",
        data: {
          region: 'ap-guangzhou',
          bucketName: 'refuel-1258944054',
          fileName: filename
        }
      })
        .then(data => {
          let sign = data.data.values.sign;
          let path = data.data.values.path;
          this.$options.methods.uploadFile.bind(this)(sign, path, blobFile, filename);
        })
    },

    //上传腾讯云
    uploadFile(sign, folder, file, filename) {
      var bucket ='refuel-1258944054';
      // var appid = '1256287502';
      var region = 'ap-guangzhou';

      var cos = new COS({
        // 必选参数
        getAuthorization: function (options, callback) {
          callback({
            Authorization: sign
            // XCosSecurityToken: data.XCosSecurityToken, // 如果是临时密钥计算出来的签名，需要提供 XCosSecurityToken
          });
        },
        // 可选参数
        FileParallelLimit: 3, // 控制文件上传并发数
        ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
        ProgressInterval: 1000 // 控制上传的 onProgress 回调的间隔
      });
      const loading = this.$loading({
        lock: true,
        text: '资源正在上传,请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var _this = this;
      cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: folder + filename,
        Body: file
      }, function (err, data) {
        if (data.statusCode === 200) {
        //上传成功得到的资源地址
          let path = 'https://' + bucket + '.cos.ap-shanghai.myqcloud.com' + folder + '' + filename + ''
          loading.close();
        }
      });
    },

    //DataURL转Blob
    dataURLtoBlob(fileObj) {
      console.log(fileObj.size)
      return new Blob([fileObj], { type: fileObj.type });
    }
  }
}
</script>

<style>

</style>
