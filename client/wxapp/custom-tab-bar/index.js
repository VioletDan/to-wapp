const app = getApp();
Component({
  data: {
    show:false,
    selected: 0,
    color: "#e8c892",
    selectedColor: "#e8c892",
    backgroundColor: "#001445",
    list: [{
      pagePath: "/pages/index/index",
      text: "探店",
      iconPath: "../images/tabBar/icon1.png",
      selectedIconPath: "../images/tabBar/icon1.png"
    },
      {
        pagePath: "/pages/customized/customized",
        text: "私人定制",
        iconPath: "../images/tabBar/icon2.png",
        selectedIconPath: "../images/tabBar/icon2.png"
      },
      {
        pagePath: "/pages/order/order",
        text: "预约体验",
        iconPath: "../images/tabBar/icon3.png",
        selectedIconPath: "../images/tabBar/icon3.png"
      },
      {
        pagePath: "/pages/personal/personal",
        text: "个人中心",
        iconPath: "../images/tabBar/icon4.png",
        selectedIconPath: "../images/tabBar/icon4.png"
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      let pages = getCurrentPages();
      let page = pages[pages.length - 1];
      if (data.index == page.data.currentPageIndex){
        return
      }
      app.data.froms = '';
      wx.switchTab({url});
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})