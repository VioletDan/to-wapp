// components/home/home.js
const app = getApp();
const {
  API,
  beats,
  icom,
  config,
  mta,
  regeneratorRuntime,
  promisify,
  Router,
  utils,
  imath
} = app;

var $page = null;
var _currentId = null,
  _currentItem = null; //当前选中产品的id
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    cumulativeIntegral: 1,
    // 门店列表
    shopList: [],
    // 门店信息
    shopInfo: {},
    // 门店名称
    commercialName: "定位中...",
    // 门店描述
    commercialDesc: "",
    // 当前距离
    distance: 0.0,
    //菜品分类信息
    categoryList: [],
    //菜品信息
    dishMenuList: [],
    scrollTop: 0,
    activeId: "",
    scrollId: "",
    scrollTopList: [],
    checked: app.data.checked,
    showMore: false,
    cardMaskShow: false,
    detailBtnTxt: "更多",
    cardList: wx.getStorageSync("cardList") || [],
    selectInfo: {},
    showModal: false, // 显示规格模态框
    modelData: {},
    current: 0,
    carSelectConfig: {},
    shopInfo: {
      isBusState: true
    }
  },

  lifetimes: {
    ready() {
      Router.regTabPage("home", this);
      $page = this;
      this.initData();
    },
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      // setTimeout(() => {
      //   this.updateData();
      // }, 200)
    },
    hide: function () {},
    resize: function () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //========== Public ===========
    updateData() {
      //这里是外部调用的方法 如果要刷新数据的话在这里执行
      console.log("home udpate");
      this.initData();
    },

    //========== Private ===========
    initData() {
      icom.loading("加载中");
      this.initCar();
      this.setPage();
    },
    onPageScroll(event) {
      this.setData({
        scrollTop: event.scrollTop,
      });
    },

    /**
     * 获取门店详情
     */
    async getShopInfo() {
      let {
        data
      } = await API.GetShopInfo({});
      let _info = data;
      _info.commercialName = _info.shopname;
      _info.commercialDesc = _info.notice;
      app.data.coordinate.latitude = _info.latitude;
      app.data.coordinate.longitude = _info.longitude;
      app.data.ShopInfo = _info;
      // icom.storage("ssoShopCateId", _info.shopCateId);
      // icom.storage("ssoShopId", _info.shopId);
      this.setData({
        shopInfo: _info,
        'shopInfo.isBusState': app.checkAuditTime(_info.beginTime, _info.endTime),
        checked: app.data.checked,
        cardList: wx.getStorageSync("cardList") || [],
      });
      console.log("_info=================", this.data.shopInfo);

      app.data.shopInfo = _info;
      this.setCommercialInfo();
    },
    goStoreList() {
      wx.navigateTo({
        url: "/pages/shops/shops",
      });
    },
    // 设置门店信息
    setCommercialInfo() {
      this.setData({
        commercialName: this.data.shopInfo.commercialName,
        commercialDesc: this.data.shopInfo.commercialDesc,
      });
      app.checkLocationPermission(this.setDistance);
    },
    // 计算距离
    setDistance(curLoc) {
      var latitude = app.data.userCurrentDis.userCurrentLat ? app.data.userCurrentDis.userCurrentLat : curLoc.latitude;
      var longitude = app.data.userCurrentDis.userCurrentLon ? app.data.userCurrentDis.userCurrentLon : curLoc.longitude;
      if (!app.data.userCurrentDis.userCurrentLat) {
        console.log('初始没有经纬度,获取用户定位的');
        app.data.userCurrentDis.userCurrentLat = latitude;
        app.data.userCurrentDis.userCurrentLon = longitude;
      }

      $page.setData({
        distance: utils.getDistance(
          latitude,
          longitude,
          app.data.coordinate.latitude,
          app.data.coordinate.longitude
        ),
      });
      app.data.ShopInfo.distance = $page.data.distance
    },
    /**
     * 菜品分类信息查询
     */
    category() {
      return new Promise((resolve, reject) => {
        //获取店铺详细信息
        API.GetShopMenuList({}).then((res) => {
          if (res.data.length > 0) {
            resolve(res.data);
          }else {
            icom.loadingHide();
            this.setData({
              dishMenuList: [],
              activeId: '',
            });
          }
        });
      });
    },

    // bindGetUserInfo (e) {
    //   console.log(e.detail.userInfo)
    //   app.data.userInfo = e.detail.userInfo
    //   this.setData({
    //     userInfo: e.detail.userInfo,
    //     hasUserInfo: true
    //   })
    //   this.setPage()
    // },

    setPage() {
      this.getShopInfo();

      Promise.all([this.category()]).then((res) => {
        // console.log(res)
        if (icom.storage('token')) icom.loadingHide();
        // let tmpList = [];
        // let tmpCategoryList = res[0];

        // tmpCategoryList.forEach(category => {
        //   console.log('category', category, category.foodList);

        //   const id = category.id;

        // var list = category.foodList.filter(
        //   menu => menu.categorys[0].categoryId === id,
        // );

        // if (category.foodList.length > 0) {
        //   list.forEach(menu => {
        //     menu.num = 0
        //     menu.total = 0
        //   });
        //   tmpList.push({
        //     ...category,
        //     list
        //   });
        // }
        // });
        this.setData({
          dishMenuList: res[0],
          activeId: res[0][0].id,
        });

        setTimeout(() => {
          this.getScrollTop();
        }, 20);
      });
    },

    // 点击AddIcon
    tapAddIcon(e) {
      const item = e.currentTarget.dataset.item;
      this.addToCart(
        item.id,
        item.name,
        item.price,
        item.num,
        item.packagePrice
      );
    },
    selectCategory(e) {
      this.setData({
        scrollId: "dish" + e.currentTarget.dataset.id,
        activeId: e.currentTarget.dataset.id,
      });
    },
    bindscroll(e) {
      let activeId = this.data.dishMenuList[0].id;
      for (let i = 0; i < this.data.scrollTopList.length; i++) {
        const scrollTop = this.data.scrollTopList[i];
        if (e.detail.scrollTop >= scrollTop.top) {
          activeId = scrollTop.id * 1;
        }
      }
      this.setData({
        activeId,
      });
    },

    // 添加到购物车
    addToCart(id, name, price, num, packagePrice) {
      var _cartList = this.data.cartList;
      var index; // 购物车中相同id菜品的index

      if ((index = this.checkCartSameId(id))) {
        _cartList[index].num++;
      } else {
        var tmpItem = {
          id: id,
          name: name,
          price: price,
          num: 1,
          packagePrice: packagePrice,
        };
        _cartList.push(tmpItem);
      }
    },
    getScrollTop() {
      if (this.data.scrollTopList.length > 0) {
        return;
      }

      const _this = this;
      let query = wx.createSelectorQuery().in(_this);
      query
        .select("#dishList")
        .boundingClientRect(function (response) {
          const parentTop = response.top;
          _this.data.dishMenuList.forEach((dish) => {
            query = wx.createSelectorQuery().in(_this);
            query.select(`#dish${dish.id}`).boundingClientRect(function (res) {
              _this.setData({
                scrollTopList: [
                  ..._this.data.scrollTopList,
                  {
                    top: res.top - parentTop,
                    id: res.id.replace("dish", ""),
                  },
                ],
              });
            });
          });
        })
        .exec();
    },
    changeChecked(e) {
      app.data.checked = e.detail,
        this.setData({
          checked: e.detail,
        });

      if (e.detail) {
        // 跳转到收货地址页面
        wx.navigateTo({
          url: "/pages/receiveAddress/receiveAddress",
        });
      }
    },
    showMoreDetail() {
      this.setData({
        showMore: !this.data.showMore,
        detailBtnTxt: !this.data.showMore ? "收起" : "更多",
      });
    },
    // 选规格(单个)
    onSelectConfig(e) {
      console.log(e.currentTarget.dataset);
      const {
        parentIndex,
        item
      } = e.currentTarget.dataset;
      const {
        foodId
      } = item;
      _currentItem = item;
      _currentId = foodId;
      item.imgList = [];
      item.imgList.push(item.imgUrl);
      const cardList = wx.getStorageSync("cardList") || [];
      const selectIndex = cardList.findIndex((card) => card.id === foodId);
      if (selectIndex > -1) {
        cardList[selectIndex].num += 1;
      } else {
        item.num = 1;
        cardList.push(item);
      }
      this.setData({
        cardList,
      });
      wx.setStorageSync("cardList", cardList);
      this.initCar();
    },
    /**选规格(多个) */
    onSelectConfigMore(e) {
      console.log(e.currentTarget.dataset);
      const {
        parentIndex,
        item
      } = e.currentTarget.dataset;
      const {
        foodId
      } = item;
      _currentItem = item;
      _currentId = foodId;
      item.imgList = [];
      item.imgList.push(item.imgUrl);
      item.component = item.desc;
      this.setData({
        showModal: true,
      });
      this.dishDetailes(item, foodId);
    },
    /**render模态框 */
    dishDetailes(obj) {
      console.log("obj", obj);
      const carSelectConfig = {
        ...obj,
        propertiesDto: {},
        specs: obj.specs[0],
        price: obj.specs[0].originPrice,
        buyNum: 1,
        foodId: obj.specs[0].foodId,
        foodSpecsId: obj.specs[0].foodSpecsId,
        packageFee: obj.specs[0].packageFee
      };

      obj.propertiesDto.forEach((properties) => {
        carSelectConfig.propertiesDto[properties.name] =
          properties.details[0].name;
      });

      console.log(carSelectConfig);

      this.setData({
        modalData: obj,
        carSelectConfig,
      });
      this.getTextFromCarSelectConfig();
    },
    closeModal() {
      this.setData({
        modalData: {},
        carSelectConfig: {},
        showModal: false,
      });
    },
    swprerChange(e) {
      this.setData({
        current: e.detail.current,
      });
    },
    reduceConfigNum() {
      if (this.data.carSelectConfig.buyNum === 1) return;

      this.setData({
        carSelectConfig: {
          ...this.data.carSelectConfig,
          buyNum: this.data.carSelectConfig.buyNum - 1,
        },
      });
    },
    addConfigNum() {
      this.setData({
        carSelectConfig: {
          ...this.data.carSelectConfig,
          buyNum: this.data.carSelectConfig.buyNum + 1,
        },
      });
    },
    selectSpecs(e) {
      const carSelectConfig = this.data.carSelectConfig;
      const {
        item
      } = e.currentTarget.dataset;

      carSelectConfig.specs = item;
      carSelectConfig.price = item.originPrice;
      carSelectConfig.footId = item.footId;
      carSelectConfig.foodSpecsId = item.foodSpecsId;

      this.setData({
        carSelectConfig,
      });
      this.getTextFromCarSelectConfig();
    },
    selectConfigCard(e) {
      const carSelectConfig = this.data.carSelectConfig;
      const {
        itemparentname,
        item
      } = e.currentTarget.dataset;

      carSelectConfig.propertiesDto[itemparentname] = item.name;

      this.setData({
        carSelectConfig,
      });
      this.getTextFromCarSelectConfig();
    },
    // 通过carSelectConfig生成选中文本
    getTextFromCarSelectConfig() {
      const carSelectConfig = this.data.carSelectConfig;
      const text =
        carSelectConfig.specs.foodSpecsName +
        "," +
        Object.values(carSelectConfig.propertiesDto).join(",");

      this.setData({
        carSelectConfig: {
          ...this.data.carSelectConfig,
          foodProperties: text,
        },
      });
    },
    // 加入购物车
    addCard() {
      const cardList = wx.getStorageSync("cardList") || [];
      const {
        foodId,
        foodProperties,
        buyNum
      } = this.data.carSelectConfig;
      const selectIndex = cardList.findIndex(
        (card) =>
        card.foodProperties === foodProperties && card.foodId === foodId
      );

      if (selectIndex > -1) {
        cardList[selectIndex].buyNum += buyNum;
      } else {
        cardList.push(this.data.carSelectConfig);
      }

      this.setData({
        cardList,
      });
      wx.setStorageSync("cardList", cardList);

      this.initCar();
      this.closeModal();
    },
    showCardDetail() {
      this.setData({
        cardMaskShow: !this.data.cardMaskShow,
      });
    },
    clearCar() {
      icom.dilaog({
          title: "清空购物车",
          cancelColor: '#3a3a3a',
          confirmColor: '#3a3a3a'
        },
        (res) => {
          if (res.confirm) {
            this.setData({
              cardList: [],
              selectInfo: {},
              cardMaskShow: false,
            });
            wx.removeStorageSync("cardList");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      );
    },
    initCar() {
      const total = this.data.cardList.reduce((num, item) => {
        return (num += item.buyNum);
      }, 0);
      let totalPrice = this.data.cardList.reduce((num, item) => {
        // return (num += item.buyNum * item.price);
        return (num = imath.accAdd(num, item.buyNum * item.price));
      }, 0);
      this.setData({
        selectInfo: {
          total,
          totalPrice,
        },
      });
    },

    //购物车加减
    reduceConfigNum2(e) {
      let {
        index
      } = e.currentTarget.dataset;
      var item = this.data.cardList[index];
      if (item.buyNum >= 1) {
        item.buyNum = item.buyNum - 1;
      }
      if (item.buyNum == 0) {
        this.data.cardList.splice(index, 1);
      }
      this.setData({
        cardList: this.data.cardList
      });
      this.initCar();
      wx.setStorageSync("cardList", this.data.cardList);
    },
    addConfigNum2(e) {
      let {
        index
      } = e.currentTarget.dataset;
      var item = this.data.cardList[index];
      item.buyNum = item.buyNum + 1;
      this.setData({
        cardList: this.data.cardList
      });
      this.initCar();
      wx.setStorageSync("cardList", this.data.cardList);
    },




    // 订单结算
    orderSettle(e) {
      wx.navigateTo({
        url: "/pages/orderSettle/orderSettle",
      });
    },
  },
});