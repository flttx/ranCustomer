// packageOrder/pages/orderEvaluate/orderEvaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadVideo: [], //上传的视频
    uploadImgs: [], //上传的图片
    thumbed: false, //是否点赞
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
   * 上传视频
   */
  uploadVideo: function(){
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      // maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res);
        var videoArr = [];
        videoArr.push({
          path: res.tempFilePath
        });
        that.setData({
          uploadVideo: videoArr
        });
      }
    })
  },

  /**
   * 上传图片
   */
  uploadImg: function(){
    var that = this;
    wx.chooseImage({
      // count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // console.log(res);
        var imgArr = that.data.uploadImgs;
        for (var i = 0, len = res.tempFilePaths.length;i<len;i++){
          imgArr.push({
            path: res.tempFilePaths[i]
          });
        }
        that.setData({
          uploadImgs: imgArr
        });
      }
    })
  },


  playVideo: function(){
    var videoContext = wx.createVideoContext("video1");
    // videoContext.requestFullScreen();
  },

  /**
   * 点赞
   */
  clickThumb: function(){
    this.setData({
      thumbed: !this.data.thumbed
    });
  }


})