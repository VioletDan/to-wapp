// components/user/user.js
const app = getApp()
const { API, beats, icom, config, mta, regeneratorRuntime, promisify, Router } = app;

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
    hide: function () { },
    resize: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //========== Public ===========
    updateData() {
      //这里是外部调用的方法 如果要刷新数据的话在这里执行
      console.log('user udpate');
      this.initData() ;
    },
   
    //========== Private ===========
    initData() {
    },
  }
})
