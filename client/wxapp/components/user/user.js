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
    cumulativeIntegral: 1,
    userName: '',
    userImg: '/images/user/img.png',
  },

  lifetimes: {
    ready() {
      Router.regTabPage('user', this);
      // this.initData();
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
    }
  }
})