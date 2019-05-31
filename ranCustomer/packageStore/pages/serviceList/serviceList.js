// packageStore/pages/serviceList/serviceList.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    currentTab: 0,
    shop_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.shop_id){
      this.setData({
        shop_id: options.shop_id
      });
      this.getPriceList();
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

  //获取价目表
  getPriceList() {
    let that = this;
    let param = {};
    param.shop_id = that.data.shop_id;
    network.ajax(network.PRICE_LIST, "post", param, res => {
      that.setData({
        tabs: res.data
      });

    });
  },

  /**
   * 切换tab
   */
  changeTab: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    });
  },

  /**
   * 切换轮播内容
   */
  changeSwiper: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current
      });
    }
  },
})