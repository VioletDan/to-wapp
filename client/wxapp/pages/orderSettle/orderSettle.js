const app = getApp();
const {
  beats,
  iuser,
  icom,
  utils,
  Toast,
  API
} = app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    userOrderinfo: {
      // 门店名称
      commercialName: '定位中。。。',
      // 门店描述
      commercialDesc: '',
      //门店地址
      commercialAddress: '',
      // 当前距离
      distance: 0.0,
      //手机号
      userTel: 18856856168,
      //前面还有多少单
      userBeforeNum: 1,
      //总共多少单
      userAllNum: 1,
      //还需等待多长时间
      needwaitTime: '1分钟',
      //等待时间百分比
      needwaitTimePrecent: 0,
      //食品类型
      userFoodType: 2, //1 代表冰淇淋/鲜食等产品 2 代表饮品,
      //优惠券数量
      userCouponNum: 0,
      //外卖配送费
      userRunMoney: 6,
      //备注
      remarksTxt: '无'
    },
    cardList: [],
    //购物车商品详情
    selectInfo: {},
    //用户地址
    userAdressInfo: {
      username: '',
      gender: 1,
      mobile: '',
      address: '',
      street: '',
      defaultAddress: 1, //1未选中 2 选中
      isDefault: false
    }
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
    if (app.data.userAdressInfo && this.data.checked) {
      this.setData({
        userAdressInfo: app.data.userAdressInfo
      });
      console.log(app.data.userAdressInfo)
    }
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
    //轻提示
    icom.sign(`请确认下单,门店是否为「${app.data.shopInfo.commercialName}店」`);
  },
  // switch
  changeChecked(e) {
    this.setData({
      checked: e.detail,
    })
    if (e.detail) {
      // 跳转到收货地址页面
      wx.navigateTo({
        url: '/pages/receiveAddress/receiveAddress',
      })
    }
  },
  goReceiveAddress() {
    // 跳转到收货地址页面
    wx.navigateTo({
      url: '/pages/receiveAddress/receiveAddress',
    })
  },
  goStoreList() {
    wx.navigateTo({
      url: '/pages/store/store',
    })
  },
  //手机号逻辑
  async getPhoneNumber(e) {
    let res = await beats.member.getPhoneNumber(e.detail);
    if (res.data.mobile) {
      this.setData({
        'userOrderinfo.userTel': res.data.mobile
      })
    }
  },
  //支付
  btnPaymentClick() {
    // icom.alert('敬请期待');
    icom.loading();
    //支付
    var obj1 = {
      "orderId": 1,
      "orderNo": "1290540786663952384"
    };
    //预下单
    var obj = {
      "orderDto": {
        "sendType": 2,
        "boxCost": 2.7,
        "sendCost": 3,
        "totalMoney": 52.7,
        "discountMoney": 0,
        "payMoney": 52.7,
        "payWay": 1,
        "remark": "加点孜然，谢谢！",
        "tableware": -1
      },
      "orderFoodDtoList": [{
        "foodId": 1,
        "foodSpecsId": 1,
        "foodProperties": "不辣-正常香菜-不放蒜-正常炸",
        "buyNum": 1
      }, {
        "foodId": 3,
        "foodSpecsId": 4,
        "foodProperties": "",
        "buyNum": 1
      }],
      "userAddressId": 3
    };
    API.payOrder(obj1).then(res => {
      icom.loadingHide();
      if (res) {
        app.data.perOrder = true;
        wx.removeStorageSync('cardList');
        wx.redirectTo({
          url: '/pages/orderSettleDetail/orderSettleDetail',
        })
      }
    });
    return
    API.preOrder(obj).then(res => {
      icom.loadingHide();
      if (res) {
        app.data.perOrder = true;
        wx.removeStorageSync('cardList');
        wx.redirectTo({
          url: '/pages/orderSettleDetail/orderSettleDetail',
        })
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
})