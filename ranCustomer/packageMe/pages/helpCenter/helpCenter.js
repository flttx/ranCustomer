// packageMe/pages/helpCenter/helpCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clicked: false, 
    questionList: [{ title: "然club是一个什么样的平台？", answer: "大垃圾袋啦可是基督教垃圾圣诞节卡时间德基及啊收款机副科级大连市解放路看见了神盾局离开家。", clicked: false}]
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
   * 查看回答
   */
  showAnswer: function(e){
    let index = e.currentTarget.dataset.index;
    this.data.questionList[index].clicked = !this.data.questionList[index].clicked;
    this.setData({
      [`questionList[${index}]`]: this.data.questionList[index]
    });
  },
})