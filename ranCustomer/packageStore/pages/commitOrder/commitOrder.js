// packageStore/pages/commitOrderCoupon/commitOrderCoupon.js
const app = getApp();
const util = require('../../../utils/util.js');
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: null, //商品id
    goods_name: "", //商品名称
    brand: "", //所属品牌
    price: 0, //价格
    sumPrice: 0, //小计
    realPrice: 0, //实付金额
    userInfo: null,  //用户信息
    pay_points_type: 2, //2为不使用 1为使用(1000积分为一个使用点)
    pay_points: 2100, //可用
    number: 1,  //数量
    order_type: 1, //订单类别
    hasPhone: false, //是否绑定过手机号码
    phoneNumber: "", //显示的手机号码
    deduction: 0, //积分抵扣金额
    disableCheckbox: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_type: options.order_type,
      goods_id: options.goods_id,
      goods_name: options.goods_name,
      price: Number(options.price),
      sumPrice: Number(options.price),
      realPrice: Number(options.price)
    });

    let userInfo = wx.getStorageSync("userInfo");



    if(userInfo.phone) {
      this.setData({
        hasPhone: true,
        userInfo: userInfo,
        phoneNumber: userInfo.phone.substring(0, 3) + "****" + userInfo.phone.substring(7, 11)
        // pay_points: userInfo.pay_points,
        // disableCheckbox: userInfo.pay_pints < 1000 || (his.data.sumPrice <= 10 && userInfo.pay_points>=1000)
      });
    } else {
      wx.showToast({
        title: '请先到我的页面绑定手机号码',
        icon: 'none'
      })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 数量加一
   */
  addNum: function(){
    var number = this.data.number + 1;
    this.setData({
      number: number,
      sumPrice: this.data.sumPrice + this.data.price
    });
    this.judgeCheckbox();
  },

  /**
   * 数量减一
   */
  minusNum: function(){
    if(this.data.number ==1){
      return;
    }
    var number = this.data.number - 1;
    this.setData({
      number: number,
      sumPrice: this.data.sumPrice-this.data.price
    });
  },

  //勾选使用积分
  checkboxChange(e){
    if(e.detail.value.length>0){
      let sumPrice = this.data.sumPrice;
      let pay_points = this.data.pay_points;

      let priceCount = parseInt(sumPrice/10);  //金额对10取余
      let pointCount = parseInt(pay_points/1000); //积分对1000取余
      let count = Math.min(priceCount, pointCount);
      
      let realPrice = sumPrice - count*10;
      this.setData({
        pay_points_type: 1,
        realPrice: realPrice
      })
    } else {
      this.setData({
        pay_points_type: 2,
        realPrice: this.data.sumPrice
      });
    }
    
  },

  //判断金额是否满足积分抵扣 条件
  judgeCheckbox(){
    if (this.data.sumPrice <= 10 && this.data.pay_points>=1000) {
      this.setData({
        disableCheckbox: true
      });
    }
  },


  //提交订单
  commitOrder(){
    let that = this;
    let param = {};
    param.token = that.data.userInfo.token;
    param.order_type = that.data.order_type;
    param.goods_id = that.data.goods_id;
    param.number = that.data.number;
    param.pay_points_type = that.data.pay_points_type;
    // network.ajax(network.PLACE_ORDER, "post", param, res=>{
      // wx.navigateTo({
      //   url: '../payOrder/payOrder?price=' + that.data.realPrice + '&order_sn=' + res.data.order_sn,
      // });
      wx.navigateTo({
        url: '../payOrder/payOrder?price=' + that.data.realPrice,
      });
    // }, err=>{
    //   if(err.code == 401){
    //     that.setData({
    //       login: true
    //     });
    //   } else {
    //     if(err.msg){
    //       wx.showToast({
    //         title: err.msg,
    //         icon: "none"
    //       });
    //     }
        
    //   }
    // }, "提交中...");
  }
})