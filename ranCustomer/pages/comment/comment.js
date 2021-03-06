// pages/comment/comment.js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['热门','推荐'],
    currentTab: 0,
    userInfo: {},
    hotList: [],
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wxUserInfo = wx.getStorageSync("wxUserInfo");
    if (wxUserInfo){
      this.setData({
        userInfo: wxUserInfo
      });
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
  toCommentDetail: function() {
    wx.navigateTo({
      url: '../../packageComment/pages/commentDetail/commentDetail',
    })
  }
})