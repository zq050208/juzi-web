import axios from "axios";
import router from "../router.js";
import { Message } from 'element-ui';
const baseUrl = process.env.NODE_ENV === 'development' ? "http://192.168.50.10:8081/wwhl/" : "http://iot.juzi1688.cn/wwhl/";
// const baseUrl = process.env.NODE_ENV === 'development' ? "http://192.168.50.29:8081/wwhl/" : "http://iot.juzi1688.cn/wwhl/";

// const baseUrl = process.env.NODE_ENV === 'development' ? "http://192.168.50.10:8081/wwhl/" : "http://test.juzi1688.cn/wwhl/"; 
axios.defaults.timeout = 150000; //设置接口超时时间
axios.defaults.baseURL = baseUrl; //根据环境设置基础路径
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8"; //设置编码
/*
 *请求前拦截
 *用于处理需要请求前的操作
 */
axios.interceptors.request.use(
    config => {
        let token = localStorage.getItem('token')
        if (token) {
            config.headers["Token"] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(res => {
    if (res.data.code == 401) {
        localStorage.clear();
        router.push("/login");
    }
    return Promise.resolve(res)
}, error => {
    // Message({
    //     message: '网络异常',
    //     type: 'error',
    //     duration: 5 * 1000
    // })
    return Promise.reject(error)
})


/*
 *get方法，对应get请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function get(url, params) {

    return new Promise((resolve, reject) => {
        axios
            .get(baseUrl + url, {
                params
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}
/*
 *post方法，对应post请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(baseUrl + url, params)
            .then(res => {
                // console.log(res)
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}