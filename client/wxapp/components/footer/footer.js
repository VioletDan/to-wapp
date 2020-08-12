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
        name: '沉浸探店',
        icon: '/images/tabBar/icon1.png',
        iconActive: '/images/tabBar/icon1.png',
        url: '/pages/index/index'
      },
      {
        id: 2,
        name: '私人礼订',
        icon: '/images/tabBar/icon2.png',
        iconActive: '/images/tabBar/icon2.png',
        url: '/pages/customized/customized'
      },
      {
        id: 3,
        name: '预约体验',
        icon: '/images/tabBar/icon3.png',
        iconActive: '/images/tabBar/icon3.png',
        url: '/pages/order/order'
      },
      {
        id: 4,
        name: '限定礼遇',
        icon: '/images/tabBar/icon4.png',
        iconActive: '/images/tabBar/icon4.png',
        url: '/pages/gift/gift'
      },
      {
        id: 5,
        name: '个人中心',
        icon: '/images/tabBar/icon5.png',
        iconActive: '/images/tabBar/icon4.png',
        url: '/pages/personal/personal'
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
      wx.showLoading({
        title: '',
      });
      //更新用户数据
      let res2 = await API.GetUserInfo({});
      wx.hideLoading();
      app.data.userMsg = res2.data;
      if (res2.data.mobile == '') {
        app.data.Flag_Phone = 0;
      } else {
        app.data.Flag_Phone = 1;
      }
    },

    //=========== Event ============
    itemClick(e) {
      let { index } = e.currentTarget.dataset;
      currentNum = index;
      if (index != this.data.active){
        this.toUrl(index);
        return
        if (app.data.Flag_Phone == 0) {
          this.setData({ showAuth: true, getInfo: 'getNumber' })
        } else {
          this.toUrl(index);
        }
      }
      
    },
    // 取消授权
    onAuthCancle(e) {
      console.log(e.detail);
      //===================测试
      this.toUrl(currentNum);
    },
    // 拿到授权
    onAuthSure(e) {
      console.log(e.detail);
      this.toUrl(currentNum);
    },
    toUrl(index){
      switch (index) {
        case 0:
          wx.redirectTo({
            url: '/pages/web/web',
          });
          Router.toHome();
          mta.Event.stat("footer_btn_go_shop");
          break;
        case 1:
          Router.toCustomized();
          mta.Event.stat("footer_btn_go_customized");
          break;
        case 2:
          Router.toOrder();
          mta.Event.stat("footer_btn_go_order");
          break;
        case 3:
            Router.toGift();
            mta.Event.stat("footer_btn_go_gift");
            break;
        case 4:
          Router.toPersonal();
          mta.Event.stat("footer_btn_go_personal");
          break;
      }
    }
  }
})
