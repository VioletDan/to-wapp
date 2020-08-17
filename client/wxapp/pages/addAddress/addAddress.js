const app = getApp();
const {
  utils,
  icom,
  Toast,
  API
} = app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poisList: [],
    form: {
      name: '',
      gender: 1,
      phone: '',
      address: '',
      adressHouseNum: '',
      defaultAddress: 1, //1未选中 2 选中
      isDefault: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.data.userEditorAdressInfo);
    if (app.data.userEditorAdressInfo) {
      this.setData({
        form: app.data.userEditorAdressInfo,
        'form.name': app.data.userEditorAdressInfo.username,
        'form.phone': app.data.userEditorAdressInfo.mobile,
        'form.adressHouseNum': app.data.userEditorAdressInfo.street
      })
    }
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
    if (app.data.addressListTitle) {
      this.setData({
        'form.address': app.data.addressListTitle,
        appData: app.data
      });
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
  selectAddress() {
    wx.navigateTo({
      url: '/pages/addressList/addressList'
    })
  },
  //联系人
  bindKeyInputName: function (e) {
    this.setData({
      'form.name': e.detail.value
    })
  },
  //性别
  radioChange(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      'form.gender': Number(e.detail.value)
    })
  },
  //手机号
  bindKeyInputTel: function (e) {
    this.setData({
      'form.phone': e.detail.value
    })
  },
  //门牌号
  bindKeyInputHouseNum: function (e) {
    this.setData({
      'form.adressHouseNum': e.detail.value
    })
  },
  //保存
  btnSaveClick() {
    icom.loading();
    var isPhone = icom.checkStr(this.data.form.phone);
    var content = '',
      type = 'text';
    if (this.data.form.name == '') {
      content = '请填写姓名';
    } else if (this.data.form.phone == '') {
      content = '请填写手机号';
    } else if (!isPhone) {
      content = '请填写正确的手机号';
    } else if (this.data.form.address == '') {
      content = '请填写地址';
      type = 'fail';
    } else if (this.data.form.adressHouseNum == '') {
      content = '请填写门牌号';
    }
    if (content != '') {
      Toast({
        type: type,
        message: content,
        position: 'top',
        duration: 1500
      });
    } else {
      //获取用户的地址列表
      icom.sign();
      if (app.data.userEditorAdressInfo) {
        API.EditorUserAdress({
          'id': app.data.userEditorAdressInfo.id,
          "username": this.data.form.name,
          "gender": this.data.form.gender,
          "mobile": this.data.form.phone,
          "address": this.data.form.address,
          "street": this.data.form.adressHouseNum,
          "isDefault": this.data.form.isDefault,
          "latitude": this.data.formlatitude,
          "longitude": this.data.formlongitude
        }).then(res => {
          icom.loadingHide();
          app.data.userEditorAdressInfo = null;
          //返回地址列表页
          wx.navigateBack({})
        });

      } else {
        API.SaveUserAdress({
          "username": this.data.form.name,
          "gender": this.data.form.gender,
          "mobile": this.data.form.phone,
          "address": this.data.form.address,
          "street": this.data.form.adressHouseNum,
          "isDefault": this.data.form.isDefault,
          "latitude": app.data.addressListTitleLoc.latitude,
          "longitude": app.data.addressListTitleLoc.longitude
        }).then(res => {
          icom.loadingHide();
          //返回地址列表页
          wx.navigateBack({})
        });
      }

    }
  },
  //设置默认地址
  checkboxChange(e) {
    var defaultAddress = 1,
      isDefault = false;
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value.length > 0 && e.detail.value[0] == 1) {
      //选中
      defaultAddress = 2;
      isDefault = true;
    } else {
      //未选中
      defaultAddress = 1;
      isDefault = false;
    }

    this.setData({
      'form.defaultAddress': defaultAddress,
      'form.isDefault': isDefault
    })
  }
})