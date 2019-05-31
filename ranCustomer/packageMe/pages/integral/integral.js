// packageMe/pages/integral/integral.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    weekDay: [],  //日历
    showInfo: false, //显示积分提示
    exchangeList: [{ name: '爱奇艺会员', points: 4000 }, { name: '爱奇艺会员', points: 4000 }, { name: '爱奇艺会员', points: 4000 },
    { name: '爱奇艺会员', points: 4000 }],  //兑换列表
    buttonClicked: false, //防止重复点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let weekDay = [];
    for(let i = 0;i<7;i++){
      weekDay.push({
        month: new Date(new Date().getTime() + i*24*60*60*1000).toString().split(" ")[1],
        day: new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000).toString().split(" ")[2]
      });
    }
    this.setData({
      weekDay: weekDay
    });

    // this.getUser();

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

  //获取用户信息
  getUser() {
    let that = this;
    let param = {
      token: wx.getStorageSync("userInfo").token
    };
    network.ajax(network.USER_INFO, "post", param, res => {
      res.data.pay_points = util.formatNum(res.data.pay_points);
      that.setData({
        userInfo: res.data
      });
    });
  },

  //签到
  sign(){
    let that = this;
    if (!that.data.buttonClicked) {
      util.buttonClicked(that);

      let param = {
        token: wx.getStorageSync("userInfo").token
      };
      network.ajax(network.USER_SIGN, "post", param, res => {
        wx.showToast({
          title: "您已连续签到" + res.data.sign_day + "天",
          icon: "none"
        });
        that.getUser();
      }, err => {
        if (err.code == 403) {
          wx.showToast({
            title: "您今日已签到",
            icon: "none"
          });
        }
      });
    }
    
  },

  /**
   * 跳转积分明细
   */
  toIntegralDetail: function(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      wx.navigateTo({
        url: '../integralDetail/integralDetail',
      })
    }
  },

  //点击积分帮助
  clickShowInfo(){
    if (!this.data.buttonClicked) {
      util.buttonClicked(this);
      this.setData({
        showInfo: true
      });
    }
  },


  hideMask(){
    this.setData({
      showInfo: false
    });
  }
})