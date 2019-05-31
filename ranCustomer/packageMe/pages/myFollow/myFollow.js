// packageMe/pages/myFollow/myFollow.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["门店", "商品"],
    currentIndex: 0,
    storeList: [],  //门店列表
    productList: [{ name: '迷你大象加湿器', price: 66.00 }, { name: '大象加湿器', price: 100.00 }, 
      { name: '迷你大象加湿器', price: 66.00 }, { name: '迷你大象加湿器', price: 66.00 }], //商品列表
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
   * 切换tab
   */
  changeTab: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.current
    });
  },

  /**
   * 切换轮播内容
   */
  changeSwiper: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        currentIndex: e.detail.current
      });
    }
  },
  
})