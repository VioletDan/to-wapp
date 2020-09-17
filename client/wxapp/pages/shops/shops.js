const app = getApp();
const {
  iuser,
  icom,
  regeneratorRuntime,
  promisify,
  API,
  utils
} = app;
let cityData;
//-------------------------------------------------------初始化-------------------------------------------------------
let $page, $query, SessionKey, OpenID;
let PageData = {
  appData: app.data, //拿到全局的数据
  cityName: '上海徐汇区',
  hasLocation: false,
  currentLatitude: '',
  currentLongitude: '',
  scale: 14,
  markers: [],
  centerLatitude: '', //中心纬度
  centerLongitude: '', //中心经度
  resultArr: [], //搜索结果
  items: [],
  collectData:[],//常用收藏
};

Page({
  data: Object.assign({
    appData: app.data,
    userInfo: {},
    hasUserInfo: false,
    show: false,
    searchValue: '', //搜索关键词
  }, PageData), //页面的初始数据
  async onLoad(option) {
    $page = this;
    $query = option;
    console.log('getQueryString', option);
    this.setData({
      appData: app.data,
      currentLatitude: app.data.userCurrentDis.userCurrentLat,
      currentLongitude: app.data.userCurrentDis.userCurrentLon,
    });
    this.getAllShop();
  },
  async onReady() {},
  async screenCurrentCity(arr) {
    let cityData = $page.data.items;
    let arrData = {}
    let arrTemp = cityData.filter((i, index) => {
      // console.log('i', i)
      if (i.area.indexOf(arr[0]) != -1) {
        // console.log(index)
        arrData.mainActiveIndex = index
        cityData[index].children.filter(ii => {
          if (ii.text.indexOf(arr[1]) != -1) arrData.activeId = ii.id
          return
        })
        return
      }
    })
    return arrData
  },
  async onShow() {
    // console.log('isStore:' +icom.storage('isStore'))
    if (Number(icom.storage('isStore')) == 1 && this.data.items.length > 0) {
      this.setData({
        cityName: icom.storage('cityName')
      })
      await this.getStore(icom.storage('cityName'));
    }
  },
  /**获取所有的店铺 */
  getAllShop() {
    icom.loading();
    API.GetAllShops({
      latitude: app.data.userCurrentDis.userCurrentLat,
      longitude: app.data.userCurrentDis.userCurrentLon
    }).then(res => {
      icom.loadingHide();
      if (res) {
        this.setData({
          markers:res.data
        })
        dealData(this.data.markers, false);
      }
    });
  },

  searchClick(e) {
    this.setData({
      show: true
    })
  },
  //监听输入变化
  onChange: utils.debounce(function (e) {
    // console.log(e.detail)
    if (!e.detail) return
    searchhandle(e)
  }, 1000, true),
  // 确定搜索
  async onSearch(e) {
    // console.log(e.detail)
    if (!e.detail) return icom.alert('请输入关键词~')
    searchhandle(e)
  },
  //取消搜索
  onCancel() {
    cancelData()
  },
  markertap(e) {
    positionMarker(e)
  },
  //点击搜索列表项
  itemClick(e) {
    // console.log(e)
    let area_id = Number(e.currentTarget.id)
    let name = e.currentTarget.dataset.name
    API.callFunction('getCurrentstore', {
      area_id: area_id
    }).then(res => {
      // console.log(res)
      if (res && res.data) {
        dealData(res.data, true, name)
      }
    })
  },
  //蒙层关闭
  onClose() {
    cancelData()
  },
  //去看看
  viewStore(e) {
    // wx.navigateTo({
    //   url: `/pages/storeInfo/storeInfo?id=${e.currentTarget.id}`,
    // })
    let currentID = e.currentTarget.id;
    let {item} = e.currentTarget.dataset;
    console.log(item);
    //跳转到当前选择的店铺
    // app.data.userCurrentDis.userCurrentLat = item.latitude;
    // app.data.userCurrentDis.userCurrentLon = item.longitude;
    icom.storage('ssoShopCateId',item.shopCateId);
    icom.storage('ssoShopId',item.shopId);
    wx.navigateBack({
      delta: 0,
    });

    // this.data.markers.map((v, index) => {
    //   if (v.id == currentID) {
    //     const latitude = Number(v.latitude)
    //     const longitude = Number(v.longitude)
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    // })
    // icom.storage('isStore', 2)
  },

  //拨打电话
  btnTelClick(e){
    let currentID = e.currentTarget.id;
    let {item} = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: item.contactMobile,
    })
  },
  //导航
  markertapToCheck(e){
    let currentID = e.currentTarget.id;
    let {item} = e.currentTarget.dataset;
    wx.openLocation({
      latitude : Number(item.latitude),
      longitude : Number(item.longitude),
      scale: 18
    });
  }
}) //end page

//-------------------------------------------------------业务逻辑-------------------------------------------------------
function cancelData() {
  $page.setData({
    show: false,
    resultArr: [],
    searchValue: ''
  })
} //end func

//确认搜索数据结果
function searchhandle(e) {
  API.callFunction('search', {
    value: e.detail
  }).then(res => {
    let resultArr = []
    // console.log(res)
    if (res && res.data) {
      resultArr = res.data
      $page.setData({
        resultArr: resultArr
      })
    }
  })
}

//处理搜索的数据结果
function dealData(data, search, name) {
  let store = data
  let currentIndex
  store.map((v, index) => {
    let distance = GetDistance(v.latitude, v.longitude, $page.data.currentLatitude, $page.data.currentLongitude)
    v.address = v.address.replace('\r\n','');
    v.isBusState = app.checkAuditTime(v.beginTime,v.endTime);
    v.distance = 0
    v.distance = Number(distance)
    v.id = index + 1
    v.iconPath = '/images/common/icon_write.png'
    v.width = 20
    v.height = 20
    v.callout = {
      content: v.shopname + ' >',
      borderWidth: 4,
      borderColor: '#fff',
      bgColor: "#fff",
      padding: 5,
      borderRadius: 5,
      display: 'BYCLICK'
    }
    if (name && name == v.shopname) {
      currentIndex = index + 1
    }
  })
  if (search) {
    $page.setData({
      markers: store.sort(compare("distance")),
      centerLatitude: store.sort(compare("distance"))[0].latitude, //中心纬度
      centerLongitude: store.sort(compare("distance"))[0].longitude, //中心经度
      scrollTop: 0,
      scale: 14,
      show: false,
      resultArr: [],
      searchValue: '',
      cityName: store[0].province
    })
  } else {
    $page.setData({
      markers: store.sort(compare("distance")),
      centerLatitude: store.sort(compare("distance"))[0].latitude, //中心纬度
      centerLongitude: store.sort(compare("distance"))[0].longitude, //中心经度
      scrollTop: 0,
      scale: 14
    })
  }
  if (name) positionMarker({
    id: currentIndex
  })
}

//定位地图中心位置
function positionMarker(e) {
  let currentID = e.id || e.markerId || e.currentTarget.id
  $page.data.markers.map((v, index) => {
    let display = `markers[${index}].callout.display`
    if (v.id == currentID) {
      $page.setData({
        centerLatitude: v.latitude, //中心纬度
        centerLongitude: v.longitude, //中心经度
        toView: 'mark-' + (currentID),
        scale: 16
      })
      if (e.id || e.currentTarget.id) {
        $page.setData({
          [display]: 'ALWAYS'
        })
      }
    }
  })
} //end func

//进行经纬度转换为距离的计算
function Rad(d) {
  return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}

//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(Number(lat1));
  var radLat2 = Rad(Number(lat2));
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  s = s.toFixed(2);
  return s;
}
//排序
function compare(p) { //这是比较函数
  return function (m, n) {
    var a = m[p];
    var b = n[p];
    return a - b; //升序
  }
} //end func

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