import config from 'config.js';
import icom from 'common/js/base/com.js';
import imath from 'common/js/base/math.js';
import API from 'common/js/API.js';
import regeneratorRuntime from '/common/js/plugs/regeneratorRuntime';
import promisify from '/common/js/plugs/promisify.js';
import Init from '/common/js/base/init.js';
import Router from 'common/js/Router.js';
import iuser from 'common/js/base/user.js';
import Toast from 'miniprogram/@vant/weapp/dist/toast/toast';
const utils = require('utils/utils.js');

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
    this.iuser = iuser;
    this.utils = utils;
    first = true

    //来源
    Scene = options.query.scene ? options.query.scene : "defualt";
    SceneValue = options.scene ? options.scene : "defualt";
    this.beats = new Init({
      API: this.API
    }); //new 一下init.js,这样每个页面都可以拿到
    console.log("Scene:" + Scene);
    console.log("SceneValue:" + SceneValue);

    //更新版本
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
    if (this.data.token == '' || first) {
      first = false;
      await this.AppletLogin(cb);
    } else {
      if (cb) cb();
    }
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    page.setData({
      appData: this.data
    });
  },
  // code换openid
  async AppletLogin(cb) {
    wx.showLoading({
      title: '',
    });
    const login = promisify(wx.login);
    let {
      code
    } = await login();
    console.log(code)
    let res = await this.API.AppletLogin({
      code: code
    });
    wx.hideLoading();
    if (res.code == 200) {
      this.data.actionCode = res.data.actionCode || '';
      this.data.wxuid = res.data.wxuid || '';
      this.data.token = res.data.token;
      icom.storage('token', this.data.token);

      //actionCode:BindPhone 代表要用户去绑定手机号
      if (this.data.actionCode && this.data.actionCode === 'BindPhone') {
        this.data.Flag_Info = 0 //1是 0否
        this.data.Flag_Phone = 0 //1是 0否
      } else {
        this.data.Flag_Info = 1 //1是 0否
        this.data.Flag_Phone = 1 //1是 0否
      }
    } else {
      icom.alert(res.msg);
      return;
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
    coordinate: {
      latitude: 31.04958,
      longitude: 121.20283
    },
    shopInfo: {},
    userAddress: []
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
    opts.path = icom.combineUrl(opts.path, {
      scene: Scene
    });
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

  checkAddressPermission(callback) {
    const that = this
    wx.chooseAddress({
      success: (res) => {
        callback(res)
      },
      fail: (res) => {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting["scope.address"]) {
              that.needAddressPermission(callback)
            }
          },
        })
      }
    })
  },

  checkLocationPermission(callback) {
    const that = this
    wx.getLocation({
      // type: 'gcj02',
      success(res) {
        wx.setStorageSync('LastAddress', JSON.stringify(res))
        callback(res)
      },
      fail(res) {
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting["scope.userLocation"]) {
              that.needLocationPermission(callback)
            }
          }
        })
      }
    })
  },

  needAddressPermission(callback) {
    const that = this
    wx.showModal({
      title: '是否授权获取收货地址',
      content: '需要获取您的收货地址，请确认授权，否则无法下单',
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success: function (data) {
              if (data.authSetting["scope.address"] === true) {
                wx.showToast({
                  title: "授权成功",
                  icon: "success",
                  duration: 1000
                });
                wx.chooseAddress({
                  success: (res) => {
                    callback(res)
                  },
                });
              }
            }
          });
        } else if (res.cancel) {
          // that.needAddressPermission(callback)
          wx.navigateTo({
            url: "/pages/store/store"
          })
        }
      }
    })
  },

  needLocationPermission(callback) {
    const that = this
    wx.showModal({
      title: '是否授权获取当前位置',
      content: '需要获取您的地理位置，请确认授权，否则无法计算您与店铺的距离',
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success: function (data) {
              if (data.authSetting["scope.userLocation"] === true) {
                wx.showToast({
                  title: "授权成功",
                  icon: "success",
                  duration: 1000
                });
                wx.getLocation({
                  type: "wgs84",
                  success(res) {
                    callback(res)
                  }
                });
              }
            }
          });
        } else if (res.cancel) {
          that.needLocationPermission(callback)
        }
      }
    })
  }












})