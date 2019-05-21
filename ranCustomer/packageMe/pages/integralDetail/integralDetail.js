// packageMe/pages/integralDetail/integralDetail.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    payPointsList: [], //积分流水
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPayPoint();
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

  //获取积分流水
  getPayPoint(){
    let that = this;
    let param = {
      token: this.data.userInfo.token
    };
    network.ajax(network.USER_PAY_POINTS, "post", param, res=>{
      res.data.map(function(value){
        if (value.point_change>0){
          value.point_change = "+" + value.point_change
        }
      });
      that.setData({
        payPointsList: res.data
      });
    });
  }
})