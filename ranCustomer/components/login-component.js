// components/login-component.js
const app = getApp();
const network = require("../utils/network.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    login: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
  * 登录
  */
    login: function () {
      var that = this;
      app.login(res => {
        that.getUser(res.token);
        that.setData({
          login: false
        });
        
      }, err => {
        wx.showToast({
          title: err.msg,
          icon: 'none'
        });
      });
    },

    //获取用户信息
    getUser(token) {
      let that = this;
      let param = {};
      param.token = token;
      network.ajax(network.USER_INFO, "post", param, res => {
        res.data.token = token;
        that.setData({
          userInfo: res.data.data,
        });
        wx.setStorageSync("userInfo", res.data);
        that.triggerEvent('login', res.data);
        
      });
    }
  }
})
