// packageMe/pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['系统消息','互动消息'],
    currentIndex: 0,
    systemMessages: [{title: "您有一张新的洗车券，请查收", content: "内容内容内容内容内容内容", hasRead: false, time: '20:00'}], //系统消息
    commentMessages: []  //互动消息
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

  changeTab: function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index
    });
  },


  changeSwiper: function(e){
    if (e.detail.source == 'touch') {
      this.setData({
        currentIndex: e.detail.current
      });
    }
  }
})