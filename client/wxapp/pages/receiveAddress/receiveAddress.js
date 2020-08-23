const app = getApp();
const { API, utils, icom, Toast } = app;
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
    if (app.data.addressListTitle) {
      this.getAddressList();
    }
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
    const { position, instance } = event.detail;
    console.log(event);
    let index = Number(event.currentTarget.dataset.index);
    console.log(event);
    switch (position) {
      case "right":
        icom.dilaog(
          {
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
                  var _addressList = [];
                  if (index == 0) {
                    _addressList = [];
                  } else {
                    _addressList = this.data.addressList.splice(index, 1);
                  }
                  this.setData({
                    addressList: _addressList,
                  });
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
    app.data.userAdressInfo = this.data.addressList[index];
    wx.navigateBack({});
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
});
