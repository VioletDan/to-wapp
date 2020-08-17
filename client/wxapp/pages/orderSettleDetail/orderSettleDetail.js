const app = getApp();
const {
  beats,
  iuser,
  icom,
  utils,
  Toast,
} = app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    time: 1 * 60 * 1000,//倒计时
    userOrderinfo:{
      // 门店名称
      commercialName: '定位中。。。',
       //备注
       remarksTxt: '无'
    },
    cardList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _cardList = icom.storage('cardList') ? JSON.parse(icom.storage('cardList')) : [];
    this.setData({
      'userOrderinfo.needwaitTimePrecent': parseInt(this.data.userOrderinfo.userBeforeNum / this.data.userOrderinfo.userAllNum * 100),
      cardList: _cardList,
      appData: app.data
    });
    this.initCar();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  /**初始化结算页数据 */
  initCar() {
    const total = this.data.cardList.reduce((num, item) => {
      return num += item.num
    }, 0)
    const totalPrice = this.data.cardList.reduce((num, item) => {
      return num += item.num * item.price
    }, 0)
    this.setData({
      selectInfo: {
        total,
        totalPrice,
      },
      'userOrderinfo.commercialName': app.data.shopInfo.commercialName, // 设置门店信息
      'userOrderinfo.commercialDesc': app.data.shopInfo.commercialDesc,
      'userOrderinfo.commercialAddress': app.data.shopInfo.commercialAddress,
    });
  },
  //展示商品
  showCardListClick() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  finished() {
    icom.sign('订单取消');
  },
})