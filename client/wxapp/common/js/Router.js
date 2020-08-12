class Router {
  constructor() {

    //用来管理底部tab的页面
    this.tabPage = {};
  }


  //=========== 这里是四个不会销毁的页面管理 START =========

  _backIndex() {
    let len = getCurrentPages().length;
    // console.log('len:' + len);
    if (len > 1) {
      wx.navigateBack({
        delta: len - 1
      })
    }
  }
  _updateFooter(value) {
    let footer = this.tabPage['footer'];
    if (footer) footer.updateActive(value);
  }


  /**
   * 注册tab页面
   * @params name 名字
   * @params page 页面实例
   */
  regTabPage(name, page) {
    this.tabPage[name] = page;
  }

  //去探店
  toHome() {
    this._backIndex();
    this._updateFooter(0);
    let home = this.tabPage['home'];
    home.updateData();
  }
  //去私人订制
  toCustomized(value) {
    this._backIndex();
    this._updateFooter(1);
    let customized = this.tabPage['customized'];
    customized.updateData(value);
  }
  //去预约体验
  toOrder() {
    this._backIndex();
    this._updateFooter(2);
    let order = this.tabPage['order'];
    order.updateData();
  }
  //去限定礼遇
  toGift(){
    this._backIndex();
    this._updateFooter(3);
    let gift = this.tabPage['gift'];
    gift.updateData();
  }
  //去个人中心
  toPersonal() {
    this._backIndex();
    this._updateFooter(4);
    let personal = this.tabPage['personal'];
    personal.updateData();
  }
  toUserAuth() {
    wx.navigateTo({
      url: '/pages/userAuth/userAuth'
    })
  }
  //=========== 这里是四个不会销毁的页面管理 END =========
}


module.exports = Router;