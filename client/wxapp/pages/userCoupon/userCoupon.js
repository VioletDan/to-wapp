// pages/userCoupon/userCoupon.js
const app = getApp();
const {
  beats,
  iuser,
  icom,
  utils,
  Toast,
  API,
  imath
} = app;
var _index = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopup: false,
    boxType: 1, // 1代表我的优惠券 2 代表 选择使用优惠券
    couponList: [{
      title: '饮品免单券1',
      btnType: '免单券',
      startDate: '2020-09-01',
      endDate: '2020-09-28',
      typeTxt: '全场通用免单券',
      isEnd: true, //是否即将过期
      isUse: true, //能否使用 true 能 false 不能
      isAct: true, //是否被选择,
      money: 20
    }, {
      title: '饮品免单券2',
      btnType: '免单券',
      startDate: '2020-09-01',
      endDate: '2020-09-28',
      typeTxt: '全场通用免单券',
      isEnd: false, //是否即将过期
      isUse: true, //能否使用 true 能 false 不能
      isAct: false, //是否被选择
      money: 50
    }, {
      title: '订单满100-10元',
      btnType: '满减券',
      startDate: '2020-09-01',
      endDate: '2020-09-28',
      typeTxt: '满足一定金额可使用',
      isEnd: false, //是否即将过期
      isUse: false, //能否使用 true 能 false 不能
      isAct: false, //是否被选择
      money: 10
    }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  btnShowClick() {
    this.setData({
      isPopup: true
    });
  },
  //选择
  btnSelectClick(e){
    let {index} = e.currentTarget.dataset;
    _index = index;
    this.data.couponList.forEach((value,index)=>{
      value.isAct  = false;
    });
    this.data.couponList[_index].isAct = true;
    this.setData({
      couponList: this.data.couponList
    });
  },
  btnClosePopup() {
    this.setData({
      isPopup: false
    });
  },
  //确定
  btnSure(){
    this.setData({
      currentItem:this.data.couponList[_index]
    });
  }
})