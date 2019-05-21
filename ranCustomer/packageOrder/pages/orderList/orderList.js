// packageOrder/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部","奢护","车护","花艺","好货"],
    currentTab: 0,
    state: [1,2,3,4,5]
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

  /**
   * 切换tab
   */
  changeTab: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.current
    });
  },

  /**
   * 切换轮播内容
   */
  changeSwiper: function(e){
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current
      });
    }
  },

  /**
   * 跳转订单详情
   */
  toOrderDetail: function(e){
    let id = e.currentTarget.dataset.id;
    var pageUrl = "/packageOrder/pages/orderDetail/";
    switch(parseInt(id)){
      case 1:  //奢侈品护理订单
        pageUrl += "luxuryOrderDetail/luxuryOrderDetail";
        break;
      case 2:  //名车护理订单
        pageUrl += "carOrderDetail/carOrderDetail"; break;
      case 3:  //花艺订单
        pageUrl += "flowerOrderDetail/flowerOrderDetail"; break;
      case 4:  //优惠券订单
        pageUrl += "couponOrderDetail/couponOrderDetail"; break;
      case 5:  //优惠服务订单
        pageUrl += "serviceOrderDetail/serviceOrderDetail"; break;
      case 6:  //好货订单
        pageUrl += "goodsOrderDetail/goodsOrderDetail"; break;
      default: break;
    }
    wx.navigateTo({
      url: pageUrl,
    })
  },

  /**
   * 调整订单评价
   */
  toOrderEvaluate: function(){
    wx.navigateTo({
      url: '/packageOrder/pages/orderEvaluate/orderEvaluate',
    })
  }

})