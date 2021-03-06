// components/user/user.js
const app = getApp()
const {
  API,
  beats,
  icom,
  config,
  mta,
  regeneratorRuntime,
  promisify,
  Router
} = app;

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isPopup: false,
    cumulativeIntegral: 1,
    userName: '',
    userImg: '/images/user/img.png',
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
    }]
  },

  lifetimes: {
    ready() {
      Router.regTabPage('user', this);
      this.initData();
    }
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      // setTimeout(() => {
      //   this.updateData();
      // }, 200)
    },
    hide: function () {},
    resize: function () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //========== Public ===========
    updateData() {
      //这里是外部调用的方法 如果要刷新数据的话在这里执行
      console.log('user udpate');
      this.initData();
    },

    //========== Private ===========
    initData() {
      this.setData({
        appData: app.data
      });
      this.getUserInfo();
    },
    getUserInfo() {
      if (this.userInfo) {
        app.data.Flag_Info = 1;
        this.setData({
          userInfo: this.userInfo,
          userImg: this.userInfo.avatarUrl,
          userName: this.userInfo.nickName,
          appData: app.data
        });
      } //edn if
      else {
        wx.getUserInfo({
          success: (res) => {
            this.parse(res);
          },
          fail: () => {}
        });
      } //end else
    },
    //授权
    getAuth(e) {
      let {
        auth
      } = e.currentTarget.dataset;
      if (!e.detail.encryptedData) {

      } else {
        this.parse(e.detail);
      }
    },
    //解析
    parse(data) {
      this.encryptedData = data.encryptedData;
      this.iv = data.iv;
      this.rawData = data.rawData;
      this.signature = data.signature;
      this.userInfo = data.userInfo;
      // console.log('user info', this.userInfo);
      app.data.Flag_Info = 1;
      this.setData({
        userInfo: this.userInfo,
        userImg: this.userInfo.avatarUrl,
        userName: this.userInfo.nickName,
        appData: app.data
      });
    },
    //我的订单
    goUserOrder(){
      Router.toOrder();
    },
    //查看所有订单
    goUserAllOrder(){
      Router.toOrder();
    },
    //立即点单
    btnGoOrder(){
      Router.toHome();
    },
    //优惠券
    goUserCoupon() {
      wx.navigateTo({
        url: '/pages/userCoupon/userCoupon?boxType=1',
      })
    },
    //查看详情
    btnShowClick() {
      this.setData({
        isPopup: true
      });
    },
    btnClosePopup() {
      this.setData({
        isPopup: false
      });
    },
  }
})