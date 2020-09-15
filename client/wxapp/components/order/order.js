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
let pageSize = 4;
let page = 1;
let isGet = true;
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
    scrollTop: 0,
    currentList: [], //当前订单
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
    initData() {
      page = 1;
      isGet = true;
      this.setData({
        active: 0,
        scrollTop: 0,
        currentList: [],
        historyList: []
      });
      this.getOrderList(0);
    },
    onChange(event) {
      isGet = true;
      page = 1;
      this.setData({
        active: event.detail.name,
        scrollTop: 0,
        currentList: [],
        historyList: []
      });
      this.getOrderList(this.data.active)
    },

    async getOrderList(active) {
      if (active == 1) {
        return
      }
      icom.loading();
      let res = await API.getOrderList({
        size: pageSize,
        current: page
      });
      let currentList = this.data.currentList;
      icom.loadingHide();
      if (res.data.records.length === 0) {
        wx.showToast({
          title: '没有更多数据',
          icon: 'none'
        })
        isGet = false;
      } else {
        res.data.records.forEach((item, index) => {
          currentList.push(item);
        });
        this.setData({
          currentList: currentList
        })
        console.log(this.data.currentList);
        icom.fadeList(this, 'currentList', currentList, '.scrollView', '.li');
      }
    },
    /**拉到底部加载更多 */
    scrolltolower(e) {
      if (isGet && this.data.active == 0) {
        page++
        this.getOrderList(this.data.active);
      }
    },
    //再来一单
    btnOrderAgain() {
      Router.toHome();
    },
    //查看订单详情
    checkDetailClick(e) {
      let {
        item
      } = e.currentTarget.dataset;
      console.log(item);
      app.data.userCurrentOrderDetail = item;
      wx.navigateTo({
        url: '/pages/orderSettleDetail/orderSettleDetail?orderId='+ item.orderId,
      })

    }
  },
});