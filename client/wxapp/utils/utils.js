function timeStampLong() {
  return Date.parse(new Date()) / 1000;
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  return s;
}

function randomString(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

var QQMapWX = require('../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'QNWBZ-V57RW-I46RF-RB4UZ-NCN7K-FOB3T'
});
function getLatAndLong(addr, callback) {
  qqmapsdk.geocoder({
    address: addr,
    success(res, data) {
      callback(res.result.location)
    },
    fail(res) {
      wx.showToast({
        title: '地址无效，请重新选择地址',
      })
    }
  })
}
//根据坐标逆解析详细地址
function getreverseGeocoder(res, callback) {
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: res.latitude,
      longitude: res.longitude
    },
    success(res) {
      // console.log("地址转码成功", res);
      callback(res.result);
    },
    fail: function (res) {
      wx.showToast({
        title: '地址解析失败',
      })
    }
  });
}

// 通过经纬度获取周边位置数据
function getNearByAddressList(res, callback) {
  var _this = this;
  // 调用接口
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: res.latitude,
      longitude: res.longitude
    },  //设置周边搜索中心点
    coord_type:1,
    get_poi: 1,
    poi_options: 'page_size=20;page_index=1',
    success: function (res) { //搜索成功后的回调
      callback(res);
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
      // console.log(res);
    }
  });
}

// 模糊地点搜索
function getNearByAddressListThroughKeyword(keyword, callback) {
  var _this = this;
  // 调用接口
  qqmapsdk.search({
    keyword,
    coord_type:1,
    get_poi: 1,
    poi_options: 'page_size=20;page_index=1',
    success: function (res) { //搜索成功后的回调
      callback(res);
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) {
      // console.log(res);
    }
  });
}

/**
 * 防抖
 * 非立即执行版
 * 触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 * 立即执行版
 * 触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。
 */
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait = 1000, immediate) {
  let pages = getCurrentPages();
  let $page = pages[pages.length - 1];
  let timeout;
  return function (event) {
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.call($page, event)
    } else {
      timeout = setTimeout(() => {
        func.call($page, event)
      }, wait)
    }
  }
}

/**
 * 节流
 * 时间戳版和定时器版
 * 时间戳版和定时器版的节流函数的区别就是，时间戳版的函数触发是在时间段内开始的时候，而定时器版的函数触发是在时间段内结束的时候。
 */
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func, wait, type) {
  let pages = getCurrentPages();
  let $page = pages[pages.length - 1];
  if (type === 1) {
    var previous = 0;
  } else if (type === 2) {
    var timeout;
  }
  return function (event) {
    let context = $page;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();
      if (now - previous > wait) {
        func.call(context, event);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.call(context, event)
        }, wait)
      }
    }
  }
}
module.exports = {
  timeStampLong: timeStampLong,
  formatTime: formatTime,
  getDistance: getDistance,
  randomString: randomString,
  getLatAndLong: getLatAndLong,
  getreverseGeocoder,
  getNearByAddressList,
  getNearByAddressListThroughKeyword,
  debounce,
  throttle
}