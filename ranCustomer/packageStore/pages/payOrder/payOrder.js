// packageStore/pages/payOrder/payOrder.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0, //订单金额
    minute: '',
    second: '',
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    payType: 1,
    order_sn: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      price: Number(options.price),
      order_sn: options.order_sn
    });
    this.countDown();
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

  //倒计时
  countDown(){
    var that = this;
    var time = 1800;//30分钟换算成1800秒
    var timer = setInterval(function () {
      time = time - 1;
      var minute = parseInt(time / 60);
      var second = parseInt(time % 60);
      if(minute == 0 && second == 0){
        clearInterval(timer);
        return;
      }
      that.setData({
        minute: that.formatNumber(minute),
        second: that.formatNumber(second)
      });
    }, 1000);
  },

  
  formatNumber(n){
    n = n.toString()
    return n[1] ? n : '0' + n
  },


  //选择支付方式
  radioChange(e){
    this.setData({
      payType: e.detail.value
    });
  },

  //点击支付
  pay(){
    if(this.data.payType==1){
      this.balancePay();
    } else{

    }
  },

  //余额支付
  balancePay(){
    let param = {
      token: this.data.userInfo.token,
      order_sn: this.data.order_sn
    };
    network.ajax(network.BALANCE_PAY, "post", param, res=>{
      wx.showToast({
        title: '支付成功',
        icon: 'none'
      });
      wx.navigateBack({
        delta: 2
      });
    }, null, "支付中...");
  }


})