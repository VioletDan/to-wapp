// components/noticeBar/noticeBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:String,
    isBar:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    isBar:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeBar(){
      this.setData({
        isBar:false

      })
    }
  }
})
