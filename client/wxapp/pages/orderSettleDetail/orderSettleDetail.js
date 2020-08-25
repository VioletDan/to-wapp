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
      shopname: '定位中。。。',
      //备注
      remark: '无'
    },
    cardList: [],
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.orderId) {
      this.getOrdersDetail(options.orderId);
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
  initCar() {
    const total = this.data.cardList.reduce((num, item) => {
      return (num += item.buyNum);
    }, 0);
    const totalPrice = this.data.cardList.reduce((num, item) => {
      item.price = item.realPerPrice;
      return (num += item.buyNum * item.price);
    }, 0);
    let allPrice = this.data.userOrderinfo.totalMoney;
    //商品总价
    let shopAllPrice = (allPrice - this.data.userOrderinfo.sendCost).toFixed(2);
    this.setData({
      selectInfo: {
        total,
        allPrice,
        shopAllPrice
      }
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
    this.setData({
      'userOrderinfo.state': 7
    });
  },

  //获取订单详情
  async getOrdersDetail(orderId) {
    icom.loading();
    let res = await API.getOrderListDetail({
      orderId: orderId
    });
    icom.loadingHide();
    if (res.code == 200) {
      var _cardList = res.data.orderFoodList;
      if (res.data.orderProcessList.length == 0) {
        res.data.orderProcessList = [{
          text: '',
          desc: '暂无信息'
        }]
      } else {
        res.data.orderProcessList.reverse().map((v, index) => {
          v.text = '';
          v.desc = app.data.orderProcessListDesc[v.orderStatus]
        });
      }

      this.setData({
        userOrderinfo: res.data,
        'userOrderinfo.commercialName': res.data.shopname,
        'userOrderinfo.remarksTxt': res.data.remark,
        cardList: _cardList,
        appData: app.data,
        active: res.data.orderProcessList.length - 1
      });
      this.initCar();
    }
  },

  //拨打电话
  makePhoneCallClick(e) {
    let {
      phone
    } = e.currentTarget.dataset;
    console.log(phone);
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },

  //支付
  btnPaymentClick() {
    API.payOrder({
      'orderId': this.data.userOrderinfo.orderId,
      'orderNo': this.data.userOrderinfo.orderNo
    }).then((res) => {
      icom.loadingHide();
      if (res) {
        //==========调起支付接口
        var timeStamp = res.data.timeStamp;
        var nonceStr = res.data.nonceStr;
        var package_id = res.data.package;
        var signType = res.data.signType;
        var paySign = res.data.paySign;
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': package_id,
          'signType': signType,
          'paySign': paySign,
          'success': function (res) {
            console.log("支付成功");
            this.getOrdersDetail(this.data.userOrderinfo.orderId);
          },
          'fail': function (res) {
            console.log("支付失败");
            icom.alert('支付失败');
            this.getOrdersDetail(this.data.userOrderinfo.orderId);
          }
        })
      }
    });
  },
})