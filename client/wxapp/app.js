import config from 'config.js';
import icom from 'common/js/base/com.js';
import imath from 'common/js/base/math.js';
import API from 'common/js/API.js';
import regeneratorRuntime from '/common/js/plugs/regeneratorRuntime';
import promisify from '/common/js/plugs/promisify.js';
import Init from '/common/js/base/init.js';
import Router from 'common/js/Router.js';
const mta = require('common/js/mta_analysis.js');
let first;
let Scene = "defualt"; //来源
let SceneValue = ""; //场景值

App({
  onLaunch: function (options) {
    console.log('onLaunch', options);
    this.launchoptions = options;
    this.API = new API(); // new 一下API.js, 这样每个页面都可以拿到
    this.Router = new Router();
    this.icom = icom;
    this.imath = imath;
    this.regeneratorRuntime = regeneratorRuntime;
    this.promisify = promisify;
    // this.bgm = bgm;
    this.mta = mta;
    this.config = config;

    first = true


    Scene = options.query.scene ? options.query.scene : "defualt";
    SceneValue = options.scene ? options.scene : "defualt";
    this.beats = new Init({ API: this.API }); //new 一下init.js,这样每个页面都可以拿到
    console.log("Scene:" + Scene);
    console.log("SceneValue:" + SceneValue);


    this.updateManager();

    //播放背景音乐
    // this.bgm = require('common/js/base/bgm.js');
    // this.bgm.on({ src: 'http://t.sky.be-xx.com/wxapp/wxapp_frame/sound/bgm.mp3'});

    // //腾讯小程序数据监测
    // this.mta.App.init({
    //   "appID":"500725890",
  	//   "eventID":"500726382",
    //   "autoReport": true, 
    //   "statParam": true, 
    //   "ignoreParams": [], 
    //   "statPullDownFresh": true,
    //   "statShareApp": true, 
    //   "statReachBottom": true 
    // });
  },

  updateManager() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },

  async initApp(cb) {
    wx.showLoading({
      title: '',
    });
    // if (this.data.session_key == '' || first) {
    //   first = false;
    //   await this.AppletLogin(cb);
    // }
    await this.AppletLogin(cb);
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    // page.footclick = this.footclick;
    page.setData({ appData: this.data });
  },
  // code换openid
  async AppletLogin(cb) {
    const login = promisify(wx.login);
    let { code } = await login();
    console.log(code)
    let res = await this.API.AppletLogin({ code: code });
    wx.hideLoading();
    if (res.error == 0) {
      this.data.openid = res.data.openid
      this.data.session_key = res.data.session_key;
      this.data.token = res.data.token;
      icom.storage('openid', this.data.openid);
      icom.storage('session_key', this.data.session_key);
      icom.storage('token', this.data.token)
    } else {
      icom.alert(res.msg);
      return;
    }
    let res2 = await this.API.GetUserInfo({});
    this.data.userMsg = res2.data;
    if (res2.data.mobile == '') {
      this.data.Flag_Phone = 0;
      this.data.Flag_Info = 0;
    } else {
      this.data.Flag_Phone = 1;
      this.data.Flag_Info = 1;
    }
    // 如果只需要其中一个授权，另外一个这里赋值=1即可
    // this.data.Flag_Info = res2.result.Flag_Info    //1是 0否
    // this.data.Flag_Phone = res2.result.Flag_Phone     //1是 0否
    if (cb) cb();
  },
  /**
   * 全局参数
   * */
  data: {
    froms: '',
    //用户信息username=姓名,mobile=电话, addr=地址,email=邮箱,isLQ=是否可以领取
    userMsg: {},
    
  },
  //初始化 end
  setShareData: function (options) {
    let defaults = {
      title: config.shareData.title,
      path: config.shareData.path,
      imageUrl: config.shareData.imageUrl,
    };
    let opts = {};
    Object.assign(opts, defaults, options);
    opts.path = icom.combineUrl(opts.path, { scene: Scene });
    console.log(opts);
    return {
      title: opts.title,
      path: opts.path,
      imageUrl: opts.imageUrl
    };
  },


  bgmClick: function () { //背景音乐按钮点击事件
    bgm.click();
  },
  onShow: function () {
    // if (this.bgm.stopByAppHide && this.bgm.playing){
    //     this.bgm.stopByAppHide = false;
    //     this.bgm.play();
    // }//edn if
  },

  onHide: function () {
    // this.bgm.stopByAppHide=true;
  },
  //日历
  formatDate(date) {
    var date = new Date(date);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return `${date.getFullYear()}.${month}.${day}`;
  },
})