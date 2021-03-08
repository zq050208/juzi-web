
export const commonMethods = {
  //根据地址获取经纬度
  getLal: (address,cb) => {
    var geocoder = new qq.maps.Geocoder();
    geocoder.getLocation(address);
    geocoder.setComplete(function(res) {
        cb(res)
    });
    geocoder.setError(function(err) {
        cb(err)
    });
  }
}