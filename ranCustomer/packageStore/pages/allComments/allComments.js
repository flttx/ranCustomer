// packageStore/pages/allComments/allComments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部', '晒图'],
    currentTab: 0,
    state: [1, 2],
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

  /**
   * 跳转晒一晒详情
   */
  toCommentDetail: function (e) {
    wx.navigateTo({
      url: '/packageComment/pages/commentDetail/commentDetail',
    })
  },


  playCommentVideo: function(){
    console.log(e);
    return false;
  }
})