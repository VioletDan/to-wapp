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
  currentLatitude: 31.18826,
  currentLongitude: 121.43687,
  scale: 14,
  markers: [{
      "name": "来福士茶空间店",
      "name_en": "Raffles Tea Space Store",
      "area_id": 17,
      "latitude": "30.248485",
      "longitude": "120.213354",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "湖滨银泰黑金店",
      "name_en": "Hubin Yintai Black Gold Shop",
      "area_id": 17,
      "latitude": "30.252900",
      "longitude": "120.162850",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "杭州万象城店",
      "name_en": "Wanxiang City Shop, Hangzhou",
      "area_id": 17,
      "latitude": "30.253060",
      "longitude": "120.215070",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "星光大道茶空间店",
      "name_en": "Starlight Avenue Tea Space Shop",
      "area_id": 17,
      "latitude": "30.20746",
      "longitude": "120.20947",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "杭州城西银泰城店",
      "name_en": "Hangzhou City West Yintai City Shop",
      "area_id": 17,
      "latitude": "30.299943",
      "longitude": "120.106603",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "杭州金沙天街茶空间店",
      "name_en": "Hangzhou Jinsha Tianjie Tea Space Shop",
      "area_id": 17,
      "latitude": "30.309944",
      "longitude": "120.326198",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "杭州工联CC店",
      "name_en": "CC Shop of Hangzhou Federation of Industry",
      "area_id": 17,
      "latitude": "30.253979",
      "longitude": "120.164664",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "西溪印象城DP店",
      "name_en": "Impression City DP Shop in Xixi",
      "area_id": 17,
      "latitude": "30.247427",
      "longitude": "120.048719",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "杭州国大广场热麦店",
      "name_en": "Hot wheat shop in Hangzhou Guoda Plaza",
      "area_id": 17,
      "latitude": "30.269549",
      "longitude": "120.162445",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "杭州萧山银隆店",
      "name_en": "Yinlong Shop, Xiaoshan, Hangzhou",
      "area_id": 17,
      "latitude": "30.170842",
      "longitude": "120.268064",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    },
    {
      "name": "杭州临平银泰城店",
      "name_en": "Yintai City Shop, Linping, Hangzhou",
      "area_id": 17,
      "latitude": "30.404601",
      "longitude": "120.302932",
      "time": "营业时间 10:00~22:00",
      "address": "上海市上海市徐汇区南丹东路"
    }
  ],
  centerLatitude: 31.192660, //中心纬度
  centerLongitude: 121.439361, //中心经度
  resultArr: [], //搜索结果
  items: []
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
        // dealData(this.data.markers, false);
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
    let currentID = e.currentTarget.id
    this.data.markers.map((v, index) => {
      if (v.id == currentID) {
        const latitude = Number(v.latitude)
        const longitude = Number(v.longitude)
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
    icom.storage('isStore', 2)
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
    v.distance = 0
    v.distance = Number(distance)
    v.id = index + 1
    v.iconPath = '/images/common/icon_write.png'
    v.width = 20
    v.height = 20
    v.callout = {
      content: v.name + ' >',
      borderWidth: 4,
      borderColor: '#fff',
      bgColor: "#fff",
      padding: 5,
      borderRadius: 5,
      display: 'BYCLICK'
    }
    if (name && name == v.name) {
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