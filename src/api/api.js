import { get, post } from './request';
//登陆
export const login = (params) => post('user/login', params)
// 获取左边sidebar
export const info = (params) => post('user/info', params)
// 登出
export const logout = (params) => post('user/logout', params)
// 创建代理
export const addUser = (params) => post('user/addUser', params)
// 获取用户资料与获取代理资料
export const getUserDetail = (params) => post('user/getUserDetail', params)
//修改密码
export const updatePassword = (params) => post('user/updatePassword', params)
//获取代理列表与搜索
export const userIndex = (params) => post('user/userIndex', params)
// 修改代理信息与修改用户资料
export const updateUser = (params) => post('user/updateUser', params)
// 获取套餐组
export const listAllServerGroupInfo = (params) => post('server/listAllServerGroupInfo', params)
// 实名列表
export const kycIndex = (params) => post('kyc/kycIndex', params)
// 实名详情
export const kycDetail = (params) => post('kyc/kycDetail', params)
// 实名状态
export const updateKycStatus = (params) => post('kyc/updateKycStatus', params)


// 流量卡管理接口
//运营商列表
export const operationList = (params) => post('card/operationList', params)
// 增加卡源
export const addCardSource = (params) => post('card/addCardSource', params)
// 获取卡源列表
export const cardSourceList = (params) => post('card/cardSourceList', params)
//修改卡源信息
export const changeCardSource = (params) => post('card/changeCardSource', params)
//流量卡列表
export const cardIndex = (params) => post('card/cardIndex', params)
//流量卡列表导出
export const exportCardList = (params) => post('card/exportCardList', params)
//流量卡备注
export const updateCardRemark = (params) => post('card/updateCardRemark', params)
// 获取卡分配的代理商列表
export const assignCardAgentListSelect = (params) => post('user/assignCardAgentListSelect', params)
// 卡分配提交接口
export const assignCard = (params) => post('card/assignCard', params)
// 提交运营商出现对应的卡源
export const cardSourceSelectList = (params) => post('card/cardSourceSelectList', params)
// 文件上传
export const batchImportCard = (params) => post('card/batchImportCard', params)
// 查找卡源列表
export const cardSourceSelectListNoParam = (params) => post('card/cardSourceSelectListNoParam', params)
// 流量卡详情
export const cardDetail = (params) => post('card/cardDetail', params)
// 流量卡的搜索
export const searchCard = (params) => post('card/searchCard', params)
// 流量卡的批量查询
export const searchCardByList = (params) => post('card/searchCardByList', params)
// 批量修改流量卡备注
export const updateCardByListRemarks = (params) => post('card/updateCardByListRemarks', params)
// 批量开机
export const activationCardList = (params) => post('card/activationCardList', params)
// 批量关机
export const shunDownCardList = (params) => post('card/shunDownCardList', params)
// 批量开启同步
export const openCardListSync = (params) => post('card/openCardListSync', params)
// 批量关闭同步 
export const closeCardListSync = (params) => post('card/closeCardListSync', params)
// 批量卡回收
export const recycleCard = (params) => post('card/recycleCard', params)
// 单卡开关同步
export const singleCardSync = (params) => post('card/singleCardSync', params)
// 单卡立即更新
export const syncCard = (params) => post('card/syncCard', params)
// 单卡开机关机
export const changeCardStatus = (params) => post('card/changeCardStatus', params)
// 单卡开启关闭gprs
export const changeCardGprs = (params) => post('card/changeCardGprs', params)
// gprs列表
export const gprsIndex = (params) => post('card/gprs/gprsIndex', params)
// 批量开启gprs
export const gprsBatchOpen = (params) => post('card/gprs/gprsBatchOpen', params)
// 获取卡的跳转页面
export const cardOperationList = (params) => post('card/cardOperationList', params)
//卡解锁的查询
export const searchCardLockInfo = (params) => post('card/searchCardLockInfo', params)
//卡解锁 的重新绑定
export const unLockCard = (params) => post('card/unLockCard', params)
//任务中心
export const missionList = (params) => post('missionCenter/missionList', params)
// 任务中心的代理商
export const beAssignList = (params) => post('missionCenter/beAssignList', params)
// 首页折线图
export const lineChart = (params) => post('statistic/lineChart', params)
// 首页三大运营商的饼图
export const listOperationFlow = (params) => post('statistic/listOperationFlow', params)
// 首页不同卡源的状态图
export const listCardStatus = (params) => post('statistic/listCardStatus', params)



//套餐模块
//获取套餐列表
export const listServerInfo = (params) => post('server/listServerInfo', params)
//获取所有套餐列表
export const listAllServerInfo = (params) => post('server/listAllServerInfo', params)
//获取套餐详情
export const getServerInfo = (params) => post('server/getServerInfo', params)
//添加套餐
export const addServerInfo = (params) => post('server/addServerInfo', params)
//修改套餐
export const updateServerInfo = (params) => post('server/updateServerInfo', params)
//删除套餐
export const delServerInfo = (params) => post('server/delServerInfo', params)

//套餐组模块
//获取套餐组列表
export const listServerGroupInfo = (params) => post('server/listServerGroupInfo', params)
//添加套餐组
export const addServerGroupInfo = (params) => post('server/addServerGroupInfo', params)
//删除套餐组
export const delServerGroupInfo = (params) => post('server/delServerGroupInfo', params)
//修改套餐组
export const updateServerGroupInfo = (params) => post('server/updateServerGroupInfo', params)

//代理套餐模块
//获取代理套餐列表
export const baseServerIndex = (params) => post('baseServer/baseServerIndex', params)
//筛选后的代理商接口
export const getBaseServerUserList = (params) => post('baseServer/getBaseServerUserList', params)
//筛选后的套餐接口POST /baseServer/getBaseServerList
export const getBaseServerList = (params) => post('baseServer/getBaseServerList', params)
//添加代理套餐
export const addBaseServer = (params) => post('baseServer/addBaseServer', params)
//修改代理套餐 
export const updateBaseServer = (params) => post('baseServer/updateBaseServer', params)
//删除代理套餐 
export const delBaseServer = (params) => post('baseServer/delBaseServer', params)
//获取代理套餐详情 
export const getBaseServerDetail = (params) => post('baseServer/getBaseServerDetail', params)

//订单管理模块
//订单列表
export const listOrderInfo = (params) => post('order/listOrderInfo', params)
//订单导出
export const exportDataList = (params) => post('order/exportDataList', params)
//批量充值
export const addOrderInfo = (params) => post('order/addOrderInfo', params)
//删除订单
export const delOrderInfo = (params) => post('order/delOrderInfo', params)
//佣金列表
export const listCommissionInfo = (params) => post('commission/listCommissionInfo', params)
//佣金列表导出
export const exportListCommissionInfo = (params) => post('commission/exportListCommissionInfo', params)
//首页的订单数量
export const getOrderInfoCount = (params) => post('order/getOrderInfoCount', params)
//获取卡套餐列表
export const listCardServer = (params) => post('order/listCardServer', params)

// 个人中心
// 充值记录
export const userRechargeList = (params) => post('user/userRechargeList', params)
// 获取个人中心的信息
export const userCenter = (params) => post('user/userCenter', params)
// 系统充值
export const recharge = (params) => post('user/recharge', params)
// 金额收支明细
export const walletRecord = (params) => post('user/walletRecord', params)
// 套餐购买内容明细
export const userWalletRecordList = (params) => post('user/userWalletRecordList', params)



