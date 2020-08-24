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
        'ssoSapid': icom.storage('ssoSapid') || 1,
        'ssoShopId': icom.storage('ssoShopId') || 1
      },
      dataType: "json"
    });
    console.log('APIname:=========' + method, res.data)
    if (!res.data.data || !res.data) {
      icom.sign(res.data.msg || '网络异常了');
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
    return this._send('/address/update/', data, 'PUT');
  }

  // 删除用户的地址
  async DeletUserAdress(data) {
    return this._send('/address/del/' + data.id + '', null, 'DELETE');
  }

  // 获取用户的地址详情
  async GetUserAdressItem(data) {
    return this._send('/address/get/' + data.id + '', null, 'GET');
  }

  // 预下单
  async preOrder(data) {
    return this._send('/api/v1/preorder', data, 'POST');
  }

  // 支付
  async payOrder(data) {
    return this._send('/wechatPay/pay', data, 'POST');
  }

  // 获取用户的订单列表
  async getOrderList(data) {
    return this._send('/api/v1/orders/list', data, 'GET');
  }

  // 支付
  async getOrderListDetail(data) {
    return this._send('/api/v1/orders/' + data.orderId + '', null, 'GET');
  }



}



module.exports = API;