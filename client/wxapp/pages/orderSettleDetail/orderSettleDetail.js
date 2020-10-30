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
  imath,
  QRCode,
  rpx2px
} = app;
var $page = null;
var demandTime = null; //推单时间
var timer = null;//清除定时器
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(250);
let qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    userOrderinfo: {
      // 门店名称
      shopname: '定位中...',
      //备注
      remark: '无',
    },
    cardList: [],
    active: 0,
    tactive: true, //选中状态
    qrcodeWidth: qrcodeWidth,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    $page = this;
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
    let total = this.data.cardList.reduce((num, item) => {
      return (num += item.buyNum);
    }, 0);
    //商品总价
    let totalPrice = this.data.cardList.reduce((num, item) => {
      item.price = item.realPerPrice;
      // return (num += item.buyNum * item.price);
      return (num = imath.accAdd(num, item.buyNum * item.price));
    }, 0);
    totalPrice = imath.accAdd(totalPrice, this.data.userOrderinfo.boxCost);
    let allPrice = this.data.userOrderinfo.payMoney;
    //配送费
    let sendCost = this.data.userOrderinfo.sendCost;
    this.setData({
      selectInfo: {
        total,
        totalPrice,
        sendCost,
        allPrice,
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
      'userOrderinfo.state': 7,
      tactive: true
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
      //===========生成二维码
      if (res.data.state == 2 && res.data.sendType == 1) {
        this.addQCode(res.data.orderNo);
      }
      //===========生成二维码
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

      demandTime = res.data.createTime;

      if (res.data.state == 0 && res.data.payState == 0) {
        this.countDown();
      }else {
        if(timer) clearTimeout(timer);
        this.setData({
          countdown: '00:00'
        });
      }
    }
  },
  //生成二维码
  addQCode(text) {
    qrcode = new QRCode('myQrcode', {
      text: text,
      width: qrcodeWidth,
      height: qrcodeWidth,
      padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
    });
    qrcode.exportImage(function (path) {
      $page.setData({
        imgsrc: path
      });
    });
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
    this.setData({
      tactive: false
    });
    this.preOrderHandle();
  },
  //preOrderHandle
  preOrderHandle() {
    var that = this;
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
            that.getOrdersDetail(that.data.userOrderinfo.orderId);
            //订阅消息
            that.subscribeHandle();
          },
          'fail': function (res) {
            console.log("支付失败");
            icom.alert('支付失败');
            that.getOrdersDetail(that.data.userOrderinfo.orderId);
          }
        })
      }
    });
  },
  //处理订阅消息
  subscribeHandle() {
    var that = this;
    var templateArr = this.data.userOrderinfo.sendType == 1 ? app.data.signTemplateId_arr_zt : app.data.signTemplateId_arr_ps;
    wx.requestSubscribeMessage({
      tmplIds: templateArr,
      success(res) {
        console.log('res', res)
        let acceptTemplateIds = Object.keys(res).filter(key => res[key] === 'accept');
        if (acceptTemplateIds.length == templateArr.length) {
          //  说明全部同意
        } else {
          //  单次拒绝
        }
      },
      fail(err) {
        console.log('err', err);
        //失败
      }
    })
  },

  //再来一单
  btnPayAgainClick() {
    wx.reLaunch({
      url: '/pages/index/index?currentPageIndex=2',
    });
  },

  /**处理倒计时 */
  countDown() {
    var that = this;

    var start = new Date(demandTime.replace(/-/g, "/")).getTime();
    var endTime = start + 5 * 60000;

    var date = new Date(); //现在时间
    var now = date.getTime(); //现在时间戳

    var allTime = endTime - now;

    var m, s;
    if (allTime > 0) {
      m = Math.floor(allTime / 1000 / 60 % 60);
      s = Math.floor(allTime / 1000 % 60);
      that.setData({
        countdown: (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s),
      })
      timer = setTimeout(that.countDown, 1000);
    } else {
      console.log('已截止')
      that.setData({
        countdown: '00:00'
      });
      that.finished();
    }
  },



})