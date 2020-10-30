const app = getApp();
const { API, beats, icom, config, mta, regeneratorRuntime, promisify, Router } = app;
let prizeType = 'test';
//-------------------------------------------------------初始化-------------------------------------------------------
let $query, toNext, $page;
let myVideo;
let idArr = ['#user','#home','#order'];
Page({
  data: {
    currentPageIndex: 0,
    show: false, //显示tabbar
    appData: app.data,
    bgmPlay: false,
    showAuth: false, //授权
    getInfo: 'getNumber', //getInfo
    showLogin:false, //登陆弹窗
  }, //页面的初始数据
  onLoad(option) {
    icom.OS();
    $page = this;
    $query = option;
    console.log('getQueryString', option);
    // 跳转过来显示对应的tab
    if (option.currentPageIndex) {
      this.setData({
        currentPageIndex: (Number(option.currentPageIndex - 1)),
      })
      this.selectComponent('#footer').updateActive(this.data.currentPageIndex);
      option.currentPageIndex = null;
    }
    app.initApp(()=>{
      if(app.data.actionCode) {
        this.setData({
          showLogin:true
        })
      }
    });
  },
  onReady: function () {
  }, //监听页面初次渲染完成
  onShow: function () {
    setTimeout(() => {
      //菜单页面才更新
      if (icom.storage('token') && this.data.currentPageIndex != 2) this.selectComponent(idArr[this.data.currentPageIndex]).updateData();
    }, 1000)
  }, //监听页面显示
  onHide: function () { }, //监听页面隐藏
  onUnload: function () { }, //监听页面卸载
  onPullDownRefresh: function () { }, //页面相关事件处理函数--监听用户下拉动作
  onReachBottom: function () { }, //页面上拉触底事件的处理函数
  onShareAppMessage: function () { //用户点击右上角分享
    return app.setShareData();
  },
  // 更新数据
  //=========== Event ============
  navChange(e) {
    let index = e.detail;
    this.setData({
      currentPageIndex: index
    });
  },
  // // 取消授权
  // onAuthCancle(e) {
  //   console.log(e.detail)
    
  // },
  // // 拿到授权
  // onAuthSure(e) {
  //   console.log(e.detail);
  // },
  // 取消授权
  onLoginCancle(e) {
    console.log(e.detail)
    
  },
  // 拿到授权
  onLoginSure(e) {
    console.log(e.detail);
  },
}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------
