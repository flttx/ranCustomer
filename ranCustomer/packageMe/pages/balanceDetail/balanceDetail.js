// packageMe/pages/balanceDetail/balanceDetail.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"),  //用户信息
    accountList: [], //账户流水
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccount();
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


  //获取账户流水
  getAccount() {
    let that = this;
    let param = {
      token: this.data.userInfo.token
    };
    network.ajax(network.USER_ACCOUNT, "post", param, res => {
      res.data.map(function (value) {
        if (Number(value.money_change) > 0) {
          value.money_change = "+" + value.money_change;
        }
        value.created_at = util.formatDate(new Date(value.created_at.split(" ")[0]));
      });
      that.setData({
        accountList: res.data
      });
    }, null, "加载中...");
  },


})