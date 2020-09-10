const app = getApp();
const { utils, icom } = app;

Page({

  data: {
    scale: 16,
    markers: [{
      iconPath: '/images/common/icon_write.png',
      latitude: null,
      longitude: null,
      width: 25,
      height: 25
    }],
    poisList: [],
    nearByAddressList: [],
    showSearch: false,
    searchValue: undefined,
  },
  // regionchange(e) {
  //   console.log(e.type)
  // },
  // markertap(e) {
  // },
  // controltap(e) {
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lastAddress = icom.storage('LastAddress')
    this.getAddressList(lastAddress);
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
  getAddressList(lastAddress) {    
    if (lastAddress) {
      lastAddress = JSON.parse(lastAddress)

      this.getAddressApi(lastAddress)
    }
  },
  getAddressApi(lastAddress) {
    const _this = this;
    utils.getNearByAddressList(lastAddress, (res) => {
      const {lat, lng} = res.result.pois[0].location
      _this.setData({
        poisList:res.result.pois,
        markers: [{
          ..._this.data.markers[0],
          latitude: lat,
          longitude: lng,
          id: res.result.pois[0].id,
          title: res.result.pois[0].title,
          address:res.result.pois[0].address,
          category:res.result.pois[0].category,
        }]
      })
    })
  },
  selectAddress(e) {
    const { id, location, title,address,category} = e.currentTarget.dataset.item;
    const markers = [{
      ...this.data.markers[0],
      latitude: location.lat,
      longitude: location.lng,
      id,
      title,
      address,
      category
    }]

    this.setData({
      markers
    })
  },
  focusSearch() {
    this.setData({
      searchValue: '',
      nearByAddressList: [],
      showSearch: true
    })
  },
  closePopup() {
    this.setData({
      showSearch: false
    })
  },
  onSearch(e) {
    const _this = this;
    utils.getNearByAddressListThroughKeyword(e.detail, (res) => {
      console.log(res);
      if (res.message=== 'query ok') {
        _this.setData({
          nearByAddressList: res.data
        })
      }
    })
  },
  selectNearByAddress(e) {
    const { id, location, title,address,category} = e.currentTarget.dataset.item;
    const markers = [{
      ...this.data.markers[0],
      latitude: location.lat,
      longitude: location.lng,
      id,
      title,
      address,
      category
    }]

    // this.getAddressApi(markers[0])

    this.setData({
      markers,
      showSearch: false
    });

    this.btnSure();
  },
  /**确定 */
  btnSure(){
    app.data.addressListTitle = this.data.markers[0].title;
    app.data.addressListTitleLocObj = this.data.markers[0];
    console.log('addressListTitleLocObj======',app.data.addressListTitleLocObj);
    wx.navigateBack({})
  }
})