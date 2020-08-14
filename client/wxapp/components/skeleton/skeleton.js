// components/skeleton/skeleton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    row: {
      type: [String, Number],
      value: 1
    },
    animate: {
      type: Boolean,
      value: true
    },
    width: {
      type: [String, Number],
    },
    height: {
      type: [String, Number],
      value: 32
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {}
});
