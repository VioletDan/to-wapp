// components/order/order.js
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
//测试
var _cardList = icom.storage("cardList") || [];
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    cumulativeIntegral: 1,
    active: 0,
    currentList: [
      {
        orderType: 1, //1自取 2外卖
        proList: _cardList,
        oderStatus: 1, //1制作中 2已完成 3 已送达 4已取消
        orderNumber: "021023202005272003204560", //订单编号
        orderTime: "2020-05-27 20:03:20", //下单时间
        storeName: "徐汇区日月光1号",
        totalPrize: 180,
      },
      {
        orderType: 2, //1自取 2外卖
        proList: _cardList,
        oderStatus: 2, //1制作中 2已完成 3 已送达 4已取消
        orderNumber: "021023202005272003204560", //订单编号
        orderTime: "2020-05-27 20:03:20", //下单时间
        storeName: "徐汇区日月光2号",
        totalPrize: 123,
      },
      {
        orderType: 1, //1自取 2外卖
        proList: _cardList,
        oderStatus: 3, //1制作中 2已完成 3 已送达 4已取消
        orderNumber: "021023202005272003204560", //订单编号
        orderTime: "2020-05-27 20:03:20", //下单时间
        storeName: "徐汇区日月光3号",
        totalPrize: 130,
      },
      {
        orderType: 2, //1自取 2外卖
        proList: _cardList,
        oderStatus: 4, //1制作中 2已完成 3 已送达 4已取消
        orderNumber: "021023202005272003204560", //订单编号
        orderTime: "2020-05-27 20:03:20", //下单时间
        storeName: "徐汇区日月光4号",
        totalPrize: 80,
      },
      {
        orderType: 2, //1自取 2外卖
        proList: _cardList,
        oderStatus: 1, //1制作中 2已完成 3 已送达 4已取消
        orderNumber: "021023202005272003204560", //订单编号
        orderTime: "2020-05-27 20:03:20", //下单时间
        storeName: "徐汇区日月光4号",
        totalPrize: 80,
      },
    ], //当前订单
    historyList: [], //历史订单
  },

  lifetimes: {
    ready() {
      Router.regTabPage("order", this);
      // this.initData();
    },
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
      console.log("order udpate");
      this.initData();
    },

    //========== Private ===========
    initData() {},
    onChange(event) {
      this.setData({
        active: event.detail.name,
      });
      // wx.showToast({
      //   title: `切换到标签 ${event.detail.name}`,
      //   icon: 'none',
      // });
    },
  },
});
