// components/login/login.js
const app = getApp();
const { API, beats, icom,  regeneratorRuntime, promisify } = app;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    showLogin: Boolean,
    getInfo: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancle() {
      this.setData({
        showLogin: false
      })
      this.triggerEvent('cancle', {
        cancle: this.data.getInfo
      });
    },
    async isAuth(e) {
      // data.Flag_Phone 1是 0否
      // data.Flag_Info  1是 0否
      if (app.data.Flag_Phone == 0) {
        this.setData({
          getInfo: 'getNumber',
          showLogin: true
        })
      } else if (app.data.Flag_Info == 0) {
        this.setData({
          showLogin: true,
          getInfo: 'getInfo'
        })
      } else {
        // 授权结束
        this.triggerEvent('sure', {
          sure: 'all'
        });
      }
    },
    async getAuth(e) {
      let {
        auth
      } = e.currentTarget.dataset;
      if (!e.detail.encryptedData) {
        this.setData({
          showLogin: false
        })
        this.triggerEvent('cancle', {
          cancle: this.data.getInfo
        });
      } else {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        if (auth == 'getUserInfo') {
          let res = await beats.member.getUserInfo(e.detail);
          if (res.code == 200) {
            app.data.Flag_Info = 1;
            // app.data.info = res.data;
            app.data.info = e.detail.userInfo;
            this.setData({
              showLogin: false
            })
            page.setData({
              appData: app.data
            })
            this.triggerEvent('sure', {
              sure: 'all'
            });
          }
        } else if (auth == 'getPhoneNumber') {
          // console.log(e)
          let res = await beats.member.getPhoneNumber(e.detail);
          if (res.code == 200) {
            //更新token
            app.data.token = res.data.token;
            icom.storage('token', app.data.token);
            app.data.Flag_Phone = 1;
            app.data.numberInfo = res.data;
            page.setData({
              appData: app.data
            })
            // 检测是否获取到用户信息
            if (app.data.Flag_Info == 0) {
              this.setData({
                showLogin: true,
                getInfo: 'getInfo'
              })
            } else {
              // 授权结束(只授权手机号)
              this.setData({
                showLogin: false
              })
              this.triggerEvent('sure', {
                sure: 'all'
              });
            }
          }
        }
      }
    },
  }
})