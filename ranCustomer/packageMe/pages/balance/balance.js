// packageMe/pages/balance/balance.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"),  //用户信息
    rechargeList: [{ amount: 100, points: 1000 }, { amount: 200, points: 2000 }, { amount: 500, points: 5000 },
      { amount: 1000, points: 10000 }], //充值配置
    showInfo: false, //显示积分提示
    buttonClicked: false, //防止重复点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //点击充值说明
  clickShowInfo() {
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      this.setData({
        showInfo: true
      });
    }
  },

  hideMask() {
    
    this.setData({
      showInfo: false
    });
  },

  //跳转余额明细
  toBalanceDetail(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../balanceDetail/balanceDetail',
      });
    }
  }
})