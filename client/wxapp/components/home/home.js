// components/home/home.js
const app = getApp()
const {API,beats,icom,config,mta,regeneratorRuntime,promisify,Router,utils} = app;

var $page = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

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
    commercialName: '定位中。。。',
    // 门店描述
    commercialDesc: '',
    // 当前距离
    distance: 0.0,
    //菜品分类信息
    categoryList: [],
    //菜品信息
    dishMenuList: [],
    scrollTop: 0,
    activeId: '',
    scrollId: '',
    scrollTopList: [],
    checked: false,
    showMore: false,
    cardMaskShow: false,
    detailBtnTxt: '更多',
    cardList: wx.getStorageSync('cardList') ?
      JSON.parse(wx.getStorageSync('cardList')) : [],
    selectInfo: {},
    showModal: false, // 显示规格模态框
    modelData: {},
    current: 0,
    selectConfig: {},
  },

  lifetimes: {
    ready() {
      Router.regTabPage('home', this);
      $page = this;
      this.initData();
    }
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
      console.log('home udpate');
      this.initData();
    },

    //========== Private ===========
    initData() {
      this.initCar()
      this.setPage()
    },
    onPageScroll(event) {
      this.setData({
        scrollTop: event.scrollTop,
      })
    },

    /**
     * 获取门店详情
     */
    getShopInfo() {
      var res = [{
        "_id": "f149f6775ea28002001877dc52d9e2e3",
        "areaCode": "021",
        "areaId": "310117",
        "areaName": "松江区",
        "brandId": 206445,
        "brandName": "豆腐先生",
        "busiCode": 10782,
        "busiName": "松江大学城",
        "cityCode": "310100",
        "cityName": "上海市",
        "commercialAddress": "上海市松江区文汇路818号淘点点",
        "commercialContact": "郑鑫",
        "commercialDesc": "豆腐先生",
        "commercialId": 810485944,
        "commercialLogo": "https://img-static.keruyun.com/mind/rc-upload-1583396354627-11.png",
        "commercialName": "豆腐先生",
        "commercialPhone": "",
        "latitude": 31.04958,
        "longitude": 121.20283,
        "openTimes": [
          {
            "items": [
              {
                "endTime": "23:00",
                "startTime": "00:00",
                "type": 0
              }
            ],
            "timeType": 0,
            "type": 0
          }
        ],
        "pCode": "",
        "pName": "",
        "status": 0
      }];
      this.setData({
        shopInfo: res[0],
      });
      app.data.shopInfo = res[0];
      this.setCommercialInfo();
    },
    goStoreList() {
      wx.navigateTo({
        url: '/pages/store/store',
      })
    },
    // 设置门店信息
    setCommercialInfo() {
      this.setData({
        commercialName: this.data.shopInfo.commercialName,
        commercialDesc: this.data.shopInfo.commercialDesc,
      })
      app.checkLocationPermission(this.setDistance);
    },
    // 计算距离
    setDistance(curLoc) {
      var latitude = curLoc.latitude
      var longitude = curLoc.longitude
      $page.setData({
        distance: utils.getDistance(
          latitude,
          longitude,
          app.data.coordinate.latitude,
          app.data.coordinate.longitude
        ),
      })
    },
    /**
     * 菜品分类信息查询
     */
    category() {
      return new Promise((resolve, reject) => {
        var res = {
          "result": {
            "result": [
              {
                "aliasName": null,
                "name": "便当",
                "sort": 3,
                "id": 329240273640885250,
                "parentId": null,
                "level": null
              },
              {
                "aliasName": null,
                "name": "主食",
                "sort": 4,
                "id": 329240457679020000,
                "parentId": null,
                "level": null
              },
              {
                "aliasName": null,
                "name": "小食",
                "sort": 5,
                "id": 329240515631718400,
                "parentId": null,
                "level": null
              },
              {
                "aliasName": null,
                "name": "饮料",
                "sort": 6,
                "id": 329240589430497300,
                "parentId": null,
                "level": null
              },
              {
                "aliasName": null,
                "name": "豆腐",
                "sort": 1,
                "id": 329239841631767550,
                "parentId": null,
                "level": null
              },
              {
                "aliasName": null,
                "name": "炸鸡",
                "sort": 2,
                "id": 329239907684130800,
                "parentId": null,
                "level": null
              }
            ],
            "code": 0,
            "message": "成功[OK]",
            "messageUuid": "369ca790-d4ac-4599-857f-0e540de9dadb",
            "apiMessage": "成功[OK]"
          },
          "requestID": "e0d399fe-de08-11ea-ac4c-525400c2bfee"
        };
        resolve(res.result.result);
      })
    },
    /**
     * 菜品分页查询 默认 200条
     */
    dishMenu() {
      return new Promise((resolve, reject) => {
        var res = {
          "result": {
            "result": {
              "hasnext": false,
              "dishTOList": [
                {
                  "shopIdenty": 810485944,
                  "name": "秘制豆腐（小份）",
                  "aliasName": "",
                  "id": 329245247821188100,
                  "dishCode": "SKU0002",
                  "uuid": "b8e8b1d9868d474685da3bdb42eef6bd",
                  "type": 0,
                  "unit": "盒",
                  "unitId": 290468756467059700,
                  "saleType": 2,
                  "upc": null,
                  "clearStatus": 1,
                  "price": 10,
                  "rank": 0,
                  "minOrderNum": 1,
                  "residueTotal": 1000,
                  "saleTotal": 1000,
                  "boxQty": 1,
                  "imgUrl": "https://img-static.keruyun.com/kry-dir/rc-upload-1584350287797-78.jpg?x-oss-process=image/resize,w_640,h_480",
                  "desc": "秘制酱料精心油炸的豆腐",
                  "categorys": [
                    {
                      "categoryId": 329239841631767550,
                      "categoryName": "豆腐"
                    }
                  ],
                  "saleTimes": [
                    {
                      "start": "00:00:00",
                      "end": "00:00:00"
                    }
                  ],
                  "attrs": [],
                  "dishTaxes": null,
                  "brandDishId": 329245181265188860,
                  "barcode": null,
                  "supplyCondiments": [
                    {
                      "id": 347755322008107000,
                      "name": "加辣椒",
                      "marketPrice": 0,
                      "extendId": 347755322037467140,
                      "extendUuid": "e8b61e55793f4bd98b4cec5128765f17"
                    },
                    {
                      "id": 347755369084973060,
                      "name": "加香菜",
                      "marketPrice": 0,
                      "extendId": 347755369105944600,
                      "extendUuid": "7bb740cb3d27493ab4fad637a4dc7860"
                    },
                    {
                      "id": 347756285666225150,
                      "name": "加大蒜",
                      "marketPrice": 0,
                      "extendId": 347756285687196700,
                      "extendUuid": "15b74951e8a64981b12e2d8f6963c007"
                    }
                  ],
                  "saleTotalWechat": 1000,
                  "dishQty": null,
                  "brandDishUuid": "7ee09c9de55b4387856ad8fd1a6e56ea",
                  "num": 0,
                  "total": 0
                },
                {
                  "shopIdenty": 810485944,
                  "name": "黄金炸鸡（小份）",
                  "aliasName": "",
                  "id": 329258295131185150,
                  "dishCode": "SKU0008",
                  "uuid": "d51c9fcc5eeb48948f600624d57b5c15",
                  "type": 0,
                  "unit": "盒",
                  "unitId": 290468756467059700,
                  "saleType": 2,
                  "upc": "",
                  "clearStatus": 1,
                  "price": 10,
                  "rank": 5,
                  "minOrderNum": 1,
                  "residueTotal": 1000,
                  "saleTotal": 1000,
                  "boxQty": 1,
                  "imgUrl": "https://img-static.keruyun.com/kry-dir/rc-upload-1587101579682-20.jpeg?x-oss-process=image/resize,w_640,h_480",
                  "desc": null,
                  "categorys": [
                    {
                      "categoryId": 329239907684130800,
                      "categoryName": "炸鸡"
                    }
                  ],
                  "saleTimes": [
                    {
                      "start": "00:00:00",
                      "end": "00:00:00"
                    }
                  ],
                  "attrs": [],
                  "dishTaxes": null,
                  "brandDishId": 329248060352895000,
                  "barcode": null,
                  "supplyCondiments": null,
                  "saleTotalWechat": 1000,
                  "dishQty": null,
                  "brandDishUuid": "ab8e66b448f94406a6f9a73a5f051ce2",
                  "num": 0,
                  "total": 0
                },
                {
                  "shopIdenty": 810485944,
                  "name": "豆腐炸鸡套餐",
                  "aliasName": "",
                  "id": 336196502310009860,
                  "dishCode": "SKU0015",
                  "uuid": "83fa08af1b674f058cde7daefffdfbcd",
                  "type": 1,
                  "unit": "盒",
                  "unitId": 290468756467059700,
                  "saleType": 2,
                  "upc": null,
                  "clearStatus": 1,
                  "price": 20000,
                  "rank": 0,
                  "minOrderNum": 1,
                  "residueTotal": 1000,
                  "saleTotal": 1000,
                  "boxQty": 1,
                  "imgUrl": "https://img-static.keruyun.com/kry-dir/rc-upload-1584350287797-52.jpg?x-oss-process=image/resize,w_640,h_480",
                  "desc": "精品豆腐炸鸡套餐",
                  "categorys": [
                    {
                      "categoryId": 329240273640885250,
                      "categoryName": "便当"
                    }
                  ],
                  "saleTimes": [
                    {
                      "start": "00:00:00",
                      "end": "00:00:00"
                    }
                  ],
                  "attrs": [],
                  "dishTaxes": null,
                  "brandDishId": 336196471192518660,
                  "barcode": null,
                  "supplyCondiments": null,
                  "saleTotalWechat": 1000,
                  "dishQty": null,
                  "brandDishUuid": "60c0d1e592c7491cbf4ecb6141860b57",
                  "num": 0,
                  "total": 0
                },
                {
                  "shopIdenty": 810485944,
                  "name": "脆皮炸鸡@黄金豆腐+炒时蔬@送饮料",
                  "aliasName": "",
                  "id": 347744105755328500,
                  "dishCode": "SKU0016",
                  "uuid": "4ebc439f4b104a24ac29bfcfa9f583aa",
                  "type": 0,
                  "unit": "盒",
                  "unitId": 290468756467059700,
                  "saleType": 2,
                  "upc": null,
                  "clearStatus": 1,
                  "price": 10,
                  "rank": 0,
                  "minOrderNum": 1,
                  "residueTotal": 1000,
                  "saleTotal": 1000,
                  "boxQty": 0,
                  "imgUrl": "https://img-static.keruyun.com/kry-dir/rc-upload-1587101579682-37.jpg?x-oss-process=image/resize,w_640,h_480",
                  "desc": null,
                  "categorys": [
                    {
                      "categoryId": 329240273640885250,
                      "categoryName": "便当"
                    }
                  ],
                  "saleTimes": [
                    {
                      "start": "00:00:00",
                      "end": "00:00:00"
                    }
                  ],
                  "attrs": [],
                  "dishTaxes": null,
                  "brandDishId": 347744070317300740,
                  "barcode": null,
                  "supplyCondiments": null,
                  "saleTotalWechat": 1000,
                  "dishQty": null,
                  "brandDishUuid": "3d9ebfad713548a785b92231eb6c88a2",
                  "num": 0,
                  "total": 0
                }
              ],
              "startId": null
            },
            "code": 0,
            "message": "成功[OK]",
            "messageUuid": "8daaf56a-10aa-4ffc-bee6-a951445fb13a",
            "apiMessage": null
          },
          "requestID": "e0d0eeac-de08-11ea-af26-525400a8c4bb"
        };
        resolve(res.result.result.dishTOList);
      })
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
      this.getShopInfo()

      Promise.all([this.category(), this.dishMenu()]).then(res => {
        let tmpList = [];
        let tmpCategoryList = res[0];
        const tmpDishMenuList = res[1];

        tmpCategoryList.forEach(category => {
          const id = category.id;

          var list = tmpDishMenuList.filter(
            menu => menu.categorys[0].categoryId === id,
          );

          if (list.length > 0) {
            list.forEach(menu => {
              menu.num = 0
              menu.total = 0
            });
            tmpList.push({
              ...category,
              list
            });
          }
        });

        this.setData({
          dishMenuList: tmpList,
          activeId: tmpList[0].id
        });

        setTimeout(() => {
          this.getScrollTop();
        }, 20);
      });
    },

    // 点击AddIcon
    tapAddIcon(e) {
      const item = e.currentTarget.dataset.item
      this.addToCart(item.id, item.name, item.price, item.num, item.packagePrice)
    },
    selectCategory(e) {
      this.setData({
        scrollId: 'dish' + e.currentTarget.dataset.id,
        activeId: e.currentTarget.dataset.id,
      })
    },
    bindscroll(e) {
      let activeId = this.data.dishMenuList[0].id
      for (let i = 0; i < this.data.scrollTopList.length; i++) {
        const scrollTop = this.data.scrollTopList[i]
        if (e.detail.scrollTop >= scrollTop.top) {
          activeId = scrollTop.id * 1
        }
      }
      this.setData({
        activeId,
      })
    },

    // 添加到购物车
    addToCart(id, name, price, num, packagePrice) {
      var _cartList = this.data.cartList
      var index // 购物车中相同id菜品的index

      if (index = this.checkCartSameId(id)) {
        _cartList[index].num++;
      } else {
        var tmpItem = {
          "id": id,
          "name": name,
          "price": price,
          "num": 1,
          "packagePrice": packagePrice,
        }
        _cartList.push(tmpItem)
      }

    },
    getScrollTop() {
      if (this.data.scrollTopList.length > 0) {
        return
      }

      const _this = this;
      let query = wx.createSelectorQuery().in(_this);
      query.select('#dishList').boundingClientRect(function(response){
        const parentTop = response.top;
        _this.data.dishMenuList.forEach((dish) => {
          query = wx.createSelectorQuery().in(_this);
          query.select(`#dish${dish.id}`).boundingClientRect(function(res){
            _this.setData({
              scrollTopList: [
                ..._this.data.scrollTopList,
                {
                  top: res.top - parentTop,
                  id: res.id.replace('dish', ''),
                },
              ],
            })
          });
        })
      }).exec();
    },
    changeChecked(e) {
      this.setData({
        checked: e.detail,
      })

      if (e.detail) {
        // 跳转到收货地址页面
        wx.navigateTo({
          url: '/pages/receiveAddress/receiveAddress',
        })
      }
    },
    showMoreDetail() {
      this.setData({
        showMore: !this.data.showMore,
        detailBtnTxt: !this.data.showMore ? '收起' : '更多',
      })
    },
    // 选规格(单个)
    selectConfig(e) {
      console.log(e.currentTarget.dataset);
      const {parentIndex,item} = e.currentTarget.dataset;
      const {id} = item;
      item.imgList = [];
      item.imgList.push(item.imgUrl);
      const cardList = wx.getStorageSync('cardList') ?
        JSON.parse(wx.getStorageSync('cardList')) : []
      const selectIndex = cardList.findIndex(card => card.id === id)
      if (selectIndex > -1) {
        cardList[selectIndex].num += 1
      } else {
        item.num = 1
        cardList.push(item)
      }
      this.setData({
        cardList
      })
      wx.setStorageSync('cardList', JSON.stringify(cardList))
      this.initCar();
    },
    /**选规格(多个) */
    selectConfigMore(e){
      console.log(e.currentTarget.dataset);
      const {parentIndex,item} = e.currentTarget.dataset;
      const {id} = item;
      item.imgList = [];
      item.imgList.push(item.imgUrl);
      item.component = item.desc;
      this.setData({
        showModal: true,
      })
      this.dishDetailes(item,id);
    },
    /**render模态框 */
    dishDetailes(obj,id){
      this.setData({
        modalData: obj,
        selectConfig: {
          id: id,
          // configIdArr,
          // configTxtArr: configTxtArr.join(','),
          configNum: 1,
          price: obj.price,
          name: obj.name,
        },
      });
      console.log(this.data.modelData)
    },
    closeModal() {
      this.setData({
        modalData: {},
        selectConfig: {},
        showModal: false,
      })
    },
    swprerChange(e) {
      this.setData({
        current: e.detail.current,
      })
    },
    reduceConfigNum() {
      if (this.data.selectConfig.configNum === 1) return

      this.setData({
        selectConfig: {
          ...this.data.selectConfig,
          configNum: this.data.selectConfig.configNum - 1,
        },
      })
    },
    addConfigNum() {
      this.setData({
        selectConfig: {
          ...this.data.selectConfig,
          configNum: this.data.selectConfig.configNum + 1,
        },
      })
    },
    selectConfigCard(e) {
      const id = Number(e.currentTarget.dataset.id)
      const index = Number(e.currentTarget.dataset.index)
      const configIdArr = this.data.selectConfig.configIdArr
      const configTxtArr = this.data.selectConfig.configTxtArr.split(',')

      this.data.mockDetail.config.forEach((configItem) => {
        if (Array.isArray(configItem.list) && configItem.list.length > 0) {
          configItem.list.forEach((listItem) => {
            if (listItem.id === id) {
              configIdArr[index] = listItem.id
              configTxtArr[index] = listItem.name
            }
          })
        }
      })

      this.setData({
        selectConfig: {
          ...this.data.selectConfig,
          configIdArr,
          configTxtArr: configTxtArr.join(','),
        },
      })
    },
    // 加入购物车
    addCard() {
      let selectNum = 0
      let totalPrice = 0
      const cardList = wx.getStorageSync('cardList') ?
        JSON.parse(wx.getStorageSync('cardList')) : []

      if (cardList && Array.isArray(cardList)) {
        const index = cardList.findIndex(
          (select) =>
          select.id === this.data.selectConfig.id &&
          JSON.stringify(select.configIdArr) ===
          JSON.stringify(this.data.selectConfig.configIdArr)
        )

        if (index > -1) {
          cardList[index].configNum += this.data.selectConfig.configNum
          cardList[index].name = this.data.selectConfig.name
        } else {
          cardList.push(this.data.selectConfig)
        }

        cardList.forEach((card) => {
          selectNum += card.configNum
          totalPrice += card.price * card.configNum
        })

        this.setData({
          cardList: cardList,
          selectInfo: {
            selectNum,
            totalPrice,
          },
        })

        wx.setStorageSync('cardList', JSON.stringify(cardList))
        wx.setStorageSync(
          'selectInfo',
          JSON.stringify({
            selectNum,
            totalPrice,
          })
        )

        this.closeModal()
      }
    },
    showCardDetail() {
      this.setData({
        cardMaskShow: !this.data.cardMaskShow,
      })
    },
    clearCar() {
      this.setData({
        cardList: [],
        selectInfo: {},
        cardMaskShow: false,
      })
      wx.removeStorageSync('cardList')
    },
    initCar() {
      const total = this.data.cardList.reduce((num, item) => {
        return num += item.num
      }, 0)
      const totalPrice = this.data.cardList.reduce((num, item) => {
        return num += item.num * item.price
      }, 0)

      this.setData({
        selectInfo: {
          total,
          totalPrice
        }
      })
    },
    // 订单结算
    orderSettle() {
      wx.navigateTo({
        url: '/pages/orderSettle/orderSettle',
      })
    }
  }
})