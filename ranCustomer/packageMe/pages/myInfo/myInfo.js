// packageMe/myInfo/myInfo.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},  //用户信息
    userAddress: '',  //用户地址
    phone: '', //手机号
    showName: false, //展示姓名输入框
    surname: '', //姓
    name: '', //名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getUser();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取用户信息
  getUser(){
    let that = this;
    let param = {
      token: wx.getStorageSync("userInfo").token
    };
    network.ajax(network.USER_INFO, "post", param, res=>{
      that.setData({
        userInfo: res.data,
        phone: res.data.phone ? res.data.phone : '绑定手机号'
      });
    });
  },

  /**
   * 选择地址
   */
  chooseAddress: function(){
    var that = this;
    wx.navigateTo({
      url: '../addressList/addressList',
    })
  },

  /**
   * 点击真实姓名
   */
  clickName: function(){
    this.setData({
      showName: true
    });
  },

  /**
   * 点击蒙版，隐藏姓名输入框
   */
  hideName: function(){
    var userInfo = this.data.userInfo;
    userInfo.real_name = this.data.surname + this.data.name;
    this.setData({
      showName: false,
      userInfo: userInfo
    });
  },

  /**
   * 输入姓
   */
  inputSurname: function(e){
    this.setData({
      surname: e.detail.value
    });

  },

  /**
   * 输入名
   */
  inputName: function(e){
    this.setData({
      name: e.detail.value
    });
  },

  /**
   * 获取手机号
   */
  getPhoneNumber: function (e) {
    var that = this;
    wx.checkSession({
      success() {
        that.register(e);
      },
      fail() {
        app.login(res => {
          that.register(e);
        });
      }
    })
  },

  //绑定手机号注册
  register(e) {
    var that = this;
    let iv = e.detail.iv, encryptedData = encodeURI(e.detail.encryptedData);
    let userId = that.data.userInfo.id;
    let params = {
      user_id: userId,
      encryptedData: encryptedData,
      iv: iv
    };
    network.ajax(network.REGISTER, "post", params, res => {
      that.setData({
        userInfo: res.data,
        hasPhone: true
      });
      wx.setStorageSync("userInfo", res.data);
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