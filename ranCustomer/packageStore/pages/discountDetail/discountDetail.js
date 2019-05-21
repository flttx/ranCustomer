// packageStore/pages/discountDetail/discountDetail.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_serve_id: "",  //门店服务id
    serve_detail: null,  //服务详情对象
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        shop_serve_id: options.id
      });
    }

    this.getServeDetail();
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

  //获取服务详情
  getServeDetail(){
    let that = this;
    let param = {};
    param.shop_serve_id = that.data.shop_serve_id;
    network.ajax(network.SHOP_SERVE, "post", param, r=>{
      that.setData({
        serve_detail: r.data
      })
    });
  },

  //点击抢购
  clickPurchase(){
    if(this.data.userInfo.token){
      wx.navigateTo({
 
        url: '../commitOrder/commitOrder?order_type=2&goods_id=' + this.data.serve_detail.id + "&goods_name=" + this.data.serve_detail.serve_name + "&price=" + (this.data.serve_detail.is_promote == 1 ? this.data.serve_detail.promote_price : this.data.serve_detail.shop_price)
      })
    } else {
      this.setData({
        login: true
      });
    }
  },


  //刷新用户信息
  refreshUserInfo(e) {
    this.setData({
      userInfo: e.detail
    });
  }
})