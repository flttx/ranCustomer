// pages/me/me.js
const app = getApp();
const network = require('../../utils/network.js');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, 
    userId: '',
    hasPhone: true,
    hasLogin: false,
    token: '',
    buttonClicked: false, //防止重复点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    var that = this;
    if (userInfo){
      console.log("has userinfo");
      this.setData({
        userInfo: userInfo,
        hasPhone: userInfo.phone ? true : false
      });
      app.login(res=>{
        that.getUser(res.token);
      });
    } else {
      console.log("no userinfo");
      this.login();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.hasLogin){
      that.getUser("");
    }
  },

  //获取用户信息
  getUser(token) {
    let that = this;
    let param = {};
    let user_token = token;
    if(token == ""){
      user_token = that.userInfo.token
    }
    param.token = user_token;
    network.ajax(network.USER_INFO, "post", param, res => {
      res.data.token = user_token;
      that.setData({
        userInfo: res.data,
        hasPhone: res.data.phone ? true : false,
        hasLogin: true
      });
      wx.setStorageSync("userInfo", res.data);
    });
  },

  /**
   * 跳转订单列表
   */
  toOrderList: function(){
    if(!this.data.buttonClicked){
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageOrder/pages/orderList/orderList',
      });
    }
    
  },

  /**
   * 跳转个人信息
   */
  toMyInfo: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/myInfo/myInfo',
      });
    }
  },

  /**
   * 跳转优惠券
   */
  toCoupon: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/coupon/coupon',
      });
    }
  },

  /**
   * 跳转余额
   */
  toBalance: function() {
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/balance/balance',
      });
    }
  },

  /**
   * 跳转积分
   */
  toIntegral: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/integral/integral',
      });
    }
  },

  /**
   * 跳转好货
   */
  toGoodsList: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/goodsList/goodsList',
      });
    }
  },

  /**
   * 跳转我的关注
   */
  toMyFollow: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/myFollow/myFollow',
      });
    }
  },

  /**
   * 跳转最近浏览
   */
  toRecentBrowse: function () {
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/recentBrowse/recentBrowse',
      });
    }
  },

  /**
   * 跳转帮助中心
   */
  toHelpCenter: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/helpCenter/helpCenter',
      });
    }
  },

  /**
   * 跳转商户入驻
   */
  toMerchantEnter: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/merchantEnter/merchantEnter',
      });
    }
  },

  /**
   * 跳转通知消息
   */
  toMessage: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../../packageMe/pages/message/message',
      });
    }
  },

  /**
   * 登录
   */
  login: function() {
    var that = this;
    app.login(res=>{
      that.getUser(res.token);
      
    }, err=>{
      wx.showToast({
        title: err.msg,
        icon: 'none'
      });
      if(err.code == 403){  //未绑定手机号
        that.setData({
          userId: err.data.user_id,
          userInfo: wx.getStorageSync("wxUserInfo"),
          hasPhone: false
        });
      }
      
    },null,"登录中...");

    
  },

  /**
   * 获取手机号
   */
  getPhoneNumber: function(e){
    var that = this;
    wx.checkSession({
      success(){
        that.register(e);
      },
      fail(){
        app.login(res=>{
          that.register(e);
        });
      }
    })
  },

  //绑定手机号注册
  register(e){
    var that = this;
    let iv = e.detail.iv, encryptedData = encodeURI(e.detail.encryptedData);
    let userId = that.data.userId;
    let params = {
      user_id: userId,
      encryptedData: encryptedData,
      iv: iv
    };
    network.ajax(network.REGISTER, "post", params, res => {
      that.getUser(res.data.token);
      
    }, err => {
      if (err.code == 403) {
        wx.showToast({
          title: "您已绑定过微信手机号",
          icon: "none"
        });
      }
    });
  }

})