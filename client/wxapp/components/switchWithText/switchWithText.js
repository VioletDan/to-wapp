// components/switchWithText/switch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false
    },
    width: {
      type: String,
      value: 40
    },
    onState: {
      type: [String, Number, Boolean],
      value: true
    },
    offState: {
      type: [String, Number, Boolean],
      value: false
    },
    height: {
      type: String,
      value: 20
    },
    backgroundColor: {
      type: String,
      value: "#f7f7f7"
    },
    highLightColor: {
      type: String,
      value: "#e7645c"
    },
    activeText: {
      type: String,
      value: ""
    },
    inactiveText: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    getStyle: "",
    getHighLightStyle: "",
    getActiveStyle: "",
    getInactiveStyle: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hadleChange() {
      this.triggerEvent("changeChecked", !this.properties.checked);
    },
    init() {
      const padding = Math.ceil(this.properties.height / 10);
      const left = this.properties.checked
        ? this.properties.width / 2 + padding
        : padding;

      this.setData({
        getStyle: `
          height: ${this.properties.height}rpx;
          width: ${this.properties.width}rpx;
          border-radius: ${this.properties.height / 2}rpx;
          background-color: ${this.properties.backgroundColor};
        }`,
        getHighLightStyle: `
        height: ${this.properties.height - padding * 2}rpx;
        width: ${this.properties.width / 2 - padding * 2}rpx;
        border-radius: ${(this.properties.height - padding * 2) / 2}rpx;
        background-color: ${this.properties.highLightColor};
        top: ${padding}rpx;
        left: ${left}rpx;
      `,
        getActiveStyle: `
        color: ${this.properties.checked ? "" : "#fff"};
        font-size: ${this.properties.checked ? "" : "24rpx"};
      `,
        getInactiveStyle: `
        color: ${this.properties.checked ? "#fff" : ""};
        font-size: ${this.properties.checked ? "24rpx" : ""};
      `
      });
    }
  },
  observers: {
    checked: function() {
      this.init();
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.init();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    }
  }
});
