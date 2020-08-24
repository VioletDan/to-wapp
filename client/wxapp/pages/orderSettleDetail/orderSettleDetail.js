const app = getApp();
const {
  API,
  beats,
  icom,
  config,
  mta,
  regeneratorRuntime,
  promisify,
  Router,
} = app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    time: 1 * 60 * 1000, //倒计时
    userOrderinfo: {
      // 门店名称
      commercialName: '定位中。。。',
      //备注
      remarksTxt: '无'
    },
    cardList: [],
    preOrderObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.orderId) {
      this.getOrdersDetail(options.orderId);
    } else {
      var _cardList = app.data.preOrderObj.orderFood;
      console.log('preOrderObj========', app.data.preOrderObj);
      console.log('_cardList=======', _cardList);
      this.setData({
        'userOrderinfo.needwaitTimePrecent': parseInt(this.data.userOrderinfo.userBeforeNum / this.data.userOrderinfo.userAllNum * 100),
        'userOrderinfo.remarksTxt': app.data.preOrderObj.order.remark,
        cardList: _cardList,
        appData: app.data,
        preOrderObj: app.data.preOrderObj ? app.data.preOrderObj : {}
      });
      this.initCar();
    }

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
  initCar(flag) {
    const total = this.data.cardList.reduce((num, item) => {
      return (num += item.buyNum);
    }, 0);
    const totalPrice = this.data.cardList.reduce((num, item) => {
      item.price = item.realPerPrice;
      return (num += item.buyNum * item.price);
    }, 0);

    if (flag) {
      let boxCost = 0;
      let sendCost = 0;
      let allPrice = this.data.preOrderObj.totalMoney;
      this.setData({
        selectInfo: {
          total,
          allPrice
        }
      });
    } else {
      let boxCost = 0;
      if (app.data.ShopInfo.boxType == 1) {
        boxCost = app.data.ShopInfo.boxCost;
      } else {
        boxCost = this.data.cardList.reduce((num, item) => {
          return (num += item.buyNum * item.packageFee);
        }, 0);
      }
      let sendCost = this.data.checked ? app.data.ShopInfo.sendCost : 0;
      let allPrice = app.data.preOrderObj.order.totalMoney;
      this.setData({
        selectInfo: {
          total,
          totalPrice,
          boxCost,
          sendCost,
          allPrice
        },
        "userOrderinfo.commercialName": app.data.shopInfo.commercialName, // 设置门店信息
        "userOrderinfo.commercialDesc": app.data.shopInfo.commercialDesc,
        "userOrderinfo.commercialAddress": app.data.shopInfo.commercialAddress,
      });
    }


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

  //获取订单详情
  async getOrdersDetail(orderId) {
    let res = await API.getOrderListDetail({
      orderId: orderId
    });
    if (res.code == 200) {
      var _cardList = res.data.orderFoodList;
      this.setData({
        preOrderObj: res.data,
        'userOrderinfo.remarksTxt': res.data.remark,
        cardList: _cardList,
        appData: app.data,
      });
      this.initCar(true);
    }
  }
})