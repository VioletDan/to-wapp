const app = getApp();
const {
  API,
  utils,
  icom,
  Toast
} = app;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    appData: app.data,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //取出地址列表
    setTimeout(() => {
      this.getAddressList();
    }, 200)
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
  // 获取地址数据
  getAddressList() {
    icom.loading();
    //获取用户的地址列表
    API.GetUserAdressList({}).then((res) => {
      icom.loadingHide();
      if (res.data.length > 0) {
        this.setData({
          addressList: res.data,
        });
      }
    });
  },
  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    console.log(event);
    let index = Number(event.currentTarget.dataset.index);
    console.log(event);
    switch (position) {
      case "right":
        icom.dilaog({
            title: "确定删除吗？",
          },
          (res) => {
            if (res.confirm) {
              icom.loading();
              API.DeletUserAdress({
                id: this.data.addressList[index].id,
              }).then((res) => {
                if (res) {
                  icom.loadingHide();
                  this.setData({
                    apptList: [], // 已预约列表
                    scrollTop: 0
                  })
                  this.getAddressList();
                  instance.close();
                }
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
              instance.close();
            }
          }
        );
        break;
    }
  },
  // 跳转添加地址页面
  addAddress() {
    app.data.userEditorAdressInfo = null;
    wx.navigateTo({
      url: "/pages/addAddress/addAddress",
    });
  },
  //选中一个地址
  selectItemClick(e) {
    // console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    //监测是否支持配送
    app.checkdistance({
      latitude: this.data.addressList[index].latitude,
      longitude: this.data.addressList[index].longitude
    }, (res) => {
      if (res) {
        if (app.data.wechatInfo) app.data.wechatInfo = null;
        app.data.userAdressInfo = this.data.addressList[index];
        app.data.userCurrentDis.userCurrentLat = this.data.addressList[index].latitude;
        app.data.userCurrentDis.userCurrentLon = this.data.addressList[index].longitude;
        wx.navigateBack({});
      }
    });
  },
  //编辑地址
  editorClick(e) {
    var index = e.currentTarget.dataset.index;
    app.data.userEditorAdressInfo = this.data.addressList[index];
    app.data.userEditorAdressInfo.currentIndex = index;
    wx.navigateTo({
      url: "/pages/addAddress/addAddress",
    });
  },
  //微信导入地址
  addAddressWechat() {
    wx.chooseAddress({
      success: (res) => {
        // console.log(res);
        if (app.data.userEditorAdressInfo) app.data.userEditorAdressInfo = null;
        app.data.wechatInfo = res;
        var addressTxt = res.provinceName + res.cityName + res.countyName + res.detailInfo;
        app.data.wechatInfo.name = res.userName;
        app.data.wechatInfo.phone = res.telNumber;
        app.data.wechatInfo.address = res.provinceName + res.cityName + res.countyName; //具体地址
        app.data.wechatInfo.addressName = res.provinceName + res.cityName + res.countyName; //页面显示选择的部分地址
        app.data.wechatInfo.adressHouseNum = res.detailInfo; //门牌号
        app.data.wechatInfo.name = res.userName;
        //根据地址取经纬度
        utils.getLatAndLong(addressTxt, (res) => {
          app.data.wechatInfo.latitude = res.lat;
          app.data.wechatInfo.longitude = res.lng;
          wx.navigateTo({
            url: "/pages/addAddress/addAddress",
          });
        });
      }
    });
  }
});