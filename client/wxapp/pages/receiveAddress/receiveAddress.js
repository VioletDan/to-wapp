const app = getApp();
const { utils, icom, Toast } = app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList()
    .then(res => {
      // this.setData({
      //   addressList: res
      // })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //取出地址列表
    if (icom.storage('userAdressInfoList')){
      var userAdressInfoList = JSON.parse(icom.storage('userAdressInfoList'));
      // console.log(userAdressInfoList);
      this.setData({
        addressList: userAdressInfoList
      })
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取地址数据
  getAddressList() {
    return new Promise((resolve) => {
      const data = [{
        name: '将军',
        gender: 1,
        mobile: 17621399872,
        address: {
          name: '徐汇区日月光'
        },
        detail: '1099号19楼'
      }]

      resolve(data)
    })
  },
  // 跳转添加地址页面
  addAddress() {
    app.globalData.userEditorAdressInfo = null;
   wx.navigateTo({
      url: '/pages/addAddress/addAddress'
    })
  },
  //选中一个地址
  selectItemClick(e){
    // console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    app.globalData.userAdressInfo = this.data.addressList[index];
    wx.navigateBack({});
  },
  //编辑地址
  editorClick(e){
    var index = e.currentTarget.dataset.index;
    app.globalData.userEditorAdressInfo = this.data.addressList[index];
    app.globalData.userEditorAdressInfo.currentIndex = index;
    wx.navigateTo({
      url: '/pages/addAddress/addAddress',
    });
  }
})