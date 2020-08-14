// components/footer/footer.js
// import regeneratorRuntime from '../../common/js/plugs/regeneratorRuntime';
const app = getApp();
const { API, beats, icom, config, mta, regeneratorRuntime, promisify, Router } = app;
let currentNum = 0;
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
    showAuth: false, //授权
    getInfo: 'getNumber',
    active: 0,
    list: [
      {
        id: 1,
        name: '首页',
        icon: '/images/tabBar/icon1.png',
        iconActive: '/images/tabBar/icon1_act.png',
        url: '/pages/home/home'
      },
      {
        id: 2,
        name: '订单',
        icon: '/images/tabBar/icon2.png',
        iconActive: '/images/tabBar/icon2_act.png',
        url: '/pages/order/order'
      },
      {
        id: 3,
        name: '我的',
        icon: '/images/tabBar/icon3.png',
        iconActive: '/images/tabBar/icon3_act.png',
        url: '/pages/order/order'
      }],
  },

  lifetimes: {
    ready() {
      Router.regTabPage('footer', this);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //========= Public =========
    async updateActive(value) {
      this.setData({ active: value });
      this.triggerEvent('navChange', value);
    },

    //=========== Event ============
    itemClick(e) {
      let { index } = e.currentTarget.dataset;
      currentNum = index;
      if (index != this.data.active){
        this.toUrl(index);
      }
      
    },
    toUrl(index){
      switch (index) {
        case 0:
          Router.toHome();
          break;
        case 1:
          Router.toOrder();
          break;
        case 2:
          Router.toUser();
          break;
      }
    }
  }
})
