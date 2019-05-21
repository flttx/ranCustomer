// packageActivity/pages/activityDetail/activityDetail.js
const app = getApp();
const network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"", //专题id
    activityDetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.getActivityDetail();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //活动详情
  getActivityDetail: function(){
    var that = this;
    let param = {
      id: that.data.id
    };
    network.ajax(network.TOPIC_DETAIL,"post",param,res=>{
      that.setData({
        activityDetail: res.data
      });
    },null,"加载中...");
  }
})