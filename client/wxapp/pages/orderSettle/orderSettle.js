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
    show: false,
    checked: app.data.checked, // 配送类型 1自提，2配送
    isOrderBox: true,
    userOrderinfo: {
      // 门店名称
      commercialName: "定位中。。。",
      // 门店描述
      commercialDesc: "",
      //门店地址
      commercialAddress: "",
      // 当前距离
      distance: 0.0,
      //手机号
      userTel: 18856856168,
      //前面还有多少单
      userBeforeNum: 1,
      //总共多少单
      userAllNum: 1,
      //还需等待多长时间
      needwaitTime: "1分钟",
      //等待时间百分比
      needwaitTimePrecent: 0,
      //食品类型
      userFoodType: 2, //1 代表冰淇淋/鲜食等产品 2 代表饮品,
      //优惠券数量
      userCouponNum: 0,
      //外卖配送费
      userRunMoney: 6,
      //备注
      remarksTxt: "无",
    },
    cardList: [],
    //购物车商品详情
    selectInfo: {},
    //用户地址
    userAdressInfo: {
      username: "",
      gender: 1,
      mobile: "",
      address: "",
      street: "",
      defaultAddress: 1, //1未选中 2 选中
      isDefault: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _cardList = icom.storage("cardList") || [];
    this.setData({
      "userOrderinfo.needwaitTimePrecent": parseInt(
        (this.data.userOrderinfo.userBeforeNum /
          this.data.userOrderinfo.userAllNum) *
        100
      ),
      cardList: _cardList,
      appData: app.data,
      checked: app.data.checked,
      appData: app.data
    });
    this.initCar();
    if (app.data.userAdressInfo && this.data.checked) this.checkdistance();
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
        userAdressInfo: app.data.userAdressInfo,
        checked: app.data.checked
      });
      this.initCar();
      this.checkdistance();
      console.log(app.data.userAdressInfo);
    }
    this.setData({
      "userOrderinfo.remarksTxt": app.data.remarksTxt || '无',
    });
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
      // return (num += item.buyNum * item.price);
      return (num = imath.accAdd(num, item.buyNum * item.price));
    }, 0);
    let boxCost = 0;
    if (app.data.ShopInfo.boxType == 1) {
      boxCost = app.data.ShopInfo.boxCost;
    } else {
      boxCost = this.data.cardList.reduce((num, item) => {
        // return (num += item.buyNum * item.packageFee);
        return (num = imath.accAdd(num, item.buyNum * item.packageFee));
      }, 0);
    }

    let sendCost = this.data.checked ? app.data.ShopInfo.sendCost : 0;

    let allPrice = imath.accAdd(imath.accAdd(totalPrice, boxCost), sendCost);

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
    //轻提示
    icom.sign(`请确认下单,门店是否为「${app.data.shopInfo.commercialName}店」`);
  },
  // switch
  typeClick(e) {
    console.log(e)
    let {
      checked
    } = e.currentTarget.dataset;
    let _checked = JSON.parse(checked);
    app.data.checked = _checked;
    this.setData({
      checked: _checked,
    });
    if (_checked) {
      // 跳转到收货地址页面
      wx.navigateTo({
        url: "/pages/receiveAddress/receiveAddress",
      });
    }
  },
  changeChecked(e) {
    app.data.checked = e.detail
    this.setData({
      checked: e.detail,
    });
    if (e.detail) {
      // 跳转到收货地址页面
      wx.navigateTo({
        url: "/pages/receiveAddress/receiveAddress",
      });
    }
  },
  goReceiveAddress() {
    // 跳转到收货地址页面
    wx.navigateTo({
      url: "/pages/receiveAddress/receiveAddress",
    });
  },
  goStoreList() {
    // wx.navigateTo({
    //   url: "/pages/shops/shops",
    // });
  },
  //手机号逻辑
  async getPhoneNumber(e) {
    let res = await beats.member.getPhoneNumber(e.detail);
    if (res && res.data.mobile) {
      this.setData({
        "userOrderinfo.userTel": res.data.mobile,
      });
    }
  },
  /**
   * 餐盒费:餐盒费有两种，一种固定的，一种是根据餐品来，
      boxType：
      1:订单收费,如果按订单收费价格为：boxCost字段，固定的费用
      2:商品收费，根据商品属性里的packageFee字段相加得到的费用，每增加一份就要加一个对应属性的餐盒费
      2.配送费:店铺信息里的配送费字段sendCost
      3.商品费:（商品属性里的realPerPrice*数量）有多个就要相加
      4.总价=商品费+配送费+餐盒费
   */
  //支付
  btnPaymentClick() {
    // icom.alert('敬请期待');
    var that = this;
    if (!app.data.userAdressInfo && this.data.checked) {
      icom.alert('请选择地址');
      return;
    }
    this.subscribeHandle();

  },
  //预下单
  preOrderHandle() {
    icom.loading();
    const {
      totalPrice,
      boxCost,
      sendCost,
      allPrice
    } = this.data.selectInfo;
    //预下单
    var obj = {
      orderDto: {
        sendType: this.data.checked ? 2 : 1, // 配送类型，1自提，2配送
        boxCost: boxCost, // 餐盒费，（如果按订单收费就是店铺信息里固定的费餐盒费，如果按商品收费就要取每个商品属性里的餐盒费相加）
        sendCost: sendCost, // 配送费，自提没有，配送有，
        totalMoney: allPrice, // 总费用，最下面有介绍，看下面
        discountMoney: 0, // 折扣费用，暂无
        payMoney: allPrice, // 支付的费用
        payWay: 1, // 支付方式，目前为1是微信支付
        remark: this.data.userOrderinfo.remarksTxt, // 备注
        tableware: -1, // 餐具，-1为按订单来，0不需要，大于0的为具体数量，默认-1
      },
      orderFoodDtoList: this.data.cardList,
      userAddressId: this.data.checked ? app.data.userAdressInfo.id : null, // 如果是配送的此值为用户填写的地址id，配送必填
    };
    console.log('预下单=======', obj)
    API.preOrder(obj).then((res) => {
      icom.loadingHide();
      if (res) {
        console.log("res", res);
        app.data.preOrderObj = res.data;
        API.payOrder(res.data.order).then((res) => {
          icom.loadingHide();
          if (res) {
            // app.data.perOrder = true;
            // wx.removeStorageSync("cardList");
            // wx.redirectTo({
            //   url: "/pages/orderSettleDetail/orderSettleDetail",
            // });
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
                wx.removeStorageSync("cardList");
                wx.redirectTo({
                  url: '/pages/orderSettleDetail/orderSettleDetail?orderId=' + app.data.preOrderObj.order.orderId,
                });
                //去掉备注
                app.data.remarksTxt = null;
              },
              'fail': function (res) {
                console.log("支付失败");
                icom.alert('支付失败');
                wx.removeStorageSync("cardList");
                wx.redirectTo({
                  url: '/pages/orderSettleDetail/orderSettleDetail?orderId=' + app.data.preOrderObj.order.orderId,
                });
                //去掉备注
                app.data.remarksTxt = null;
              }
            })
          }
        });
      }
    });
  },
  //处理订阅消息
  subscribeHandle() {
    var that = this;
    var templateArr = this.data.checked ? app.data.signTemplateId_arr_ps : app.data.signTemplateId_arr_zt;
    wx.requestSubscribeMessage({
      tmplIds: templateArr,
      success(res) {
        console.log('res', res)
        let acceptTemplateIds = Object.keys(res).filter(key => res[key] === 'accept');
        if (acceptTemplateIds.length == templateArr.length) {
          //  说明全部同意
          that.preOrderHandle();
        } else {
          //  单次拒绝
          that.preOrderHandle();
          return;
        }
      },
      fail(err) {
        console.log('err', err);
        //失败
        that.preOrderHandle();
      }
    })
  },
  //展示商品
  showCardListClick() {
    this.setData({
      show: true,
    });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  /**监测是否支持配送 */
  checkdistance() {
    app.checkdistance({
      latitude: app.data.userCurrentDis.userCurrentLat,
      longitude: app.data.userCurrentDis.userCurrentLon
    }, (res) => {
      console.log(res)
      if (res) {
        this.setData({
          isOrderBox: true
        })
      } else {
        this.setData({
          isOrderBox: false
        });
      }
    });
  },
  /**备注 */
  btnRemarksBoxClick() {
    wx.navigateTo({
      url: '/pages/remark/remark',
    });
  }
});