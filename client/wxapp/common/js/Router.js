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

  _updateTitle(value) {
    wx.setNavigationBarTitle({
      title: value
    })
  }

  /**
   * 注册tab页面
   * @params name 名字
   * @params page 页面实例
   */
  regTabPage(name, page) {
    this.tabPage[name] = page;
  }

  //去首页
  toHome() {
    this._backIndex();
    this._updateFooter(0);
    let home = this.tabPage['home'];
    home.updateData();
  }
  //去订单
  toOrder() {
    this._backIndex();
    this._updateFooter(1);
    let order = this.tabPage['order'];
    order.updateData();
  }
  //去我的
  toUser() {
    this._backIndex();
    this._updateFooter(2);
    let user = this.tabPage['user'];
    user.updateData();
  }
  //=========== 这里是四个不会销毁的页面管理 END =========
}


module.exports = Router;