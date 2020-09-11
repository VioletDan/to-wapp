// pages/remark/remark.js
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarksTxt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      appData: app.data,
      remarksTxt:app.data.remarksTxt || ''
    });
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
  bindFormSubmit(e) {
    this.setData({
      remarksTxt: e.detail.value.textarea
    });
    if (this.data.remarksTxt == '') {
      icom.alert('请输入订单备注');
      return
    }
    console.log('remarksTxt', this.data.remarksTxt);
    app.data.remarksTxt = this.data.remarksTxt;
    wx.navigateBack({
      delta: 0,
    });
  }
})