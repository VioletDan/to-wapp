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
    // if (!data.hasOwnProperty('ssoShopId')) data.ssoShopId = icom.storage('ssoShopId') || 1;
    let res = await this.wxResuest({
      url: this.DOMAIN + method,
      data: data,
      method: type || 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        // 'content-type': 'application/x-www-form-urlencoded' // 默认值
        // 'Authorization': 'Bearer ' + (icom.storage('token') || ''),
        'Authorization': icom.storage('token') || '',
        'ssoShopCateId': icom.storage('ssoShopCateId') || 1,
        'ssoShopId': icom.storage('ssoShopId') || 1
      },
      dataType: "json"
    });
    console.log('APIname:=========' + method, res.data)
    if (!res.data.data || !res.data) {
      icom.sign(res.data.msg|| '网络异常了');
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

  // 获取连锁店所有店铺，由近到远排序
  async GetAllShops(data) {
    return this._send('/api/v1/shops', data, 'GET');
  }

  // 获取店铺的详细信息
  async GetShopInfo(data) {
    return this._send('/api/v1/shop/info', data, 'GET');
  }
  
  // 店铺分类和商品
  async GetShopMenuList(data) {
    return this._send('/api/v1/shopfoods', data, 'GET');
  }

  // 获取用户的地址列表
  async GetUserAdressList(data) {
    return this._send('/address/list', data, 'GET');
  }

  // 保存用户的地址
  async SaveUserAdress(data) {
    return this._send('/address/save', data, 'POST');
  }

  // 修改用户的地址
  async EditorUserAdress(data) {
    return this._send('/address/update', data, 'POST');
  }

  // 预下单
  async preOrder(data) {
    return this._send('/api/v1/preorder', data, 'POST');
  }

  // 支付
  async payOrder(data) {
    return this._send('/wechatPay/pay', data, 'POST');
  }
}



module.exports = API;