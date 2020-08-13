/**
 * 全页面的请求接口都统一放在API.js里
 * 一般的接口请求都需要SessionKey,所以这里会统一写好传给后端
 * 前端可以传其他需要的参数
 *  统一的接口域名请求在config.js里,前端可以自己配置
 */
const app = getApp();
import regeneratorRuntime from 'plugs/regeneratorRuntime';
import promisify from 'plugs/promisify.js';
import icom from 'base/com.js';
import config from '../../config.js';

class API {
  constructor() {
    this.DOMAIN = config.domain;
    this.wxResuest = promisify(wx.request)
    this.wxUploadFile = promisify(wx.uploadFile)
    this.apiurl = '/action=';
  }
  /**
   * 初始化
   */
  async _send(method, data, type) {
    //data里面不带SessionKey才赋值
    // if (!data.hasOwnProperty('sessionKey')) data.sessionKey = icom.storage('session_key');
    // if (!data.hasOwnProperty('token')) data.token = icom.storage('token') || '';
    // if (!data.hasOwnProperty('ssoShopCateId')) data.ssoShopCateId = icom.storage('ssoShopCateId') || 1;
    // if (!data.hasOwnProperty('ssoSapid')) data.ssoSapid = icom.storage('ssoSapid') || 1;
    let res = await this.wxResuest({
      url: this.DOMAIN + method,
      data: data,
      method: type || 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        // 'content-type': 'application/x-www-form-urlencoded' // 默认值
        'Authorization': 'Bearer ' + (icom.storage('token') || ''),
        'ssoShopCateId': icom.storage('ssoShopCateId') || 1,
        'ssoSapid': icom.storage('ssoSapid') || 1
      },
      dataType: "json"
    });
    console.log('APIname:=========' + method, res.data)
    if (!res.data) {
      wx.showToast({
        title: res.data.msg,
        icon: "none"
      })
      return null;
    } else {
      return res.data;
    }
  }

  // 授权微信用户登录
  async AppletLogin(data) {
    return this._send('/auth/wxlogin', data, 'POST');
  }

  // 绑定手机号
  async GetUserPhone(data) {
    return this._send('/auth/bindphone', data, 'POST');
  }
}



module.exports = API;